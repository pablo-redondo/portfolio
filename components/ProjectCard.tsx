import Link from "next/link";
import type { Project } from "@/content/types";

type Props = {
  project: Project;
  /** Variante a doble ancho para el proyecto insignia de una rejilla. */
  featured?: boolean;
};

/** Tres piezas: con más, la fila de chips salta a dos líneas y descuadra. */
const MAX_CHIPS = 3;

const ESTADO_TONE = {
  live: "text-ok",
  "in-progress": "text-warn",
  archived: "text-ink-faint",
} as const;

const ESTADO_LABEL = {
  live: "operativo",
  "in-progress": "en curso",
  archived: "archivado",
} as const;

/**
 * Card de proyecto del sistema de diseño: slug y estado arriba, titular,
 * entradilla y una fila de chips con el stack.
 *
 * El stack va como chips de texto y no como tira de logos: en la rejilla
 * de tres columnas el nombre escrito identifica la pieza sin depender de
 * reconocer un glifo, y no deja fuera a las que no tienen logo propio.
 */
export function ProjectCard({ project, featured = false }: Props) {
  const chips = project.stack.slice(0, MAX_CHIPS);

  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className={`project-card group flex h-full flex-col gap-3 ${
        featured ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate font-mono text-[11px] text-ink-meta">
          {project.slug}
        </span>
        <span className={`shrink-0 font-mono text-[11px] ${ESTADO_TONE[project.status]}`}>
          {ESTADO_LABEL[project.status]}
        </span>
      </div>

      <h3 className="font-sans text-xl leading-tight font-bold text-balance text-ink transition-colors group-hover:text-accent">
        {project.cardTitle ?? project.title}
      </h3>

      <p className="flex-1 text-sm leading-relaxed text-ink-soft">{project.tagline}</p>

      <div className="flex flex-wrap gap-1.5">
        {chips.length > 0 ? (
          chips.map((tech) => (
            <span key={tech.name} className="tech-chip">
              {tech.name}
            </span>
          ))
        ) : (
          // Carrera Vóley no lleva stack: es HTML, CSS y JavaScript a pelo.
          // El hueco vacío se lee como un olvido; decirlo lo convierte en
          // lo que es, una característica del proyecto.
          <span className="tech-chip">sin dependencias</span>
        )}
      </div>
    </Link>
  );
}
