import Link from "next/link";
import type { Project } from "@/content/types";
import { StatusBadge } from "@/components/StatusBadge";

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  // Tres chips y un contador: con más, la fila se descuadra. El contador no
  // recorta texto, resume — el stack completo está en el caso de estudio.
  const chips = project.stack.slice(0, 3);
  const extra = project.stack.length - chips.length;

  return (
    <Link
      href={`/proyectos/${project.slug}`}
      data-spot
      className="card-lift surface-card group flex h-full flex-col overflow-hidden"
    >
      {/* Foco que sigue al cursor. Lo posiciona el listener delegado de
          <Spotlight />; sin él se queda en el centro y simplemente no se
          enciende, porque solo es visible en hover. */}
      <span className="spot-glow" aria-hidden />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate font-mono text-[11px] text-ink-faint">
            {project.slug}
          </span>
          <StatusBadge status={project.status} />
        </div>

        {/* Sin recorte de líneas ni en el título ni en la entradilla: la
            rejilla iguala la altura de la fila, así que un texto más largo
            no descuadra nada y no hay por qué cortarlo con puntos
            suspensivos. */}
        <h2 className="mt-3.5 font-mono text-lg leading-snug font-bold tracking-tight text-balance text-ink transition-colors group-hover:text-accent">
          {project.title}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {project.tagline}
        </p>

        {chips.length > 0 && (
          // `mt-auto`: los chips caen al pie del cuerpo, así que quedan
          // alineados entre las cards de una fila aunque sus entradillas
          // midan distinto. El aire sobrante se va al hueco, no al final.
          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
            {chips.map((tech) => (
              <span key={tech.name} className="chip">
                {tech.name}
              </span>
            ))}
            {extra > 0 && <span className="chip chip-quiet">+{extra}</span>}
          </div>
        )}
      </div>

      <span className="card-action">Ver caso de estudio</span>
    </Link>
  );
}
