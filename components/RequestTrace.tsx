"use client";

import { useNavigationTiming, type NavTiming } from "@/hooks/useNavigationTiming";

const STEPS: { key: keyof Pick<NavTiming, "dns" | "tcp" | "tls" | "ttfb">; label: string }[] = [
  { key: "dns", label: "dns" },
  { key: "tcp", label: "tcp" },
  { key: "tls", label: "tls" },
  { key: "ttfb", label: "ttfb" },
];

/**
 * Ventana de terminal con la traza real de la petición que acaba de cargar
 * esta página — Navigation Timing API del propio navegador, no un dato de
 * muestra. Si la conexión ya estaba abierta (visita repetida, HTTP keep
 * alive) no hay DNS/TCP/TLS que medir, y se dice así en vez de pintar tres
 * barras a cero que parecerían un acierto perfecto.
 */
export function RequestTrace() {
  const timing = useNavigationTiming();
  const max = timing ? Math.max(timing.dns, timing.tcp, timing.tls, timing.ttfb, 1) : 1;

  return (
    <div className="win">
      <div className="win-bar">
        <div className="win-dots" aria-hidden>
          <span className="win-dot" />
          <span className="win-dot" />
          <span className="win-dot" />
        </div>
        <span className="win-title">traza — pablo-redondo.dev</span>
        <span />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-mono-meta text-ink-meta uppercase">traza de esta petición</span>
          <span className={`text-mono-data text-ok transition-opacity ${timing ? "opacity-100" : "opacity-0"}`}>
            cargada
          </span>
        </div>

        {timing?.reused ? (
          <p className="text-mono-data mt-6 leading-relaxed text-ink-soft">
            Conexión reutilizada: sin DNS, TCP ni TLS nuevos que medir en esta
            carga. <span className="text-ink">{Math.round(timing.ttfb)} ms</span> hasta el
            primer byte.
          </p>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            {STEPS.map((step) => {
              const value = timing ? timing[step.key] : 0;
              const pct = timing ? Math.max(4, (value / max) * 100) : 0;
              return (
                <div key={step.key} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-mono-cmd text-ink-meta">{step.label}</span>
                    <span className="text-mono-data text-ink tabular-nums">
                      {timing ? `${Math.round(value)} ms` : "—"}
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-mono-data mt-5 border-t border-[var(--bg-raised)] pt-4 leading-relaxed text-ink-meta">
          el gráfico es la petición que acabas de hacer, no un adorno
        </p>
      </div>
    </div>
  );
}
