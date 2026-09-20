import { API_BASE } from "../config.js";
import { SCENARIOS, OPPORTUNITIES } from "./mock.js";

/**
 * Every dashboard read goes through here. While Person 3's FastAPI endpoints
 * are still landing, VITE_USE_MOCK=1 keeps the UI fully demoable; flip it off
 * and the same components read live data. No component knows the difference.
 */
const USE_MOCK = (import.meta.env?.VITE_USE_MOCK ?? "1") === "1";

async function get(path, fallback) {
  if (USE_MOCK) return fallback;
  try {
    const r = await fetch(`${API_BASE}${path}`, { credentials: "include" });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch (e) {
    console.warn("[business] falling back to mock for", path, e);
    return fallback;
  }
}

export const api = {
  demand: (scenario, radiusKm = 1.5) =>
    get(`/business/demand?scenario=${scenario}&radius_km=${radiusKm}`, SCENARIOS[scenario]),
  opportunities: (scenario) =>
    get(`/business/opportunities?scenario=${scenario}`, OPPORTUNITIES[scenario]),
  acceptOpportunity: (id) =>
    USE_MOCK ? Promise.resolve({ ok: true }) : fetch(`${API_BASE}/business/opportunities/${id}/accept`, { method: "POST" }),
};
