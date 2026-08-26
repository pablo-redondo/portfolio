import type { Project } from "@/content/types";

/**
 * Palabra o palabras que identifican cada tecnología de content/stack.ts
 * dentro del nombre, tal como aparece escrito en el stack de un proyecto
 * real. Explícito y no adivinado por parecido de cadenas: dos o más
 * alternativas cuando el nombre general junta más de una cosa (p. ej.
 * "Vitest + Playwright" cuenta si el proyecto usa cualquiera de las dos).
 */
const MATCHERS: Record<string, string[]> = {
  React: ["react"],
  "Next.js (App Router)": ["next.js"],
  "Tailwind CSS": ["tailwind"],
  Zustand: ["zustand"],
  "Node.js + Express": ["express"],
  NestJS: ["nestjs"],
  PostgreSQL: ["postgresql", "postgres"],
  Prisma: ["prisma"],
  Docker: ["docker"],
  "Fly.io / Render": ["fly.io", "render"],
  Vercel: ["vercel"],
  TypeScript: ["typescript"],
  "Vitest + Playwright": ["vitest", "playwright"],
  pnpm: ["pnpm"],
  "GitHub Actions": ["github actions"],
};

/** En cuántos de los proyectos reales aparece esta tecnología del stack general. */
export function buildStackUsage(
  stackNames: string[],
  projects: Project[],
): Map<string, number> {
  const usage = new Map<string, number>();
  for (const name of stackNames) {
    const keywords = MATCHERS[name] ?? [name.toLowerCase()];
    const count = projects.filter((p) =>
      p.stack.some((t) => keywords.some((kw) => t.name.toLowerCase().includes(kw))),
    ).length;
    usage.set(name, count);
  }
  return usage;
}
