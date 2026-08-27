import { Fragment } from "react";

export type MethodStage = {
  /** El titular de la etapa. */
  title: string;
  body: string;
  /**
   * Lo que entra o sale de la etapa, en una línea. Es lo que convierte tres
   * tarjetas sueltas en una tubería: cada una declara con qué se queda.
   */
  cue: string;
};

/**
 * "Runbook de incidencia" — catálogo de animaciones #15. Las tres etapas
 * del método encadenadas por conectores punteados, en el orden en que
 * ocurren: leer, diagnosticar, cambiar. No son tres virtudes sueltas.
 *
 * En pantalla estrecha los conectores desaparecen y las tarjetas se
 * apilan: una línea de puntos entre columnas que ya no están una al lado
 * de la otra no diría nada.
 */
export function MethodPipeline({ stages }: { stages: MethodStage[] }) {
  return (
    <div className="method-pipeline">
      {stages.map((stage, i) => (
        <Fragment key={stage.title}>
          {i > 0 && <span className="method-link" aria-hidden />}
          <div className="method-card">
            <div className="flex items-center gap-2.5">
              <span className="method-chip">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-mono-meta text-ink-meta uppercase">
                etapa {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="font-sans text-[22px] leading-tight font-extrabold tracking-tight text-ink">
              {stage.title}
            </h3>

            <p className="text-sm leading-relaxed text-ink-soft">{stage.body}</p>

            <span className="mt-auto font-mono text-[11px] leading-snug text-ink-meta">
              {stage.cue}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
