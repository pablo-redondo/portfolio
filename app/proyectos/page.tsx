import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/content/projects";
import { PROJECT_TAGS } from "@/content/types";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Proyectos full-stack, herramientas y experimentos de Pablo Redondo.",
};

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function ProyectosPage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const activeTag = PROJECT_TAGS.includes(tag as (typeof PROJECT_TAGS)[number]) ? tag : undefined;

  const filtered = activeTag
    ? projects.filter((project) => project.tags.includes(activeTag))
    : projects;

  // El proyecto insignia siempre encabeza el listado, con card a doble ancho.
  const ordered = [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <Container>
      <section className="py-16 sm:py-24">
        <SectionLabel>{`ls proyectos/${activeTag ? ` --tag="${activeTag}"` : ""}`}</SectionLabel>
        <h1 className="font-mono text-3xl font-bold tracking-tight">Proyectos</h1>

        <nav className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/proyectos"
            className={`rounded-sm border px-3 py-1 font-mono text-xs ${
              !activeTag ? "border-accent text-accent" : "border-line text-ink-soft hover:text-ink"
            }`}
          >
            todos
          </Link>
          {PROJECT_TAGS.map((t) => (
            <Link
              key={t}
              href={`/proyectos?tag=${encodeURIComponent(t)}`}
              className={`rounded-sm border px-3 py-1 font-mono text-xs ${
                activeTag === t ? "border-accent text-accent" : "border-line text-ink-soft hover:text-ink"
              }`}
            >
              {t}
            </Link>
          ))}
        </nav>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ordered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {ordered.length === 0 && (
          <p className="mt-10 text-ink-soft">Ningún proyecto con esa etiqueta todavía.</p>
        )}
      </section>
    </Container>
  );
}
