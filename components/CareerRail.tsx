import { Reveal } from "@/components/Reveal";

export type Job = {
  role: string;
  company: string;
  /** Rango legible, tal como consta en el CV. */
  dates: string;
  /** Dos cifras del año de inicio: es lo que cabe en el punto del raíl. */
  year: string;
  detail: string;
};

/**
 * Trayectoria sobre el mismo raíl vertical que la línea de evolución de los
 * casos de estudio. Es contenido cronológico en el componente cronológico
 * que la web ya tiene, con su relleno de acento guiado por scroll — en vez
 * de una lista plana de cards que no transmite orden.
 */
export function CareerRail({ jobs }: { jobs: Job[] }) {
  return (
    <Reveal stagger className="rail flex flex-col gap-3">
      {jobs.map((job, i) => (
        <details key={`${job.company}-${job.dates}`} className="rail-node group" open={i === 0}>
          <summary className="phase-summary">
            <span className="rail-dot">{job.year}</span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-sm font-semibold text-ink transition-colors group-open:text-accent">
                  {job.role}
                </span>
                <span className="font-mono text-[11px] text-ink-faint">
                  {job.company}
                </span>
              </span>
              <span className="mt-1.5 block font-mono text-[11px] tracking-wide text-ink-faint uppercase">
                {job.dates}
              </span>
            </span>

            {/* Mismo indicador "+"/"−" que las fases de un caso de estudio. */}
            <span className="phase-toggle" aria-hidden />
          </summary>

          <div className="detail-in phase-detail">
            <p className="max-w-[70ch] text-sm leading-relaxed text-ink-soft">
              {job.detail}
            </p>
          </div>
        </details>
      ))}
    </Reveal>
  );
}
