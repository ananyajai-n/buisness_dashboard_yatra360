import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FieldTooltip from "./FieldTooltip.jsx";

const axis = { fill: "#EEF0EA", fillOpacity: 0.7, fontSize: 12, fontFamily: "IBM Plex Sans" };

/** Square corners, no radius prop, and hover dims the rest of the series. */
export default function ComfortBarChart({ rows }) {
  const [hot, setHot] = useState(null);
  return (
    <div className="y-chart-wrap">
      <ResponsiveContainer width="100%" aspect={1.7}>
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 8 }}
          onMouseLeave={() => setHot(null)}>
          <CartesianGrid stroke="#3A3F3C" strokeDasharray="0" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={axis} tickLine={false} axisLine={{ stroke: "#3A3F3C" }} unit="%" />
          <YAxis type="category" dataKey="label" width={168} tick={axis} tickLine={false} axisLine={false} />
          <Tooltip content={<FieldTooltip unit="%" />} cursor={{ fill: "#EEF0EA", fillOpacity: 0.05 }} />
          <Bar dataKey="value" name="Share of arrivals" isAnimationActive={false}
            onMouseEnter={(_, i) => setHot(i)}
            activeBar={{ stroke: "#3A3F3C", strokeWidth: 1, fillOpacity: 1 }}>
            {rows.map((r, i) => (
              <Cell key={r.label} fill={r.value >= 60 ? "#C98A2B" : "#2C6E63"}
                fillOpacity={hot === null || hot === i ? 1 : 0.4} />))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
