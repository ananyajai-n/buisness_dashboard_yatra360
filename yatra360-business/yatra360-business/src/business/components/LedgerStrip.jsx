export default function LedgerStrip({ kpi, label }) {
  const cells = [
    ["FOOTFALL IN RADIUS", kpi.footfall, `projected for ${label}`, ""],
    ["PEAK WINDOW", kpi.peak, "sharpest arrival gradient", ""],
    ["DOMINANT SEGMENT", kpi.segment, kpi.share, ""],
    ["SPILLOVER INDEX", kpi.spill, "vs your four-week median", kpi.spillTone],
  ];
  return (
    <div className="y-ledger">
      {cells.map(([l, v, d, tone]) => (
        <div key={l}>
          <span className="y-label">{l}</span>
          <div className={"y-v " + (tone || "")}>{v}</div>
          <div className="y-d">{d}</div>
        </div>))}
    </div>
  );
}
