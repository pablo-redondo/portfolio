import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { ProjectCard } from "@/components/ProjectCard";
import { FeaturedProject } from "@/components/FeaturedProject";
import { StackSummary } from "@/components/StackSummary";
import { Timeline } from "@/components/Timeline";
import { TopologyGraph } from "@/components/TopologyGraph";
import { Reveal } from "@/components/Reveal";
import { DeploymentStatusPanel } from "@/components/DeploymentStatus";
import { HeroGrid } from "@/components/HeroGrid";
import { projects } from "@/content/projects";
import { aboutStack } from "@/content/stack";
import { SITE } from "@/content/site";
import { HOME_HERO } from "@/content/home";
import { buildTopology } from "@/content/topology";

const TITLE = "Pablo Redondo — Desarrollador full-stack";
const DESCRIPTION =
  "Full-stack con base de infraestructura real: React, Next.js, Node.js y TypeScript, con pruebas automatizadas, CI y despliegue real. Proyectos, stack y casos de estudio.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

const featured = projects.find((project) => project.featured) ?? projects[0];
const rest = projects.filter((project) => project.slug !== featured.slug);
const topology = buildTopology(projects);

/**
 * Cifras del panel del hero. Todas se cuentan aquí desde content/, así que
 * no pueden quedarse desfasadas al añadir un proyecto ni afirman nada que
 * no esté en los datos.
 */
const RESUMEN: { k: string; v: string }[] = [
  { k: "proyectos", v: String(projects.length) },
  {
    k: "en producción",
    v: String(projects.filter((p) => p.status === "live").length),
  },
  {
    k: "tecnologías",
    v: String(new Set(projects.flatMap((p) => p.stack.map((t) => t.name))).size),
  },
  { k: "fases documentadas", v: String(featured.timeline?.length ?? 0) },
];

