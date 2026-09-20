/**
 * Deployment-mode switch.
 *
 * The Business console can run in two ways without any code changes:
 *
 *   MODE "embedded"  -> mounted inside the main Yatra 360 SPA at /business/*
 *   MODE "standalone"-> deployed on its own origin (business.yatra360.in) at /*
 *
 * Nothing in this module hard-codes a URL. Every link is built through
 * businessPath(), every route is declared relative, and the auth + API
 * adapters are injected. Flip the env var, rebuild, done.
 */
export const MODE = import.meta.env?.VITE_BUSINESS_MODE ?? "embedded";

/** Base path this module is mounted under. "" when standalone. */
export const BASE = MODE === "standalone" ? "" : "/business";

/** Build an in-module link. businessPath("app/overview") -> "/business/app/overview" */
export const businessPath = (p = "") => `${BASE}/${p}`.replace(/\/+/g, "/").replace(/\/$/, "") || "/";

/** Where to send someone who is not a business user. */
export const EXIT_TO_TOURIST = MODE === "standalone"
  ? (import.meta.env?.VITE_TOURIST_ORIGIN ?? "https://yatra360.in")
  : "/";

export const API_BASE = import.meta.env?.VITE_API_BASE ?? "/api";
