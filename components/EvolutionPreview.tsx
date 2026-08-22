import type { TimelinePhase } from "@/content/types";

export function EvolutionPreview({ phases }: { phases: TimelinePhase[] }) {
  const sorted = phases.slice().sort((a, b) => a.order - b.order);

  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {sorted.map((phase, i) => (
        <li key={phase.order} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden className="text-line-strong">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75"
                   strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
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