export default function HomePage() {
  return (
    <>
      {/* El hero no lleva reveal (depende de hidratación y de que el
          observer dispare). Entra con `data-enter`: una secuencia CSS
          escalonada que arranca con el primer pintado. El h1 es el
          elemento LCP, así que el suyo mueve solo el transform y nunca la
          opacidad: Chrome no contabiliza un elemento en opacity 0. */}
      <section className="hero-glow relative flex min-h-[calc(100svh-4rem)] items-center border-b border-line">
        <HeroGrid />
        <Container className="w-full">
          <div className="py-16 sm:py-20">
            <div data-enter="1">
              <SectionLabel>whoami --stack</SectionLabel>
            </div>

            {/* El titular ocupa el ancho completo por encima de las dos
                columnas, como pide el sistema de diseño: a 70px no cabe en
                media rejilla sin partirse en cinco líneas. */}
            <h1 data-enter="lcp" className="text-display mt-5 max-w-[21ch] text-balance text-ink">
              {HOME_HERO.headline}
            </h1>

            <div className="mt-9 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_372px] lg:gap-14">
              <div className="min-w-0">
                <p data-enter="3" className="text-body max-w-[56ch] text-ink-soft">
                  {HOME_HERO.intro}
                </p>

                <div data-enter="4" className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/proyectos" className="btn btn-primary">
                    Ver proyectos
                  </Link>
                  {SITE.cvUrl ? (
                    <a href={SITE.cvUrl} className="btn btn-secondary">
                      Descargar CV
                    </a>
                  ) : (
                    <span className="btn btn-secondary opacity-60">
                      Descargar CV (próximamente)
                    </span>
                  )}
                </div>
              </div>

              {/* Ventana de terminal con las cifras del propio contenido.
                  Da peso al lado derecho sin repetir el monitor de estado,
                  que tiene su propia sección a ancho completo debajo. */}
              <div data-enter="4" className="win min-w-0">
                <div className="win-bar">
                  <div className="win-dots" aria-hidden>
                    <span className="win-dot" />
                    <span className="win-dot" />
                    <span className="win-dot" />
                  </div>
                  <span className="win-title">perfil — pablo-redondo.dev</span>
                  <span />
                </div>

                <div className="p-5">
                  <p className="text-mono-cmd text-ink-meta">
                    <span className="text-accent">$</span> cat resumen.json
                  </p>

                  <dl className="mt-5 flex flex-col gap-4">
                    {RESUMEN.map((fact) => (
                      <div key={fact.k} className="flex items-baseline justify-between gap-4">
                        <dt className="text-mono-meta text-ink-meta uppercase">{fact.k}</dt>
                        <dd className="font-mono text-[15px] font-medium text-ink tabular-nums">
                          {fact.v}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <p className="text-mono-data mt-5 border-t border-[var(--bg-raised)] pt-4 leading-relaxed text-ink-meta">
                    contados desde content/, no escritos a mano
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Con la primera pantalla completa no queda ni un borde que
              insinúe que hay más abajo. Un trazo que recorre hacia abajo lo
              sugiere sin texto ni flecha. Decorativo: aria-hidden. */}
          <span className="scroll-hint" aria-hidden />
        </Container>
      </section>

      <section className="border-b border-line py-20">
        <Container>
          <Reveal>
            <SectionLabel>status --all</SectionLabel>
            <h2 className="text-h2 mt-3 text-ink">Estado de los despliegues</h2>
            <span className="heading-rule mt-4 mb-5" aria-hidden />
            <p className="text-body mb-8 text-ink-soft">
              El portfolio comprobando sus propios despliegues, y los de los demás
              proyectos, con una petición HTTP de verdad.
            </p>
          </Reveal>

          <Reveal>
            <DeploymentStatusPanel />
          </Reveal>
        </Container>
      </section>

      {/* Topología: los mismos siete proyectos, pero como red — qué
          tecnología comparte cada uno con los demás, calculado de verdad
          desde content/projects/*.ts, no dibujado a mano. */}
      <section className="border-b border-line py-20">
        <Container>
          <Reveal>
            <SectionLabel>netstat --graph proyectos</SectionLabel>
            <h2 className="text-h2 mt-3 text-ink">La topología de lo que he construido</h2>
            <span className="heading-rule mt-4 mb-5" aria-hidden />
            <p className="text-body mb-8 text-ink-soft">
              Cada nodo es un proyecto; cada arista, las tecnologías que comparten.
              Pasa el foco o el ratón por un nodo para aislar sus vecinos.
            </p>
          </Reveal>

          <Reveal>
            <TopologyGraph
              nodes={topology.nodes}
              edges={topology.edges}
              defaultSlug={featured.slug}
            />
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line py-20">
        <Container>
          <Reveal>
            <SectionLabel>cat destacado.md</SectionLabel>
          </Reveal>

          <Reveal className="mt-6">
            <FeaturedProject project={featured} />
          </Reveal>

          {featured.timeline && (
            <div className="mt-12">
              <Reveal>
                <p className="text-mono-meta mb-5 text-ink-meta uppercase">
                  cómo llegó hasta aquí · {featured.timeline.length} fases
                </p>
              </Reveal>
              <Timeline phases={featured.timeline} />
            </div>
          )}
        </Container>
      </section>

      <section className="border-b border-line py-20">
        <Container>
          <Reveal>
            <SectionLabel
              action={
                <Link href="/proyectos" className="text-mono-cmd text-accent">
                  ver los siete →
                </Link>
              }
            >
              ls proyectos/
            </SectionLabel>
            <h2 className="text-h2 mt-3 text-ink">Proyectos</h2>
            <span className="heading-rule mt-4 mb-5" aria-hidden />
            <p className="text-body mb-8 text-ink-soft">
              El resto, cada uno con su caso de estudio: qué problema resuelven, qué
              decidí y por qué.
            </p>
          </Reveal>

          {/* `stagger`: la rejilla entera comparte un observador y el CSS
              reparte el retardo por hijo, en vez de montar un observador
              por card. */}
          <Reveal stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          {/* El enlace al porqué va en la cabecera, no colgando bajo las
              cards: ahí ocupa el hueco que dejaba el titular y queda a la
              altura de la línea, en vez de suelto al final. */}
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
            <div>
              <SectionLabel>cat stack.txt</SectionLabel>
              <h2 className="text-h2 mt-3 text-ink">Stack actual</h2>
              <span className="heading-rule mt-4 mb-5" aria-hidden />
              <p className="text-body max-w-[54ch] text-ink-soft">
                Agrupado por la capa en la que trabaja cada cosa. El motivo concreto de
                cada elección está en los casos de estudio.
              </p>
            </div>
            <Link href="/sobre-mi" className="btn btn-secondary">
              Por qué cada elección
            </Link>
          </Reveal>

          <StackSummary stack={aboutStack} />
        </Container>
      </section>
    </>
  );
}
