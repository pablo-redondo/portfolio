import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
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
      images: [`/og/${project.slug}.png`],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  return (
    <Container>
      <section className="py-16 sm:py-24">
        <SectionLabel>{`cat ${project.slug}.md`}</SectionLabel>
        <h1 className="font-mono text-3xl font-bold tracking-tight">{project.title}</h1>
        <p className="mt-4 max-w-[60ch] text-ink-soft">{project.tagline}</p>
      </section>
    </Container>
  );
}
