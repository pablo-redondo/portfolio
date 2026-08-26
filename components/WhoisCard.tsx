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
  { label: "idiomas", value: "Español · Gallego · Inglés" },
  { label: "estado", value: "buscando primer puesto dev" },
];

/**
 * Ficha «whois» del hero de contacto. Solo lleva datos verificables: nada
 * de un uptime o un tiempo de respuesta que nadie mide de verdad. El
 * "LISTEN" es literal — sigue disponible para que le escriban — no una
 * métrica de servidor.
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

      <div className="p-5">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="pulse-dot h-1.5 w-1.5 rounded-full bg-ok text-ok" />
          <span className="text-mono-cmd font-medium text-ok">LISTEN</span>
        </div>

        <dl className="mt-5 flex flex-col gap-4">
          {FILAS.map((fila) => (
            <div key={fila.label} className="flex items-baseline justify-between gap-4">
              <dt className="text-mono-meta text-ink-meta uppercase">{fila.label}</dt>
              <dd className="text-mono-data text-right text-ink">{fila.value}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-mono-meta text-ink-meta uppercase">zona</dt>
            <dd className="text-mono-data min-w-[3.5rem] text-right text-ink tabular-nums">
              {zona || " "}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
