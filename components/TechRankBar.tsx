import type { TechRankItem } from "@/content/topology";

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

      <div className="p-5">
        <p className="text-mono-meta text-ink-meta">
          <span className="text-accent">$</span> sort -rn tecnologias.txt | head
        </p>

        <div className="mt-5 flex flex-col gap-3.5">
          {items.map((item) => (
            <div key={item.name} className="grid grid-cols-[minmax(0,7.5rem)_1fr_1.5rem] items-center gap-3">
              <span className="text-mono-data min-w-0 truncate text-ink-soft">{item.name}</span>
              <span className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                <span
                  className="block h-full rounded-full bg-accent"
                  style={{ width: `${Math.max(6, (item.count / max) * 100)}%` }}
                />
              </span>
              <span className="text-mono-data text-right text-ink tabular-nums">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
