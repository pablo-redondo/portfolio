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
    <div className="flex flex-col gap-12">
      {CATEGORY_ORDER.map((category) => {
        const items = stack.filter((tech) => tech.category === category);
        if (items.length === 0) return null;

        return (
          <section key={category}>
            <div className="mb-5 flex items-center gap-3">
              <h3 className="font-mono text-sm font-semibold tracking-wide text-accent uppercase">
                {CATEGORY_LABELS[category]}
              </h3>
              <span className="divider flex-1" />
              <span className="font-mono text-[11px] text-ink-faint">
                {items.length}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((tech) => (
                <div key={tech.name} className="surface-card p-5">
                  <h4 className="font-mono text-sm font-semibold text-ink">
                    {tech.name}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {tech.why}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
