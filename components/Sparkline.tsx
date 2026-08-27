"use client";

import { useEffect, useRef } from "react";

const W = 132;
const H = 30;

/**
 * Catálogo de animaciones #5 — "Sparklines de latencia vivas": un trazo
 * que se dibuja, no un fade-in. Muestras reales del historial que ya
 * guarda /api/status (una por ciclo de caché, sin cadencia fija), nunca
 * una serie inventada. Con reduced-motion se ve ya trazada del todo.
 */
export function Sparkline({
  values,
  tone = "accent",
}: {
  values: number[];
  tone?: "accent" | "warn" | "crit";
}) {
  const ref = useRef<SVGPolylineElement>(null);

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(1, max - min);
  const points = values
    .map((v, i) => {
      const x = values.length > 1 ? (i / (values.length - 1)) * W : W / 2;
      const y = H - 3 - ((v - min) / span) * (H - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const len = el.getTotalLength();

    if (reduced) {
      el.style.strokeDasharray = "none";
      el.style.strokeDashoffset = "0";
      return;
    }

    el.style.transition = "none";
    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;
    // Fuerza el reflow antes de armar la transición, o el navegador funde
    // el estado inicial con el final y no hay nada que dibujar.
    el.getBoundingClientRect();
    el.style.transition = "stroke-dashoffset 900ms var(--ease-out)";
    el.style.strokeDashoffset = "0";
  }, [values]);

  if (values.length < 2) {
    return <span className="text-mono-meta text-ink-faint">—</span>;
  }

  const strokeColor = tone === "accent" ? "var(--accent)" : `var(--${tone})`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden className="overflow-visible">
      <polyline
        ref={ref}
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.4}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
