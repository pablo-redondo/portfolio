import type { ReactNode } from "react";
import { TerminalWindow } from "@/components/TerminalWindow";

export type Stage = {
  /** Hash corto, decorativo — el mismo recurso que un ID de traza, no un dato real que consultar. */
  hash: string;
  /** El comando que da título a la ventana de este panel. */
  command: string;
  title: string;
  body: string;
  cue: string;
};

/**
 * La señal propia de cada panel: no es el mismo adorno repetido tres veces,
 * es la salida real que cada comando de la cabecera produciría — un commit
 * para el primero, checks de red para el segundo, checkpoints de una
 * migración para el tercero.
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
      <ul className="flex flex-wrap gap-x-3.5 gap-y-1 font-mono text-[11px]">
        <li className="text-ok">✓ tcp</li>
        <li className="text-ok">✓ dns</li>
        <li className="text-ok">✓ tls</li>
        <li className="text-ink-meta">ping: no basta</li>
      </ul>
    );
  }

  return (
    <ul className="flex items-center gap-2 font-mono text-[11px] text-ink-meta">
      <li className="flex items-center gap-1.5 text-ok">
        <span aria-hidden>●</span>build
      </li>
      <li aria-hidden>→</li>
      <li className="flex items-center gap-1.5 text-ok">
        <span aria-hidden>●</span>jugable
      </li>
      <li aria-hidden>→</li>
      <li className="flex items-center gap-1.5 text-ok">
        <span aria-hidden>●</span>TS
      </li>
    </ul>
  );
}

/**
 * "Cómo trabajo" como tres paneles de terminal en paralelo, no una tarjeta
 * repetida tres veces ni un log en vertical: cada trabajo real deja un
 * rastro distinto en la terminal, así que cada panel muestra el suyo. El
 * central va algo más ancho porque diagnosticar es el hilo que atraviesa
 * el resto de la página, no los tres pesan igual.
 */
export function MethodPanes({ stages }: { stages: Stage[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr_1fr] lg:items-start">
      {stages.map((stage, i) => (
        <TerminalWindow key={stage.hash} title={stage.command} className="method-pane">
          <div className="flex h-full flex-col p-5">
            <div className="mb-3">{signalFor(i, stage.hash)}</div>

            <h3 className="mb-2 font-sans text-[19px] leading-tight font-extrabold tracking-tight text-ink">
              {stage.title}
            </h3>

            <p className="text-sm leading-relaxed text-ink-soft">{stage.body}</p>

            <p className="mt-auto border-t border-line pt-3 font-mono text-[11px] text-ink-meta">
              {stage.cue}
            </p>
          </div>
        </TerminalWindow>
      ))}
    </div>
  );
}
