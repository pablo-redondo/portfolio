/** Fragmento de código real, sobre --bg-raised, en mono. */
export function CodeBlock({ file, code }: { file?: string; code: string }) {
  return (
    <div className="data-block overflow-x-auto">
      {file && <p className="text-mono-meta mb-3 text-ink-meta">{file}</p>}
      <pre className="text-[12.5px] leading-relaxed whitespace-pre text-ink-body">{code}</pre>
    </div>
  );
}
