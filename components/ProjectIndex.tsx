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

/**
 * Índice tipográfico de los proyectos que no llevan card propia arriba.
 *
 * Antes esto era una rejilla de cards con entradilla y chips de stack —
 * justo lo que la topología, un scroll más arriba, ya cuenta por nodo.
 * Aquí no se repite ninguno de los dos: solo lo que la topología no dice
 * (la categoría del proyecto) y una fila ligera que lleva al caso de
 * estudio, donde vive el resto.
 */
/**
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
            <span className="project-index-n" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="project-index-title min-w-0 truncate">
              {project.cardTitle ?? project.title}
            </span>
            <span className="project-index-meta">
              <span className="project-index-tag">{project.tags[0]}</span>
              <span className={`flex items-center gap-2 ${ESTADO_TONE[project.status]}`}>
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
                {ESTADO_LABEL[project.status]}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </>
  );
}
