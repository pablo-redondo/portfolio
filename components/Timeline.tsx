import type { TimelinePhase } from "@/content/types";

export function Timeline({ phases }: { phases: TimelinePhase[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
      {phases
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((phase, i) => (
          <details
            key={phase.order}
            className="group relative rounded-sm border border-line bg-surface p-3"
            open={i === 0}
          >
            {i > 0 && (
              <div
                className="pointer-events-none absolute top-[22px] right-full hidden h-0.5 w-3 bg-line md:block"
                aria-hidden
              />
            )}
            <summary className="cursor-pointer list-none">
              <span className="mb-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent font-mono text-[10px] font-bold text-accent">
                {phase.order}
              </span>
              <span className="block font-mono text-xs font-semibold text-ink group-open:text-accent">
                {phase.label}
              </span>
              <span className="mt-1 block text-xs text-ink-soft">{phase.summary}</span>
            </summary>
            <div className="detail-in mt-2 border-t border-dashed border-line pt-2 text-xs text-ink-soft">
              {phase.detail}
              {phase.commitRange && (
                <span className="mt-1.5 block font-mono text-[10px] text-ink-faint">
                  {phase.commitRange}
                </span>
              )}
            </div>
          </details>
        ))}
    </div>
  );
}
