/** Recharts tooltip restyled as a paper label pinned to a dossier. */
export default function FieldTooltip({ active, payload, label, unit = "" }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((a, p) => a + (p.value || 0), 0);
  return (
    <div className="y-tip">
      <h4>{typeof label === "number" ? String(label).padStart(2, "0") + ":00" : label}</h4>
      {payload.map((p) => (
        <div className="y-tr" key={p.dataKey}>
          <span><i style={{ background: p.color || p.stroke }} />{p.name}</span>
          <b>{p.value}{unit}</b>
        </div>))}
      {payload.length > 1 && <div className="y-tr y-tr-total"><span>Total</span><b>{total}</b></div>}
    </div>
  );
}
