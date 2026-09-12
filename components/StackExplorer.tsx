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

/** Dos letras como respaldo cuando la tecnología no trae logo propio. */
function monograma(name: string) {
  return name.replace(/[^A-Za-z]/g, "").slice(0, 2) || name.slice(0, 2);
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="stack-row-chevron h-3.5 w-3.5"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

type RowProps = {
  tech: TechChoice;
  color: string;
  usados?: number;
  totalProyectos?: number;
};

/**
 * Una tecnología, cerrada por defecto. El icono, el nombre y una señal
 * mínima de uso van siempre visibles; el porqué —y el medidor real de en
 * cuántos proyectos vive— aparecen al abrir. `<details>` nativo: teclado y
 * lector de pantalla funcionan sin una sola línea de ARIA de más.
 */
function StackRow({ tech, color, usados, totalProyectos }: RowProps) {
  const pct = usados !== undefined && totalProyectos ? Math.round((usados / totalProyectos) * 100) : 0;
  const tieneUso = usados !== undefined && totalProyectos !== undefined && !tech.note;

  return (
    <details className="stack-row" style={{ ["--cat" as string]: color }}>
      <summary className="stack-row-head">
        <span className="stack-row-icon" aria-hidden>
          {techIcon(tech.name) ? (
            <TechIcon name={tech.name} className="h-4 w-4" />
          ) : (
            monograma(tech.name)
          )}
        </span>

        <span className="stack-row-name">
          <span className="truncate font-mono text-[13px] font-semibold text-ink">
            {tech.name}
          </span>

          {tech.note ? (
            <span className="shrink-0 font-mono text-[11px] text-warn">{tech.note}</span>
          ) : tieneUso ? (
            <span className="shrink-0 font-mono text-[11px] text-ink-meta tabular-nums">
              {usados}/{totalProyectos}
            </span>
          ) : null}
        </span>

        <ChevronIcon />
      </summary>

      <div className="detail-in stack-row-body">
        <p className="max-w-[62ch] text-sm leading-relaxed text-ink-soft">{tech.why}</p>

        {tieneUso && (
          <div
            className="stack-meter mt-3.5"
            aria-hidden
            style={{ ["--pct" as string]: `${pct}%` }}
          >
            <span className="stack-meter-fill" />
          </div>
        )}
      </div>
    </details>
  );
}

type Props = {
  stack: TechChoice[];
  /** Nº de proyectos reales que usan cada tecnología, por nombre. */
  usage?: Map<string, number>;
  totalProyectos?: number;
};

/**
 * El stack por capas, filtrable por categoría y con cada pieza cerrada
 * por defecto.
 *
 * Antes las quince fichas iban siempre desplegadas a ancho completo, con
 * el motivo real siempre visible: honesto, pero larguísimo de recorrer.
 * Ahora cada categoría es una rejilla de filas de una sola línea — icono,
 * nombre, señal de uso — y el porqué vive a un clic, en un `<details>`.
 * El filtro de categoría es CSS puro: radios ocultos + `:has()`, sin una
 * línea de estado en React (el mismo recurso que ya usa `.filter-pill`
 * en /proyectos, aquí con inputs en vez de enlaces porque no hace falta
 * que el filtro viva en la URL).
 */
export function StackExplorer({ stack, usage, totalProyectos }: Props) {
  const grupos = CATEGORY_ORDER.map((category) => ({
    category,
    items: stack.filter((tech) => tech.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <TerminalWindow title="lsof — stack">
      <div className="stack-explorer">
        <input
          type="radio"
          name="stack-filter"
          id="stack-filter-all"
          className="stage-radio"
          defaultChecked
        />
        {grupos.map((grupo) => (
          <input
            key={grupo.category}
            type="radio"
            name="stack-filter"
            id={`stack-filter-${grupo.category}`}
            className="stage-radio"
          />
        ))}

        <nav
          className="status-head flex flex-wrap items-center gap-2"
          aria-label="Filtrar por categoría"
        >
          <label htmlFor="stack-filter-all" className="filter-pill">
            <span
              className="stack-filter-dot"
              aria-hidden
              style={{ background: "var(--ink-meta)" }}
            />
            todo
            <span className="text-ink-meta">{stack.length}</span>
          </label>

          {grupos.map((grupo) => (
            <label
              key={grupo.category}
              htmlFor={`stack-filter-${grupo.category}`}
              className="filter-pill"
            >
              <span
                className="stack-filter-dot"
                aria-hidden
                style={{ background: CATEGORY_COLOR[grupo.category] }}
              />
              {grupo.category}
              <span className="text-ink-meta">{grupo.items.length}</span>
            </label>
          ))}
        </nav>

        <div className="grid gap-7 p-5">
          {grupos.map((grupo) => (
            // `data-category` va en el propio elemento de la rejilla — el
            // que oculta el filtro — y no en un hijo: si no, el hueco
            // vacío seguiría aportando su `gap` aunque no quede nada
            // dentro que ver.
            <div key={grupo.category} className="stack-group" data-category={grupo.category}>
              <Reveal>
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

                <Reveal stagger className="grid sm:grid-cols-2">
                  {grupo.items.map((tech) => (
                    <StackRow
                      key={tech.name}
                      tech={tech}
                      color={CATEGORY_COLOR[grupo.category]}
                      usados={usage?.get(tech.name)}
                      totalProyectos={totalProyectos}
                    />
                  ))}
                </Reveal>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </TerminalWindow>
  );
}
