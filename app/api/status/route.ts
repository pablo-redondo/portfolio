import { projects } from "@/content/projects";

/**
 * Estado real de cada despliegue.
 *
 * La comprobación va en el servidor por obligación, no por gusto: desde el
 * navegador una petición a otro origen devuelve una respuesta opaca, así que
 * no hay forma de saber si el servicio está arriba ni cuánto tardó.
 *
 * Se cachea en memoria del proceso para no lanzar una ronda de peticiones
 * contra seis despliegues ajenos cada vez que alguien abre la página. Es el
 * mismo criterio que aplica NetPulse con su intervalo de cinco minutos:
 * ante servicios que no son míos, mejor pasarse de discreto.
 */

export const dynamic = "force-dynamic";

const TTL_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 8000;

export type ServiceStatus = {
  slug: string;
  title: string;
  url: string;
  state: "up" | "down" | "unknown";
  httpStatus: number | null;
  latencyMs: number | null;
};

type Payload = {
  checkedAt: string;
  services: ServiceStatus[];
};

let cache: { at: number; payload: Payload } | null = null;

async function check(slug: string, title: string, url: string): Promise<ServiceStatus> {
  const startedAt = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        // Identificable, para que quien mire sus logs sepa de dónde sale.
        "user-agent": "pablo-redondo.dev status check",
      },
    });

    return {
      slug,
      title,
      url,
      // <400 se considera arriba: un 3xx sigue siendo un servicio que responde.
      state: res.status < 400 ? "up" : "down",
      httpStatus: res.status,
      latencyMs: Date.now() - startedAt,
    };
  } catch {
    // Timeout, DNS, TLS o red: no llegó a responder.
    return { slug, title, url, state: "down", httpStatus: null, latencyMs: null };
  }
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
