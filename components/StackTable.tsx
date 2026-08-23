import type { TechChoice } from "@/content/types";
import { Reveal } from "@/components/Reveal";

const CATEGORY_LABELS: Record<TechChoice["category"], string> = {
  frontend: "frontend",
  backend: "backend",
  infra: "infra",
  tooling: "tooling",
};

export function StackTable({ stack }: { stack: TechChoice[] }) {
  // Con un número par de tecnologías, dos columnas dejan todas las filas
  // completas. Con un número impar, tres columnas cuadran mejor el bloque
  // que dos, que siempre dejarían la última sola.
  //
  // Las tres columnas solo a partir de `lg`: a 640px ya se estrecharían
  // demasiado para el texto del porqué, que es lo que hay que poder leer.
  const columnas =
    stack.length % 2 === 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";

  return (
    <Reveal stagger className={`grid gap-3 ${columnas}`}>
      {stack.map((tech) => (
        <div key={tech.name} className="card-scan surface-panel group p-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-mono text-sm font-semibold text-ink">{tech.name}</h3>
            <span className="shrink-0 font-mono text-[10px] tracking-wide text-ink-faint uppercase">
              {CATEGORY_LABELS[tech.category]}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{tech.why}</p>
        </div>
      ))}
    </Reveal>
  );
}
