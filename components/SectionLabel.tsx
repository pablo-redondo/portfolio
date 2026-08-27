import type { ReactNode } from "react";
import { Typewriter } from "@/components/Typewriter";

type Props = {
  children: string;
  /**
   * Acción alineada a la derecha del comando, en la misma línea — el
   * "ver los siete" que el sistema de diseño pone junto a `ls proyectos/`.
   */
  action?: ReactNode;
};

/**
 * Etiqueta de sección con forma de comando: el `$` en acento y el resto en
 * --ink-meta. Sin regla debajo: en el sistema de diseño la etiqueta va
 * suelta y es el margen de 26px lo que la separa de lo que sigue.
 *
 * El marcador [data-hop] ancla el nodo de la traza vertical a esta fila,
 * 34px a la izquierda — dentro del carril que reserva <Container rail>.
 */
export function SectionLabel({ children, action }: Props) {
  return (
    <div className="relative mb-[26px] flex items-center gap-2.5">
      <span
        data-hop
        aria-hidden
        className="absolute left-[-34px] top-1/2 z-[3] h-6 w-6 -translate-y-1/2 cursor-pointer rounded-full"
      />
      <p className="text-mono-cmd text-ink-meta">
        <span className="text-accent">$</span> <Typewriter text={children} />
      </p>
      {action && <div className="ml-auto shrink-0">{action}</div>}
    </div>
  );
}
