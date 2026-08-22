import type { TimelinePhase } from "@/content/types";

export function EvolutionPreview({ phases }: { phases: TimelinePhase[] }) {
  const sorted = phases.slice().sort((a, b) => a.order - b.order);
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {sorted.map((phase, i) => (
        <li key={phase.order} className="flex items-center gap-2">
          {i > 0 && <span className="text-line">→</span>}
          <span className="flex items-center gap-1.5 rounded-sm border border-line bg-surface-2 px-2 py-1 font-mono text-[11px] text-ink-soft">
            <span className="text-accent">{phase.order}</span> {phase.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
