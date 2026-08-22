import Link from "next/link";
import type { Project } from "@/content/types";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowRight } from "@/components/icons";

type Props = {
  project: Project;
  /** La card del insignia usa tinte de acento y más aire. */
  featured?: boolean;
};

export function ProjectCard({ project, featured = false }: Props) {
  const chips = project.stack.slice(0, featured ? 6 : 4);
  const extra = project.stack.length - chips.length;

  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className={`card-lift group flex h-full flex-col ${
        featured ? "surface-featured p-7 sm:p-9" : "surface-card p-6"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* El prompt se recorta en vez de partirse en dos líneas. */}
        <span className="min-w-0 truncate font-mono text-[11px] text-ink-faint">
          <span className="text-accent">$</span> open {project.slug}
        </span>
        <StatusBadge status={project.status} />
      </div>

      <h2
        className={`mt-4 font-mono font-bold tracking-tight text-ink transition-colors group-hover:text-accent ${
          featured ? "text-2xl sm:text-3xl" : "clamp-2 text-lg"
        }`}
      >
        {project.title}
      </h2>

      {featured && (
        <span className="mt-2 w-fit rounded-full border border-accent-line bg-accent-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-accent uppercase">
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

      <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-1">
        {chips.map((tech) => (
          <span key={tech.name} className="chip">
            {tech.name}
          </span>
        ))}
        {extra > 0 && <span className="chip chip-quiet">+{extra}</span>}
      </div>

      <span className="link-arrow mt-5 border-t border-line pt-4 group-hover:text-accent">
        Ver caso de estudio <ArrowRight />
      </span>
    </Link>
  );
}
