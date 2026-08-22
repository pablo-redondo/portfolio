import type { TechCategory, TechChoice } from "@/content/types";

const CATEGORY_ORDER: TechCategory[] = ["frontend", "backend", "infra", "tooling"];

const CATEGORY_LABELS: Record<TechCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  infra: "Infra",
  tooling: "Tooling",
};

export function StackByCategory({ stack }: { stack: TechChoice[] }) {
  return (
    <div className="flex flex-col gap-10">
      {CATEGORY_ORDER.map((category) => {
        const items = stack.filter((tech) => tech.category === category);
        if (items.length === 0) return null;
        return (
          <div key={category}>
            <h3 className="mb-4 font-mono text-xs font-semibold tracking-wide text-accent uppercase">
              {CATEGORY_LABELS[category]}
            </h3>
            <dl className="flex flex-col divide-y divide-line border-y border-line">
              {items.map((tech) => (
                <div
                  key={tech.name}
                  className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4"
                >
                  <dt className="font-mono text-sm font-semibold text-ink">{tech.name}</dt>
                  <dd className="text-sm text-ink-soft">{tech.why}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}
    </div>
  );
}
