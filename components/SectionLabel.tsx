import type { CSSProperties } from "react";

type Props = {
  children: string;
  /** Solo para el hero del home: el comando se escribe una vez al cargar. */
  typed?: boolean;
};

export function SectionLabel({ children, typed = false }: Props) {
  return (
    <p
      className="mb-3 font-mono text-xs tracking-wide text-ink-faint"
      // En monoespaciada 1ch es exactamente un carácter, así que el mismo
      // número sirve para los steps del tecleo y para el viaje del cursor.
      style={typed ? ({ "--type-steps": children.length } as CSSProperties) : undefined}
    >
      <span className="text-accent">$</span>{" "}
      {typed ? (
        <>
          <span className="type-in">{children}</span>
          <span className="type-cursor" aria-hidden />
        </>
      ) : (
        children
      )}
    </p>
  );
}
