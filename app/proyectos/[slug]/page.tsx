import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { StatusBadge } from "@/components/StatusBadge";
import { StackTable } from "@/components/StackTable";
import { PhaseTabs } from "@/components/PhaseTabs";
import { AuditBox } from "@/components/AuditBox";
import { CodeDiff } from "@/components/CodeDiff";
import { CodeBlock } from "@/components/CodeBlock";
import { EvalVsWorkerDemo } from "@/components/EvalVsWorkerDemo";
import { Reveal } from "@/components/Reveal";
import { LiveDemo } from "@/components/LiveDemo";
import { DeploymentBadge } from "@/components/DeploymentStatus";
import { HeroGrid } from "@/components/HeroGrid";
import { HopScrollSpy } from "@/components/HopScrollSpy";
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

function HopSection({
  id,
  n,
  eyebrow,
  title,
  children,
}: {
  id: string;
  n: number;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="hop-section border-b border-line py-16">
      <Container>
        <Reveal>
          <p className="text-mono-meta mb-2 text-ink-meta uppercase">
            hop {String(n).padStart(2, "0")} · {eyebrow}
          </p>
          <h2 className="font-mono text-2xl font-bold tracking-tight">{title}</h2>
          <span className="heading-rule mt-3.5 mb-8" aria-hidden />
          {children}
        </Reveal>
      </Container>
    </section>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const { caseStudy } = project;
  const hayTimeline = Boolean(project.timeline && project.timeline.length > 0);
  const hayDecisiones = caseStudy.decisions.length > 0;
  const hayStack = project.stack.length > 0;

  // Los hops disponibles varían por proyecto: no todos tienen fases
  // documentadas o decisiones con código de por medio, así que la
  // navegación se calcula, no se da por hecha fija en seis pasos.
  const hops: { id: string; label: string }[] = [
    { id: "contexto", label: "contexto" },
    ...(hayDecisiones ? [{ id: "decisiones", label: "decisiones" }] : []),
    { id: "reto", label: "reto técnico" },
    ...(hayTimeline ? [{ id: "fases", label: "fases" }] : []),
    { id: "resultado", label: "resultado" },
    ...(hayStack ? [{ id: "stack", label: "stack" }] : []),
  ];

  let hopN = 0;

  return (
    <>
      {/* --- Cabecera --- */}
      <section className="hero-glow border-b border-line">
        <HeroGrid />
        <Container>
          <div className="py-16 sm:py-20">
            <p data-enter="1" className="text-mono-cmd text-ink-meta">
              <Link href="/proyectos" className="hover:text-accent">
                cd ../proyectos
              </Link>{" "}
              <span className="text-ink">{project.slug}</span>
            </p>

            <div data-enter="lcp" className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
              <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl">
                {project.title}
              </h1>
              <StatusBadge status={project.status} />
            </div>

            <p data-enter="3" className="mt-5 max-w-[65ch] text-lg leading-relaxed text-ink-soft">
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
              {project.demoUrl && (
                <a href={project.demoUrl} className="btn btn-primary">
                  Abrir demo
                </a>
              )}
              {project.repos.map((repo) => (
                <a key={repo.url} href={repo.url} className="btn btn-secondary">
                  {repo.label}
                </a>
              ))}
            </div>

            {/* Cifras reales del propio caso de estudio: fases y el dato
                suelto que ya cuenta el resultado, si los hay. El badge de
                despliegue no depende de que existan: se muestra siempre
                que haya demo que comprobar. */}
            {(hayTimeline || caseStudy.stat || project.metric || project.demoUrl) && (
              <div
                data-enter="4"
                className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-line pt-5"
              >
                {hayTimeline && (
                  <MetaStat label="fases" value={String(project.timeline!.length)} />
                )}
                {caseStudy.stat && (
                  <MetaStat label={caseStudy.stat.label} value={caseStudy.stat.value} />
                )}
                {project.metric && (
                  <MetaStat label={project.metric.label} value={project.metric.note} />
                )}
                {project.demoUrl && <DeploymentBadge slug={project.slug} />}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* --- Navegación por hops ---
          Anclas normales: saltan sin JavaScript, y el hop activo se marca
          con :target en CSS, no con estado de React. */}
      <nav
        aria-label="Secciones del caso de estudio"
        className="sticky top-16 z-30 border-b border-line bg-bg/90 backdrop-blur-md"
      >
        <Container>
          <div className="flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {hops.map((hop, i) => (
              <a key={hop.id} href={`#${hop.id}`} data-hop={hop.id} className="hop-link">
                <span className="text-mono-meta mr-1.5 text-ink-meta normal-case">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {hop.label}
              </a>
            ))}
          </div>
        </Container>
        <HopScrollSpy hopIds={hops.map((hop) => hop.id)} />
      </nav>

      {/* --- Contexto --- */}
      <HopSection id="contexto" n={(hopN += 1)} eyebrow="por qué existe" title="Contexto">
        <p className="max-w-[70ch] leading-relaxed text-ink-soft">{caseStudy.problem}</p>
        {caseStudy.audit && (
          <div className="mt-7">
            <AuditBox audit={caseStudy.audit} />
          </div>
        )}
      </HopSection>

      {/* --- Decisiones --- */}
      {hayDecisiones && (
        <HopSection
          id="decisiones"
          n={(hopN += 1)}
          eyebrow="el porqué, no solo el qué"
          title="Decisiones técnicas"
        >
          <div className="flex flex-col gap-3">
            {caseStudy.decisions.map((decision, i) => (
              <details key={decision.title} className="rail-node group" open={i === 0}>
                <summary className="phase-summary">
                  <span className="rail-dot">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1 self-center font-mono text-sm font-semibold text-ink">
                    {decision.title}
                  </span>
                  <span className="phase-toggle" aria-hidden />
                </summary>
                <div className="detail-in phase-detail">
                  <p className="max-w-[70ch] text-sm leading-relaxed text-ink-soft">
                    {decision.detail}
                  </p>
                  {decision.code && (
                    <div className="mt-4">
                      <CodeDiff change={decision.code} />
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </HopSection>
      )}

      {/* --- Reto técnico --- */}
      <HopSection id="reto" n={(hopN += 1)} eyebrow="lo más difícil" title="Reto técnico">
        {/* La demo interactiva es específica de este reto (eval() vs Worker):
            no tendría sentido para el challengeCode de otro proyecto. */}
        {project.slug === "codequest-rpg" && <EvalVsWorkerDemo />}
        <p className="max-w-[70ch] leading-relaxed text-ink-soft">{caseStudy.challenge}</p>
        {caseStudy.challengeCode && (
          <div className="mt-6">
            <CodeBlock file={caseStudy.challengeCode.file} code={caseStudy.challengeCode.code} />
          </div>
        )}
      </HopSection>

      {/* --- Fases --- */}
      {hayTimeline && (
        <HopSection
          id="fases"
          n={(hopN += 1)}
          eyebrow="cómo llegó hasta aquí"
          title="Fases de desarrollo"
        >
          <PhaseTabs phases={project.timeline!} />
        </HopSection>
      )}

      {/* --- Resultado --- */}
      <HopSection id="resultado" n={(hopN += 1)} eyebrow="dónde está hoy" title="Resultado">
        {project.metric && (
          <div className="mb-7 grid max-w-md grid-cols-2 gap-3">
            <div className="rounded-lg border border-line p-4">
              <p className="text-xl font-medium text-crit">{project.metric.before.value}</p>
              <p className="text-mono-meta mt-1 text-ink-meta uppercase">
                {project.metric.before.note}
              </p>
            </div>
            <div className="rounded-lg border border-line p-4">
              <p className="text-xl font-medium text-ok">{project.metric.after.value}</p>
              <p className="text-mono-meta mt-1 text-ink-meta uppercase">
                {project.metric.after.note}
              </p>
            </div>
          </div>
        )}
        <div className="card-scan surface-featured group p-7 sm:p-9">
          <p className="max-w-[70ch] leading-relaxed text-ink-soft">{caseStudy.result}</p>
        </div>
      </HopSection>

      {/* --- Stack --- */}
      {hayStack && (
        <HopSection id="stack" n={(hopN += 1)} eyebrow="con qué está construido" title="Stack">
          <StackTable stack={project.stack} />
        </HopSection>
      )}

      {/* --- Demo en vivo ---
           Fuera de la navegación por hops a propósito: es el premio, no
           un paso más del caso de estudio. Quien solo quiera probarlo
           tiene el botón "Abrir demo" en la cabecera. --- */}
      {project.demoUrl && (
        <section className="border-b border-line py-16">
          <Container>
            <Reveal>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="mb-2 font-mono text-[11px] tracking-wide text-accent uppercase">
                    pruébalo tú
                  </p>
                  <h2 className="font-mono text-2xl font-bold tracking-tight">Demo en vivo</h2>
                  <span className="heading-rule mt-3.5" aria-hidden />
                </div>
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

      <section className="py-16">
        <Container>
          <Link href="/proyectos" className="btn btn-secondary">
            Ver el resto de proyectos
          </Link>
        </Container>
      </section>
    </>
  );
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-2.5">
      <span className="text-mono-meta text-ink-meta uppercase">{label}</span>
      <span className="text-mono-data text-ink">{value}</span>
    </span>
  );
}
