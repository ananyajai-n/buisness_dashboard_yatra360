import { Link } from "react-router-dom";
import { useDashboard } from "../data/useDashboard.js";
import { SEGMENT_META } from "../data/mock.js";
import { businessPath } from "../config.js";
import LedgerStrip from "../components/LedgerStrip.jsx";
import DemandAreaChart from "../components/DemandAreaChart.jsx";
import OpportunityCard from "../components/OpportunityCard.jsx";

export default function DemandOverview() {
  const { data, opps, segments, toggleSegment, accepted, accept, unaccept } = useDashboard();
  if (!data) return <div className="y-boot">Loading your radius…</div>;

  return (
    <>
      <header className="y-page-head">
        <div><h1>Demand overview</h1><p>Everything shaping the next 24 hours inside your 1.5 km radius.</p></div>
        <span className="y-label">{data.label.toUpperCase()} · PUNE</span>
      </header>
      <LedgerStrip kpi={data.kpi} label={data.label} />
      <div className="y-sheet">
        <div className="y-col">
          <section className="y-mod">
            <div className="y-mod-head"><h3>Hyper-local demand forecast</h3><span className="y-label">1.5 KM RADIUS · HOURLY</span></div>
            <p className="y-note">Projected arrivals inside your radius, split by segment. The dotted line marks where the arrival gradient is steepest — that is the window worth staffing.</p>
            <div className="y-toggles">
              {Object.entries(SEGMENT_META).map(([k, m]) => (
                <button key={k} className="y-chip" aria-pressed={segments[k]} onClick={() => toggleSegment(k)}>
                  <span className="y-swatch" style={{ background: m.hex }} />{m.name}
                </button>))}
            </div>
            <DemandAreaChart series={data.series} segments={segments} />
          </section>
          <section className="y-mod">
            <div className="y-mod-head"><h3>Where your demand comes from</h3><span className="y-label">ATTRIBUTED ARRIVALS</span></div>
            <table>
              <thead><tr><th>Source node</th><th>Visitors</th><th style={{ width: "34%" }}>Share</th></tr></thead>
              <tbody>{data.origin.map((o) => (
                <tr key={o.node}><td>{o.node}</td><td>{o.visitors.toLocaleString("en-IN")}</td>
                  <td><div className="y-bar-cell"><i style={{ width: `${o.share * 100}%` }} /></div></td></tr>))}
              </tbody>
            </table>
          </section>
        </div>
        <div className="y-col">
          <section className="y-mod">
            <div className="y-mod-head"><h3>Today's opportunity</h3></div>
            {opps[0] && <OpportunityCard opp={opps[0]} accepted={!!accepted[opps[0].id]} onAccept={accept} onRemove={unaccept} />}
            <Link className="y-btn y-btn-ghost" to={businessPath("app/opportunities")}>See all {opps.length} recommendations</Link>
          </section>
          <section className="y-mod">
            <div className="y-mod-head"><h3>Conditions on your block</h3><span className="y-label">LIVE</span></div>
            {data.alerts.map((a) => (
              <div className="y-alert" key={a.at}>
                <time>{a.at}</time>
                <div><div className="y-t"><span className={`y-sev y-sev-${a.sev}`} />{a.title}</div><div className="y-s">{a.sub}</div></div>
              </div>))}
          </section>
          <section className="y-mod">
            <div className="y-mod-head"><h3>Spillover note</h3></div>
            <p className="y-opp-body">{data.spillNote}</p>
          </section>
        </div>
      </div>
    </>
  );
}
