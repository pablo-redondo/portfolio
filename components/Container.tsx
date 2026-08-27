import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /**
   * "wide" para rejillas y cabeceras — aprovecha la pantalla en vez de
   * dejar márgenes muertos. "prose" para texto corrido, donde una línea
   * larga se lee peor.
   */
  size?: "wide" | "prose";
  /**
   * Reserva el carril izquierdo de 46px donde vive la traza vertical y los
   * nodos de sección. Sin él la señal se pintaría encima del texto en vez
   * de al lado. Solo las páginas que montan <SectionSpine> lo necesitan.
   */
  rail?: boolean;
  className?: string;
};

const WIDTHS = {
  wide: "max-w-[1160px]",
  prose: "max-w-[760px]",
};

export function Container({
  children,
  size = "wide",
  rail = false,
  className = "",
}: Props) {
  return (
    <div className={`mx-auto w-full ${WIDTHS[size]} px-5 sm:px-7 ${className}`}>
      <div className={rail ? "lg:pl-[46px]" : undefined}>{children}</div>
    </div>
  );
}
