/**
 * Extrae de simple-icons los trazos de los logos que usa el contenido y los
 * escribe en content/tech-icons.ts.
 *
 * Se ejecuta a mano cuando se añade una tecnología nueva:
 *   npm i --no-save simple-icons && node scripts/gen-tech-icons.mjs
 *
 * El paquete NO queda como dependencia: trae más de 3000 iconos y aquí se
 * usan veinte. Lo que se versiona es el archivo generado.
 */
import * as si from "simple-icons";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

// Los nombres del contenido son descriptivos ("Next.js 14 (App Router) +
// React 18"), no identificadores, así que se resuelven por patrón. El orden
// importa: gana el primero que encaje, y por eso "Vitest" va antes que
// "Vite", que si no se lo comería.
const REGLAS = [
  [/^next\.js/i, "nextdotjs"],
  [/^nest/i, "nestjs"],
  [/^react/i, "react"],
  [/^node/i, "nodedotjs"],
  [/^typescript/i, "typescript"],
  [/^tailwind/i, "tailwindcss"],
  [/^prisma/i, "prisma"],
  [/^postgres/i, "postgresql"],
  [/^vitest/i, "vitest"],
  [/^vite/i, "vite"],
  [/^docker/i, "docker"],
  [/^fly\.io/i, "flydotio"],
  [/^render/i, "render"],
  [/^github actions/i, "githubactions"],
  [/^jwt/i, "jsonwebtokens"],
  [/^pnpm/i, "pnpm"],
  [/^tanstack/i, "reactquery"],
  [/^tmdb/i, "themoviedatabase"],
  [/^vercel/i, "vercel"],
  [/^codemirror/i, "codemirror"],
];

const fuentes = [
  ...readdirSync("content/projects")
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .map((f) => `content/projects/${f}`),
  "content/stack.ts",
];

const nombres = new Set();
for (const f of fuentes) {
  for (const m of readFileSync(f, "utf8").matchAll(/name: "([^"]+)"/g)) {
    nombres.add(m[1]);
  }
}

const usados = new Map();
const sinIcono = [];
for (const nombre of [...nombres].sort()) {
  const slug = REGLAS.find(([re]) => re.test(nombre))?.[1];
  const icono = slug && si["si" + slug[0].toUpperCase() + slug.slice(1)];
  if (!icono) {
    sinIcono.push(nombre);
    continue;
  }
  usados.set(slug, { title: icono.title, path: icono.path });
}

const entradas = [...usados.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(
    ([slug, i]) =>
      `  ${slug}: {\n    title: ${JSON.stringify(i.title)},\n    path: ${JSON.stringify(i.path)},\n  },`,
  )
  .join("\n");

writeFileSync(
  "content/tech-icons.ts",
  `/**
 * Trazos de los logos de tecnología, extraídos de simple-icons. Los iconos
 * son marcas de sus dueños; aquí solo se dibujan para indicar con qué está
 * hecho cada proyecto.
 *
 * Se copian en vez de depender del paquete: son unos pocos kilobytes frente
 * a más de 3000 iconos de los que se usan veinte. Para regenerarlo, ver
 * scripts/gen-tech-icons.mjs.
 *
 * GENERADO — no editar a mano.
 */

const PATHS: Record<string, { title: string; path: string }> = {
${entradas}
};

/**
 * Los nombres del contenido son descriptivos, no identificadores, así que se
 * resuelven por patrón. El orden importa: gana el primero que encaje, y por
 * eso "Vitest" va antes que "Vite", que si no se lo comería.
 */
const REGLAS: [RegExp, string][] = [
${REGLAS.map(([re, slug]) => `  [${re}, ${JSON.stringify(slug)}],`).join("\n")}
];

/** El logo de una tecnología, o null si no tiene uno propio. */
export function techIcon(name: string) {
  const slug = REGLAS.find(([re]) => re.test(name))?.[1];
  return (slug && PATHS[slug]) || null;
}
`,
);

console.log("iconos extraídos:", usados.size);
console.log("sin icono propio:", sinIcono.join(", ") || "ninguno");
