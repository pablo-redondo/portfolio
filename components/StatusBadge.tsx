import type { ProjectStatus } from "@/content/types";

const LABELS: Record<ProjectStatus, string> = {
  live: "live",
  "in-progress": "en progreso",
  archived: "archivado",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const color = status === "live" ? "text-teal" : status === "in-progress" ? "text-accent" : "text-ink-faint";
  return (
    <span className={`font-mono text-[11px] ${color}`}>
      ● {LABELS[status]}
    </span>
  );
}
