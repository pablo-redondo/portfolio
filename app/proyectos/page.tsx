import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/content/projects";
import { PROJECT_TAGS } from "@/content/types";

/** Cards que caben sobre el pliegue: la insignia a doble ancho y la fila
 *  siguiente. No llevan reveal para no retrasar el LCP. */
const ABOVE_FOLD_CARDS = 3;

const TITLE = "Proyectos";
const DESCRIPTION = "Proyectos full-stack, herramientas y experimentos de Pablo Redondo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · Pablo Redondo`, description: DESCRIPTION },
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
          {ordered.map((project, i) => {
            // El ancho doble del insignia va en el envoltorio: es el grid
            // quien decide el layout, no la card.
            const span = project.featured ? "sm:col-span-2" : "";

            // Aquí el grid empieza casi pegado al título, así que las
            // primeras cards caen dentro del pliegue y una de ellas es el
            // elemento LCP (medido: el tagline de la segunda card).
            // Animarlas de entrada retrasa la métrica, así que se
            // renderizan directas; el reveal empieza donde hay scroll real.
            if (i < ABOVE_FOLD_CARDS) {
              return (
                <div key={project.slug} className={span}>
                  <ProjectCard project={project} />
                </div>
              );
            }

            return (
              <Reveal
                key={project.slug}
                delay={((i - ABOVE_FOLD_CARDS) % 3) * 60}
                className={span}
              >
                <ProjectCard project={project} />
              </Reveal>
            );
          })}
        </div>

        {ordered.length === 0 && (
          <p className="mt-10 text-ink-soft">Ningún proyecto con esa etiqueta todavía.</p>
        )}
      </section>
    </Container>
  );
}
