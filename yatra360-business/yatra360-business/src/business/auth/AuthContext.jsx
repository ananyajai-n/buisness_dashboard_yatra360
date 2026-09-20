import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const Ctx = createContext(null);

/**
 * Wraps the module (or the whole app) and exposes the current session + role.
 * The adapter is injected, so this file is identical in both deployment modes.
 */
export function BusinessAuthProvider({ adapter, children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    adapter.current().then((s) => { if (mounted.current) { setSession(s); setReady(true); } });
    const unsub = adapter.subscribe?.((s) => { if (mounted.current) setSession(s); });
    return () => { mounted.current = false; unsub?.(); };
  }, [adapter]);

  const value = useMemo(() => ({
    session,
    ready,
    role: session?.role ?? null,
    business: session?.business ?? session?.user?.user_metadata ?? null,
    signIn: (...a) => adapter.signIn(...a),
    signUp: (...a) => adapter.signUp(...a),
    signOut: () => adapter.signOut(),
  }), [session, ready, adapter]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useBusinessAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBusinessAuth must be used inside <BusinessAuthProvider>");
  return v;
};
