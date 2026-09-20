import { createContext, createElement, useContext, useEffect, useRef, useState } from "react";
import { api } from "./client.js";

const Ctx = createContext(null);

/** Shared dashboard state: scenario, visible segments, scrub hour, accepted plan. */
export function DashboardProvider({ children }) {
  const [scenario, setScenario] = useState("weekend");
  const [segments, setSegments] = useState({ family: true, solo: true, transit: true });
  const [hour, setHour] = useState(18);
  const [data, setData] = useState(null);
  const [opps, setOpps] = useState([]);
  const [accepted, setAccepted] = useState(() => {
    try { return JSON.parse(localStorage.getItem("y360.accepted")) || {}; } catch { return {}; }
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    Promise.all([api.demand(scenario), api.opportunities(scenario)]).then(([d, o]) => {
      if (!mounted.current) return;
      setData(d); setOpps(o);
    });
    return () => { mounted.current = false; };
  }, [scenario]);

  const accept = (id) => {
    const next = { ...accepted, [id]: { at: new Date().toISOString() } };
    setAccepted(next);
    try { localStorage.setItem("y360.accepted", JSON.stringify(next)); } catch {}
    api.acceptOpportunity(id);
  };
  const unaccept = (id) => {
    const next = { ...accepted }; delete next[id];
    setAccepted(next);
    try { localStorage.setItem("y360.accepted", JSON.stringify(next)); } catch {}
  };
  const toggleSegment = (k) => setSegments((s) => {
    const on = Object.values({ ...s, [k]: !s[k] }).some(Boolean);
    return on ? { ...s, [k]: !s[k] } : s;
  });

  return createElement(Ctx.Provider, {
    value: { scenario, setScenario, segments, toggleSegment, hour, setHour, data, opps, accepted, accept, unaccept },
  }, children);
}

export const useDashboard = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDashboard must be used inside <DashboardProvider>");
  return v;
};
