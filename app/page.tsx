import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { EvolutionPreview } from "@/components/EvolutionPreview";
import { StatusBadge } from "@/components/StatusBadge";
import { projects } from "@/content/projects";
import { aboutStack } from "@/content/stack";
import { SITE } from "@/content/site";

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
    <Container>
      {/* El hero no lleva reveal: su h1 es el elemento LCP y arrancarlo
          en opacity 0 retrasaría la métrica por definición. */}
      <section className="py-16 sm:py-24">
        <SectionLabel typed>whoami --stack</SectionLabel>
        <h1 className="max-w-[18ch] font-mono text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          De la sala de servidores al código
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg text-ink-soft">
          Desarrollador full-stack con base en ASIR y redes: entiendo lo que
          pasa por debajo de una petición HTTP, no solo lo que se ve en el
          navegador. Construyo aplicaciones completas — de la base de datos al
          pixel — y esa base de sistemas y redes es la que explica el porqué
          de muchas decisiones, no solo el qué.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/proyectos"
            className="btn-primary rounded-sm bg-accent px-4 py-2 font-mono text-sm font-medium text-accent-ink"
          >
            Ver proyectos
          </Link>
          {SITE.cvUrl ? (
            <a
              href={SITE.cvUrl}
              className="btn-secondary inline-flex items-center gap-2 rounded-sm border border-line px-4 py-2 font-mono text-sm text-ink"
            >
              Descargar CV <span className="btn-arrow">↓</span>
            </a>
          ) : (
            <span className="rounded-sm border border-line px-4 py-2 font-mono text-sm text-ink-faint">
              Descargar CV (próximamente)
            </span>
          )}
        </div>
      </section>

      {featured && (
        <section className="border-t border-line py-16">
          <Reveal>
          <SectionLabel>{`cat proyectos/${featured.slug}.md --preview`}</SectionLabel>
          <Link href={`/proyectos/${featured.slug}`} className="group block">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-mono text-2xl font-bold tracking-tight group-hover:text-accent">
                {featured.title}
              </h2>
              <span className="font-mono text-[10px] font-medium tracking-wide text-accent">
                PROYECTO INSIGNIA
              </span>
              <StatusBadge status={featured.status} />
            </div>
            <p className="mt-3 max-w-[65ch] text-ink-soft">{featured.tagline}</p>
          </Link>
          {featured.timeline && (
            <div className="mt-6">
              <EvolutionPreview phases={featured.timeline} />
            </div>
          )}
          <Link
            href={`/proyectos/${featured.slug}`}
            className="mt-6 inline-block font-mono text-sm text-teal hover:text-accent"
          >
            Ver caso de estudio completo →
          </Link>
          </Reveal>
        </section>
      )}

      <section className="border-t border-line py-16">
        <SectionLabel>ls proyectos/</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, i) => (
            // Stagger con tope de 3 pasos: acumularlo dejaría la última
            // card esperando 300 ms, que ya se lee como lentitud.
            <Reveal key={project.slug} delay={(i % 3) * 60}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        <Link
          href="/proyectos"
          className="mt-6 inline-block font-mono text-sm text-teal hover:text-accent"
        >
          Ver todos los proyectos →
        </Link>
      </section>

      <section className="border-t border-line py-16">
        <Reveal>
        <SectionLabel>cat stack.txt</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {stripStack.map((tech) => (
            <span
              key={tech.name}
              className="rounded-sm border border-line bg-surface-2 px-2.5 py-1 font-mono text-xs text-ink-soft"
            >
              {tech.name}
            </span>
          ))}
        </div>
        <Link
          href="/sobre-mi"
          className="mt-6 inline-block font-mono text-sm text-teal hover:text-accent"
        >
          Por qué este stack →
        </Link>
        </Reveal>
      </section>
    </Container>
  );
}
