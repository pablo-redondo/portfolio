import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { ProjectCard } from "@/components/ProjectCard";
import { TechRankBar } from "@/components/TechRankBar";
import { Reveal } from "@/components/Reveal";
import { HeroGrid } from "@/components/HeroGrid";
import { projects } from "@/content/projects";
import { PROJECT_TAGS } from "@/content/types";
import { buildTechRanking } from "@/content/topology";

const techRanking = buildTechRanking(projects);

const TITLE = "Proyectos";
const DESCRIPTION = "Proyectos full-stack, herramientas y experimentos de Pablo Redondo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · Pablo Redondo`, description: DESCRIPTION },
};

/** Cards visibles sin hacer scroll: no llevan reveal para no retrasar el LCP. */
const ABOVE_FOLD_CARDS = 3;

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function ProyectosPage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const activeTag = PROJECT_TAGS.includes(tag as (typeof PROJECT_TAGS)[number]) ? tag : undefined;

  const filtered = activeTag
    ? projects.filter((project) => project.tags.includes(activeTag))
    : projects;

  // El filtro activo se imprime en la propia línea de comando, como en el
  // sistema de diseño: el estado del filtro se lee como texto y no solo
  // por el color de la pastilla.
  const filtro = activeTag ?? "todo";

  return (
    <>
      <section className="hero-glow border-b border-line">
        <HeroGrid />
        <Container>
          <div className="grid items-start gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_372px] lg:gap-14">
            <div className="min-w-0">
              <div data-enter="1">
                <SectionLabel>ls proyectos/</SectionLabel>
              </div>

              <h1 data-enter="lcp" className="text-h1 mt-5 max-w-[20ch] text-balance text-ink">
                Proyectos
              </h1>

              <p data-enter="3" className="text-body mt-5 text-ink-soft">
                Siete proyectos con su caso de estudio: el problema real que resuelven,
                las decisiones técnicas y lo que no salió bien.
              </p>
            </div>

            <div data-enter="4" className="min-w-0">
              <TechRankBar items={techRanking} />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Reveal>
            <SectionLabel
              action={
                <span className="text-mono-meta text-ink-meta normal-case">
                  {filtered.length} de {projects.length}
                </span>
              }
            >
              {`top --tag=${filtro}`}
            </SectionLabel>
          </Reveal>

          {/* Enlaces, no botones: el filtro vive en la URL, así que funciona
              con JavaScript desactivado, es compartible y el navegador puede
              volver atrás. */}
          <Reveal>
            <nav className="mb-10 flex flex-wrap gap-2" aria-label="Filtrar por etiqueta">
              <FiltroPill
                href="/proyectos"
                label="todo"
                count={projects.length}
                active={!activeTag}
              />
              {PROJECT_TAGS.map((t) => (
                <FiltroPill
                  key={t}
                  href={`/proyectos?tag=${encodeURIComponent(t)}`}
                  label={t}
                  count={projects.filter((p) => p.tags.includes(t)).length}
                  active={activeTag === t}
                />
              ))}
            </nav>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* El insignia ocupa dos columnas; el resto, una. Las primeras
                cards caen dentro del pliegue y una de ellas es el elemento
                LCP: animarlas de entrada retrasa la métrica. */}
            {filtered.map((project, i) =>
              i < ABOVE_FOLD_CARDS ? (
                <ProjectCard key={project.slug} project={project} featured={project.featured} />
              ) : (
                <Reveal
                  key={project.slug}
                  delay={((i - ABOVE_FOLD_CARDS) % 3) * 60}
                  className={project.featured ? "sm:col-span-2" : undefined}
                >
                  <ProjectCard project={project} />
                </Reveal>
              ),
            )}
          </div>

          {filtered.length === 0 && (
            <p className="text-body py-12 text-center text-ink-soft">
              Ningún proyecto con esa etiqueta todavía.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}

/**
 * Pastilla del filtro. El estado activo va en cian, pero también lleva un
 * marcador de texto (`✓`) y `aria-current`: en escala de grises, o con un
 * lector de pantalla, se sigue sabiendo cuál está puesta.
 */
function FiltroPill({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      data-active={active}
      aria-current={active ? "true" : undefined}
      className="filter-pill"
    >
      {active && <span aria-hidden>✓</span>}
      {label}
      <span className="text-[10px] opacity-70 tabular-nums">{count}</span>
    </Link>
  );
}
