type IconProps = {
  /** Dirección en la que se desplaza al hacer hover sobre el enlace padre. */
  slide?: "right" | "left" | "up-right" | "down";
  className?: string;
};

/**
 * Iconos como SVG en línea, no como caracteres de texto.
 *
 * Las flechas tipográficas (→ ↗ ↓) en una monoespaciada ocupan el ancho de
 * una celda entera y quedan estiradas y desalineadas respecto al texto.
 * Un SVG dimensionado en `em` acompaña a la tipografía sin deformarse.
 */
function Svg({ children, slide, className = "" }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-icon={slide}
      className={`inline-block h-[1em] w-[1em] shrink-0 ${className}`}
    >
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Svg slide="right" {...props}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </Svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <Svg slide="left" {...props}>
      <path d="M13 8H3M7 4L3 8l4 4" />
    </Svg>
  );
}

/** Enlace que abre fuera del sitio. */
export function ArrowUpRight(props: IconProps) {
  return (
    <Svg slide="up-right" {...props}>
      <path d="M5 11L11 5M6 5h5v5" />
    </Svg>
  );
}

/** Descarga. */
export function ArrowDown(props: IconProps) {
  return (
    <Svg slide="down" {...props}>
      <path d="M8 3v10M4 9l4 4 4-4" />
    </Svg>
  );
}

export function Play(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 3.5l7 4.5-7 4.5z" fill="currentColor" strokeWidth="1" />
    </Svg>
  );
}
