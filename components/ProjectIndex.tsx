import Link from "next/link";
import type { Project } from "@/content/types";

const ESTADO_LABEL: Record<Project["status"], string> = {
  live: "operativo",
  "in-progress": "en curso",
  archived: "archivado",
};

const ESTADO_TONE: Record<Project["status"], string> = {
  live: "text-ok",
  "in-progress": "text-warn",
  archived: "text-ink-faint",
};

/** Dos nombres bastan como avance: el stack completo vive en el caso de estudio. */
const MAX_STACK_PREVIEW = 2;

function stackPreview(project: Project): string {
  if (project.stack.length === 0) {
    // Carrera Vóley no lleva stack: es HTML, CSS y JavaScript a pelo. El
    // hueco vacío se lee como un olvido; decirlo lo convierte en lo que
    // es, una característica del proyecto.
    return "sin dependencias";
  }
  const nombres = project.stack.slice(0, MAX_STACK_PREVIEW).map((t) => t.name);
  const resto = project.stack.length - nombres.length;
  return nombres.join(" · ") + (resto > 0 ? ` +${resto}` : "");
}

/**
 * Índice tipográfico de los proyectos que no llevan card propia arriba.
 *
 * En reposo es solo número, nombre, categoría y estado — nada que la
 * topología, un scroll más arriba, no cuente ya por nodo. La entradilla y
 * el stack existen igualmente, pero agazapados: el foco o el ratón sobre
 * la fila anima su alto de 0 a lo que pida el contenido (CSS puro, truco
 * de `grid-template-rows`, sin JS) y los descubre. Así la fila no repite
 * nada en reposo pero tampoco se queda muda al tacto.
 *
 * Devuelve solo las filas (`<li>`), no la lista: el `<ol>` que las
 * envuelve lo pone quien la use, para poder pasarle a la vez la clase
 * `project-index` y el reparto de entrada de `Reveal` (que necesita ser
 * él mismo el elemento de lista para escalonar cada `<li>` como hijo
 * directo).
 */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  return (
    <>
      {projects.map((project, i) => (
        <li key={project.slug}>
          <Link href={`/proyectos/${project.slug}`} className="project-index-row group">
            <span className="project-index-top">
              <span className="project-index-n" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="project-index-title min-w-0 truncate">
                {project.cardTitle ?? project.title}
                <span className="project-index-caret" aria-hidden />
              </span>
              <span className="project-index-leader" aria-hidden />
              <span className="project-index-meta">
                <span className="project-index-tag">{project.tags[0]}</span>
                <span className={`flex items-center gap-2 ${ESTADO_TONE[project.status]}`}>
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
                  {ESTADO_LABEL[project.status]}
                </span>
              </span>
            </span>

            <span className="project-index-detail">
              <span className="project-index-detail-inner">
                <span className="project-index-tagline">{project.tagline}</span>
                <span className="project-index-stack">{stackPreview(project)}</span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </>
  );
}
