"use client";

import type { ServiceStatus } from "@/app/api/status/route";
import { useDeploymentStatus as useStatus } from "@/hooks/useDeploymentStatus";
import { Sparkline } from "@/components/Sparkline";

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

function Dot({
  tone,
  pulse,
  ring,
  delayIndex = 0,
}: {
  tone: string;
  pulse?: boolean;
  ring?: boolean;
  delayIndex?: number;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-current ${tone} ${
        pulse ? "animate-pulse" : ""
      } ${ring ? "healthcheck-pulse" : ""}`}
      style={ring ? ({ "--pulse-delay": `${delayIndex * 0.32}s` } as React.CSSProperties) : undefined}
    />
  );
}

/** Badge de una sola línea, para la cabecera de una demo. */
export function DeploymentBadge({ slug }: { slug: string }) {
  const { state, services, checkedAt } = useStatus();

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
      <Dot key={checkedAt} tone={TONES[service.state]} ring={service.state === "up"} />
      {LABELS[service.state]}
      {service.latencyMs !== null && (
        <span className="text-ink-faint tabular-nums">· {service.latencyMs} ms</span>
      )}
    </span>
  );
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
 * El panel es un monitor compacto: una línea por servicio, con la latencia
 * y el estado a la derecha. Se queda con el nombre del proyecto y deja
 * fuera el subtítulo que va tras el guión largo, que era lo único que
 * llegaba a recortarse con puntos suspensivos en pantallas estrechas.
 */
function nombreCorto(title: string) {
  return title.split(" — ")[0];
}

/** Mediana de las latencias reales del historial (ignora las caídas). */
function mediana(history: ServiceStatus["history"]) {
  const valores = history.map((h) => h.latencyMs).filter((v): v is number => v !== null);
  if (valores.length === 0) return null;
  const ord = [...valores].sort((a, b) => a - b);
  const mid = Math.floor(ord.length / 2);
  return ord.length % 2 === 0 ? (ord[mid - 1] + ord[mid]) / 2 : ord[mid];
}

/**
 * Ventana real cubierta por el historial — no hay cadencia fija, así que
 * el texto sale del hueco real entre la primera y la última muestra.
 */
function ventanaReal(history: ServiceStatus["history"]) {
  if (history.length < 2) return null;
  const minutos = Math.round(
    (new Date(history[history.length - 1].at).getTime() - new Date(history[0].at).getTime()) /
      60000,
  );
  if (minutos < 1) return `${history.length} comprobaciones`;
  return minutos < 60 ? `últimos ${minutos} min` : `últimas ${Math.round(minutos / 60)} h`;
}

/**
 * Monitor a ancho completo: una fila por servicio con su endpoint, la
 * tendencia real de latencia, el RTT y el estado.
 *
 * La sparkline sale del historial que ya guarda /api/status (una muestra
 * real por ciclo de caché) — nunca una serie inventada. Cambia a ámbar
 * cuando la última comprobación se aleja bastante de su propia mediana,
 * no por un umbral fijo de milisegundos.
 */
export function DeploymentStatusPanel() {
  const { state, services, checkedAt } = useStatus();

  return (
    <div className="status-table">
      <div className="status-head">
        <div className="status-grid !p-0">
          <span className="text-mono-meta text-ink-meta uppercase">servicio</span>
          <span className="status-endpoint text-mono-meta text-ink-meta uppercase">
            endpoint
          </span>
          <span className="status-spark text-mono-meta text-ink-meta uppercase">latencia</span>
          <span className="status-rtt text-mono-meta text-right text-ink-meta uppercase">
            rtt
          </span>
          <span className="text-mono-meta text-right text-ink-meta uppercase">estado</span>
        </div>
      </div>

      {state === "ready" && services.length > 0
        ? services.map((service, i) => {
            const historyValues = service.history
              .map((h) => h.latencyMs)
              .filter((v): v is number => v !== null);
            const med = mediana(service.history);
            const anomalo =
              service.state === "up" &&
              med !== null &&
              service.latencyMs !== null &&
              service.latencyMs > med * 1.5;
            const ventana = ventanaReal(service.history);

            return (
              <div key={service.slug} className="status-row status-grid">
                <span className="min-w-0 truncate font-semibold text-ink">
                  {nombreCorto(service.title)}
                </span>
                <span className="status-endpoint text-mono-data min-w-0 truncate text-ink-meta">
                  {host(service.url)}
                </span>
                <span className="status-spark" title={ventana ?? undefined}>
                  <Sparkline
                    values={historyValues}
                    tone={service.state === "down" ? "crit" : anomalo ? "warn" : "accent"}
                  />
                </span>
                <span className="status-rtt text-mono-data text-right text-ink tabular-nums">
                  {service.latencyMs !== null ? `${service.latencyMs} ms` : "—"}
                </span>
                <span
                  className={`flex items-center justify-end gap-2 font-mono text-[11px] ${TONES[service.state]}`}
                >
                  <Dot
                    key={checkedAt}
                    tone={TONES[service.state]}
                    ring={service.state === "up"}
                    delayIndex={i}
                  />
                  {LABELS[service.state]}
                </span>
              </div>
            );
          })
        : // Filas fantasma: reservan el alto exacto, así la tabla no
          // provoca ningún salto de layout al llegar los datos.
          Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="status-row status-grid">
              <span className="h-4 w-40 rounded bg-surface-2" />
              <span className="status-endpoint h-4 w-32 rounded bg-surface-2" />
              <span className="status-spark h-4 w-full rounded bg-surface-2" />
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
