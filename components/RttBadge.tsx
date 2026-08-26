"use client";

import { useNavigationTiming } from "@/hooks/useNavigationTiming";

/**
 * El rtt real de la petición que acaba de traer esta página, no un número
 * de muestra. En SSR/primer pintado no hay nada que medir todavía, así que
 * no se pinta nada hasta que el efecto resuelve — ocupa su hueco con
 * `invisible` en vez de aparecer de golpe y empujar la cabecera.
 */
export function RttBadge() {
  const timing = useNavigationTiming();

  return (
    <div
      className={`hidden shrink-0 items-center gap-2 rounded-md border border-line bg-surface-2 px-2.5 py-1.5 min-[560px]:flex ${
        timing ? "" : "invisible"
      }`}
    >
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-ok" />
      <span className="text-mono-meta text-ink-meta">rtt</span>
      <span className="text-mono-data text-ink tabular-nums">
        {timing ? Math.round(timing.total) : 0} ms
      </span>
    </div>
  );
}
