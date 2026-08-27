"use client";

import { useEffect, useRef } from "react";

/**
 * Catálogo de animaciones #13 — "Índice de hops pegajoso". El hop activo
 * se ilumina según lees (scroll-spy, no solo al pulsar) y la barra bajo
 * la nav marca cuánto caso llevas recorrido. El sistema `:target`/`:has()`
 * de globals.css sigue siendo el estado real sin JavaScript; esto es una
 * mejora progresiva por encima, nunca un reemplazo.
 */
export function HopScrollSpy({ hopIds }: { hopIds: string[] }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = hopIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const links = new Map(
      hopIds.map((id) => [
        id,
        document.querySelector<HTMLElement>(`.hop-link[data-hop="${id}"]`),
      ]),
    );

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setActive = (id: string) => {
      links.forEach((el, key) => {
        el?.classList.toggle("hop-link-js-active", key === id);
        el?.classList.toggle("hop-link-js-inactive", key !== id);
      });
      const idx = hopIds.indexOf(id);
      if (barRef.current && idx >= 0) {
        barRef.current.style.width = `${((idx + 1) / hopIds.length) * 100}%`;
      }
    };

    // Umbral de 220px: el hop activo es el que ya cruzó ese margen desde
    // arriba, no el primero que asoma por abajo del viewport.
    const io = new IntersectionObserver(
      (entries) => {
        const visibles = entries.filter((e) => e.isIntersecting);
        if (visibles.length === 0) return;
        const top = visibles.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActive((top.target as HTMLElement).id);
      },
      { rootMargin: "-220px 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    setActive(hopIds[0]);

    // Scroll suave al pulsar, salvo con reduced-motion (salto instantáneo).
    const onClick = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLAnchorElement;
      const id = el.dataset.hop;
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    };
    links.forEach((el) => el?.addEventListener("click", onClick));

    return () => {
      io.disconnect();
      links.forEach((el) => el?.removeEventListener("click", onClick));
    };
  }, [hopIds]);

  return (
    <div className="hop-progress" aria-hidden>
      <div ref={barRef} className="hop-progress-fill" />
    </div>
  );
}
