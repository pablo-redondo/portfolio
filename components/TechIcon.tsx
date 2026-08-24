import { techIcon } from "@/content/tech-icons";

/**
 * Logo de una tecnología, en monocromo.
 *
 * `currentColor` y no el color de marca de cada una: veinte colores
 * distintos pelearían con la paleta del sitio y convertirían el stack en un
 * muestrario. Así el logo hereda el color del texto que acompaña.
 *
 * Decorativo: el nombre de la tecnología va escrito al lado, así que
 * `aria-hidden` para no repetirlo en el lector de pantalla.
 *
 * No todas tienen logo propio —Zustand, Playwright o localStorage no—. Con
 * `fallbackDot` se pinta un punto en su lugar, para que en una lista las
 * que sí lo tienen y las que no queden alineadas igual.
 */
export function TechIcon({
  name,
  className = "",
  fallbackDot = false,
}: {
  name: string;
  className?: string;
  fallbackDot?: boolean;
}) {
  const icono = techIcon(name);
  if (!icono) {
    return fallbackDot ? (
      <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-accent/50" />
    ) : null;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      <path d={icono.path} />
    </svg>
  );
}
