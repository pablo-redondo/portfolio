import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { projects } from "@/content/projects";

/**
 * Estado real de cada despliegue.
 *
 * La comprobación va en el servidor por obligación, no por gusto: desde el
 * navegador una petición a otro origen devuelve una respuesta opaca, así que
 * no hay forma de saber si el servicio está arriba ni cuánto tardó.
 *
 * Se cachea en memoria del proceso para no lanzar una ronda de peticiones
 * contra los despliegues ajenos cada vez que alguien abre la página. Es el
 * mismo criterio que aplica NetPulse con su intervalo de cinco minutos:
 * ante servicios que no son míos, mejor pasarse de discreto.
 *
 * Va con http/https de bajo nivel y no con fetch: solo así se pueden leer
 * los eventos de socket (lookup/connect/secureConnect) y sacar un desglose
 * real por fase en vez de un único RTT total.
 */

export const dynamic = "force-dynamic";

const TTL_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 8000;

/**
 * Ventana real del uptime: 30 días de histórico en KV, no una cifra de
 * muestra. Los primeros días tras desplegar esto el % sale de lo poco que
 * haya — mejor eso que fingir treinta días que todavía no pasaron.
 */
const HISTORY_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
// Tope duro además de la ventana temporal: si un día hay tráfico real de
// sobra, el valor de KV no crece sin límite.
const HISTORY_MAX_POINTS = 500;

export type PhaseTimings = { dns: number; tcp: number; tls: number; ttfb: number };

export type HistoryPoint = { at: string; latencyMs: number | null; state: ServiceStatus["state"] };

export type ServiceStatus = {
  slug: string;
  title: string;
  url: string;
  state: "up" | "down" | "unknown";
  httpStatus: number | null;
  latencyMs: number | null;
  /** Desglose real por fase de esta comprobación. Null si no llegó a responder. */
  phases: PhaseTimings | null;
  /**
   * % de comprobaciones en "up" dentro de la ventana de 30 días guardada en
   * KV. Null si todavía no hay ni una muestra persistida — nunca un 100%
   * de partida sin datos detrás.
   */
  uptimePct: number | null;
  /**
   * Muestras reales de comprobaciones anteriores, más antigua primero — no
   * hay una cadencia fija (solo se añade una al expirar la caché de 5 min,
   * y solo si alguien visita entonces), así que el hueco real entre la
   * primera y la última es el dato honesto, no "últimos 2 minutos" fijo.
   */
  history: HistoryPoint[];
};

type Payload = {
  checkedAt: string;
  services: ServiceStatus[];
};

let cache: { at: number; payload: Payload } | null = null;

type Check = Omit<ServiceStatus, "history" | "uptimePct">;

function check(slug: string, title: string, url: string): Promise<Check> {
  return new Promise((resolve) => {
    let target: URL;
    try {
      target = new URL(url);
    } catch {
      resolve({ slug, title, url, state: "down", httpStatus: null, latencyMs: null, phases: null });
      return;
    }

    const requestFn = target.protocol === "https:" ? httpsRequest : httpRequest;
    const t0 = Date.now();
    let dnsAt: number | null = null;
    let tcpAt: number | null = null;
    let tlsAt: number | null = null;
    let settled = false;

    const finish = (result: Check) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const req = requestFn(
      target,
      {
        method: "GET",
        timeout: TIMEOUT_MS,
        // Sin keep-alive: cada comprobación abre una conexión nueva, para
        // que dns/tcp/tls sean la fase real y no un socket reutilizado a 0.
        agent: false,
        headers: { "user-agent": "pablo-redondo.dev status check" },
      },
      (res) => {
        const ttfbAt = Date.now();
        res.resume();
        res.on("end", () => {
          const connectDoneAt = tlsAt ?? tcpAt ?? t0;
          finish({
            slug,
            title,
            url,
            state: (res.statusCode ?? 0) < 400 ? "up" : "down",
            httpStatus: res.statusCode ?? null,
            latencyMs: ttfbAt - t0,
            phases: {
              dns: Math.max(0, (dnsAt ?? t0) - t0),
              tcp: Math.max(0, (tcpAt ?? dnsAt ?? t0) - (dnsAt ?? t0)),
              tls: Math.max(0, (tlsAt ?? tcpAt ?? t0) - (tcpAt ?? t0)),
              ttfb: Math.max(0, ttfbAt - connectDoneAt),
            },
          });
        });
        res.on("error", () => {
          finish({ slug, title, url, state: "down", httpStatus: null, latencyMs: null, phases: null });
        });
      },
    );

    req.on("socket", (socket) => {
      socket.on("lookup", () => {
        dnsAt = Date.now();
      });
      socket.on("connect", () => {
        tcpAt = Date.now();
      });
      socket.on("secureConnect", () => {
        tlsAt = Date.now();
      });
    });

    req.on("timeout", () => {
      req.destroy(new Error("timeout"));
    });

    req.on("error", () => {
      // Timeout, DNS, TLS o red: no llegó a responder.
      finish({ slug, title, url, state: "down", httpStatus: null, latencyMs: null, phases: null });
    });

    req.end();
  });
}

function historyKey(slug: string) {
  return `history:${slug}`;
}

/** Descarta lo que ya salió de la ventana de 30 días y aplica el tope duro. */
function trimHistory(points: HistoryPoint[], now: number): HistoryPoint[] {
  const cutoff = now - HISTORY_WINDOW_MS;
  const dentroDeVentana = points.filter((p) => new Date(p.at).getTime() >= cutoff);
  return dentroDeVentana.slice(-HISTORY_MAX_POINTS);
}

function uptimePct(points: HistoryPoint[]): number | null {
  // "unknown" no cuenta ni a favor ni en contra: no es una comprobación
  // real de si el servicio respondió.
  const medibles = points.filter((p) => p.state !== "unknown");
  if (medibles.length === 0) return null;
  const arriba = medibles.filter((p) => p.state === "up").length;
  return (arriba / medibles.length) * 100;
}

export async function GET() {
  if (cache && Date.now() - cache.at < TTL_MS) {
    return Response.json(cache.payload);
  }

  const targets = projects.filter((p) => p.demoUrl);

  // En paralelo: el timeout de uno no puede arrastrar a los demás.
  const checked = await Promise.all(
    targets.map((p) => check(p.slug, p.title, p.demoUrl as string)),
  );
  const checkedAt = new Date().toISOString();
  const now = Date.now();

  // Sin el binding (por ejemplo en un entorno que no lo expone) el panel
  // sigue funcionando: solo se queda sin histórico ni uptime, nunca roto.
  let kv: KVNamespace | null = null;
  try {
    const { env } = await getCloudflareContext({ async: true });
    kv = env.STATUS_HISTORY ?? null;
  } catch {
    kv = null;
  }

  const services: ServiceStatus[] = await Promise.all(
    checked.map(async (result) => {
      const key = historyKey(result.slug);
      const prior = kv ? ((await kv.get<HistoryPoint[]>(key, "json")) ?? []) : [];
      const updated = trimHistory(
        [...prior, { at: checkedAt, latencyMs: result.latencyMs, state: result.state }],
        now,
      );

      if (kv) {
        try {
          await kv.put(key, JSON.stringify(updated));
        } catch {
          // Persistir el histórico es un extra, no el propio check: si KV
          // falla, la respuesta sigue siendo válida con lo que ya había.
        }
      }

      return { ...result, history: updated, uptimePct: uptimePct(updated) };
    }),
  );

  const payload: Payload = { checkedAt, services };
  cache = { at: Date.now(), payload };

  return Response.json(payload);
}
