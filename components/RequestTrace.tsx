"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigationTiming, type NavTiming } from "@/hooks/useNavigationTiming";
import { TerminalWindow } from "@/components/TerminalWindow";

const STEPS: {
  key: keyof Pick<NavTiming, "dns" | "tcp" | "tls" | "ttfb">;
  label: string;
  color: string;
}[] = [
  { key: "dns", label: "dns", color: "var(--meta)" },
  { key: "tcp", label: "tcp", color: "var(--accent)" },
  { key: "tls", label: "tls", color: "var(--ok)" },
  { key: "ttfb", label: "ttfb", color: "var(--warn)" },
];

/**
 * Ventana de terminal con la traza real de la petición que acaba de cargar
 * esta página — Navigation Timing API del propio navegador, el mismo dato
 * que da `curl -w`, no una cifra de muestra.
 *
 * Antes eran cuatro barras sueltas, cada una escalada contra el máximo de
 * las cuatro: comparaban las fases entre sí, pero no decían dónde se fue
 * el tiempo de verdad. Ahora es una única barra apilada — cada fase ocupa
 * el tramo proporcional al total real, como el waterfall de la pestaña de
 * red de cualquier navegador — con el total en grande arriba, que es el
 * dato que de verdad importa.
 *
 * Catálogo de animaciones #7 — las fases se dibujan de izquierda a
 * derecha (scaleX, no width: crecer no dispara reflow) cuando el hero
 * termina de teclearse, escalonadas 90ms. Con reduced-motion se ven ya en
 * su estado final, sin esperar al typewriter de al lado.
 */
export function RequestTrace() {
  const timing = useNavigationTiming();
  const rootRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Promise.resolve().then(() => setArmed(true));
      return;
    }

    const scope = rootRef.current?.closest("section") ?? window;
    const onDone = () => setArmed(true);
    scope.addEventListener("typewriter-done", onDone, { once: true });
    return () => scope.removeEventListener("typewriter-done", onDone);
  }, []);

  const total = timing?.total ?? 0;

  return (
    <TerminalWindow title="curl -w">
      <div ref={rootRef} className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-mono-meta text-ink-meta uppercase">esta petición</span>
          <span
            className={`text-mono-data text-ok transition-opacity ${timing ? "opacity-100" : "opacity-0"}`}
          >
            cargada
          </span>
        </div>

        <p className="mt-4 flex items-baseline gap-2.5">
          <span className="font-mono text-[34px] leading-none font-semibold text-ink tabular-nums">
            {timing ? Math.round(total) : "—"}
          </span>
          <span className="text-mono-meta text-ink-meta">ms hasta el primer byte</span>
        </p>

        <div className="mt-5 flex h-2 w-full overflow-hidden rounded-full bg-surface-2">
          {timing?.reused ? (
            <span
              className="waterfall-bar h-full"
              style={{ width: "100%", background: "var(--warn)", transform: `scaleX(${armed ? 1 : 0})` }}
            />
          ) : (
            STEPS.map((step, i) => {
              const value = timing ? timing[step.key] : 0;
              const pct = timing && total > 0 ? (value / total) * 100 : 0;
              return (
                <span
                  key={step.key}
                  className="waterfall-bar h-full"
                  style={{
                    width: `${pct}%`,
                    background: step.color,
                    transform: `scaleX(${armed ? 1 : 0})`,
                    transitionDelay: `${i * 90}ms`,
                  }}
                />
              );
            })
          )}
        </div>

        <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5">
          {timing?.reused ? (
            <span className="text-mono-data text-ink-meta">
              <span className="text-ink">conexión reutilizada</span> — sin dns, tcp ni tls nuevos que
              medir en esta carga
            </span>
          ) : (
            STEPS.map((step) => (
              <span
                key={step.key}
                className="text-mono-data flex items-center gap-1.5 text-ink-meta tabular-nums"
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: step.color }} />
                {step.label} {timing ? `${Math.round(timing[step.key])} ms` : "—"}
              </span>
            ))
          )}
        </div>

        <p className="text-mono-data mt-5 border-t border-[var(--bg-raised)] pt-4 leading-relaxed text-ink-meta">
          el gráfico es la petición que acabas de hacer, no un adorno
        </p>
      </div>
    </TerminalWindow>
  );
}
