import type { ProjectStatus } from "@/content/types";

// Mismo vocabulario que el monitor de despliegues (`operativo` / `sin
// respuesta`): un servicio en pie se llama igual en las dos piezas.
const LABELS: Record<ProjectStatus, string> = {
  live: "operativo",
  "in-progress": "en curso",
  archived: "archivado",
};

const TONES: Record<ProjectStatus, string> = {
  live: "text-ok",
  "in-progress": "text-warn",
  archived: "text-ink-faint",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] whitespace-nowrap ${TONES[status]}`}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full bg-current"
      />
      {LABELS[status]}
    </span>
  );
}
