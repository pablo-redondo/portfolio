"use client";

import Link from "next/link";
import { useDeploymentStatus } from "@/hooks/useDeploymentStatus";
import { useNavigationTiming } from "@/hooks/useNavigationTiming";

/** «hace 5 s» / «hace 3 min»: lo real desde checkedAt, no un contador falso. */
function haceTiempo(iso: string): string {
  const segundos = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (segundos < 60) return `hace ${segundos} s`;
  const minutos = Math.round(segundos / 60);
  return `hace ${minutos} min`;
}

/**
 * Franja de cifras bajo el hero. Todas salen de datos reales ya presentes
 * en la página (el propio check de /api/status, la Navigation Timing de
 * esta carga): nada de uptime histórico, porque no hay ningún sitio donde
 * ese dato se esté guardando todavía.
 */
export function HeroStats() {
  const { state, services, checkedAt } = useDeploymentStatus();
  const timing = useNavigationTiming();

  const up = services.filter((s) => s.state === "up").length;

  return (
    <div className="flex flex-wrap items-center gap-x-9 gap-y-3 border-t border-line pt-5">
      <Stat k="servicios" v={state === "ready" ? `${up} / ${services.length} operativos` : "—"} />
      <Stat k="rtt" v={timing ? `${Math.round(timing.total)} ms` : "—"} />
      <Stat k="último check" v={checkedAt ? haceTiempo(checkedAt) : "—"} />
      <Link href="/proyectos" className="text-mono-cmd ml-auto text-ink-meta hover:text-accent">
        ir a ~/proyectos →
      </Link>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <span className="flex items-baseline gap-2.5">
      <span className="text-mono-meta text-ink-meta uppercase">{k}</span>
      <span className="text-mono-data text-ink tabular-nums">{v}</span>
    </span>
  );
}
