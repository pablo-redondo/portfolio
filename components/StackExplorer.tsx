import type { TechCategory, TechChoice } from "@/content/types";
import { Reveal } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";

const CATEGORY_ORDER: TechCategory[] = ["frontend", "backend", "infra", "tooling"];

const CATEGORY_LABELS: Record<TechCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  infra: "Infra",
  tooling: "Tooling",
};

/**
 * Stack filtrable por capa.
 *
 * El filtro son radios ocultos dentro de las propias pastillas, y el CSS
 * oculta lo que no toca con `:has()`. Sin estado de React a propósito: así
 * sigue funcionando con el JavaScript desactivado, igual que el resto de la
 * web, y no cuesta ni un byte de bundle.
 */
export function StackExplorer({ stack }: { stack: TechChoice[] }) {
  const filtros = [
    { value: "todo", label: "todo", count: stack.length },
    ...CATEGORY_ORDER.map((category) => ({
      value: category,
      label: CATEGORY_LABELS[category].toLowerCase(),
      count: stack.filter((tech) => tech.category === category).length,
    })).filter((f) => f.count > 0),
  ];

  // Agrupadas por capa para que "todo" no las mezcle sin orden.
  const ordenadas = CATEGORY_ORDER.flatMap((category) =>
    stack.filter((tech) => tech.category === category),
  );

  return (
    <fieldset className="stack-scope min-w-0">
      <legend className="sr-only">Filtrar el stack por capa</legend>

      <Reveal className="stack-filter mb-8 flex-wrap gap-2">
        {filtros.map((filtro) => (
          <label key={filtro.value} className="filter-pill cursor-pointer">
            <input
              type="radio"
              name="capa"
              value={filtro.value}
              defaultChecked={filtro.value === "todo"}
              className="sr-only"
            />
            {filtro.label}
            <span className="ml-1.5 text-[10px] opacity-70">
              {String(filtro.count).padStart(2, "0")}
            </span>
          </label>
        ))}
      </Reveal>

      <Reveal stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ordenadas.map((tech) => (
          <article
            key={tech.name}
            data-capa={tech.category}
            className="card-scan tech-card group"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex min-w-0 items-center gap-2 font-mono text-sm font-semibold text-ink">
                <TechIcon
                  name={tech.name}
                  fallbackDot
                  className="h-4 w-4 text-ink-faint transition-colors group-hover:text-accent"
                />
                <span className="min-w-0">{tech.name}</span>
              </h3>
              <span className="shrink-0 font-mono text-[10px] tracking-wider text-ink-faint uppercase">
                {CATEGORY_LABELS[tech.category]}
              </span>
            </div>

            <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
              {tech.why}
            </p>
          </article>
        ))}
      </Reveal>
    </fieldset>
  );
}
