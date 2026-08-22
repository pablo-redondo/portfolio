/**
 * Captura cada despliegue real y guarda el PNG en public/screenshots/.
 *
 * Se ejecuta en CI (.github/workflows/screenshots.yml), nunca en el build:
 * el build no puede depender de que seis sitios ajenos estén levantados.
 *
 * Las URLs salen de content/projects, que es la única fuente de verdad; por
 * eso el script es TypeScript y se ejecuta con tsx, en vez de mantener una
 * segunda lista que se desincronizaría.
 */

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { projects } from "../content/projects";

const OUT_DIR = join(process.cwd(), "public", "screenshots");
const VIEWPORT = { width: 1440, height: 900 };
const NAV_TIMEOUT_MS = 45_000;
/** Margen para los backends que duermen (Fly.io, Render) y para las fuentes. */
const SETTLE_MS = 6_000;

const targets = projects
  .filter((project) => project.demoUrl)
  .map((project) => ({ slug: project.slug, url: project.demoUrl as string }));

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  colorScheme: "dark",
  // Identificable, igual que la comprobación de estado: quien mire sus
  // logs y se pregunte quién le está dando la lata puede saberlo.
  userAgent:
    "Mozilla/5.0 (compatible; pablo-redondo.dev screenshot bot; +https://pablo-redondo.dev)",
});

let failed = 0;
console.log(`Capturando ${targets.length} despliegues…`);

for (const target of targets) {
  const page = await context.newPage();
  try {
    await page.goto(target.url, { waitUntil: "networkidle", timeout: NAV_TIMEOUT_MS });
    await page.waitForTimeout(SETTLE_MS);
    const buffer = await page.screenshot({ type: "png" });
    await writeFile(join(OUT_DIR, `${target.slug}.png`), buffer);
    console.log(`  ✓ ${target.slug}`);
  } catch (error) {
    failed += 1;
    const message = error instanceof Error ? error.message.split("\n")[0] : String(error);
    console.warn(`  ✗ ${target.slug}: ${message}`);
  } finally {
    await page.close();
  }
}

await browser.close();

console.log(
  failed === 0
    ? "Todas las capturas actualizadas."
    : `${targets.length - failed}/${targets.length} actualizadas; ${failed} conservan la anterior.`,
);

// Un despliegue caído no debe poner el workflow en rojo: se conserva su
// captura anterior. Solo falla si no respondió absolutamente ninguno, que
// ya indica un problema real (red del runner, o todo caído a la vez).
if (targets.length > 0 && failed === targets.length) {
  console.error("Ningún despliegue respondió.");
  process.exit(1);
}
