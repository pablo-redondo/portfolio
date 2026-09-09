import { TerminalWindow } from "@/components/TerminalWindow";

export type Commit = {
  /** Hash corto, decorativo — el mismo recurso que un ID de traza, no un dato real que consultar. */
  hash: string;
  title: string;
  body: string;
  /** La línea de stat al pie del commit: lo que entra o sale de esa etapa. */
  cue: string;
};

/**
 * "Cómo trabajo" como un `git log`, no como una tubería de incidencia.
 * Tres commits en el orden en que ocurren — leer, diagnosticar, cambiar —
 * con su propio grafo vertical en vez de tres tarjetas idénticas en fila:
 * es historia, no una máquina de tres estaciones.
 */
export function CommitLog({ commits }: { commits: Commit[] }) {
  return (
    <TerminalWindow title="git log --stat -3 -- cómo-trabajo">
      <div className="px-5 py-1">
        {commits.map((commit) => (
          <div key={commit.hash} className="commit-row py-6">
            <span className="commit-rail" aria-hidden>
              <span className="commit-dot" />
            </span>

            <div className="min-w-0 pb-0.5">
              <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="commit-hash font-mono text-xs">{commit.hash}</span>
                <h3 className="font-sans text-[20px] leading-tight font-extrabold tracking-tight text-ink">
                  {commit.title}
                </h3>
              </div>

              <p className="max-w-[68ch] text-sm leading-relaxed text-ink-soft">{commit.body}</p>

              <p className="mt-3 font-mono text-[11px] text-ink-meta">{commit.cue}</p>
            </div>
          </div>
        ))}
      </div>
    </TerminalWindow>
  );
}
