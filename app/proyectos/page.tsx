import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { HeroGrid } from "@/components/HeroGrid";
import { projects } from "@/content/projects";
import { PROJECT_TAGS } from "@/content/types";

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

  return (
    <>
      <section className="hero-glow border-b border-line">
        <HeroGrid />
        <Container>
          <div className="py-16 sm:py-20">
            <div data-enter="1">
              <SectionLabel>ls proyectos/</SectionLabel>
            </div>
            <h1
              data-enter="lcp"
              className="mt-4 font-mono text-4xl font-bold tracking-tight sm:text-5xl"
            >
              Proyectos
            </h1>
            <p data-enter="3" className="mt-5 max-w-[60ch] text-lg text-ink-soft">
              Siete proyectos con su caso de estudio: el problema real que
              resuelven, las decisiones técnicas y lo que no salió bien.
            </p>

            <nav data-enter="4" className="mt-8 flex flex-wrap gap-2">
              <Link href="/proyectos" data-active={!activeTag} className="filter-pill">
                todos
                <span className="ml-1.5 text-[10px] opacity-70">{projects.length}</span>
              </Link>
              {PROJECT_TAGS.map((t) => {
                const count = projects.filter((p) => p.tags.includes(t)).length;
                return (
                  <Link
                    key={t}
                    href={`/proyectos?tag=${encodeURIComponent(t)}`}
                    data-active={activeTag === t}
                    className="filter-pill"
                  >
                    {t}
                    <span className="ml-1.5 text-[10px] opacity-70">{count}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {/* Las siete con el mismo peso y el mismo tamaño. Sacar una a una
              banda aparte a ancho completo dejaba a las otras descuadradas. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) =>
              // Las primeras cards caen dentro del pliegue y una de ellas es
              // el elemento LCP: animarlas de entrada retrasa la métrica.
              i < ABOVE_FOLD_CARDS ? (
                <ProjectCard key={project.slug} project={project} />
              ) : (
                <Reveal
                  key={project.slug}
                  delay={((i - ABOVE_FOLD_CARDS) % 3) * 60}
                >
                  <ProjectCard project={project} />
                </Reveal>
              ),
            )}
          </div>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-ink-soft">
              Ningún proyecto con esa etiqueta todavía.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}

/** Cards visibles sin hacer scroll: no llevan reveal para no retrasar el LCP. */
const ABOVE_FOLD_CARDS = 3;
