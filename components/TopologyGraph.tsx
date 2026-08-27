"use client";

import { useState } from "react";
import Link from "next/link";
import type { TopologyEdge, TopologyNode } from "@/content/topology";

type Props = {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  /** Nodo mostrado en la barra lateral antes de que el usuario toque nada. */
  defaultSlug?: string;
};

type Point = { x: number; y: number };

/**
 * Reparto en círculo. Con siete nodos y aristas densas, cualquier layout
 * con física necesitaría JS corriendo en bucle; en círculo la geometría
 * sale de una fórmula y el grafo es idéntico en servidor y en cliente.
 */
function layout(nodes: TopologyNode[]): Map<string, Point> {
  const positions = new Map<string, Point>();
  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    positions.set(node.slug, {
      x: 50 + 37 * Math.cos(angle),
      y: 50 + 38 * Math.sin(angle),
    });
  });
  return positions;
}

/**
 * Grafo de proyectos conectados por tecnología compartida.
 *
 * Estático: no hay animación ninguna (eso es la Fase 4). Lo único que
 * cambia con el hover o el foco es qué nodo está aislado, y el detalle no
 * vive en un tooltip sino en la barra lateral, que se lee igual con
 * teclado y con lector de pantalla.
 */
export function TopologyGraph({ nodes, edges, defaultSlug }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const positions = layout(nodes);
  const byslug = new Map(nodes.map((n) => [n.slug, n]));

  // El grosor de cada arista es el número real de tecnologías compartidas,
  // no un valor fijo: una arista gruesa significa stack repetido a
  // propósito, no un adorno.
  const maxShared = Math.max(...edges.map((e) => e.techs.length), 1);
  const grosor = (e: TopologyEdge) => 0.15 + (e.techs.length / maxShared) * 0.55;

  const selectedSlug = active ?? defaultSlug ?? nodes[0]?.slug;
  const selected = byslug.get(selectedSlug);
  const selectedEdges = edges.filter((e) => e.a === selectedSlug || e.b === selectedSlug);

  // Al salir de un nodo solo se limpia si el que sale es el que estaba
  // marcado: si no, mover el ratón entre dos nodos apagaría el que acaba
  // de entrar.
  const clearIfSelf = (slug: string) => (current: string | null) =>
    current === slug ? null : current;

  return (
    <div className="topo-panel">
      <div className="relative min-h-0 min-w-0 p-3.5">
        {/* Alto fijo en móvil: el panel no tiene altura propia hasta `lg`,
            y sin esto el área del grafo colapsaría a cero. */}
        <div className="relative h-[380px] w-full lg:h-full">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            {edges.map((edge) => {
              const p1 = positions.get(edge.a);
              const p2 = positions.get(edge.b);
              if (!p1 || !p2) return null;
              const on = selectedSlug === edge.a || selectedSlug === edge.b;
              const width = grosor(edge);
              return (
                <g key={`${edge.a}-${edge.b}`}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={on ? "var(--accent)" : "var(--border-strong)"}
                    strokeWidth={width}
                    strokeOpacity={on ? 0.9 : 0.55}
                    vectorEffect="non-scaling-stroke"
                    className="edge-line"
                  />
                  {/* La corriente de datos entre dos proyectos: solo se ve
                      en la arista activa, no como adorno permanente. */}
                  {on && (
                    <line
                      className="edge-flow"
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke="var(--ink)"
                      strokeWidth={0.6}
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => {
            const p = positions.get(node.slug)!;
            return (
              <Link
                key={node.slug}
                href={`/proyectos/${node.slug}`}
                data-active={node.slug === selectedSlug}
                onMouseEnter={() => setActive(node.slug)}
                onMouseLeave={() => setActive(clearIfSelf(node.slug))}
                onFocus={() => setActive(node.slug)}
                onBlur={() => setActive(clearIfSelf(node.slug))}
                className="topology-node text-mono-data"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                {node.label}
              </Link>
            );
          })}
        </div>
      </div>

      <aside className="topo-side" aria-live="polite">
        <div className="mb-4 flex items-center gap-2.5">
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span className="text-mono-meta text-ink-meta uppercase">nodo seleccionado</span>
        </div>

        {selected && (
          <>
            <p className="text-xl leading-tight font-bold text-ink">{selected.label}</p>
            <p className="text-mono-data mt-1.5 text-accent">{selected.slug}</p>
            <p className="text-body-sm mt-3 line-clamp-2 text-ink-soft">{selected.tagline}</p>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-lg border border-line p-3">
                <p className="font-mono text-lg leading-none font-medium text-ink tabular-nums">
                  {selectedEdges.length}
                </p>
                <p className="text-mono-meta mt-1.5 text-ink-meta uppercase">aristas</p>
              </div>
              <div className="rounded-lg border border-line p-3">
                <p className="font-mono text-lg leading-none font-medium text-ink tabular-nums">
                  {selected.techCount}
                </p>
                <p className="text-mono-meta mt-1.5 text-ink-meta uppercase">tecnologías</p>
              </div>
            </div>

            <p className="text-mono-meta mt-4 mb-1.5 text-ink-meta uppercase">
              stack compartido con
            </p>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {selectedEdges.length > 0 ? (
                <ul>
                  {selectedEdges.map((edge) => {
                    const other = edge.a === selectedSlug ? edge.b : edge.a;
                    // Dos nombres y el resto contado: con cuatro o cinco, la
                    // columna de tecnologías se come el nombre del proyecto,
                    // que es lo que identifica la fila.
                    const visibles = edge.techs.slice(0, 2);
                    const extra = edge.techs.length - visibles.length;
                    return (
                      <li
                        key={other}
                        className="flex items-baseline justify-between gap-3 border-b border-[var(--bg-raised)] py-2"
                      >
                        <span className="min-w-0 truncate text-[13px] font-semibold text-ink">
                          {byslug.get(other)?.label}
                        </span>
                        <span className="text-mono-meta shrink-0 text-accent normal-case">
                          {visibles.join(" · ")}
                          {extra > 0 && <span className="text-ink-meta"> +{extra}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-mono-data rounded-lg border border-dashed border-line-strong p-3.5 leading-relaxed text-ink-meta">
                  nodo aislado · vainilla, sin dependencias que compartir con nadie
                </p>
              )}
            </div>

            <p className="text-mono-meta mt-3.5 shrink-0 text-ink-meta">
              foco o ratón para aislar · click para abrir el caso
            </p>
          </>
        )}
      </aside>
    </div>
  );
}
