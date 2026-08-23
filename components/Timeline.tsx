import type { TimelinePhase } from "@/content/types";
import { Reveal } from "@/components/Reveal";

export function Timeline({ phases }: { phases: TimelinePhase[] }) {
  const sorted = phases.slice().sort((a, b) => a.order - b.order);

  return (
    <Reveal stagger className="rail flex flex-col gap-3">
      {sorted.map((phase, i) => (
        <details key={phase.order} className="rail-node group" open={i === 0}>
          <summary className="cursor-pointer list-none rounded-xl border border-transparent px-4 py-3 transition-colors hover:border-line hover:bg-surface">
            <span className="rail-dot">{phase.order}</span>
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-sm font-semibold text-ink group-open:text-accent">
                {phase.label}
              </span>
              <span className="font-mono text-[10px] tracking-wide text-ink-faint uppercase">
                Fase {phase.order} de {sorted.length}
              </span>
            </span>
            <span className="mt-1.5 block max-w-[70ch] text-sm text-ink-soft">
              {phase.summary}
            </span>
          </summary>

          <div className="detail-in mx-4 mt-1 mb-2 rounded-xl border border-line bg-surface-2 px-4 py-3">
            <p className="max-w-[70ch] text-sm leading-relaxed text-ink-soft">
              {phase.detail}
            </p>
            {phase.commitRange && (
              <p className="mt-2 font-mono text-[11px] text-ink-faint">
                {phase.commitRange}
              </p>
            )}
          </div>
        </details>
      ))}
    </Reveal>
  );
}
