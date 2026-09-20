import { useEffect, useRef } from "react";

/**
 * Street-level kernel-density surface.
 *
 * This is the drop-in slot for deck.gl's HeatmapLayer over a MapLibre basemap:
 * same palette ramp, same weighted points, same 1.5 km clip. It is drawn on a
 * 2D canvas here so the module has zero WebGL dependency until Person 4's live
 * ping feed exists — swap the body of this component, not its callers.
 *
 * When you do swap it in, keep the cleanup below: map.remove() in the effect's
 * return, an isMounted ref before any setState, and a webglcontextlost handler.
 */
const RAMP = [[0, 44, 110, 99, 0], [0.32, 44, 110, 99, 150], [0.62, 201, 138, 43, 205], [1, 180, 67, 46, 235]];

export default function FootTrafficHeat({ points, intensity = 1, label = "Your outlet" }) {
  const ref = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const draw = () => {
      const cv = ref.current;
      if (!cv || !mounted.current) return;
      const w = (cv.width = 900), h = (cv.height = 480);
      const ctx = cv.getContext("2d");
      ctx.fillStyle = "#101C19"; ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#3A3F3C"; ctx.lineWidth = 1;
      for (let i = 1; i < 9; i++) { ctx.beginPath(); ctx.moveTo((i * w) / 9, 0); ctx.lineTo((i * w) / 9 - 40, h); ctx.stroke(); }
      for (let j = 1; j < 6; j++) { ctx.beginPath(); ctx.moveTo(0, (j * h) / 6); ctx.lineTo(w, (j * h) / 6 + 14); ctx.stroke(); }
      ctx.strokeStyle = "#4A524E"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, h * 0.62); ctx.bezierCurveTo(w * 0.3, h * 0.5, w * 0.62, h * 0.72, w, h * 0.56); ctx.stroke();

      const acc = document.createElement("canvas"); acc.width = w; acc.height = h;
      const ax = acc.getContext("2d");
      points.forEach(([px, py, wt]) => {
        const cx = px * w, cy = py * h, r = 60 + 150 * wt * intensity;
        const g = ax.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(255,255,255,${Math.min(1, wt * intensity * 1.15)})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ax.fillStyle = g; ax.beginPath(); ax.arc(cx, cy, r, 0, 7); ax.fill();
      });
      const img = ax.getImageData(0, 0, w, h), d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const t = d[i + 3] / 255;
        if (t < 0.05) { d[i + 3] = 0; continue; }
        let a = RAMP[0], b = RAMP[RAMP.length - 1];
        for (let k = 0; k < RAMP.length - 1; k++) if (t >= RAMP[k][0] && t <= RAMP[k + 1][0]) { a = RAMP[k]; b = RAMP[k + 1]; break; }
        const f = (t - a[0]) / Math.max(1e-4, b[0] - a[0]);
        d[i] = a[1] + (b[1] - a[1]) * f; d[i + 1] = a[2] + (b[2] - a[2]) * f;
        d[i + 2] = a[3] + (b[3] - a[3]) * f; d[i + 3] = a[4] + (b[4] - a[4]) * f;
      }
      ax.putImageData(img, 0, 0);
      ctx.globalCompositeOperation = "lighter"; ctx.drawImage(acc, 0, 0); ctx.globalCompositeOperation = "source-over";

      const cx = w * 0.42, cy = h * 0.5;
      ctx.strokeStyle = "#EEF0EA"; ctx.globalAlpha = 0.5; ctx.setLineDash([5, 6]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 190, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.fillStyle = "#EEF0EA"; ctx.fillRect(cx - 4, cy - 4, 8, 8);
      ctx.beginPath(); ctx.moveTo(cx + 10, cy); ctx.lineTo(cx + 40, cy); ctx.stroke();
      ctx.font = "13px 'IBM Plex Sans',sans-serif"; ctx.fillText(label, cx + 46, cy + 4);
      ctx.globalAlpha = 0.55; ctx.font = "12px 'IBM Plex Sans',sans-serif";
      ctx.fillText("1.5 km demand radius", cx - 60, cy - 198); ctx.globalAlpha = 1;
    };
    draw();
    window.addEventListener("resize", draw);
    return () => { mounted.current = false; window.removeEventListener("resize", draw); };
  }, [points, intensity, label]);

  return <div className="y-heat"><canvas ref={ref} aria-label="Foot traffic density around your outlet" /></div>;
}
