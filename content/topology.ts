import type { Project, TechCategory } from "@/content/types";

export type TopologyNode = {
  slug: string;
  label: string;
  tagline: string;
  /** Número de tecnologías declaradas en su stack. */
  techCount: number;
};
export type TopologyEdge = { a: string; b: string; techs: string[] };

/**
 * Palabras reconocibles en el nombre de una tecnología del stack. No es
 * una lista exhaustiva de todo lo que usa cada proyecto: es la que basta
 * para detectar solapamientos reales entre los nombres tal como están
 * escritos en content/projects/*.ts (p. ej. "Next.js 14 (App Router) +
 * React 18" y "Next.js (App Router) + Tailwind" comparten "Next.js"),
 * sin inventar una tecnología que el dato no menciona.
 */
const KEYWORDS = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind",
  "Vercel",
  "GitHub Actions",
  "PostgreSQL",
  "Playwright",
  "Vitest",
  "localStorage",
  "Node.js",
] as const;

function tagsFor(project: Project): Set<string> {
  const names = project.stack.map((tech) => tech.name.toLowerCase());
  const tags = new Set<string>();
  for (const keyword of KEYWORDS) {
    if (names.some((name) => name.includes(keyword.toLowerCase()))) {
      tags.add(keyword);
    }
  }
  return tags;
}

/** Grafo de proyectos conectados por tecnología compartida real. */
export function buildTopology(projects: Project[]): {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
} {
  const nodes = projects.map((project) => ({
    slug: project.slug,
    label: project.cardTitle ?? project.title,
    tagline: project.tagline,
    techCount: project.stack.length,
  }));

  const tagsByProject = new Map(projects.map((project) => [project.slug, tagsFor(project)]));
  const edgeMap = new Map<string, TopologyEdge>();

  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      const a = projects[i].slug;
      const b = projects[j].slug;
      const tagsA = tagsByProject.get(a)!;
      const tagsB = tagsByProject.get(b)!;
      const shared = KEYWORDS.filter((tag) => tagsA.has(tag) && tagsB.has(tag));
      if (shared.length > 0) {
        edgeMap.set(`${a}__${b}`, { a, b, techs: shared });
      }
    }
  }

  return { nodes, edges: [...edgeMap.values()] };
}

export type TechRankItem = { name: string; count: number; category: TechCategory };

/**
 * La capa en la que trabaja una tecnología, leída de los propios proyectos:
 * cada `TechChoice` ya declara su `category`, así que basta con quedarse
 * con la que más se repite entre las entradas que mencionan la palabra.
 * Nada de una tabla paralela que se desincronice del contenido.
 */
function categoryFor(keyword: string, projects: Project[]): TechCategory {
  const votos = new Map<TechCategory, number>();
  for (const project of projects) {
    for (const tech of project.stack) {
      if (tech.name.toLowerCase().includes(keyword.toLowerCase())) {
        votos.set(tech.category, (votos.get(tech.category) ?? 0) + 1);
      }
    }
  }
  let mejor: TechCategory = "tooling";
  let max = 0;
  for (const [cat, n] of votos) {
    if (n > max) {
      max = n;
      mejor = cat;
    }
  }
  return mejor;
}

/**
 * Cuántos proyectos usan cada tecnología reconocible, de más a menos. Usa
 * las mismas palabras clave que el grafo: es la lista de lo que de verdad
 * se repite entre proyectos, no todo el stack de cada uno por separado.
 */
export function buildTechRanking(projects: Project[], limit = 6): TechRankItem[] {
  const tagsByProject = projects.map((project) => tagsFor(project));

  return KEYWORDS.map((name) => ({
    name,
    count: tagsByProject.filter((tags) => tags.has(name)).length,
    category: categoryFor(name, projects),
  }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
