import type { TechChoice } from "@/content/types";
import { Reveal } from "@/components/Reveal";

const CATEGORY_LABELS: Record<TechChoice["category"], string> = {
  frontend: "frontend",
  backend: "backend",
  infra: "infra",
  tooling: "tooling",
};

export function StackTable({ stack }: { stack: TechChoice[] }) {
  return (
    <Reveal stagger className="grid gap-3 sm:grid-cols-2">
      {stack.map((tech) => (
        <div key={tech.name} data-spot className="surface-panel group p-4">
          <span className="spot-glow" aria-hidden />
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-mono text-sm font-semibold text-ink">{tech.name}</h3>
            <span className="shrink-0 font-mono text-[10px] tracking-wide text-ink-faint uppercase">
              {CATEGORY_LABELS[tech.category]}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{tech.why}</p>
        </div>
      ))}
    </Reveal>
  );
}
