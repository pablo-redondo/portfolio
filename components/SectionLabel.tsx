import type { CSSProperties } from "react";

type Props = {
  children: string;
};

/**
 * Etiqueta de sección con forma de prompt. Se teclea sola: en las que
 * están sobre el pliegue arranca al cargar, y en las que van dentro de un
 * <Reveal> el CSS retiene la animación hasta que el bloque entra en
 * pantalla, para que el usuario llegue a verla escribirse.
 */
export function SectionLabel({ children }: Props) {
  return (
    <p
      className="mb-3 font-mono text-xs tracking-wide text-ink-faint"
      // En monoespaciada 1ch es exactamente un carácter, así que el mismo
      // número sirve para los steps del tecleo y para el viaje del cursor.
      style={{ "--type-steps": children.length } as CSSProperties}
    >
      <span className="text-accent">$</span>{" "}
      <span className="type-in">{children}</span>
      <span className="type-cursor" aria-hidden />
    </p>
  );
}
