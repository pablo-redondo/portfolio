import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { ProjectCard } from "@/components/ProjectCard";
import { EvolutionPreview } from "@/components/EvolutionPreview";
import { Reveal } from "@/components/Reveal";
import { DeploymentStatusPanel } from "@/components/DeploymentStatus";
import { projects } from "@/content/projects";
import { aboutStack } from "@/content/stack";
import { SITE } from "@/content/site";
import { HOME_HERO } from "@/content/home";
import { spanForLastInRow } from "@/lib/grid";

const TITLE = "Pablo Redondo — Desarrollador full-stack";
const DESCRIPTION =
  "De la sala de servidores al código: desarrollador full-stack con base en ASIR y redes. Proyectos, stack y case studies.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

const HOME_STACK_STRIP = [
  "TypeScript",
  "React",
  "Next.js (App Router)",
  "Node.js + Express",
  "NestJS",
  "PostgreSQL",
  "Tailwind CSS",
  "Docker",
];

export default function HomePage() {
  const featured = projects.find((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);
  const stripStack = aboutStack.filter((tech) => HOME_STACK_STRIP.includes(tech.name));

  return (
    <>
      {/* El hero no lleva reveal: su h1 es el elemento LCP y arrancarlo
          en opacity 0 retrasaría la métrica por definición. */}
      <section className="hero-glow border-b border-line">
        <Container>
          <div className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <SectionLabel typed>whoami --stack</SectionLabel>

              <h1 className="mt-4 max-w-[15ch] font-mono text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {HOME_HERO.headline}
              </h1>

              <p className="mt-7 max-w-[58ch] text-lg leading-relaxed text-ink-soft">
                {HOME_HERO.intro}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/proyectos" className="btn btn-primary">
                  Ver proyectos
                </Link>
                {SITE.cvUrl ? (
                  <a href={SITE.cvUrl} className="btn btn-secondary">
                    Descargar CV <span className="btn-arrow">↓</span>
                  </a>
                ) : (
                  <span className="btn btn-secondary opacity-60">
                    Descargar CV (próximamente)
                  </span>
                )}
              </div>
            </div>

            {/* El portfolio comprobando sus propios despliegues. Da peso al
                lado derecho del hero y demuestra el ángulo de redes en la
                primera pantalla, en vez de solo contarlo. */}
            <div className="lg:justify-self-end lg:self-start lg:w-full lg:max-w-md">
              <DeploymentStatusPanel />
            </div>
          </div>
        </Container>
      </section>

      {featured && (
        <section className="border-b border-line py-20">
          <Container>
            <Reveal>
              <SectionLabel>cat proyectos/insignia.md</SectionLabel>
              <h2 className="mt-3 mb-8 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
                El proyecto que mejor me explica
              </h2>
              <ProjectCard project={featured} featured />
              {featured.timeline && (
                <div className="mt-6">
                  <p className="mb-3 font-mono text-[11px] tracking-wide text-ink-faint uppercase">
                    Seis fases documentadas por commits
                  </p>
                  <EvolutionPreview phases={featured.timeline} />
                </div>
              )}
            </Reveal>
          </Container>
        </section>
      )}

      <section className="border-b border-line py-20">
        <Container>
          <Reveal>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionLabel>ls proyectos/</SectionLabel>
                <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
                  Otros proyectos
                </h2>
              </div>
              <Link
                href="/proyectos"
                className="font-mono text-sm text-teal hover:text-accent"
              >
                Ver todos →
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((project, i) => (
              <Reveal
                key={project.slug}
                delay={(i % 3) * 60}
                className={spanForLastInRow(i, rest.length, 3)}
              >
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <Reveal>
            <SectionLabel>cat stack.txt</SectionLabel>
            <h2 className="mt-3 mb-6 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              Stack actual
            </h2>
            <div className="flex flex-wrap gap-2">
              {stripStack.map((tech) => (
                <span key={tech.name} className="chip">
                  {tech.name}
                </span>
              ))}
            </div>
            <Link
              href="/sobre-mi"
              className="mt-7 inline-block font-mono text-sm text-teal hover:text-accent"
            >
              Por qué cada una de estas elecciones →
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
