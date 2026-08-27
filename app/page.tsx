import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { ProjectCard } from "@/components/ProjectCard";
import { FeaturedProject } from "@/components/FeaturedProject";
import { TopologyGraph } from "@/components/TopologyGraph";
import { RequestTrace } from "@/components/RequestTrace";
import { HeroStats } from "@/components/HeroStats";
import { Reveal } from "@/components/Reveal";
import { DeploymentStatusPanel } from "@/components/DeploymentStatus";
import { HeroRoutes } from "@/components/HeroRoutes";
import { SectionSpine } from "@/components/SectionSpine";
import { projects } from "@/content/projects";
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

export default function HomePage() {
  return (
    <div className="relative">
      <SectionSpine />
      {/* El hero no lleva reveal (depende de hidratación y de que el
          observer dispare). Entra con `data-enter`: una secuencia CSS
          escalonada que arranca con el primer pintado. El h1 es el
          elemento LCP, así que el suyo mueve solo el transform y nunca la
          opacidad: Chrome no contabiliza un elemento en opacity 0. */}
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center pt-[72px] pb-[60px]">
        <Container rail className="w-full">
          <HeroRoutes />

          <div data-enter="1">
            <SectionLabel>whoami --stack</SectionLabel>
          </div>

          {/* El titular ocupa el ancho completo por encima de las dos
              columnas, como pide el sistema de diseño: a 70px no cabe en
              media rejilla sin partirse en cinco líneas. El segundo tramo
              va en acento. */}
          <h1
            data-enter="lcp"
            className="text-display relative mb-10 max-w-[21ch] text-balance text-ink"
          >
            {HOME_HERO.headline}
            <span className="text-accent">{HOME_HERO.headlineAccent}</span>
          </h1>

          <div className="relative grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_372px]">
            <div className="min-w-0">
              <p data-enter="3" className="text-body mb-8 max-w-[56ch] text-ink-soft">
                {HOME_HERO.intro}
              </p>

              <div data-enter="4" className="flex flex-wrap items-center gap-3">
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

            {/* La traza real de la petición que acaba de traer esta
                página — Navigation Timing del navegador, no una cifra de
                muestra. Da peso al lado derecho sin repetir el monitor de
                estado, que tiene su propia sección a ancho completo
                debajo. */}
            <div data-enter="4" className="min-w-0">
              <RequestTrace />
            </div>
          </div>

          <div data-enter="4">
            <HeroStats />
          </div>
        </Container>
      </section>

      {/* El monitor va directo tras su comando: en el sistema de diseño
          esta sección no lleva titular ni entradilla — la tabla ya dice
          qué es, y el `--watch` del comando explica la cadencia. */}
      <section className="pt-24">
        <Container rail>
          <Reveal>
            <SectionLabel
              action={
                <span className="font-mono text-[11px] text-ink-meta">
                  check cada 5 min
                </span>
              }
            >
              status --all --watch
            </SectionLabel>
          </Reveal>

          <Reveal>
            <DeploymentStatusPanel />
          </Reveal>
        </Container>
      </section>

      {/* Topología: los mismos siete proyectos, pero como red — qué
          tecnología comparte cada uno con los demás, calculado de verdad
          desde content/projects/*.ts, no dibujado a mano. */}
      <section className="pt-24">
        <Container rail>
          <Reveal>
            <SectionLabel>netstat --graph proyectos</SectionLabel>
            <h2 className="text-h2 mb-2.5 text-ink">La topología de lo que he construido</h2>
            <p className="text-body mb-[30px] max-w-[62ch] text-ink-soft">
              Cada nodo es un proyecto; cada arista, las tecnologías que comparten.
              Las aristas gruesas son stack repetido a propósito. Pasa el foco o el
              ratón por un nodo para aislar sus vecinos.
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

      <section className="pt-24">
        <Container rail>
          <Reveal>
            <SectionLabel>cat destacado.md</SectionLabel>
          </Reveal>

          <Reveal>
            <FeaturedProject project={featured} />
          </Reveal>
        </Container>
      </section>

      <section className="pt-24 pb-[130px]">
        <Container rail>
          <Reveal>
            <SectionLabel
              action={
                <Link
                  href="/proyectos"
                  className="font-mono text-xs text-accent transition-opacity hover:opacity-80"
                >
                  ver los siete
                </Link>
              }
            >
              ls proyectos/
            </SectionLabel>
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
    </div>
  );
}
