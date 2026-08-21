export function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-3 font-mono text-xs tracking-wide text-ink-faint">
      <span className="text-accent">$</span> {children}
    </p>
  );
}
