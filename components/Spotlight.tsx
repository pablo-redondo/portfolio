"use client";

import { useEffect } from "react";

/**
 * Foco que sigue al cursor sobre cualquier elemento con `data-spot`.
 *
 * Un único listener delegado en `document` para toda la web, en vez de un
 * handler por card: monta una sola vez en el layout y no obliga a convertir
 * ninguna card en componente de cliente.
 */
export function Spotlight() {
  useEffect(() => {
    // Sin hover no hay cursor que seguir (táctil), y con reduced-motion
    // el efecto sobra: en ninguno de los dos casos merece el listener.
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;

    const onMove = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>("[data-spot]");
      if (!card) return;

      pending = { el: card, x: event.clientX, y: event.clientY };
      if (frame) return;

      // Una sola escritura por frame. Lo único que se escribe son custom
      // properties, que no invalidan el layout, así que leer el rect en el
      // siguiente movimiento no fuerza un reflow sincrónico.
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!pending) return;
        const rect = pending.el.getBoundingClientRect();
        pending.el.style.setProperty("--mx", `${pending.x - rect.left}px`);
        pending.el.style.setProperty("--my", `${pending.y - rect.top}px`);
      });
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
