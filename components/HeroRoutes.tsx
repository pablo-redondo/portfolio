"use client";

import { useEffect, useRef } from "react";

/**
 * "Campo de rutas del hero" — catálogo de animaciones #8.
 *
 * El fondo del hero es una red conmutada en marcha: rutas ortogonales con
 * un pad en cada vértice y paquetes con estela viajando por ellas. El ratón
 * ilumina un radio de 250 px, así que el cursor funciona como sonda sobre
 * un tramo de red. Un barrido de escaneo recorre el ancho cada 7,5 s.
 *
 * Va a 100 vw (full-bleed) por detrás del contenido, con un degradado
 * lateral que protege la legibilidad del texto y un fundido de 300 px
 * hacia la sección siguiente.
 *
 * Con prefers-reduced-motion se pinta un único fotograma estático: la red
 * sigue ahí, pero ni los paquetes ni el barrido se mueven.
 */

const ROUTE_COUNT = 22;
const ACCENT: [number, number, number] = [76, 201, 255];
const OK: [number, number, number] = [0, 229, 160];
const PROBE_RADIUS = 250;
const SWEEP_MS = 7500;

type Seg = { x1: number; y1: number; x2: number; y2: number };
type Route = { segs: Seg[]; len: number; green: boolean; trunk: boolean; speed: number; phase: number };

/** Ruta ortogonal: tramos alternos horizontal/vertical, como una pista de PCB. */
function buildRoute(w: number, h: number, rnd: () => number, green: boolean, trunk: boolean): Route {
  const segs: Seg[] = [];
  // Las troncales cruzan la pantalla entera; las demás nacen y mueren dentro.
  let x = trunk ? -40 : rnd() * w;
  let y = rnd() * h;
  const steps = trunk ? 6 + Math.floor(rnd() * 3) : 3 + Math.floor(rnd() * 4);
  let horizontal = true;

  for (let i = 0; i < steps; i++) {
    const run = (trunk ? 120 : 60) + rnd() * (trunk ? 260 : 190);
    const nx = horizontal ? x + run : x;
    const ny = horizontal ? y : y + (rnd() < 0.5 ? -run : run);
    segs.push({ x1: x, y1: y, x2: nx, y2: ny });
    x = nx;
    y = ny;
    horizontal = !horizontal;
    if (x > w + 80 || y < -80 || y > h + 80) break;
  }

  const len = segs.reduce((a, s) => a + Math.abs(s.x2 - s.x1) + Math.abs(s.y2 - s.y1), 0);
  return { segs, len, green, trunk, speed: 0.06 + rnd() * 0.09, phase: rnd() };
}

/** Generador determinista: el mismo campo en cada carga, no un azar distinto. */
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Punto a lo largo de la polilínea, en distancia recorrida. */
function pointAt(route: Route, dist: number) {
  let d = dist;
  for (const s of route.segs) {
    const segLen = Math.abs(s.x2 - s.x1) + Math.abs(s.y2 - s.y1);
    if (d <= segLen) {
      const t = segLen === 0 ? 0 : d / segLen;
      return { x: s.x1 + (s.x2 - s.x1) * t, y: s.y1 + (s.y2 - s.y1) * t };
    }
    d -= segLen;
  }
  return null;
}

export function HeroRoutes() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let routes: Route[] = [];
    let w = 0;
    let h = 0;
    const probe = { x: -9999, y: -9999 };

    const layout = () => {
      const r = c.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rnd = mulberry(20260827);
      routes = [];
      for (let i = 0; i < ROUTE_COUNT; i++) {
        // 4 troncales y 3 rutas en verde, como fija el catálogo.
        routes.push(buildRoute(w, h, rnd, i >= ROUTE_COUNT - 3, i < 4));
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      // Modo aditivo: donde se cruzan dos rutas la luz suma, como en una
      // placa real, en vez de taparse una a otra.
      ctx.globalCompositeOperation = "lighter";

      const sweepX = reduced ? -9999 : ((t % SWEEP_MS) / SWEEP_MS) * (w + 400) - 200;

      for (const route of routes) {
        const [r, g, b] = route.green ? OK : ACCENT;

        for (const s of route.segs) {
          // Cercanía del cursor y del barrido: los dos "encienden" el tramo.
          const mx = (s.x1 + s.x2) / 2;
          const my = (s.y1 + s.y2) / 2;
          const dProbe = Math.hypot(mx - probe.x, my - probe.y);
          const lit = Math.max(0, 1 - dProbe / PROBE_RADIUS);
          const dSweep = Math.abs(mx - sweepX);
          const scan = Math.max(0, 1 - dSweep / 180);

          const base = route.trunk ? 0.16 : 0.09;
          const alpha = Math.min(0.75, base + lit * 0.5 + scan * 0.32);

          ctx.beginPath();
          ctx.moveTo(s.x1, s.y1);
          ctx.lineTo(s.x2, s.y2);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = route.trunk ? 1.1 : 0.8;
          ctx.stroke();

          // Pad en el vértice donde arranca el tramo.
          ctx.beginPath();
          ctx.rect(s.x1 - 2, s.y1 - 2, 4, 4);
          ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(0.8, alpha + 0.12)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        if (!reduced && route.len > 0) {
          // Paquete con estela recorriendo la ruta.
          const p = ((t * 0.001 * route.speed + route.phase) % 1) * route.len;
          const head = pointAt(route, p);
          if (head) {
            for (let k = 0; k < 5; k++) {
              const tail = pointAt(route, Math.max(0, p - k * 9));
              if (!tail) continue;
              ctx.beginPath();
              ctx.arc(tail.x, tail.y, 1.7 - k * 0.22, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${r},${g},${b},${0.6 - k * 0.11})`;
              ctx.fill();
            }
          }
        }
      }

      ctx.globalCompositeOperation = "source-over";
    };

    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      draw(t);
    };

    const onMove = (e: MouseEvent) => {
      const r = c.getBoundingClientRect();
      probe.x = e.clientX - r.left;
      probe.y = e.clientY - r.top;
    };
    const onLeave = () => {
      probe.x = -9999;
      probe.y = -9999;
    };
    const onResize = () => {
      layout();
      if (reduced) draw(0);
    };

    layout();
    window.addEventListener("resize", onResize);
    if (!reduced) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseout", onLeave);
      raf = requestAnimationFrame(loop);
    } else {
      draw(0);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <div className="hero-routes" aria-hidden>
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  );
}
