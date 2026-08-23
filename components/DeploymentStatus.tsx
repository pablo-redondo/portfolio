"use client";

import { useEffect, useState } from "react";
import type { ServiceStatus } from "@/app/api/status/route";

type State = "loading" | "ready" | "error";

const LABELS: Record<ServiceStatus["state"], string> = {
  up: "operativo",
  down: "sin respuesta",
  unknown: "desconocido",
};

const TONES: Record<ServiceStatus["state"], string> = {
  up: "text-teal",
  down: "text-danger",
  unknown: "text-ink-faint",
};

function useStatus() {
  const [state, setState] = useState<State>("loading");
  const [services, setServices] = useState<ServiceStatus[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/status")
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data: { services: ServiceStatus[] }) => {
        if (cancelled) return;
        setServices(data.services);
        setState("ready");
      })
      .catch(() => {
        // La comprobación es información extra, no contenido: si falla,
        // la página no debe enseñar un error.
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { state, services };
}

function Dot({ tone, pulse }: { tone: string; pulse?: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-current ${tone} ${
        pulse ? "animate-pulse" : ""
      }`}
    />
  );
}

/** Badge de una sola línea, para la cabecera de una demo. */
export function DeploymentBadge({ slug }: { slug: string }) {
  const { state, services } = useStatus();

  if (state === "error") return null;

  if (state === "loading") {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-faint">
        <Dot tone="text-ink-faint" pulse />
        comprobando…
      </span>
    );
  }

  const service = services.find((s) => s.slug === slug);
  if (!service) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] ${TONES[service.state]}`}
    >
      <Dot tone={TONES[service.state]} />
      {LABELS[service.state]}
      {service.latencyMs !== null && (
        <span className="text-ink-faint tabular-nums">· {service.latencyMs} ms</span>
      )}
    </span>
  );
}

/** Panel con todos los despliegues. El portfolio monitorizándose a sí mismo. */
/**
 * El panel es un monitor compacto: una línea por servicio, con la latencia
 * y el estado a la derecha. Se queda con el nombre del proyecto y deja
 * fuera el subtítulo que va tras el guión largo, que era lo único que
 * llegaba a recortarse con puntos suspensivos en pantallas estrechas.
 */
function nombreCorto(title: string) {
  return title.split(" — ")[0];
}

export function DeploymentStatusPanel() {
  const { state, services } = useStatus();

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-2.5">
        <span className="font-mono text-[11px] text-ink-faint">
          <span className="text-accent">$</span> status --all
        </span>
        <span className="font-mono text-[10px] tracking-wide text-ink-faint uppercase">
          {state === "loading" ? "comprobando" : state === "error" ? "no disponible" : "en vivo"}
        </span>
      </div>

      <ul className="divide-y divide-line">
        {state === "ready" && services.length > 0
          ? services.map((service) => (
              <li
                key={service.slug}
                className="flex min-w-0 items-center justify-between gap-4 px-4 py-3"
              >
                <span className="min-w-0 truncate font-mono text-[13px] text-ink">
                  {nombreCorto(service.title)}
                </span>
                <span
                  className={`flex shrink-0 items-center gap-1.5 font-mono text-[11px] ${TONES[service.state]}`}
                >
                  {service.latencyMs !== null && (
                    <span className="text-ink-faint tabular-nums">
                      {service.latencyMs} ms
                    </span>
                  )}
                  <Dot tone={TONES[service.state]} />
                  {LABELS[service.state]}
                </span>
              </li>
            ))
          : // Filas fantasma: reservan el alto exacto, así el panel no
            // provoca ningún salto de layout al llegar los datos.
            Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex min-w-0 items-center justify-between gap-4 px-4 py-3">
                <span className="h-4 w-32 rounded bg-surface-2" />
                <span className="h-4 w-20 rounded bg-surface-2" />
              </li>
            ))}
      </ul>

      <p className="border-t border-line px-4 py-2.5 font-mono text-[10px] text-ink-faint">
        Comprobación HTTP real desde el servidor, cacheada 5 min
      </p>
    </div>
  );
}
