import type { CSSProperties } from "react";
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

/** Un punto por proyecto; los primeros `count` se rellenan. */
function UsageDots({ count, total }: { count: number; total: number }) {
  return (
    <span className="flex shrink-0 items-center gap-[3px]" aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1 w-1 rounded-full ${i < count ? "bg-accent" : "bg-line-strong"}`}
        />
      ))}
    </span>
  );
}

/**
 * Stack filtrable por capa.
 *
 * El filtro son radios ocultos dentro de las propias pastillas, y el CSS
 * oculta lo que no toca con `:has()`. Sin estado de React a propósito: así
 * sigue funcionando con el JavaScript desactivado, igual que el resto de la
 * web, y no cuesta ni un byte de bundle.
 */
type Props = {
  stack: TechChoice[];
  /** Nº de proyectos reales que usan cada tecnología, por nombre. */
  usage?: Map<string, number>;
  totalProyectos?: number;
};

export function StackExplorer({ stack, usage, totalProyectos }: Props) {
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

  // Misma regla que en las páginas de proyecto: dos columnas con un número
  // par de tarjetas, tres con impar. Aquí el número cambia con el filtro, y
  // el filtro es solo CSS, así que la cuenta de cada uno viaja como custom
  // property y la hoja de estilos elige según cuál esté marcado. Se calculan
  // del contenido en vez de escribirlas a mano en el CSS: si mañana cambia
  // el stack, las columnas siguen cuadrando solas.
  const columnas = (n: number) => (n % 2 === 1 ? 3 : 2);
  const cuentas = Object.fromEntries(
    filtros.map((f) => [`--cols-${f.value}`, columnas(f.count)]),
  ) as CSSProperties;

  // El escalonado de entrada tiene que seguir el orden de lo que se VE, no
  // la posición en el DOM: con `nth-child` la capa infra (tarjetas 9 a 11)
  // arrancaba entera en el mismo fotograma tras una pausa muerta, mientras
  // que frontend (1 a 4) sí cascadeaba. Cada tarjeta lleva su índice en la
  // lista completa y su índice dentro de su capa, y el CSS usa uno u otro
  // según el filtro marcado.
  const porCapa = new Map<TechCategory, number>();
  const indices = ordenadas.map((tech, i) => {
    const j = porCapa.get(tech.category) ?? 0;
    porCapa.set(tech.category, j + 1);
    return { "--i": i, "--j": j } as CSSProperties;
  });

  return (
    <fieldset className="stack-scope min-w-0" style={cuentas}>
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

      <Reveal stagger className="stack-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ordenadas.map((tech, i) => (
          <details
            key={tech.name}
            data-capa={tech.category}
            style={indices[i]}
            className="card-scan tech-card group"
          >
            {/* Mismo marcador "+"/"−" que las fases de un caso de estudio y
                el raíl de carrera: el "porqué" de cada tecnología queda
                plegado hasta que se pincha en la ficha. */}
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex min-w-0 items-center gap-2 font-mono text-sm font-semibold text-ink">
                  <TechIcon
                    name={tech.name}
                    fallbackDot
                    className="h-4 w-4 text-ink-faint transition-colors group-hover:text-accent"
                  />
                  <span className="min-w-0">{tech.name}</span>
                </h3>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="font-mono text-[10px] tracking-wider text-ink-faint uppercase">
                    {CATEGORY_LABELS[tech.category]}
                  </span>
                  <span className="phase-toggle" aria-hidden />
                </span>
              </div>

              {usage && totalProyectos && (
                <p className="mt-2.5 flex items-center gap-2">
                  <UsageDots count={usage.get(tech.name) ?? 0} total={totalProyectos} />
                  <span className="text-mono-meta text-ink-faint">
                    {usage.get(tech.name) ?? 0} / {totalProyectos} proyectos
                  </span>
                </p>
              )}
            </summary>

            <div className="detail-in mt-2.5 border-t border-line pt-2.5">
              <p className="text-sm leading-relaxed text-ink-soft">{tech.why}</p>
            </div>
          </details>
        ))}
      </Reveal>
    </fieldset>
  );
}
