import Link from "next/link";
import type { Project } from "@/content/types";

const STATUS_LABEL: Record<Project["status"], string> = {
  live: "live",
  "in-progress": "en curso",
  archived: "archivado",
};

const STATUS_TONE: Record<Project["status"], string> = {
  live: "bg-ok/15 text-ok",
  "in-progress": "bg-warn/15 text-warn",
  archived: "bg-surface-2 text-ink-faint",
};

/**
 * Tarjeta grande del proyecto insignia: ocupa el ancho completo y se parte
 * en dos, con el dato medido a la derecha. El enlace se estira sobre toda
 * la tarjeta, así que el `leer el caso de estudio` del pie es la etiqueta
 * de ese enlace y no un segundo enlace anidado.
 */
export function FeaturedProject({ project }: { project: Project }) {
  const fases = project.timeline?.length;

  return (
    <div className="card-lift surface-card group relative grid gap-8 p-7 sm:p-9 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-11">
      <Link href={`/proyectos/${project.slug}`} className="absolute inset-0 z-0 rounded-[inherit]">
        <span className="sr-only">Leer el caso de estudio de {project.title}</span>
      </Link>

      <div className="pointer-events-none min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`text-mono-meta rounded px-2.5 py-1 normal-case ${STATUS_TONE[project.status]}`}
          >
            {STATUS_LABEL[project.status]}
          </span>
          {project.tags.slice(0, 1).map((tag) => (
            <span
              key={tag}
              className="text-mono-meta rounded border border-line-strong px-2.5 py-1 text-ink-soft normal-case"
            >
              {tag}
            </span>
          ))}
          {fases && (
            <span className="text-mono-meta text-ink-meta normal-case">
              {fases} fases documentadas
            </span>
          )}
        </div>

        <h3 className="text-h2 mt-4 text-balance text-ink transition-colors group-hover:text-accent">
          {project.title}
        </h3>

        <p className="text-body mt-3.5 max-w-[52ch] text-ink-soft">{project.tagline}</p>

        {project.stack.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech.name}
                className="text-mono-data rounded bg-surface-2 px-2.5 py-1.5 text-ink-soft"
              >
                {tech.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-mono-cmd mt-6 font-medium text-accent">leer el caso de estudio →</p>
      </div>

      {project.metric && (
        <div className="pointer-events-none rounded-[10px] border border-line bg-bg-inset p-4.5">
          <p className="text-mono-meta text-ink-meta uppercase">{project.metric.label}</p>

          <p className="mt-3 flex items-baseline gap-2.5">
            <span className="font-mono text-xl font-medium text-crit">
              {project.metric.before.value}
            </span>
            <span className="text-mono-data text-ink-meta">{project.metric.before.note}</span>
          </p>
          <p className="mt-1.5 flex items-baseline gap-2.5">
            <span className="font-mono text-xl font-medium text-ok">
              {project.metric.after.value}
            </span>
            <span className="text-mono-data text-ink-meta">{project.metric.after.note}</span>
          </p>

          <span className="mt-4 mb-4 block h-px bg-line" aria-hidden />

          <p className="text-mono-data leading-relaxed text-ink-soft">{project.metric.note}</p>
        </div>
      )}
    </div>
  );
}
