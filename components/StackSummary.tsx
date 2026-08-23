import type { TechCategory, TechChoice } from "@/content/types";
import { Reveal } from "@/components/Reveal";

const CATEGORY_ORDER: TechCategory[] = ["frontend", "backend", "infra", "tooling"];

const CATEGORY_LABELS: Record<TechCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  infra: "Infra",
  tooling: "Tooling",
};

/**
 * Resumen del stack para la home: una columna por capa en vez de una fila
 * suelta de chips. Los nombres salen agrupados como están de verdad —
 * frontend, backend, infra, tooling — que ya dice algo por sí mismo; el
 * "por qué" de cada uno vive en /sobre-mi y no se duplica aquí.
 */
export function StackSummary({ stack }: { stack: TechChoice[] }) {
  return (
    <Reveal stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CATEGORY_ORDER.map((category) => {
        const items = stack.filter((tech) => tech.category === category);
        if (items.length === 0) return null;

        return (
          <div
            key={category}
            data-spot
            className="surface-card group flex h-full flex-col p-5"
          >
            <span className="spot-glow" aria-hidden />

            <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
              <h3 className="font-mono text-xs font-semibold tracking-wider text-accent uppercase">
                {CATEGORY_LABELS[category]}
              </h3>
              <span className="font-mono text-[11px] text-ink-faint">
                {String(items.length).padStart(2, "0")}
              </span>
            </div>

            <ul className="mt-4 flex flex-col gap-2.5">
              {items.map((tech) => (
                <li
                  key={tech.name}
                  className="flex items-baseline gap-2.5 font-mono text-[13px] leading-snug text-ink"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/50"
                  />
                  {tech.name}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </Reveal>
  );
}
