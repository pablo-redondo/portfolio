import type { ReactNode } from "react";

export type Stage = {
  /** Hash corto, decorativo — el mismo recurso que un ID de traza, no un dato real que consultar. */
  hash: string;
  command: string;
  title: string;
  body: string;
  cue: string;
};

/**
 * La señal propia de cada etapa: no el mismo adorno repetido tres veces,
 * sino la salida real que produciría cada comando — un commit para la
 * primera, checks de red para la segunda, checkpoints de una migración
 * para la tercera.
 */
function signalFor(index: number, hash: string): ReactNode {
  if (index === 0) {
    return (
      <p className="font-mono text-[11px] text-ink-meta">
        commit <span className="text-accent">{hash}</span> · Indra
      </p>
    );
  }

  if (index === 1) {
    return (
      <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px]">
        <li className="text-ok">✓ tcp</li>
        <li className="text-ok">✓ dns</li>
        <li className="text-ok">✓ tls</li>
        <li className="text-ink-meta">ping: no basta</li>
      </ul>
    );
  }

  return (
    <ul className="flex items-center gap-1.5 font-mono text-[11px] text-ink-meta">
      <li className="flex items-center gap-1 text-ok">
        <span aria-hidden>●</span>build
      </li>
      <li aria-hidden>→</li>
      <li className="flex items-center gap-1 text-ok">
        <span aria-hidden>●</span>jugable
      </li>
      <li aria-hidden>→</li>
      <li className="flex items-center gap-1 text-ok">
        <span aria-hidden>●</span>TS
      </li>
    </ul>
  );
}

/**
 * "Cómo trabajo" como un explorador de dos columnas — índice a la
 * izquierda, detalle a la derecha — en vez de otra ventana de terminal
 * más: es la única sección de la página sin el marco `.win`, a propósito.
 * Los radios/labels seleccionan la etapa activa sin una línea de JS: tres
 * inputs ocultos antes del `.stage-shell`, alcanzados con `~` desde CSS.
 * Con una sola etapa visible a la vez no hay ancho que sobre ni columnas
 * que no cuadren entre sí — el contenido llena el panel entero.
 */
export function MethodTabs({ stages }: { stages: [Stage, Stage, Stage] }) {
  return (
    <div className="stages">
      {stages.map((stage, i) => (
        <input
          key={stage.hash}
          type="radio"
          name="stage"
          id={`stage-${i}`}
          className="stage-radio"
          defaultChecked={i === 0}
        />
      ))}

      <div className="stage-shell surface-panel">
        <div className="stage-nav">
          {stages.map((stage, i) => (
            <label key={stage.hash} htmlFor={`stage-${i}`} className="stage-tab" data-idx={i}>
              <span className="stage-tab-index">0{i + 1}</span>
              <span className="min-w-0">
                <span className="stage-tab-command block truncate font-mono text-[11px]">
                  {stage.command}
                </span>
                <span className="stage-tab-title block text-sm leading-snug font-semibold text-ink">
                  {stage.title}
                </span>
              </span>
            </label>
          ))}

          <p className="stage-nav-hint mt-auto hidden border-t border-line px-5 py-3 font-mono text-[11px] text-ink-meta lg:block">
            usa ↑ ↓ para cambiar
          </p>
        </div>

        <div className="stage-panels">
          {stages.map((stage, i) => (
            <div key={stage.hash} className="stage-panel p-6 lg:p-8" data-idx={i}>
              <div className="mb-4">{signalFor(i, stage.hash)}</div>

              <h3 className="mb-3 font-sans text-[26px] leading-tight font-extrabold tracking-tight text-ink">
                {stage.title}
              </h3>

              <p className="max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
                {stage.body}
              </p>

              <p className="mt-6 border-t border-line pt-3 font-mono text-[11px] text-ink-meta">
                {stage.cue}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
