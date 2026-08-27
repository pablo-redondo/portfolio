"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * "Terminal que se teclea sola" — catálogo de animaciones #10. Cadencia
 * irregular de 26–60 ms por carácter, arranque por IntersectionObserver
 * (una sola vez, no en cada scroll). Con reduced-motion el texto aparece
 * ya escrito, sin cursor ni retardo.
 *
 * El texto real vive siempre en el DOM para lectores de pantalla — la
 * animación es puramente visual, no le hace esperar a nadie.
 */
export function Typewriter({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const [done, setDone] = useState(true);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Con reduced-motion no hay nada que teclear, pero lo que depende de
      // "cuando termina" (la traza del hero) debe ver su estado final ya.
      el.dispatchEvent(new CustomEvent("typewriter-done", { bubbles: true }));
      return;
    }

    let timer = 0;
    let started = false;

    // El propio efecto es la lectura del sistema externo (la preferencia de
    // movimiento): la microtarea evita el aviso de "setState síncrono en
    // efecto" sin perder el momento — sigue resolviéndose antes de pintar.
    Promise.resolve().then(() => {
      setDisplay("");
      setDone(false);
    });

    const type = (i: number) => {
      setDisplay(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        el.dispatchEvent(new CustomEvent("typewriter-done", { bubbles: true }));
        return;
      }
      timer = window.setTimeout(() => type(i + 1), 26 + Math.random() * 34);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        io.disconnect();
        timer = window.setTimeout(() => type(1), 26 + Math.random() * 34);
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [text]);

  return (
    <span ref={ref} aria-label={text}>
      <span aria-hidden className="whitespace-pre">
        {display}
        {!done && <span className="typewriter-caret" aria-hidden />}
      </span>
    </span>
  );
}
