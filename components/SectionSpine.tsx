"use client";

import { useEffect, useRef } from "react";

type Beat = {
  i: number;
  y: number;
  lit: boolean;
  pingAt: number;
};

const W = 28;
const MID = 14;
const ACCENT = [76, 201, 255] as const; // #4CC9FF
const BG = "#070A0C";
const OFF = "#3C5866";

/**
 * El eje vertical animado — "monitor vivo" — que recorre cada página junto
 * al carril de las etiquetas de sección. Todo en un único <canvas>: los
 * nodos van pintados ahí mismo, opacos, para que la señal quede detrás y
 * no sean un <span> translúcido superpuesto.
 *
 * Un solo rAF por página. Las posiciones de los nodos ([data-hop], marcados
 * por <SectionLabel>) se miden en coordenadas LOCALES del canvas al montar,
 * al redimensionar y (con debounce) al hacer scroll — el layout no cambia
 * con el scroll, pero si un desplegable abre/cierra sí.
 */
export function SectionSpine() {
  const spineRef = useRef<HTMLCanvasElement>(null);
  const beatsRef = useRef<Beat[]>([]);
  const fromRef = useRef(0);
  const svRef = useRef(0);
  const lyRef = useRef(0);
  const mbRef = useRef<number | null>(null);
  const hoverRef = useRef<number | null>(null);
  const hoverAtRef = useRef(0);

  useEffect(() => {
    const c = spineRef.current;
    if (!c) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function measureBeats() {
      if (!c) return;
      const cb = c.getBoundingClientRect();

      const hero = c.parentElement?.parentElement?.querySelector("section");
      fromRef.current = hero ? hero.getBoundingClientRect().bottom - cb.top - 26 : 0;

      beatsRef.current = [...document.querySelectorAll<HTMLElement>("[data-hop]")].map(
        (el, i) => {
          if (!el.dataset.wired) {
            el.dataset.wired = "1";
            el.addEventListener("mouseenter", () => {
              hoverRef.current = i;
              hoverAtRef.current = performance.now();
            });
            el.addEventListener("mouseleave", () => {
              if (hoverRef.current === i) hoverRef.current = null;
            });
          }
          const b = el.getBoundingClientRect();
          return {
            i,
            y: b.top + b.height / 2 - cb.top,
            lit: el.dataset.lit === "1",
            pingAt: Number(el.dataset.pingAt) || 0,
          };
        },
      );
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.dataset.lit = "1";
          if (!el.dataset.pinged) {
            el.dataset.pinged = "1";
            el.dataset.pingAt = String(performance.now());
          }
          io.unobserve(el);
          measureBeats();
          if (reduced) scheduleDraw();
        });
      },
      { rootMargin: "0px 0px -30% 0px" },
    );
    document.querySelectorAll("[data-hop]").forEach((el) => io.observe(el));

    let scrollRaf = 0;
    const scheduleDraw = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame((t) => {
        scrollRaf = 0;
        drawSpine(t);
      });
    };

    const onScroll = () => {
      const y = window.scrollY;
      svRef.current = Math.min(90, Math.abs(y - lyRef.current));
      lyRef.current = y;
      if (!mbRef.current) {
        mbRef.current = window.setTimeout(() => {
          mbRef.current = null;
          measureBeats();
          if (reduced) scheduleDraw();
        }, 240);
      }
      // Sin rAF continuo en reduced-motion, la traza igualmente debe seguir
      // el scroll — no es animación autónoma, es reflejar dónde está el
      // lector.
      if (reduced) scheduleDraw();
    };

    function drawSpine(t: number) {
      if (!c) return;
      const h = c.clientHeight;
      if (h < 40) return;

      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      if (c.width !== Math.round(W * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(h * dpr);
      }
      const x = c.getContext("2d");
      if (!x) return;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.clearRect(0, 0, W, h);

      const [r, g, b] = ACCENT;
      const box = c.getBoundingClientRect();
      const from = fromRef.current;

      const vis0 = Math.max(from, -box.top - 60);
      const vis1 = Math.min(h, -box.top + window.innerHeight + 60);
      if (vis1 <= vis0) return;

      svRef.current *= 0.9;
      const amp = reduced ? 0 : 1.1 + Math.min(5.6, svRef.current * 0.055);

      const beats = beatsRef.current.filter((p) => p.y >= from - 4);

      const qrs = (d: number) => {
        const a = Math.abs(d);
        if (a > 26) return 0;
        if (d > -4 && d < 4) return -Math.cos(((d / 4) * Math.PI) / 2) * 9;
        if (d <= -4) return Math.exp(-(a - 4) / 7) * 2.6;
        return -Math.exp(-(a - 4) / 9) * 3.4;
      };

      const offsetAt = (y: number) => {
        let off =
          Math.sin(y * 0.055 + t / 620) * amp + Math.sin(y * 0.21 + t / 240) * amp * 0.35;
        for (const p of beats) off += qrs(y - p.y);
        return off;
      };

      x.beginPath();
      for (let y = vis0; y <= vis1; y += 2) {
        const px = MID + offsetAt(y);
        if (y === vis0) x.moveTo(px, y);
        else x.lineTo(px, y);
      }
      const grad = x.createLinearGradient(0, from, 0, from + 150);
      grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0.5)`);
      x.strokeStyle = vis0 < from + 150 ? grad : `rgba(${r},${g},${b},0.5)`;
      x.lineWidth = 1.3;
      x.lineJoin = "round";
      x.shadowColor = `rgba(${r},${g},${b},0.85)`;
      x.shadowBlur = 6;
      x.stroke();
      x.shadowBlur = 0;

      for (const p of beats) {
        const cx = MID + Math.sin(p.y * 0.055 + t / 620) * amp * 0.4;
        const cy = p.y;

        const age = p.pingAt ? performance.now() - p.pingAt : Infinity;
        if (!reduced && age < 1000) {
          const fr = age / 1000;
          x.beginPath();
          x.arc(cx, cy, 7 + fr * 16, 0, Math.PI * 2);
          x.strokeStyle = `rgba(${r},${g},${b},${(1 - fr) * 0.55})`;
          x.lineWidth = 1.4;
          x.stroke();
        }

        const hov = hoverRef.current === p.i;
        if (hov && !reduced) {
          const fr = ((performance.now() - hoverAtRef.current) % 1100) / 1100;
          x.beginPath();
          x.arc(cx, cy, 7 + fr * 13, 0, Math.PI * 2);
          x.strokeStyle = `rgba(${r},${g},${b},${(1 - fr) * 0.5})`;
          x.lineWidth = 1.2;
          x.stroke();
        }

        x.beginPath();
        x.arc(cx, cy, hov ? 8.5 : 7, 0, Math.PI * 2);
        x.fillStyle = BG;
        x.fill();

        const on = p.lit || hov;
        x.strokeStyle = on ? `rgb(${r},${g},${b})` : OFF;
        x.lineWidth = 1.3;
        if (on) {
          x.shadowColor = `rgba(${r},${g},${b},0.75)`;
          x.shadowBlur = hov ? 16 : 9;
        }
        x.stroke();
        x.shadowBlur = 0;

        x.beginPath();
        x.arc(cx, cy, hov ? 3.2 : 2.6, 0, Math.PI * 2);
        x.fillStyle = on ? `rgb(${r},${g},${b})` : OFF;
        x.fill();
      }

      if (!reduced) {
        const PERIOD = 7000;
        const span = vis1 - vis0;
        const hy = vis0 + ((t % PERIOD) / PERIOD) * span;
        const start = Math.max(vis0, hy - 60);

        const g2 = x.createLinearGradient(0, hy - 60, 0, hy);
        g2.addColorStop(0, `rgba(${r},${g},${b},0)`);
        g2.addColorStop(1, `rgba(${r},${g},${b},0.55)`);

        x.beginPath();
        for (let y = start; y <= hy; y += 2) {
          const px = MID + offsetAt(y);
          if (y === start) x.moveTo(px, y);
          else x.lineTo(px, y);
        }
        x.strokeStyle = g2;
        x.lineWidth = 2.4;
        x.stroke();

        x.beginPath();
        x.arc(MID + offsetAt(hy), hy, 2.6, 0, Math.PI * 2);
        x.fillStyle = `rgb(${r},${g},${b})`;
        x.shadowColor = `rgba(${r},${g},${b},1)`;
        x.shadowBlur = 12;
        x.fill();
        x.shadowBlur = 0;
      }
    }

    const onResize = () => {
      measureBeats();
      if (reduced) scheduleDraw();
    };

    measureBeats();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      drawSpine(t);
    };

    if (reduced) drawSpine(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      io.disconnect();
      if (mbRef.current) clearTimeout(mbRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 mx-auto w-full max-w-[1180px] px-6 sm:px-8">
      <canvas
        ref={spineRef}
        className="absolute top-0 left-[8px] z-[2] w-[28px]"
        style={{ height: "100%" }}
      />
    </div>
  );
}
