"use client";

import { useEffect, useState } from "react";

export type NavTiming = {
  dns: number;
  tcp: number;
  tls: number;
  ttfb: number;
  /** Desde el inicio de la navegación hasta el primer byte de respuesta. */
  total: number;
  /** DNS/TCP/TLS a 0: la conexión ya estaba abierta, no hay nada que trazar. */
  reused: boolean;
};

/**
 * Lee la Navigation Timing API real del navegador — la petición que el
 * propio visitante acaba de hacer para cargar esta página, no un dato de
 * muestra. Solo existe en cliente y solo tras el primer pintado, así que
 * empieza en `null` y se resuelve en un efecto.
 */
export function useNavigationTiming(): NavTiming | null {
  const [timing, setTiming] = useState<NavTiming | null>(null);

  useEffect(() => {
    if (typeof performance === "undefined") return;

    // Lee la API del navegador desde un callback, no en el cuerpo síncrono
    // del efecto: es una lectura puntual de un sistema externo (el propio
    // navegador), el mismo caso que una suscripción, solo que resuelta una
    // vez en vez de en cada evento.
    Promise.resolve().then(() => {
      const [entry] = performance.getEntriesByType(
        "navigation",
      ) as PerformanceNavigationTiming[];
      if (!entry) return;

      const dns = Math.max(0, entry.domainLookupEnd - entry.domainLookupStart);
      const connectSpan = Math.max(0, entry.connectEnd - entry.connectStart);
      const tls =
        entry.secureConnectionStart > 0
          ? Math.max(0, entry.connectEnd - entry.secureConnectionStart)
          : 0;
      const tcp = Math.max(0, connectSpan - tls);
      const ttfb = Math.max(0, entry.responseStart - entry.requestStart);
      const total = Math.max(0, entry.responseStart - entry.startTime);

      setTiming({ dns, tcp, tls, ttfb, total, reused: dns === 0 && tcp === 0 && tls === 0 });
    });
  }, []);

  return timing;
}
