import type { TechCategory, TechChoice } from "@/content/types";
import { Reveal } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";
import { TerminalWindow } from "@/components/TerminalWindow";
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
    <span className="flex shrink-0 items-center gap-1" aria-hidden>
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
 * Antes cada pieza vivía apretada en una rejilla de cuatro o cinco
 * columnas, con el motivo real escondido en un tooltip nativo — invisible
 * sin ratón, y en la práctica invisible del todo, porque nadie pasa el
 * cursor sistemáticamente por quince fichas. Eso contradecía la propia
 * entradilla de la sección: "no es una lista de logos". Ahora cada
 * tecnología es una fila a ancho completo y el porqué se lee siempre, sin
 * pasar el ratón por encima ni abrir nada.
 */
export function StackExplorer({ stack, usage, totalProyectos }: Props) {
  const grupos = CATEGORY_ORDER.map((category) => ({
    category,
    items: stack.filter((tech) => tech.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <TerminalWindow title="lsof — stack">
      <div className="grid gap-[30px] p-5">
      {grupos.map((grupo) => (
        <Reveal key={grupo.category}>
          <div className="mb-1 flex items-center gap-3">
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

          <div className="flex flex-col">
            {grupo.items.map((tech) => {
              const usados = usage?.get(tech.name);
              return (
                <div key={tech.name} className="tech-card">
                  <span className="tech-card-logo" aria-hidden>
                    {techIcon(tech.name) ? (
                      <TechIcon name={tech.name} className="h-[22px] w-[22px]" />
                    ) : (
                      monograma(tech.name)
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="font-mono text-sm font-semibold text-ink">{tech.name}</p>

                      {tech.note ? (
                        <span className="text-warn shrink-0 font-mono text-[11px]">
                          {tech.note}
                        </span>
                      ) : usados !== undefined && totalProyectos ? (
                        <span className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-ink-meta">
                          {usados}/{totalProyectos}
                          <UsageDots count={usados} total={totalProyectos} />
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1.5 max-w-[68ch] text-sm leading-relaxed text-ink-soft">
                      {tech.why}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      ))}
      </div>
    </TerminalWindow>
  );
}
