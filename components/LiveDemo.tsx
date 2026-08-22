"use client";

import { useState } from "react";

type Props = {
  url: string;
  title: string;
  /** Aviso previo, por ejemplo un backend que duerme por inactividad. */
  note?: string;
};

/**
 * Demo en vivo embebida, que solo se carga cuando el visitante la pide.
 *
 * Cargar seis iframes de arranque significaría cargar seis aplicaciones
 * enteras y tirar por tierra las métricas de la página, así que por
 * defecto solo se pinta el marco. El iframe se monta al pulsar.
 *
 * Un iframe bloqueado por X-Frame-Options se queda en blanco sin emitir
 * ningún error que se pueda capturar desde fuera (es otro origen), así
 * que el enlace para abrir en pestaña nueva está siempre visible: es la
 * salida cuando el embebido no funciona.
 */
export function LiveDemo({ url, title, note }: Props) {
  const [loaded, setLoaded] = useState(false);
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="surface-card overflow-hidden">
      {/* Cromo de navegador: mismo lenguaje que el panel del hero. */}
      <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-4 py-2.5">
        <div className="flex shrink-0 gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        </div>
        <span className="truncate rounded-md bg-bg px-2.5 py-1 font-mono text-[11px] text-ink-faint">
          {host}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto shrink-0 font-mono text-[11px] text-teal hover:text-accent"
        >
          Abrir ↗
        </a>
      </div>

      <div className="relative aspect-[16/11] bg-bg sm:aspect-[16/9]">
        {loaded ? (
          <iframe
            src={url}
            title={`Demo en vivo de ${title}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="btn btn-primary"
            >
              <span aria-hidden>▶</span> Cargar demo en vivo
            </button>
            <p className="max-w-[46ch] text-sm text-ink-soft">
              {note ??
                "La aplicación real, embebida aquí. No se carga hasta que la pides, para no penalizar la carga de esta página."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
