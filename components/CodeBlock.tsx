import { TerminalWindow } from "@/components/TerminalWindow";

/** Fragmento de código real, sobre --bg-raised, en mono. */
export function CodeBlock({ file, code }: { file?: string; code: string }) {
  return (
    <TerminalWindow title={file ?? "snippet"}>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed whitespace-pre text-ink-body">
        {code}
      </pre>
    </TerminalWindow>
  );
}
