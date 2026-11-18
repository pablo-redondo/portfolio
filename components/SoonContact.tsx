"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

/** Botón principal: copia el email, con feedback en el propio botón. */
export function SoonCopyButton({ email }: { email: string }) {
  const { estado, copiar } = useCopiar(email);
  return (
    <button type="button" onClick={copiar} className="soon-btn soon-btn-primary" aria-live="polite">
      {estado === "copiado"
        ? "Email copiado ✓"
        : estado === "error"
          ? "No se pudo copiar"
          : "Copiar mi email"}
    </button>
  );
}

/**
 * Foco de luz que sigue al puntero por el hero. Solo escribe dos variables
 * CSS en el contenedor: nada de re-renders. Sin puntero fino (móvil) o con
 * movimiento reducido no hace nada y el fondo queda estático.
 */
export function SoonSpotlight() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".soon");
    if (!root) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    )
      return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--mx", `${e.clientX}px`);
        root.style.setProperty("--my", `${e.clientY}px`);
        root.dataset.spot = "1";
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}

type Linea = { id: number; tipo: "in" | "out" | "ok" | "err"; texto: string; href?: string };

type Props = { email: string; github: string; linkedin?: string; cvUrl?: string };

/**
 * Terminal de contacto interactiva. Un `mailto:` no hace nada si el equipo
 * no tiene cliente de correo (lo habitual hoy), así que aquí se teclea (o se
 * pulsa un chip) el canal que se quiera: copiar el email, redactar en Gmail
 * web, abrir LinkedIn, GitHub o el CV. Tab autocompleta, ↑/↓ recorren el
 * historial.
 */
export function SoonTerminal({ email, github, linkedin, cvUrl }: Props) {
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent("Hola, Pablo")}`;

  const comandos = [
    "email",
    "gmail",
    ...(linkedin ? ["linkedin"] : []),
    "github",
    ...(cvUrl ? ["cv"] : []),
    "help",
  ];

  const [lineas, setLineas] = useState<Linea[]>([]);
  const [valor, setValor] = useState("");
  const idRef = useRef(0);
  const historial = useRef<string[]>([]);
  const cursor = useRef(-1);
  const input = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const push = useCallback((l: Omit<Linea, "id">[]) => {
    setLineas((prev) => [...prev, ...l.map((x) => ({ ...x, id: idRef.current++ }))].slice(-60));
  }, []);

  // Arranque: se "escribe" una sola vez, como si alguien hubiera lanzado la ayuda.
  useEffect(() => {
    push([
      { tipo: "out", texto: "contacto — pablo · escribe un comando o pulsa uno de abajo" },
      { tipo: "out", texto: "ayuda: help" },
    ]);
  }, [push]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lineas]);

  const abrir = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const ejecutar = async (crudo: string) => {
    const cmd = crudo.trim().toLowerCase();
    if (!cmd) return;
    historial.current.push(cmd);
    cursor.current = -1;
    push([{ tipo: "in", texto: cmd }]);

    switch (cmd) {
      case "help":
        push([
          { tipo: "out", texto: "email      copia mi correo" },
          { tipo: "out", texto: "gmail      redacta un mensaje en Gmail web" },
          ...(linkedin ? [{ tipo: "out" as const, texto: "linkedin   abre mi perfil" }] : []),
          { tipo: "out", texto: "github     abre mi GitHub" },
          ...(cvUrl ? [{ tipo: "out" as const, texto: "cv         abre mi currículum (PDF)" }] : []),
          { tipo: "out", texto: "whoami · clear" },
        ]);
        break;
      case "email":
        try {
          await navigator.clipboard.writeText(email);
          push([{ tipo: "ok", texto: `✓ copiado: ${email}` }]);
        } catch {
          push([{ tipo: "err", texto: `no pude copiar; es ${email}`, href: undefined }]);
        }
        break;
      case "gmail":
        abrir(gmail);
        push([{ tipo: "ok", texto: "✓ abriendo Gmail con el mensaje redactado…" }]);
        break;
      case "linkedin":
        if (!linkedin) return push([{ tipo: "err", texto: "comando no encontrado: linkedin" }]);
        abrir(linkedin);
        push([{ tipo: "ok", texto: "✓ abriendo LinkedIn…" }]);
        break;
      case "github":
        abrir(github);
        push([{ tipo: "ok", texto: "✓ abriendo GitHub…" }]);
        break;
      case "cv":
        if (!cvUrl) return push([{ tipo: "err", texto: "comando no encontrado: cv" }]);
        abrir(cvUrl);
        push([{ tipo: "ok", texto: "✓ abriendo el CV…" }]);
        break;
      case "whoami":
        push([{ tipo: "out", texto: "Pablo Redondo — desarrollador full-stack" }]);
        break;
      case "clear":
        setLineas([]);
        break;
      case "sudo":
      case "sudo su":
        push([{ tipo: "err", texto: "buen intento: aquí no hay root, solo un email." }]);
        break;
      default:
        push([{ tipo: "err", texto: `comando no encontrado: ${cmd} — prueba help` }]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const v = valor;
      setValor("");
      void ejecutar(v);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const c = comandos.find((x) => valor && x.startsWith(valor.toLowerCase()));
      if (c) setValor(c);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = historial.current;
      if (!h.length) return;
      cursor.current =
        e.key === "ArrowUp"
          ? Math.min(h.length - 1, cursor.current + 1)
          : Math.max(-1, cursor.current - 1);
      setValor(cursor.current === -1 ? "" : h[h.length - 1 - cursor.current]);
    }
  };

  return (
    <div className="soon-win soon-term" aria-label="Terminal de contacto">
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
        {/* La salida se anuncia sola a lectores de pantalla. */}
        <div className="soon-term-out" ref={scroller} role="log" aria-live="polite">
          {lineas.map((l) => (
            <p key={l.id} className={`soon-line soon-line-${l.tipo}`}>
              {l.tipo === "in" && <span className="soon-prompt">$</span>}
              {l.texto}
            </p>
          ))}
        </div>

        <label className="soon-term-in" onClick={() => input.current?.focus()}>
          <span className="soon-prompt">$</span>
          <input
            ref={input}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            aria-label="Comando"
            placeholder="escribe un comando…"
          />
        </label>

        <div className="soon-chips">
          {comandos.map((c) => (
            <button key={c} type="button" className="soon-chip" onClick={() => void ejecutar(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
