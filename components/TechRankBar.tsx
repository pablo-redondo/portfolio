import type { TechRankItem } from "@/content/topology";
import type { TechCategory } from "@/content/types";

/**
 * El color de la barra es la capa en la que trabaja esa tecnología, los
 * mismos cuatro tonos que agrupan el stack en /sobre-mi. No es decoración:
 * de un vistazo se ve si lo que se repite entre proyectos es frontend,
 * backend, infra o herramientas.
 */
const CAPA_COLOR: Record<TechCategory, string> = {
  frontend: "var(--accent)",
  backend: "var(--ok)",
  infra: "var(--warn)",
  tooling: "var(--meta)",
};

/**
 * Ranking de tecnologías por número de proyectos que la usan. Cuenta real
 * sobre content/projects/*.ts en tiempo de build, no una cifra de muestra.
 */
export function TechRankBar({ items }: { items: TechRankItem[] }) {
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="win min-w-0">
      <div className="win-bar">
        <div className="win-dots" aria-hidden>
          <span className="win-dot" />
          <span className="win-dot" />
          <span className="win-dot" />
        </div>
        <span className="win-title">stack — agregado</span>
        <span />
      </div>

      <p className="px-5 pt-4 pb-2 font-mono text-xs text-ink-meta">
        <span className="text-accent">$</span> sort -rn tecnologias.txt | head
      </p>

      <div className="grid gap-[9px] px-5 pt-2 pb-[18px]">
        {items.map((item, i) => (
          <div
            key={item.name}
            className="grid grid-cols-[minmax(0,104px)_minmax(0,1fr)_26px] items-center gap-3"
          >
            <span className="min-w-0 truncate font-mono text-xs leading-tight text-ink-soft">
              {item.name}
            </span>
            <span className="block h-1.5 overflow-hidden rounded-[3px] bg-surface-2">
              <span
                className="bar-grow block h-full rounded-[3px]"
                style={{
                  width: `${Math.max(6, (item.count / max) * 100)}%`,
                  background: CAPA_COLOR[item.category],
                  animationDelay: `${i * 60}ms`,
                }}
              />
            </span>
            <span className="text-right font-mono text-xs leading-tight font-medium text-ink tabular-nums">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
