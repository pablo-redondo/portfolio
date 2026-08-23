import type { TimelinePhase } from "@/content/types";
import { Reveal } from "@/components/Reveal";

export function Timeline({ phases }: { phases: TimelinePhase[] }) {
  const sorted = phases.slice().sort((a, b) => a.order - b.order);

  return (
    <Reveal stagger className="rail flex flex-col gap-3">
      {sorted.map((phase, i) => (
        <details key={phase.order} className="rail-node group" open={i === 0}>
          <summary className="phase-summary">
            <span className="rail-dot">{phase.order}</span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-sm font-semibold text-ink transition-colors group-open:text-accent">
                  {phase.label}
                </span>
                <span className="font-mono text-[10px] tracking-wide text-ink-faint uppercase">
                  Fase {phase.order} de {sorted.length}
                </span>
              </span>
              <span className="mt-1.5 block max-w-[70ch] text-sm leading-relaxed text-ink-soft">
                {phase.summary}
              </span>
            </span>

            {/* Indicador de estado. Sin flecha: dos trazos que forman un
                "+" y se funden en un "−" al abrirse. */}
            <span className="phase-toggle" aria-hidden />
          </summary>

          <div className="detail-in phase-detail">
            <p className="max-w-[70ch] text-sm leading-relaxed text-ink-soft">
              {phase.detail}
            </p>
            {phase.commitRange && (
              <p className="phase-commits">
                <span className="text-ink-faint">commits</span>
                <span className="text-ink">{phase.commitRange}</span>
              </p>
            )}
          </div>
        </details>
      ))}
    </Reveal>
  );
}
