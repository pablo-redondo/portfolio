"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Milisegundos de retraso, para escalonar hermanos de un grid. */
  delay?: number;
  /**
   * En vez de animarse él, reparte la entrada entre sus hijos directos con
   * retardos crecientes. Un solo observador para toda una rejilla en lugar
   * de uno por card. Con esto el envoltorio *es* la rejilla, así que pásale
   * las clases del grid por `className`.
   */
  stagger?: boolean;
  /**
   * Etiqueta del envoltorio. Con `stagger` el envoltorio pasa a ser el
   * contenedor real de la lista, así que a veces tiene que ser `ol`/`ul`
   * para no romper el marcado (un `li` suelto dentro de un `div` no es
   * HTML válido, y el lector de pantalla pierde el conteo de la lista).
   */
  as?: "div" | "ol" | "ul";
  className?: string;
};

/* ------------------------------------------------------------------
   Red de seguridad compartida.

   Un IntersectionObserver no notifica nada cuando un elemento pasa de
   estar por debajo del viewport a estar por encima sin llegar a
   intersecar: el ratio va de 0 a 0 y no cruza ningún umbral. Pasa con
   saltos de scroll instantáneos, con anclas, y con elementos bajitos
   que caen justo en el margen inferior del observador. El elemento se
   quedaría invisible para siempre, que es el único fallo que este
   componente no se puede permitir.

   Un único listener pasivo para todas las instancias — no uno por
   card — barre las que ya quedaron atrás y se desengancha solo cuando
   no queda ninguna pendiente.
   ------------------------------------------------------------------ */

const pending = new Set<() => void>();
let sweeping = false;

function sweep() {
  // Borrar la entrada actual mientras se itera un Set es seguro.
  for (const flush of pending) flush();
  if (pending.size === 0) {
    window.removeEventListener("scroll", sweep);
    sweeping = false;
  }
}

function watchScrolledPast(flush: () => void) {
  pending.add(flush);
  if (!sweeping) {
    window.addEventListener("scroll", sweep, { passive: true });
    sweeping = true;
  }
}

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
export function Reveal({
  children,
  delay = 0,
  stagger = false,
  as: Tag = "div",
  className,
}: Props) {
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

    // Al recargar, el navegador restaura el scroll: lo que quedó por
    // encima del viewport ya no va a entrar nunca, así que se muestra
    // sin animar.
    if (el.getBoundingClientRect().bottom < 0) {
      show();
      return;
    }

    // El barrido compartido solo actúa sobre lo que ya quedó atrás.
    const flush = () => {
      if (el.getBoundingClientRect().bottom < 0) reveal();
    };

    // Declarada como `function` para poder referenciar `observer` desde
    // dentro: en el momento de la llamada ya está inicializado.
    function reveal() {
      show();
      observer.disconnect(); // una sola vez: no re-animar al subir
      pending.delete(flush);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) reveal();
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.1 },
    );

    observer.observe(el);
    watchScrolledPast(flush);

    return () => {
      observer.disconnect();
      pending.delete(flush);
    };
  }, []);

  return (
    <Tag
      // `ol`/`ul` no son HTMLDivElement, pero el efecto solo usa la parte
      // común de HTMLElement: dataset y getBoundingClientRect.
      ref={ref as React.RefObject<never>}
      className={className}
      data-reveal="out"
      data-stagger={stagger ? "" : undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
