"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Milisegundos de retraso, para escalonar hermanos de un grid. */
  delay?: number;
  className?: string;
};

/**
 * Revela su contenido al entrar en viewport, una sola vez.
 *
 * El envoltorio es cliente, pero `children` llega ya renderizado desde el
 * servidor, así que envolver un bloque no lo convierte en componente cliente.
 *
 * El atributo se escribe directamente sobre el nodo en vez de pasar por
 * estado de React: el efecto sincroniza con un sistema externo (el DOM y el
 * observer), que es justo para lo que sirve, y así revelar una card no
 * dispara un re-render.
 *
 * El estado oculto vive en CSS detrás de `(scripting: enabled)`: si este
 * componente nunca llega a ejecutarse, el contenido se ve igualmente.
 */
export function Reveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => {
      el.dataset.reveal = "in";
    };

    // Sin soporte: mostrar y salir. Nunca dejar contenido oculto.
    if (!("IntersectionObserver" in window)) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect(); // una sola vez: no re-animar al subir
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-reveal="out"
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
