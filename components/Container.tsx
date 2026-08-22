import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /**
   * "wide" para rejillas y cabeceras — aprovecha la pantalla en vez de
   * dejar márgenes muertos. "prose" para texto corrido, donde una línea
   * larga se lee peor.
   */
  size?: "wide" | "prose";
  className?: string;
};

const WIDTHS = {
  wide: "max-w-[1180px]",
  prose: "max-w-[760px]",
};

export function Container({ children, size = "wide", className = "" }: Props) {
  return (
    <div className={`mx-auto w-full ${WIDTHS[size]} px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
