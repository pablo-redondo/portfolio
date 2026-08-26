"use client";

import { useState } from "react";
import type { TimelinePhase } from "@/content/types";

/**
 * Las fases de desarrollo como pestañas horizontales, con el detalle de la
 * activa debajo. Estático en el sentido de la Fase 3 — el cambio de
 * pestaña es un cambio de estado, no una animación — sin transform ni
 * transición de tamaño en ningún punto.
 */
export function PhaseTabs({ phases }: { phases: TimelinePhase[] }) {
  const sorted = phases.slice().sort((a, b) => a.order - b.order);
  const [active, setActive] = useState(sorted[0]?.order);
  const phase = sorted.find((p) => p.order === active) ?? sorted[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Fases de desarrollo"
        className="-mx-1 flex gap-5 overflow-x-auto border-b border-line px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sorted.map((p) => (
          <button
            key={p.order}
            type="button"
            role="tab"
            id={`fase-tab-${p.order}`}
            aria-selected={p.order === phase.order}
            aria-controls={`fase-panel-${p.order}`}
            onClick={() => setActive(p.order)}
            className="phase-tab shrink-0"
          >
            <span className="text-mono-meta block text-ink-meta normal-case">
              {String(p.order).padStart(2, "0")}
            </span>
            <span className="text-mono-cmd mt-0.5 block font-medium">{p.label}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`fase-panel-${phase.order}`}
        aria-labelledby={`fase-tab-${phase.order}`}
        className="surface-card mt-6 p-6 sm:p-7"
      >
        <p className="text-mono-meta text-ink-meta uppercase">
          fase {phase.order} de {sorted.length}
        </p>
        <h3 className="mt-2 text-lg font-bold text-ink">{phase.label}</h3>
        <p className="text-body-sm mt-1.5 text-ink-soft">{phase.summary}</p>
        <p className="mt-4 max-w-[65ch] leading-relaxed text-ink-soft">{phase.detail}</p>

        {phase.commitRange && (
          <p className="phase-commits mt-4">
            <span className="text-ink-faint">commits</span>
            <span className="text-ink">{phase.commitRange}</span>
          </p>
        )}
      </div>
    </div>
  );
}
