import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
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

export type PhaseTimings = { dns: number; tcp: number; tls: number; ttfb: number };

export type ServiceStatus = {
  slug: string;
  title: string;
  url: string;
  state: "up" | "down" | "unknown";
  httpStatus: number | null;
  latencyMs: number | null;
  /** Desglose real por fase de esta comprobación. Null si no llegó a responder. */
  phases: PhaseTimings | null;
};

type Payload = {
  checkedAt: string;
  services: ServiceStatus[];
};

let cache: { at: number; payload: Payload } | null = null;

function check(slug: string, title: string, url: string): Promise<ServiceStatus> {
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

    const finish = (result: ServiceStatus) => {
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

export async function GET() {
  if (cache && Date.now() - cache.at < TTL_MS) {
    return Response.json(cache.payload);
  }

  const targets = projects.filter((p) => p.demoUrl);

  // En paralelo: el timeout de uno no puede arrastrar a los demás.
  const services = await Promise.all(
    targets.map((p) => check(p.slug, p.title, p.demoUrl as string)),
  );

  const payload: Payload = { checkedAt: new Date().toISOString(), services };
  cache = { at: Date.now(), payload };

  return Response.json(payload);
}
