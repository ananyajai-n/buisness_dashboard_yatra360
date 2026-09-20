import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BUSINESS_NAV } from "../routes.jsx";
import { businessPath } from "../config.js";
import { useBusinessAuth } from "../auth/AuthContext.jsx";
import { DashboardProvider, useDashboard } from "../data/useDashboard.js";

function TopBar() {
  const { scenario, setScenario } = useDashboard();
  const [now, setNow] = useState("");
  useEffect(() => {
    const t = setInterval(() => setNow(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="y-topbar">
      <div className="y-scen" role="group" aria-label="Forecast scenario">
        {["weekend", "weekday"].map((s) => (
          <button key={s} aria-pressed={scenario === s} onClick={() => setScenario(s)}>
            {s === "weekend" ? "Weekend" : "Weekday"}
          </button>))}
      </div>
      <span className="y-clock">{now} IST</span>
    </div>
  );
}

export default function DashboardShell() {
  const { business, signOut } = useBusinessAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <DashboardProvider>
      <div className="y-shell">
        <nav className={"y-rail" + (open ? " open" : "")}>
          <div className="y-rail-head">
            <div className="y-wordmark"><b>Yatra 360</b></div>
            <span className="y-sysname">BUSINESS CONSOLE</span>
          </div>
          <div className="y-nav">
            {BUSINESS_NAV.map((n) => (
              <NavLink key={n.to} to={businessPath(`app/${n.to}`)} onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "on" : "")}>{n.label}</NavLink>))}
          </div>
          <div className="y-rail-foot">
            <div className="y-who">{business?.name ?? "Your business"}</div>
            <div className="y-where">{business?.category} · {business?.locality}</div>
            <button className="y-btn y-btn-ghost" onClick={async () => { await signOut(); nav(businessPath("login")); }}>Sign out</button>
          </div>
        </nav>
        <div className={"y-scrim" + (open ? " on" : "")} onClick={() => setOpen(false)} />
        <div className="y-main">
          <button className="y-btn y-btn-ghost y-railtoggle" onClick={() => setOpen(true)}>Menu</button>
          <TopBar />
          <div className="y-page"><Outlet /></div>
        </div>
      </div>
    </DashboardProvider>
  );
}
