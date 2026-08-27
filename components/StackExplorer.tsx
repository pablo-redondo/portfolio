import type { TechCategory, TechChoice } from "@/content/types";
import { Reveal } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";
import { techIcon } from "@/content/tech-icons";

const CATEGORY_ORDER: TechCategory[] = ["frontend", "backend", "infra", "tooling"];

/** El mismo tono por capa que colorea el ranking de /proyectos. */
const CATEGORY_COLOR: Record<TechCategory, string> = {
  frontend: "var(--accent)",
  backend: "var(--ok)",
  infra: "var(--warn)",
  tooling: "var(--meta)",
};

/** Un punto por proyecto; los primeros `count` se rellenan. */
function UsageDots({ count, total }: { count: number; total: number }) {
  return (
    <span className="mt-auto flex shrink-0 items-center gap-1" aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-[5px] w-[5px] rounded-full ${
            i < count ? "bg-accent" : "bg-line-strong"
          }`}
        />
      ))}
    </span>
  );
}

/** Dos letras como respaldo cuando la tecnología no trae logo propio. */
function monograma(name: string) {
  return name.replace(/[^A-Za-z]/g, "").slice(0, 2) || name.slice(0, 2);
}

type Props = {
  stack: TechChoice[];
  /** Nº de proyectos reales que usan cada tecnología, por nombre. */
  usage?: Map<string, number>;
  totalProyectos?: number;
};

/**
 * El stack por capas, con las cuatro abiertas a la vez.
 *
 * Antes era un filtro de pastillas con `:has()`: para ver el backend había
 * que pedirlo. Con quince piezas caben todas en pantalla, así que la capa
 * pasa a ser un encabezado con su guion de color y el filtro sobra — se ve
 * de un vistazo cuánto pesa cada capa, que es justo lo que la sección
 * quiere contar.
 *
 * El "por qué" de cada elección va en el `title` de la ficha y en el texto
 * accesible: sigue siendo el dato importante, pero no se lleva por delante
 * la rejilla.
 */
export function StackExplorer({ stack, usage, totalProyectos }: Props) {
  const grupos = CATEGORY_ORDER.map((category) => ({
    category,
    items: stack.filter((tech) => tech.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="grid gap-[30px]">
      {grupos.map((grupo) => (
        <Reveal key={grupo.category}>
          <div className="mb-3.5 flex items-center gap-3">
            <span
              aria-hidden
              className="h-[3px] w-[22px] shrink-0 rounded-sm"
              style={{ background: CATEGORY_COLOR[grupo.category] }}
            />
            <h3 className="font-mono text-[13px] font-semibold text-ink">
              {grupo.category}/
            </h3>
            <span className="font-mono text-[11px] text-ink-meta">
              {grupo.items.length} {grupo.items.length === 1 ? "pieza" : "piezas"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {grupo.items.map((tech) => {
              const usados = usage?.get(tech.name);
              return (
                <div key={tech.name} className="tech-card" title={tech.why}>
                  <span className="tech-card-logo" aria-hidden>
                    {techIcon(tech.name) ? (
                      <TechIcon name={tech.name} className="h-[22px] w-[22px]" />
                    ) : (
                      monograma(tech.name)
                    )}
                  </span>

                  <div>
                    <p className="font-mono text-[13px] leading-tight font-semibold text-ink">
                      {tech.name}
                    </p>
                    {tech.note ? (
                      <p className="text-warn mt-1 font-mono text-[11px] leading-snug">
                        {tech.note}
                      </p>
                    ) : usados !== undefined && totalProyectos ? (
                      <p className="mt-1 font-mono text-[11px] leading-snug text-ink-meta">
                        {usados} / {totalProyectos} proyectos
                      </p>
                    ) : null}
                  </div>

                  {!tech.note && usados !== undefined && totalProyectos ? (
                    <UsageDots count={usados} total={totalProyectos} />
                  ) : null}

                  {/* El motivo no cabe en la ficha sin romper la rejilla,
                      pero no puede perderse: va al árbol de accesibilidad
                      y al tooltip nativo. */}
                  <span className="sr-only">{tech.why}</span>
                </div>
              );
            })}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
