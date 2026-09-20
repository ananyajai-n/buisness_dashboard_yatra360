import { useBusinessAuth } from "../auth/AuthContext.jsx";
import { MODE } from "../config.js";

export default function Settings() {
  const { business, role } = useBusinessAuth();
  return (
    <>
      <header className="y-page-head">
        <div><h1>Settings</h1><p>Your listing, your radius and your session.</p></div>
      </header>
      <div className="y-settings">
        <section><span className="y-label">BUSINESS</span><h3>{business?.name}</h3>
          <p className="y-note">{business?.category} · {business?.locality}<br />{business?.email}</p></section>
        <section><span className="y-label">DEMAND RADIUS</span><h3>1.5 km</h3>
          <p className="y-note">Forecasts, heat surfaces and recommendations are all clipped to this radius around your pin.</p></section>
        <section><span className="y-label">DAILY BRIEF</span><h3>07:00, by email</h3>
          <p className="y-note">Yesterday's actuals against the forecast, plus anything new in the opportunity ledger.</p></section>
        <section><span className="y-label">SESSION</span><h3>{role} role</h3>
          <p className="y-note">Running in {MODE} mode. Authority modules are not available on this account.</p></section>
      </div>
    </>
  );
}
