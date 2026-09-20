/**
 * Auth adapters. The module never imports Supabase directly, so the host app
 * decides what backs authentication — and a standalone deployment can point at
 * a different project without touching a component.
 *
 * Person 5 owns the Supabase side: the PL/pgSQL access-token hook injects
 * app_metadata.user_role ("tourist" | "business" | "authority") into the JWT,
 * so the role is readable without a second round-trip.
 */
import { jwtDecode } from "jwt-decode";

export const roleFromToken = (token) => {
  if (!token) return null;
  try {
    const claims = jwtDecode(token);
    return claims?.app_metadata?.user_role ?? claims?.user_role ?? null;
  } catch {
    return null;
  }
};

/** Real adapter — pass in the supabase client created by Person 5. */
export const supabaseAdapter = (supabase) => ({
  async current() {
    const { data } = await supabase.auth.getSession();
    const s = data?.session;
    return s ? { token: s.access_token, role: roleFromToken(s.access_token), user: s.user } : null;
  },
  subscribe(cb) {
    const { data } = supabase.auth.onAuthStateChange((_e, s) =>
      cb(s ? { token: s.access_token, role: roleFromToken(s.access_token), user: s.user } : null)
    );
    return () => data?.subscription?.unsubscribe();
  },
  signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  signUp: (email, password, profile) =>
    supabase.auth.signUp({ email, password, options: { data: { ...profile, user_role: "business" } } }),
  signOut: () => supabase.auth.signOut(),
});

/** Offline adapter for demos and Playwright runs. Same shape, no network. */
export const mockAdapter = () => {
  const KEY = "y360.session";
  let listeners = [];
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };
  const write = (s) => {
    try { s ? localStorage.setItem(KEY, JSON.stringify(s)) : localStorage.removeItem(KEY); } catch {}
    listeners.forEach((cb) => cb(s));
  };
  return {
    async current() { return read(); },
    subscribe(cb) { listeners.push(cb); return () => { listeners = listeners.filter((l) => l !== cb); }; },
    async signIn(email) { const s = { token: "mock", role: "business", user: { email }, business: read()?.business ?? DEMO_BUSINESS }; write(s); return { data: s }; },
    async signUp(email, _pw, profile) { const s = { token: "mock", role: "business", user: { email }, business: profile }; write(s); return { data: s }; },
    async signOut() { write(null); },
  };
};

export const DEMO_BUSINESS = {
  name: "Kaka Halwai",
  category: "Sweets & snacks",
  locality: "Kasba Peth",
  email: "owner@kakahalwai.in",
  capacity: 40,
};
