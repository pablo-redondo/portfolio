import Link from "next/link";
import type { Project } from "@/content/types";
import { StatusBadge } from "@/components/StatusBadge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className={`group flex flex-col gap-3 rounded-sm border border-line bg-surface p-6 transition-colors hover:border-accent ${
        project.featured ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-ink-faint">
          <span className="text-accent">$</span> open proyectos/{project.slug}
        </p>
        <StatusBadge status={project.status} />
      </div>
      <h3
        className={`font-mono font-bold tracking-tight text-ink group-hover:text-accent ${
          project.featured ? "text-2xl" : "text-lg"
        }`}
      >
        {project.title}
        {project.featured && (
          <span className="ml-2 align-middle font-mono text-[10px] font-medium tracking-wide text-accent">
            PROYECTO INSIGNIA
          </span>
        )}
      </h3>
      <p className="max-w-[60ch] text-sm text-ink-soft">{project.tagline}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {project.stack.slice(0, project.featured ? 6 : 4).map((tech) => (
          <span
            key={tech.name}
            className="rounded-sm border border-line bg-surface-2 px-2 py-0.5 font-mono text-[10.5px] text-ink-soft"
          >
            {tech.name}
          </span>
        ))}
      </div>
    </Link>
  );
}
