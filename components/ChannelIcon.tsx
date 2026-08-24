type Props = {
  name: ChannelIconName;
  className?: string;
};

export type ChannelIconName = "email" | "github" | "linkedin" | "cv";

/**
 * Glifo de cada canal de contacto.
 *
 * Solo GitHub tiene marca propia aquí, sacada de simple-icons igual que los
 * logos del stack. LinkedIn ya no está en ese paquete, y dibujar su "in" a
 * mano sería reproducir una marca registrada sin motivo: los otros tres son
 * glifos de trazo genéricos —sobre, tarjeta y documento— que dicen lo mismo
 * sin suplantar a nadie.
 */
export function ChannelIcon({ name, className = "" }: Props) {
  if (name === "github") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className={`shrink-0 ${className}`}
      >
        <path d={GITHUB} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      {TRAZOS[name]}
    </svg>
  );
}

const GITHUB =
  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";

const TRAZOS: Record<Exclude<ChannelIconName, "github">, React.ReactNode> = {
  // Sobre: caja y solapa.
  email: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </>
  ),
  // Tarjeta con una silueta: es una ficha de persona, no el logo.
  linkedin: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <circle cx="8.5" cy="10.5" r="2.25" />
      <path d="M5 16.5c.6-1.7 1.9-2.6 3.5-2.6s2.9.9 3.5 2.6" />
      <path d="M15 9.75h4M15 13h4" />
    </>
  ),
  // Documento con la esquina doblada.
  cv: (
    <>
      <path d="M14 2.75H7A2.25 2.25 0 0 0 4.75 5v14A2.25 2.25 0 0 0 7 21.25h10A2.25 2.25 0 0 0 19.25 19V8Z" />
      <path d="M14 2.75V8h5.25" />
      <path d="M8.5 13.5h7M8.5 17h4.5" />
    </>
  ),
};
