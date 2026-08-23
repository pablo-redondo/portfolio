import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { StatusBadge } from "@/components/StatusBadge";
import { StackTable } from "@/components/StackTable";
import { Timeline } from "@/components/Timeline";
import { Reveal } from "@/components/Reveal";
import { LiveDemo } from "@/components/LiveDemo";
import { DeploymentBadge } from "@/components/DeploymentStatus";
import { projects } from "@/content/projects";
import { hasScreenshot } from "@/lib/screenshots";

type Props = {
  params: Promise<{ slug: string }>;
};

function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: `${project.title} · Pablo Redondo`,
      description: project.tagline,
    },
  };
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="mb-2 font-mono text-[11px] tracking-wide text-accent uppercase">
        {eyebrow}
      </p>
      <h2 className="font-mono text-2xl font-bold tracking-tight">{title}</h2>
      <span className="heading-rule mt-3.5" aria-hidden />
    </div>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const { caseStudy } = project;

  return (
    <>
      {/* --- Cabecera --- */}
      <section className="hero-glow border-b border-line">
        <Container>
          <div className="py-16 sm:py-20">
            <Link href="/proyectos" className="btn btn-ghost -ml-2.5" data-enter="1">
              Volver a proyectos
            </Link>

            {/* El h1 es el LCP de esta página: su entrada mueve solo el
                transform, nunca la opacidad. */}
            <div
              data-enter="lcp"
              className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3"
            >
              <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl">
                {project.title}
              </h1>
              <StatusBadge status={project.status} />
            </div>

            <p
              data-enter="3"
              className="mt-5 max-w-[65ch] text-lg leading-relaxed text-ink-soft"
            >
              {project.tagline}
            </p>

            <div data-enter="4" className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>

            <div data-enter="4" className="mt-8 flex flex-wrap gap-3">
              {project.repos.map((repo) => (
                <a key={repo.url} href={repo.url} className="btn btn-secondary">
                  {repo.label}
                </a>
              ))}
              {project.demoUrl && (
                <a href={project.demoUrl} className="btn btn-primary">
                  Abrir demo
                </a>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* --- Demo en vivo --- */}
      {project.demoUrl && (
        <section className="border-b border-line py-16">
          <Container>
            <Reveal>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="mb-2 font-mono text-[11px] tracking-wide text-accent uppercase">
                    pruébalo tú
                  </p>
                  <h2 className="font-mono text-2xl font-bold tracking-tight">
                    Demo en vivo
                  </h2>
                  <span className="heading-rule mt-3.5" aria-hidden />
                </div>
                <DeploymentBadge slug={project.slug} />
              </div>
              <LiveDemo
                slug={project.slug}
                url={project.demoUrl}
                title={project.title}
                note={project.demoNote}
                hasPoster={hasScreenshot(project.slug)}
              />
            </Reveal>
          </Container>
        </section>
      )}

      {/* --- Línea de evolución --- */}
      {project.timeline && project.timeline.length > 0 && (
        <section className="border-b border-line py-16">
          <Container>
            <Reveal>
              <SectionHeading eyebrow="cómo llegó hasta aquí" title="Línea de evolución" />
              <p className="mb-8 max-w-[65ch] text-ink-soft">
                Seis fases reconstruyendo el proyecto sin dejarlo roto entre
                pasos. Cada una se despliega con su detalle y su rango de
                commits.
              </p>
            </Reveal>
            <Timeline phases={project.timeline} />
          </Container>
        </section>
      )}

      {/* --- Contexto y reto, a dos columnas --- */}
      <section className="border-b border-line py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeading eyebrow="por qué existe" title="Contexto" />
              <p className="max-w-[62ch] leading-relaxed text-ink-soft">
                {caseStudy.problem}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <SectionHeading eyebrow="lo más difícil" title="Reto técnico" />
              <p className="max-w-[62ch] leading-relaxed text-ink-soft">
                {caseStudy.challenge}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* --- Decisiones --- */}
      {caseStudy.decisions.length > 0 && (
        <section className="border-b border-line py-16">
          <Container>
            <Reveal>
              <SectionHeading eyebrow="el porqué, no solo el qué" title="Decisiones técnicas" />
            </Reveal>
            <Reveal stagger className="grid gap-4 lg:grid-cols-3">
              {caseStudy.decisions.map((decision, i) => (
                <div
                  key={decision.title}
                  data-spot
                  className="surface-card group h-full p-6"
                >
                  <span className="spot-glow" aria-hidden />
                  <span className="font-mono text-[11px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-mono text-base font-semibold text-ink">
                    {decision.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {decision.detail}
                  </p>
                </div>
              ))}
            </Reveal>
          </Container>
        </section>
      )}

      {/* --- Resultado --- */}
      <section className="border-b border-line py-16">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="dónde está hoy" title="Resultado" />
            <div data-spot className="surface-featured group p-7 sm:p-9">
              <span className="spot-glow" aria-hidden />
              <p className="max-w-[70ch] leading-relaxed text-ink-soft">
                {caseStudy.result}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* --- Stack --- */}
      {project.stack.length > 0 && (
        <section className="py-16">
          <Container>
            <Reveal>
              <SectionHeading eyebrow="con qué está construido" title="Stack" />
            </Reveal>
            <StackTable stack={project.stack} />

            <Reveal>
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
                <p className="text-ink-soft">¿Quieres ver el resto de proyectos?</p>
                <Link href="/proyectos" className="btn btn-secondary">
                  Todos los proyectos
                </Link>
              </div>
            </Reveal>
          </Container>
        </section>
      )}
    </>
  );
}
