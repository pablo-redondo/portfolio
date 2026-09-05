"use client";

import { useEffect, useState } from "react";

/** Desfase horario real de Madrid ahora mismo (UTC+1 o UTC+2 según el DST). */
function useZonaHoraria() {
  const [zona, setZona] = useState("");

  useEffect(() => {
    Promise.resolve().then(() => {
      const offset = new Intl.DateTimeFormat("es-ES", {
        timeZone: "Europe/Madrid",
        timeZoneName: "shortOffset",
      })
        .formatToParts(new Date())
        .find((p) => p.type === "timeZoneName")?.value;
      if (offset) setZona(offset.replace("GMT", "UTC"));
    });
  }, []);

  return zona;
}

const FILAS: { label: string; value: string }[] = [
  { label: "ubicación", value: "Galicia, España" },
  { label: "respuesta", value: "< 24 h" },
  { label: "estado", value: "buscando primer puesto dev" },
  { label: "modalidad", value: "presencial · híbrido · remoto" },
];

/**
 * Ficha «whois» del hero de contacto. El "LISTEN" es literal — sigue
 * disponible para que le escriban — no una métrica de servidor. El
 * "uptime" y la "respuesta" son el mismo guiño al disfraz de servidor que
 * ya lleva "LISTEN", no una cifra medida por un sistema: es el mismo
 * compromiso que repite la tabla de canales de abajo.
 */
export function WhoisCard() {
  const zona = useZonaHoraria();

  return (
    <div className="win">
      <div className="win-bar">
        <div className="win-dots" aria-hidden>
          <span className="win-dot" />
          <span className="win-dot" />
          <span className="win-dot" />
        </div>
        <span className="win-title">whois — pablo</span>
        <span />
      </div>

      <div className="pt-[22px] px-6 pb-6">
        <div className="mb-5 flex items-center gap-2.5">
          <span aria-hidden className="pulse-dot h-1.5 w-1.5 rounded-full bg-ok text-ok" />
          <span className="text-mono-cmd font-medium text-ok">LISTEN</span>
          <span className="flex-1" />
          <span className="text-mono-meta text-ink-meta">uptime 100 %</span>
        </div>

        <dl>
          <div className="flex items-baseline justify-between gap-4 border-t border-[var(--bg-raised)] py-[11px]">
            <dt className="font-mono text-xs text-ink-meta">zona</dt>
            <dd className="text-mono-data min-w-[3.5rem] text-right text-ink tabular-nums">
              {zona || " "}
            </dd>
          </div>
          {FILAS.map((fila) => (
            <div
              key={fila.label}
              className="flex items-baseline justify-between gap-4 border-t border-[var(--bg-raised)] py-[11px]"
            >
              <dt className="font-mono text-xs text-ink-meta">{fila.label}</dt>
              <dd className="text-mono-data text-right text-ink">{fila.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
