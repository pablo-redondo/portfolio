"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  email: string;
  github: string;
  linkedin?: string;
};

type Estado = "listo" | "copiado" | "error";

/** Copia al portapapeles y devuelve el estado para pintar el feedback. */
function useCopiar(value: string) {
  const [estado, setEstado] = useState<Estado>("listo");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copiar = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setEstado("copiado");
    } catch {
      setEstado("error");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setEstado("listo"), 2200);
  }, [value]);

  return { estado, copiar };
}

/**
 * Terminal de contacto. Un `mailto:` no hace nada si el equipo no tiene
 * cliente de correo configurado (lo habitual hoy), así que el email se
 * copia, o se abre redactado en Gmail web. Cada canal tiene su tecla 1–4,
 * como un menú de terminal.
 */
export function SoonContact({ email, github, linkedin }: Props) {
  const { estado, copiar } = useCopiar(email);

  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent("Hola, Pablo")}`;

  const canales: {
    key: string;
    nombre: string;
    destino: string;
    accion: string;
    href?: string;
    onSelect?: () => void;
  }[] = [
    { key: "1", nombre: "email", destino: email, accion: "copiar", onSelect: copiar },
    { key: "2", nombre: "gmail", destino: "redactar mensaje", accion: "abrir", href: gmail },
    ...(linkedin
      ? [
          {
            key: "3",
            nombre: "linkedin",
            destino: linkedin.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
            accion: "abrir",
            href: linkedin,
          },
        ]
      : []),
    {
      key: linkedin ? "4" : "3",
      nombre: "github",
      destino: github.replace(/^https:\/\//, ""),
      accion: "abrir",
      href: github,
    },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      const canal = canales.find((c) => c.key === e.key);
      if (!canal) return;
      if (canal.onSelect) canal.onSelect();
      else if (canal.href) window.open(canal.href, "_blank", "noopener,noreferrer");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const accion = (c: (typeof canales)[number]) =>
    c.nombre === "email"
      ? estado === "copiado"
        ? "copiado ✓"
        : estado === "error"
          ? "no se pudo"
          : c.accion
      : c.accion;

  return (
    <div className="soon-win" aria-label="Canales de contacto">
      <div className="soon-win-bar">
        <div className="soon-dots" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <span>contacto — pablo</span>
        <span />
      </div>
      <div className="soon-win-body">
        <div className="soon-status">
          <span aria-hidden className="soon-pulse" />
          LISTEN
          <span className="soon-hint">pulsa 1–{canales.length}</span>
        </div>
        <ul className="soon-ch-list">
          {canales.map((c) => {
            const inner = (
              <>
                <kbd>{c.key}</kbd>
                <span className="soon-ch-name">{c.nombre}</span>
                <span className="soon-ch-dest">{c.destino}</span>
                <span className="soon-ch-act" data-estado={c.nombre === "email" ? estado : "listo"}>
                  {accion(c)}
                </span>
              </>
            );
            return (
              <li key={c.key}>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noreferrer" className="soon-ch">
                    {inner}
                  </a>
                ) : (
                  <button type="button" onClick={c.onSelect} className="soon-ch" aria-live="polite">
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Botón principal: copia el email, con feedback en el propio botón. */
export function SoonCopyButton({ email }: { email: string }) {
  const { estado, copiar } = useCopiar(email);
  return (
    <button
      type="button"
      onClick={copiar}
      className="soon-btn soon-btn-primary"
      aria-live="polite"
    >
      {estado === "copiado"
        ? "Email copiado ✓"
        : estado === "error"
          ? "No se pudo copiar"
          : "Copiar mi email"}
    </button>
  );
}
