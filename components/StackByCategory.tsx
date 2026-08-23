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
 * Stack por capas, en filas separadas por hairline en lugar de una card por
 * tecnología: dieciséis marcos llenaban la sección de cajas y competían con
 * el texto que de verdad importa, que es el porqué de cada elección.
 *
 * Marcado como lista de definiciones porque es literalmente lo que es —
 * término y su motivo — y así un lector de pantalla anuncia la relación.
 */
export function StackByCategory({ stack }: { stack: TechChoice[] }) {
  return (
    <div className="flex flex-col gap-14">
      {CATEGORY_ORDER.map((category) => {
        const items = stack.filter((tech) => tech.category === category);
        if (items.length === 0) return null;

        return (
          <section key={category}>
            <Reveal className="mb-1 flex items-baseline gap-4">
              <h3 className="font-mono text-sm font-semibold tracking-wider text-accent uppercase">
                {CATEGORY_LABELS[category]}
              </h3>
              <span className="divider flex-1" />
              <span className="font-mono text-[11px] text-ink-faint">
                {String(items.length).padStart(2, "0")}
              </span>
            </Reveal>

            <Reveal stagger as="dl" className="flex flex-col">
              {items.map((tech) => (
                <div key={tech.name} className="stack-row">
                  <dt className="font-mono text-sm font-semibold text-ink">
                    {tech.name}
                  </dt>
                  <dd className="text-sm leading-relaxed text-ink-soft">
                    {tech.why}
                  </dd>
                </div>
              ))}
            </Reveal>
          </section>
        );
      })}
    </div>
  );
}
