import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { ProjectMonitorList } from "@/components/ProjectMonitorList";
import { TechRankBar } from "@/components/TechRankBar";
import { Reveal } from "@/components/Reveal";
import { HeroRoutes } from "@/components/HeroRoutes";
import { SectionSpine } from "@/components/SectionSpine";
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
    <div className="relative">
      <SectionSpine />
      <section className="relative pt-[74px] pb-14">
        <Container rail>
          <HeroRoutes />

          {/* El comando abre la sección a ancho completo, por encima de las
              dos columnas — no metido dentro de la izquierda. */}
          <div data-enter="1">
            <SectionLabel>ls proyectos/</SectionLabel>
          </div>

          <div className="relative grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_356px]">
            <div className="min-w-0">
              <h1 data-enter="lcp" className="text-h1 mb-5 max-w-[20ch] text-balance text-ink">
                Proyectos
              </h1>

              <p data-enter="3" className="text-body text-ink-soft">
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

      <section className="pt-14 pb-[130px]">
        <Container rail>
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
            <nav className="mb-2 flex flex-wrap items-center gap-2" aria-label="Filtrar por etiqueta">
              <FiltroPill href="/proyectos" label="todo" active={!activeTag} />
              {PROJECT_TAGS.map((t) => (
                <FiltroPill
                  key={t}
                  href={`/proyectos?tag=${encodeURIComponent(t)}`}
                  label={t}
                  active={activeTag === t}
                />
              ))}
            </nav>
          </Reveal>

          <ProjectMonitorList projects={filtered} />

          {filtered.length === 0 && (
            <p className="text-body py-12 text-center text-ink-soft">
              Ningún proyecto con esa etiqueta todavía.
            </p>
          )}
        </Container>
      </section>
    </div>
  );
}

/**
 * Pastilla del filtro. La activa se rellena y coge borde de acento; el
 * relleno, y no solo el tono, es lo que la distingue en escala de grises.
 * `aria-current` la marca para un lector de pantalla.
 */
function FiltroPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      data-active={active}
      aria-current={active ? "true" : undefined}
      className="filter-pill"
    >
      {label}
    </Link>
  );
}
