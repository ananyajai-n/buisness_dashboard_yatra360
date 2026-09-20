import { useEffect, useRef, useState } from "react";

/**
 * The right half of the auth screens. Instead of stock photography (which
 * would need a remote host and would read as a template), each plate is
 * line-drawn in the Yatra 360 palette and carries a real figure — the panel
 * doubles as the product's first argument for itself.
 */
export const PLATES = [
  { id: "wada", title: "Shaniwar Wada, 17:00",
    note: "The Peshwa gate takes 41,200 recorded visits a month. On Saturdays the forecourt passes safe capacity before sunset and the crowd spills into Kasba Peth.",
    stats: [["41,200", "VISITS / MONTH"], ["0.91", "PEAK CROWD INDEX"]],
    art: (
      <g>
        <path d="M40 240h340" stroke="var(--basalt)" /><path d="M70 240V120h280v120" />
        <path d="M70 120l140-58 140 58" /><path d="M170 240v-72a40 40 0 0 1 80 0v72" />
        <path d="M186 240v-64a24 24 0 0 1 48 0v64" strokeOpacity=".55" />
        <path d="M100 150h34v40h-34zM286 150h34v40h-34z" />
        <path d="M110 190v-40M124 190v-40M296 190v-40M310 190v-40" strokeOpacity=".4" />
        <path d="M70 108h280M70 100h280" strokeOpacity=".5" /><circle cx="210" cy="86" r="7" />
      </g>) },
  { id: "aga", title: "Aga Khan Palace",
    note: "Italianate arcades and 19 acres of garden, and still only the fourth most-visited site in the city. Underused capacity is an opportunity, not a failure.",
    stats: [["19 ac", "GROUNDS"], ["4th", "BY FOOTFALL"]],
    art: (
      <g>
        <path d="M40 238h340" stroke="var(--basalt)" /><path d="M60 238V132h300v106" />
        <path d="M60 132h300M60 122h300" strokeOpacity=".5" />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${74 + i * 40} 238v-58a14 14 0 0 1 28 0v58`} />)}
        <path d="M150 122V86h120v36" /><path d="M150 86l60-26 60 26" />
        <path d="M196 122V96h28v26" strokeOpacity=".6" />
      </g>) },
  { id: "sinhagad", title: "Sinhagad ridge",
    note: "A 12 km climb, a fort at the top and one road in. Demand here is weather-bound: comfort score, not distance, decides whether the trip happens.",
    stats: [["1,312 m", "ELEVATION"], ["1", "ACCESS ROAD"]],
    art: (
      <g>
        <path d="M20 232h380" stroke="var(--basalt)" /><path d="M20 232l110-120 70 62 60-84 120 142z" />
        <path d="M60 232l72-80M200 232l60-72" strokeOpacity=".35" />
        <path d="M110 200c40-8 30-30 66-34s44-24 82-26 52-18 84-22" stroke="var(--teal)" strokeDasharray="4 5" />
        <path d="M244 90h44v22h-44z" /><path d="M252 90V76M266 90V70M280 90V76" strokeOpacity=".6" />
      </g>) },
  { id: "metro", title: "Mutha riverfront & Metro Line 1",
    note: "The viaduct moved 1.4 million riders last quarter. Every station is a demand source your street can be connected to — if the corridor exists.",
    stats: [["1.4 M", "QUARTERLY RIDERS"], ["6 min", "PEAK HEADWAY"]],
    art: (
      <g>
        <path d="M20 214c60 18 120-16 180-8s120 34 200 6" stroke="var(--teal)" />
        <path d="M20 236c60 18 120-16 180-8s120 34 200 6" stroke="var(--teal)" strokeOpacity=".45" />
        <path d="M20 150h380" strokeWidth="1.4" />
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i} strokeOpacity=".6"><path d={`M${40 + i * 48} 150v56`} /><path d={`M${30 + i * 48} 206h20`} /></g>))}
        <path d="M96 150v-26h84v26" /><circle cx="138" cy="137" r="5" fill="var(--gold)" stroke="none" />
      </g>) },
];

export default function RotatingPlates() {
  const [i, setI] = useState(0);
  const timer = useRef(null);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const start = () => {
    stop();
    if (!reduce) timer.current = setInterval(() => setI((n) => (n + 1) % PLATES.length), 6000);
  };
  const stop = () => { if (timer.current) clearInterval(timer.current); timer.current = null; };
  useEffect(() => { start(); return stop; }, []);

  const p = PLATES[i];
  return (
    <aside className="y-vis" onMouseEnter={stop} onMouseLeave={start}>
      {PLATES.map((pl, n) => (
        <div key={pl.id} className={"y-plate" + (n === i ? " on" : "")} aria-hidden={n !== i}>
          <svg viewBox="0 0 420 280" fill="none" stroke="var(--gold)" strokeWidth="1.1">{pl.art}</svg>
        </div>
      ))}
      <div className="y-vis-caption">
        <h3>{p.title}</h3>
        <p>{p.note}</p>
        <div className="y-vis-stat">
          {p.stats.map(([v, l]) => <div key={l}><span>{v}</span><em>{l}</em></div>)}
        </div>
        <div className="y-dots">
          {PLATES.map((pl, n) => (
            <button key={pl.id} aria-current={n === i} aria-label={`Show ${pl.title}`}
              onClick={() => { setI(n); start(); }} />
          ))}
        </div>
      </div>
    </aside>
  );
}
