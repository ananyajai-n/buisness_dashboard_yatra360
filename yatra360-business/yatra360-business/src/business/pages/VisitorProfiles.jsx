import { useDashboard } from "../data/useDashboard.js";
import { SEGMENT_META } from "../data/mock.js";
import LedgerStrip from "../components/LedgerStrip.jsx";
import ComfortBarChart from "../components/ComfortBarChart.jsx";

const hhmm = (h) => String(h).padStart(2, "0") + ":00";

export default function VisitorProfiles() {
  const { data, scenario } = useDashboard();
  if (!data) return <div className="y-boot">Loading visitor profiles…</div>;

  const peaks = Object.keys(SEGMENT_META).map((k) => {
    const row = data.series.reduce((b, r) => (r[k] > b[k] ? r : b), data.series[0]);
    return { key: k, name: SEGMENT_META[k].name, hex: SEGMENT_META[k].hex, hour: row.hour, value: row[k] };
  });

  return (
    <>
      <header className="y-page-head">
        <div><h1>Visitor profiles</h1><p>Who is arriving, and what they are willing to tolerate to get to you.</p></div>
        <span className="y-label">{data.label.toUpperCase()} · PUNE</span>
      </header>
      <LedgerStrip kpi={data.kpi} label={data.label} />
      <div className="y-sheet">
        <div className="y-col">
          <section className="y-mod">
            <div className="y-mod-head"><h3>Comfort index of arriving visitors</h3><span className="y-label">SHARE OF ARRIVALS</span></div>
            <p className="y-note">What the people heading your way are willing to put up with. A crowd that will walk 1.2 km for something specific is a different business than a crowd optimising for speed.</p>
            <ComfortBarChart rows={data.comfort} />
          </section>
        </div>
        <div className="y-col">
          <section className="y-mod">
            <div className="y-mod-head"><h3>Segment mix</h3></div>
            <table>
              <thead><tr><th>Segment</th><th>Peak hour</th><th>At peak</th></tr></thead>
              <tbody>{peaks.map((p) => (
                <tr key={p.key}><td><span className="y-sev" style={{ background: p.hex }} />{p.name}</td>
                  <td>{hhmm(p.hour)}</td><td>{p.value}</td></tr>))}
              </tbody>
            </table>
          </section>
          <section className="y-mod">
            <div className="y-mod-head"><h3>What to do with this</h3></div>
            <p className="y-opp-body">{scenario === "weekend"
              ? "Weekend arrivals skew family and patient — they will queue, and they will walk. Put the slower, higher-margin items forward and hold the fast line for the transit segment after 19:00."
              : "Midweek arrivals are commuters. Speed beats depth: a single-item counter offer priced under ₹100 captures more of this profile than any bundle."}</p>
          </section>
        </div>
      </div>
    </>
  );
}
