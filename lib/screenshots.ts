import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * ¿Existe ya la captura de este despliegue?
 *
 * Se resuelve en el servidor, al prerenderizar. Si no existe, el cliente ni
 * siquiera pide la imagen: una petición fallida a /_next/image deja un error
 * en consola aunque se oculte visualmente, y eso cuesta puntos de Lighthouse.
 *
 * El workflow de capturas las escribe aquí; hasta que corra por primera vez,
 * el marco de la demo se ve vacío, que es un estado válido.
 */
export function hasScreenshot(slug: string): boolean {
  return existsSync(join(process.cwd(), "public", "screenshots", `${slug}.png`));
}
