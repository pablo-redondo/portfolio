import Link from "next/link";
import type { Project } from "@/content/types";
import { StatusBadge } from "@/components/StatusBadge";
import { TechIcon } from "@/components/TechIcon";
import { techIcon } from "@/content/tech-icons";

type Props = {
  project: Project;
};

const MAX_LOGOS = 5;

export function ProjectCard({ project }: Props) {
  // El stack va como tira de logos, no como chips de texto.
  //
  // Con chips, tres nombres largos ("Next.js 14 (App Router) + React 18")
  // saltaban a dos filas de pastillas con borde, fondo, icono y texto: la
  // mitad del peso visual de la card para su dato menos importante. En
  // logos monocromos cabe el stack casi entero en una línea de 14px.
  //
  // Solo las que tienen logo: mezclar glifos con nombres sueltos para las
  // que no lo tienen (Zustand, Playwright, localStorage) deshace la tira.
  // Las que faltan se cuentan en el contador, así que no desaparecen.
  const logos = project.stack.filter((tech) => techIcon(tech.name));
  const visibles = logos.slice(0, MAX_LOGOS);
  const extra = project.stack.length - visibles.length;

  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className="card-lift card-scan surface-card project-card group flex h-full flex-col p-6"
    >
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

      {/* Se dibuja de cero a ancho completo al pasar por la card. Sustituye
          al separador fijo que antes partía la card en dos: marca la misma
          división, pero solo cuando la card está activa. */}
      <span className="card-rule mt-4" aria-hidden />

      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        {project.tagline}
      </p>

      {/* `mt-auto`: el pie cae al fondo de la card, así que los pies de una
          fila quedan alineados aunque las entradillas midan distinto. */}
      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
        {visibles.length > 0 ? (
          <span className="logo-strip" aria-hidden>
            {visibles.map((tech) => (
              <TechIcon key={tech.name} name={tech.name} className="h-4 w-4" />
            ))}
            {extra > 0 && <span className="logo-count">+{extra}</span>}
          </span>
        ) : (
          // Carrera Vóley no lleva stack: es HTML, CSS y JavaScript a pelo.
          // El hueco vacío se lee como un olvido; decirlo lo convierte en
          // lo que es, una característica del proyecto.
          <span className="logo-count">sin dependencias</span>
        )}

        <span className="card-cta">
          caso de estudio
          <span aria-hidden className="card-cta-arrow">
            →
          </span>
        </span>
      </div>

      {/* La tira de logos es decorativa: los nombres del stack no se pierden
          para quien navega con lector de pantalla. */}
      {project.stack.length > 0 && (
        <span className="sr-only">
          Stack: {project.stack.map((tech) => tech.name).join(", ")}.
        </span>
      )}
    </Link>
  );
}
