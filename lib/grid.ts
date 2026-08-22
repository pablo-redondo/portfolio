/**
 * Hace que el último elemento de una rejilla ocupe las columnas que
 * sobran, para que la última fila no quede con huecos sueltos.
 *
 * Con 5 elementos en 3 columnas: 3 + 2, y el último ocupa 2 → rectángulo.
 */
export function spanForLastInRow(index: number, total: number, columns: 2 | 3): string {
  if (index !== total - 1) return "";

  const remainder = total % columns;
  if (remainder === 0) return "";

  const missing = columns - remainder;
  if (missing === 1) return columns === 3 ? "lg:col-span-2" : "sm:col-span-2";
  if (missing === 2) return "lg:col-span-3";
  return "";
}
