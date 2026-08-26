"use client";

import type { ServiceStatus } from "@/app/api/status/route";
import { useDeploymentStatus as useStatus } from "@/hooks/useDeploymentStatus";

const LABELS: Record<ServiceStatus["state"], string> = {
  up: "operativo",
  down: "sin respuesta",
  unknown: "desconocido",
};

const TONES: Record<ServiceStatus["state"], string> = {
  up: "text-ok",
  down: "text-crit",
  unknown: "text-ink-faint",
};

function Dot({ tone, pulse, ring }: { tone: string; pulse?: boolean; ring?: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-current ${tone} ${
        pulse ? "animate-pulse" : ""
      } ${ring ? "pulse-dot" : ""}`}
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
      <Dot tone={TONES[service.state]} ring={service.state === "up"} />
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

/** El host del endpoint, que es lo que identifica al despliegue. */
function host(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/**
 * Monitor a ancho completo: una fila por servicio con su endpoint, la
 * latencia real de la comprobación y el estado.
 *
 * No hay columna de uptime ni gráfica de latencia: el check no guarda
 * histórico, así que serían dos columnas inventadas. Se quedan las que
 * salen de un dato que existe de verdad.
 */
export function DeploymentStatusPanel() {
  const { state, services } = useStatus();

  return (
    <div className="status-table">
      <div className="status-head">
        <div className="status-grid !p-0">
          <span className="text-mono-meta text-ink-meta uppercase">servicio</span>
          <span className="status-endpoint text-mono-meta text-ink-meta uppercase">
            endpoint
          </span>
          <span className="status-rtt text-mono-meta text-right text-ink-meta uppercase">
            rtt
          </span>
          <span className="text-mono-meta text-right text-ink-meta uppercase">estado</span>
        </div>
      </div>

      {state === "ready" && services.length > 0
        ? services.map((service) => (
            <div key={service.slug} className="status-row status-grid">
              <span className="min-w-0 truncate font-semibold text-ink">
                {nombreCorto(service.title)}
              </span>
              <span className="status-endpoint text-mono-data min-w-0 truncate text-ink-meta">
                {host(service.url)}
              </span>
              <span className="status-rtt text-mono-data text-right text-ink tabular-nums">
                {service.latencyMs !== null ? `${service.latencyMs} ms` : "—"}
              </span>
              <span
                className={`flex items-center justify-end gap-2 font-mono text-[11px] ${TONES[service.state]}`}
              >
                <Dot tone={TONES[service.state]} ring={service.state === "up"} />
                {LABELS[service.state]}
              </span>
            </div>
          ))
        : // Filas fantasma: reservan el alto exacto, así la tabla no
          // provoca ningún salto de layout al llegar los datos.
          Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="status-row status-grid">
              <span className="h-4 w-40 rounded bg-surface-2" />
              <span className="status-endpoint h-4 w-32 rounded bg-surface-2" />
              <span className="status-rtt h-4 w-12 justify-self-end rounded bg-surface-2" />
              <span className="h-4 w-20 justify-self-end rounded bg-surface-2" />
            </div>
          ))}

      <p className="text-mono-meta px-5 py-3.5 text-ink-meta">
        {state === "error"
          ? "La comprobación no está disponible ahora mismo."
          : "Check HTTP real desde el servidor, cacheado 5 min"}
      </p>
    </div>
  );
}
