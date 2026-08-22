import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { StatusBadge } from "@/components/StatusBadge";
import { StackTable } from "@/components/StackTable";
import { Timeline } from "@/components/Timeline";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/content/projects";

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

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const { caseStudy } = project;

  return (
    <Container>
      <article className="py-16 sm:py-24">
        <SectionLabel>{`cat ${project.slug}.md`}</SectionLabel>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-3xl font-bold tracking-tight">{project.title}</h1>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-3 max-w-[65ch] text-lg text-ink-soft">{project.tagline}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm border border-line px-2 py-0.5 font-mono text-[11px] text-ink-soft"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 font-mono text-sm">
          {project.repos.map((repo) => (
            <a key={repo.url} href={repo.url} className="text-teal hover:text-accent">
              {repo.label} ↗
            </a>
          ))}
          {project.demoUrl && (
            <a href={project.demoUrl} className="text-teal hover:text-accent">
              Demo ↗
            </a>
          )}
        </div>

        {project.timeline && project.timeline.length > 0 && (
          <Reveal>
          <section className="mt-14">
            <h2 className="mb-4 font-mono text-lg font-bold tracking-tight">Línea de evolución</h2>
            <Timeline phases={project.timeline} />
          </section>
          </Reveal>
        )}

        <Reveal>
          <section className="mt-14">
            <h2 className="mb-3 font-mono text-lg font-bold tracking-tight">Contexto</h2>
            <p className="max-w-[65ch] text-ink-soft">{caseStudy.problem}</p>
          </section>
        </Reveal>

        {caseStudy.decisions.length > 0 && (
          <Reveal>
          <section className="mt-12">
            <h2 className="mb-4 font-mono text-lg font-bold tracking-tight">Decisiones técnicas clave</h2>
            <div className="flex flex-col gap-6">
              {caseStudy.decisions.map((decision) => (
                <div key={decision.title}>
                  <h3 className="font-mono text-sm font-semibold text-ink">{decision.title}</h3>
                  <p className="mt-1 max-w-[65ch] text-sm text-ink-soft">{decision.detail}</p>
                </div>
              ))}
            </div>
          </section>
          </Reveal>
        )}

        <Reveal>
        <section className="mt-12">
          <h2 className="mb-3 font-mono text-lg font-bold tracking-tight">Reto técnico destacado</h2>
          <p className="max-w-[65ch] text-ink-soft">{caseStudy.challenge}</p>
        </section>
        </Reveal>

        <Reveal>
          <section className="mt-12">
            <h2 className="mb-3 font-mono text-lg font-bold tracking-tight">Resultado</h2>
            <p className="max-w-[65ch] text-ink-soft">{caseStudy.result}</p>
          </section>
        </Reveal>

        {project.stack.length > 0 && (
          <Reveal>
          <section className="mt-14">
            <h2 className="mb-4 font-mono text-lg font-bold tracking-tight">Stack</h2>
            <StackTable stack={project.stack} />
          </section>
          </Reveal>
        )}
      </article>
    </Container>
  );
}
