type Props = {
  children: string;
};

/**
 * Etiqueta de sección con forma de comando: el `$` en acento, el resto en
 * --ink-meta, y una línea que la separa del titular que sigue.
 */
export function SectionLabel({ children }: Props) {
  return (
    <div className="mb-3">
      <p className="text-mono-cmd text-ink-meta">
        <span className="text-accent">$</span> {children}
      </p>
      <span className="divider mt-3 block" aria-hidden />
    </div>
  );
}
