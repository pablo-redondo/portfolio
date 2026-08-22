import type { TimelinePhase } from "@/content/types";

export function EvolutionPreview({ phases }: { phases: TimelinePhase[] }) {
  const sorted = phases.slice().sort((a, b) => a.order - b.order);

  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {sorted.map((phase, i) => (
        <li key={phase.order} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden className="h-px w-3 bg-line-strong" />
          )}
          <span className="chip">
            <span className="mr-1.5 text-accent">{phase.order}</span>
            {phase.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
