"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Copia el email al portapapeles.
 *
 * Va sobre la card, que a su vez es un enlace `mailto:`, así que el click
 * tiene que pararse aquí: quien pulsa "copiar" no quiere que además se le
 * abra el cliente de correo.
 *
 * El botón se pinta siempre, igual en el servidor que en el navegador —
 * comprobar `navigator.clipboard` antes de pintarlo obligaría a decidirlo
 * tras montar, y eso o desajusta la hidratación o mete un render de más. Si
 * la API no está (contexto no seguro, navegador viejo) el fallo se ve al
 * pulsar, que es cuando importa.
 */
export function CopyEmail({ value }: { value: string }) {
  const [estado, setEstado] = useState<"listo" | "copiado" | "error">("listo");
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const copiar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setEstado("copiado");
    } catch {
      setEstado("error");
    }
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setEstado("listo"), 2000);
  };

  return (
    <button
      type="button"
      onClick={copiar}
      data-estado={estado}
      className="copy-btn"
      // El texto cambia al pulsar, así que el estado se anuncia solo.
      aria-live="polite"
    >
      {estado === "copiado"
        ? "copiado ✓"
        : estado === "error"
          ? "no se pudo"
          : "copiar"}
    </button>
  );
}
