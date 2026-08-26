import type { ReactNode } from "react";

type Props = {
  children: string;
  /**
   * Acción alineada a la derecha del comando, en la misma línea — el
   * "ver los siete" que el sistema de diseño pone junto a `ls proyectos/`.
   */
  action?: ReactNode;
};

/**
 * Etiqueta de sección con forma de comando: el `$` en acento, el resto en
 * --ink-meta, y una línea que la separa del titular que sigue.
 */
export function SectionLabel({ children, action }: Props) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-3">
        <p className="text-mono-cmd text-ink-meta">
          <span className="text-accent">$</span> {children}
        </p>
        {action && <div className="ml-auto shrink-0">{action}</div>}
      </div>
      <span className="divider mt-3 block" aria-hidden />
    </div>
  );
}
