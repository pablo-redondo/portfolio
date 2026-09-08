import Link from "next/link";
import type { Project } from "@/content/types";
import { Reveal } from "@/components/Reveal";

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

/** Nombres de sobra en una sola línea: el porqué de cada uno ya vive en
 * /sobre-mi y en la propia ficha del proyecto, no hace falta repetirlo aquí. */
const MAX_STACK = 6;

function stackLine(project: Project) {
  if (project.stack.length === 0) {
    // Carrera Vóley no lleva stack: es HTML, CSS y JavaScript a pelo. El
    // hueco vacío se lee como un olvido; decirlo lo convierte en lo que
    // es, una característica del proyecto.
    return "sin dependencias";
  }
  const nombres = project.stack.slice(0, MAX_STACK).map((t) => t.name);
  const resto = project.stack.length - nombres.length;
  return nombres.join(" · ") + (resto > 0 ? ` +${resto}` : "");
}

/**
 * Índice de proyectos: una fila por proyecto, sin caja — un divisor fino
 * la separa de la siguiente, igual que el resto de listas del sistema de
 * diseño. La fila entera es el enlace al caso de estudio.
 *
 * Antes esto era una tabla al estilo `top`, con la latencia y el uptime de
 * cada despliegue por fila y un panel que había que abrir para ver el
 * resto. Ese dato en vivo ya tiene su sitio — la tabla de estado de la
 * home — y aquí competía con lo que esta página tiene que vender primero:
 * qué se construyó. El único estado que queda es el real y honesto
 * (operativo / en curso / archivado), sin necesitar una petición de red.
 */
export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <Reveal stagger>
      {projects.map((project) => (
        <Link key={project.slug} href={`/proyectos/${project.slug}`} className="project-row group">
          <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1.5">
            <h3 className="project-row-title min-w-0 truncate text-h3 text-ink">
              {project.cardTitle ?? project.title}
            </h3>
            <span
              className={`flex shrink-0 items-center gap-2 font-mono text-xs normal-case ${ESTADO_TONE[project.status]}`}
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
              {ESTADO_LABEL[project.status]}
            </span>
          </div>

          <p className="text-body-sm mt-2.5 max-w-[70ch] text-ink-soft">{project.tagline}</p>

          <p className="text-mono-data mt-3 text-ink-meta">{stackLine(project)}</p>
        </Link>
      ))}
    </Reveal>
  );
}
