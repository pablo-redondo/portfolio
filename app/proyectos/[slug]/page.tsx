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
import { HeroGrid } from "@/components/HeroGrid";
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

/**
 * El primer bloque de contenido tras la cabecera entra dentro del pliegue y
 * suele ser el elemento LCP de la página. <Reveal> lo arrancaría en
 * opacity 0, y Chrome no contabiliza lo que está invisible: la métrica se
 * retrasaría hasta que hidrate y dispare el observer. Ahí va sin animar.
 */
function MaybeReveal({
  animate,
  children,
}: {
  animate: boolean;
  children: React.ReactNode;
}) {
  return animate ? <Reveal>{children}</Reveal> : <>{children}</>;
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

  // El siguiente de la lista, volviendo al principio tras el último: así
  // ningún caso de estudio termina sin a dónde ir.
  const indice = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(indice + 1) % projects.length];

  // La línea de evolución abre la página cuando existe; si no, lo hace
  // Contexto. La primera es la que no puede arrancar invisible.
  const hayTimeline = Boolean(project.timeline && project.timeline.length > 0);

  return (
    <>
      {/* --- Cabecera --- */}
      <section className="hero-glow border-b border-line">
        <HeroGrid />
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

      {/* --- Línea de evolución --- */}
      {project.timeline && project.timeline.length > 0 && (
        <section className="border-b border-line py-16">
          <Container>
            <SectionHeading eyebrow="cómo llegó hasta aquí" title="Línea de evolución" />
            <p className="mb-8 max-w-[65ch] text-ink-soft">
              Seis fases reconstruyendo el proyecto sin dejarlo roto entre
              pasos. Cada una se despliega con su detalle y su rango de
              commits.
            </p>
            <Timeline phases={project.timeline} />
          </Container>
        </section>
      )}

      {/* --- Contexto y reto, a dos columnas --- */}
      <section className="border-b border-line py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <MaybeReveal animate={hayTimeline}>
              <SectionHeading eyebrow="por qué existe" title="Contexto" />
              <p className="max-w-[62ch] leading-relaxed text-ink-soft">
                {caseStudy.problem}
              </p>
            </MaybeReveal>

            <MaybeReveal animate={hayTimeline}>
              <SectionHeading eyebrow="lo más difícil" title="Reto técnico" />
              <p className="max-w-[62ch] leading-relaxed text-ink-soft">
                {caseStudy.challenge}
              </p>
            </MaybeReveal>
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
                  className="card-scan surface-card group h-full p-6"
                >
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
            <div className="card-scan surface-featured group p-7 sm:p-9">
              <p className="max-w-[70ch] leading-relaxed text-ink-soft">
                {caseStudy.result}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* --- Stack --- */}
      {project.stack.length > 0 && (
        <section className="border-b border-line py-16">
          <Container>
            <Reveal>
              <SectionHeading eyebrow="con qué está construido" title="Stack" />
            </Reveal>
            <StackTable stack={project.stack} />
          </Container>
        </section>
      )}

      {/* --- Demo en vivo ---
           Al final a propósito: la página es un caso de estudio y la demo
           es el premio, no la introducción. Arriba interrumpía el hilo
           problema → reto → decisiones → resultado, y empujaba todo ese
           contenido por debajo de un iframe de 500px. Quien solo quiera
           probarlo tiene el botón "Abrir demo" en la cabecera. --- */}
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

      {/* Cierre: el siguiente caso de estudio, no un cartel preguntando si
          quieres ver más. Terminar la lectura ofreciendo el siguiente da
          continuidad; un enlace suelto al índice es un callejón sin salida.
          Y no cuelga del bloque de Stack, porque colgando de él un proyecto
          sin stack —Carrera Vóley— se quedaba sin salida ninguna. */}
      <section className="py-16">
        <Container>
          <Reveal>
            <p className="mb-4 font-mono text-[11px] tracking-wide text-accent uppercase">
              sigue por aquí
            </p>
            <Link
              href={`/proyectos/${next.slug}`}
              className="card-lift card-scan surface-card group block overflow-hidden"
            >
              <div className="p-7 sm:p-9">
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate font-mono text-[11px] text-ink-faint">
                    {next.slug}
                  </span>
                  <StatusBadge status={next.status} />
                </div>
                <h2 className="mt-3.5 font-mono text-2xl leading-snug font-bold tracking-tight text-balance text-ink transition-colors group-hover:text-accent sm:text-3xl">
                  {next.title}
                </h2>
                <p className="mt-3 max-w-[62ch] leading-relaxed text-ink-soft">
                  {next.tagline}
                </p>
              </div>
              <span className="card-action">Ver caso de estudio</span>
            </Link>
          </Reveal>

          <Reveal>
            <Link href="/proyectos" className="link-quiet mt-7 inline-block">
              Ver los seis proyectos
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
