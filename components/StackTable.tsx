import type { TechChoice } from "@/content/types";

const CATEGORY_LABELS: Record<TechChoice["category"], string> = {
  frontend: "frontend",
  backend: "backend",
  infra: "infra",
  tooling: "tooling",
};

export function StackTable({ stack }: { stack: TechChoice[] }) {
  return (
    <dl className="flex flex-col divide-y divide-line border-y border-line">
      {stack.map((tech) => (
        <div key={tech.name} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt className="font-mono text-xs">
            <span className="font-semibold text-ink">{tech.name}</span>
            <span className="ml-2 text-ink-faint">{CATEGORY_LABELS[tech.category]}</span>
          </dt>
          <dd className="text-sm text-ink-soft">{tech.why}</dd>
        </div>
      ))}
    </dl>
  );
}
