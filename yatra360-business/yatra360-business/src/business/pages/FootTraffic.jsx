import { useDashboard } from "../data/useDashboard.js";
import { useBusinessAuth } from "../auth/AuthContext.jsx";
import LedgerStrip from "../components/LedgerStrip.jsx";
import FootTrafficHeat from "../components/FootTrafficHeat.jsx";

export default function FootTraffic() {
  const { data, hour, setHour } = useDashboard();
  const { business } = useBusinessAuth();
  if (!data) return <div className="y-boot">Loading the surface…</div>;

  const totals = data.series.map((r) => r.family + r.solo + r.transit);
  const intensity = totals[hour] / Math.max(...totals);

  return (
    <>
      <header className="y-page-head">
        <div><h1>Foot traffic</h1><p>Street-level crowd density across your neighbourhood, hour by hour.</p></div>
        <span className="y-label">{data.label.toUpperCase()} · PUNE</span>
      </header>
      <LedgerStrip kpi={data.kpi} label={data.label} />
      <div className="y-sheet y-one">
        <div className="y-col">
          <section className="y-mod">
            <div className="y-mod-head"><h3>Street-level foot traffic</h3><span className="y-label">KERNEL DENSITY</span></div>
            <p className="y-note">Crowd density spreading outward from transit hubs and attractions. Drag the hour to watch the wave arrive.</p>
            <FootTrafficHeat points={data.heat} intensity={intensity} label={business?.name ?? "Your outlet"} />
            <div className="y-scrub">
              <span className="y-label">HOUR</span>
              <input type="range" min="6" max="23" value={hour} aria-label="Hour of day"
                onChange={(e) => setHour(Number(e.target.value))} />
              <b>{String(hour).padStart(2, "0")}:00</b>
            </div>
            <div className="y-heat-legend">
              <span>Density</span><span className="y-ramp" /><span>low</span><span>→</span><span>at capacity</span>
              <span style={{ marginLeft: "auto" }}>Dashed ring = 1.5 km demand radius</span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
