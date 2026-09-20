import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FieldTooltip from "./FieldTooltip.jsx";
import { SEGMENT_META } from "../data/mock.js";

const axis = { fill: "#EEF0EA", fillOpacity: 0.55, fontSize: 11, fontFamily: "IBM Plex Sans" };

/**
 * aspect (not a flexed height) is deliberate: ResponsiveContainer's
 * ResizeObserver intermittently measures 0 inside grid/flex parents in React 18,
 * which would blank the chart mid-demo.
 */
export default function DemandAreaChart({ series, segments }) {
  const on = Object.keys(segments).filter((k) => segments[k]);
  const peak = series.reduce((b, r) => (r.family + r.solo + r.transit > b.v ? { h: r.hour, v: r.family + r.solo + r.transit } : b), { h: 18, v: 0 }).h;

  return (
    <div className="y-chart-wrap">
      <ResponsiveContainer width="100%" aspect={2.6}>
        <AreaChart data={series} margin={{ top: 12, right: 8, bottom: 4, left: -14 }}>
          <defs>
            {on.map((k) => (
              <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SEGMENT_META[k].hex} stopOpacity={0.42} />
                <stop offset="100%" stopColor={SEGMENT_META[k].hex} stopOpacity={0} />
              </linearGradient>))}
          </defs>
          <CartesianGrid stroke="#3A3F3C" strokeDasharray="0" vertical={false} />
          <XAxis dataKey="hour" tick={axis} tickLine={false} axisLine={{ stroke: "#3A3F3C" }}
            ticks={[0, 4, 8, 12, 16, 20, 23]} tickFormatter={(h) => String(h).padStart(2, "0") + ":00"} />
          <YAxis tick={axis} tickLine={false} axisLine={false} width={46} />
          <ReferenceLine x={peak} stroke="#B4432E" strokeDasharray="3 4"
            label={{ value: "peak", fill: "#B4432E", fontSize: 11, position: "insideTopRight" }} />
          <Tooltip content={<FieldTooltip />} cursor={{ stroke: "#EEF0EA", strokeOpacity: 0.35 }} />
          {on.map((k) => (
            <Area key={k} type="monotone" dataKey={k} name={SEGMENT_META[k].name} stackId={undefined}
              stroke={SEGMENT_META[k].hex} strokeWidth={1.6} fill={`url(#grad-${k})`} isAnimationActive={false} />))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
