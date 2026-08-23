import Link from "next/link";
import type { Project } from "@/content/types";
import { StatusBadge } from "@/components/StatusBadge";

type Props = {
  project: Project;
  /** La card del insignia usa tinte de acento y más aire. */
  featured?: boolean;
};

export function ProjectCard({ project, featured = false }: Props) {
  // Tres chips como máximo: con más, saltan de línea y descuadran la card.
  const chips = project.stack.slice(0, featured ? 5 : 3);
  const extra = project.stack.length - chips.length;

  return (
    <Link
      href={`/proyectos/${project.slug}`}
      data-spot
      className={`card-lift group flex h-full flex-col overflow-hidden ${
        featured ? "surface-featured" : "surface-card"
      }`}
    >
      {/* Foco que sigue al cursor. Lo posiciona el listener delegado de
          <Spotlight />; sin él se queda en el centro y simplemente no se
          enciende, porque solo es visible en hover. */}
      <span className="spot-glow" aria-hidden />

      <div className={`flex flex-1 flex-col ${featured ? "p-7 sm:p-9" : "p-6"}`}>
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate font-mono text-[11px] text-ink-faint">
            {project.slug}
          </span>
          <StatusBadge status={project.status} />
        </div>

        <h2
          className={`mt-3 font-mono font-bold tracking-tight text-ink transition-colors group-hover:text-accent ${
            featured ? "text-2xl sm:text-3xl" : "clamp-2 text-lg"
          }`}
        >
          {project.title}
        </h2>

        {featured && (
          <span className="mt-2.5 w-fit rounded-full border border-accent-line bg-accent-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-accent uppercase">
            Proyecto insignia
          </span>
        )}

        <p
          className={`mt-3 text-sm leading-relaxed text-ink-soft ${
            featured ? "max-w-[62ch] text-base" : "clamp-3"
          }`}
        >
          {project.tagline}
        </p>

        {chips.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
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
