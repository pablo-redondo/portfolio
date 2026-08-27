"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project, TechCategory } from "@/content/types";
import type { ServiceStatus } from "@/app/api/status/route";
import { TechIcon } from "@/components/TechIcon";
import { techIcon } from "@/content/tech-icons";
import { useDeploymentStatus } from "@/hooks/useDeploymentStatus";

const CATEGORY_ORDER: TechCategory[] = ["frontend", "backend", "infra", "tooling"];

const ESTADO_LABEL: Record<ServiceStatus["state"], string> = {
  up: "operativo",
  down: "sin respuesta",
  unknown: "desconocido",
};

const ESTADO_TONE: Record<ServiceStatus["state"], string> = {
  up: "text-ok",
  down: "text-crit",
  unknown: "text-ink-faint",
};

const FASES: { key: keyof NonNullable<ServiceStatus["phases"]>; label: string }[] = [
  { key: "dns", label: "dns" },
  { key: "tcp", label: "tcp" },
  { key: "tls", label: "tls" },
  { key: "ttfb", label: "ttfb" },
];

function host(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/** Iniciales como respaldo cuando la tecnología no tiene logo propio. */
function monograma(name: string) {
  return name.slice(0, 2);
}

function Waterfall({ phases }: { phases: ServiceStatus["phases"] }) {
  const max = phases ? Math.max(phases.dns, phases.tcp, phases.tls, phases.ttfb, 1) : 1;
  return (
    <div className="flex flex-col gap-3">
      {FASES.map((fase) => {
        const value = phases?.[fase.key] ?? 0;
        const pct = phases ? Math.max(4, (value / max) * 100) : 0;
        return (
          <div key={fase.key} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-mono-cmd text-ink-meta">{fase.label}</span>
              <span className="text-mono-data text-ink tabular-nums">
                {phases ? `${Math.round(value)} ms` : "—"}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DependencyTree({ project }: { project: Project }) {
  if (project.stack.length === 0) {
    return <p className="text-mono-data text-ink-faint">sin dependencias</p>;
  }

  const grupos = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: project.stack.filter((t) => t.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="text-mono-data flex flex-col gap-2.5">
      <p className="text-ink">{project.slug}</p>
      {grupos.map((g) => (
        <div key={g.cat}>
          <p className="text-ink-meta">
            ├─ {g.cat}/ <span className="text-ink-faint">{g.items.length}</span>
          </p>
          {g.items.map((t, i) => (
            <p key={t.name} className="flex items-center gap-1.5 pl-4 text-ink-soft">
              <span className="text-ink-meta">{i === g.items.length - 1 ? "└─" : "├─"}</span>
              <TechIcon name={t.name} className="h-3 w-3" />
              {!techIcon(t.name) && (
                <span className="text-ink-faint text-[10px]">{monograma(t.name)}</span>
              )}
              {t.name}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

function ExpandedPanel({ project, service }: { project: Project; service: ServiceStatus | undefined }) {
  return (
    <div className="border-t border-line px-5 pt-5 pb-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px_260px]">
        <div>
          <p className="text-mono-meta text-ink-meta mb-2.5 uppercase">stdout</p>
          <p className="text-sm leading-relaxed text-ink-soft">{project.tagline}</p>
        </div>
        <div>
          <p className="text-mono-meta text-ink-meta mb-2.5 uppercase">
            traza de la petición
          </p>
          <Waterfall phases={service?.phases ?? null} />
        </div>
        <div>
          <p className="text-mono-meta text-ink-meta mb-2.5 uppercase">
            árbol de dependencias
          </p>
          <DependencyTree project={project} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
        {project.demoUrl && (
          <span className="text-mono-meta text-ink-meta">host: {host(project.demoUrl)}</span>
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          <Link href={`/proyectos/${project.slug}`} className="btn btn-sm btn-primary">
            Abrir caso de estudio
          </Link>
          {project.repos.map((repo) => (
            <a
              key={repo.url}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-secondary"
            >
              {repo.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function Fila({
  project,
  service,
  loading,
  open,
  onToggle,
}: {
  project: Project;
  service: ServiceStatus | undefined;
  loading: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const estado = service?.state ?? "unknown";

  return (
    <div className={`surface-card rounded-xl transition-colors ${open ? "border-accent/50" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="font-mono text-base font-bold text-ink">{project.title}</span>
            <span className="text-mono-meta text-ink-meta">{project.tags[0]}</span>
          </div>
          <p className="mt-1 truncate text-sm text-ink-soft">{project.tagline}</p>
        </div>

        <span className="text-mono-data hidden shrink-0 text-right text-ink tabular-nums sm:block">
          {loading ? "…" : service?.latencyMs != null ? `${service.latencyMs} ms` : "—"}
        </span>

        <span
          className={`flex shrink-0 items-center gap-1.5 font-mono text-[11px] whitespace-nowrap ${
            loading ? "text-ink-faint" : ESTADO_TONE[estado]
          }`}
        >
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {loading ? "comprobando…" : ESTADO_LABEL[estado]}
        </span>

        <span
          aria-hidden
          className={`shrink-0 text-ink-meta transition-transform ${open ? "rotate-90" : ""}`}
        >
          ›
        </span>
      </button>

      {open && <ExpandedPanel project={project} service={service} />}
    </div>
  );
}

export function ProjectMonitorList({ projects }: { projects: Project[] }) {
  const { state, services } = useDeploymentStatus();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {projects.map((project) => (
        <Fila
          key={project.slug}
          project={project}
          service={services.find((s) => s.slug === project.slug)}
          loading={state === "loading"}
          open={openSlug === project.slug}
          onToggle={() => setOpenSlug((cur) => (cur === project.slug ? null : project.slug))}
        />
      ))}
    </div>
  );
}
