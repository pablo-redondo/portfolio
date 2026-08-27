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
    <div className={`monitor-row ${open ? "monitor-row-open" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-[22px] text-left sm:grid-cols-[minmax(0,1fr)_74px_104px_16px] sm:gap-[22px]"
      >
        <span className="flex min-w-0 flex-col gap-1.5">
          <span className="flex min-w-0 items-baseline gap-3">
            <span className="font-sans text-xl leading-tight font-bold text-ink">
              {project.title}
            </span>
            <span className="shrink-0 font-mono text-[11px] text-ink-meta">
              {project.tags[0]}
            </span>
          </span>
          <span className="truncate text-[15px] leading-normal text-ink-soft">
            {project.tagline}
          </span>
        </span>

        <span className="hidden text-right font-mono text-[13px] font-medium text-ink-soft tabular-nums sm:block">
          {loading ? "…" : service?.latencyMs != null ? `${service.latencyMs} ms` : "—"}
        </span>

        {/* Solo el punto lleva color: la etiqueta ya nombra el estado, así
            que teñirla también sería repetir el dato en dos sitios. */}
        <span className="flex items-center justify-end gap-[7px] font-mono text-[11px] whitespace-nowrap text-ink-meta">
          <span
            aria-hidden
            className={`inline-block h-1.5 w-1.5 rounded-full bg-current ${
              loading ? "text-ink-faint" : ESTADO_TONE[estado]
            }`}
          />
          {loading ? "comprobando…" : ESTADO_LABEL[estado]}
        </span>

        <span
          aria-hidden
          className={`hidden text-right font-mono text-[13px] text-ink-faint transition-transform sm:block ${
            open ? "rotate-90" : ""
          }`}
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
    <div className="flex flex-col gap-1.5">
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
