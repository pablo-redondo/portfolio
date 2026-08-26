"use client";

import { useState } from "react";
import Link from "next/link";
import type { TopologyEdge, TopologyNode } from "@/content/topology";

type Props = {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
};

type Point = { x: number; y: number };

function layout(nodes: TopologyNode[]): Map<string, Point> {
  const positions = new Map<string, Point>();
  const radius = 40;
  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    positions.set(node.slug, {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    });
  });
  return positions;
}

/**
 * Grafo estático (sin animación: eso es la Fase 4) de proyectos conectados
 * por tecnología compartida. El único estado es qué nodo tiene el foco o el
 * puntero encima, para resaltar sus aristas y listar qué comparte — nada se
 * anima ni cambia de tamaño.
 */
export function TopologyGraph({ nodes, edges }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const positions = layout(nodes);
  const labelBySlug = new Map(nodes.map((n) => [n.slug, n.label]));

  const activeEdges = active ? edges.filter((e) => e.a === active || e.b === active) : [];

  const clearIfSelf = (slug: string) => (current: string | null) =>
    current === slug ? null : current;

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-xl">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--border)"
            strokeWidth="0.25"
            strokeDasharray="1.5 2"
          />
          {edges.map((edge) => {
            const p1 = positions.get(edge.a);
            const p2 = positions.get(edge.b);
            if (!p1 || !p2) return null;
            const isActive = active === edge.a || active === edge.b;
            return (
              <line
                key={`${edge.a}-${edge.b}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isActive ? "var(--accent)" : "var(--border-strong)"}
                strokeWidth={isActive ? 0.6 : 0.3}
              />
            );
          })}
        </svg>

        {nodes.map((node) => {
          const p = positions.get(node.slug)!;
          return (
            <Link
              key={node.slug}
              href={`/proyectos/${node.slug}`}
              onMouseEnter={() => setActive(node.slug)}
              onMouseLeave={() => setActive(clearIfSelf(node.slug))}
              onFocus={() => setActive(node.slug)}
              onBlur={() => setActive(clearIfSelf(node.slug))}
              className="topology-node text-mono-data absolute w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line-strong bg-surface-2 px-2.5 py-2 text-center text-ink-soft"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {node.label}
            </Link>
          );
        })}
      </div>

      <div className="surface-panel mx-auto mt-8 max-w-xl p-4" aria-live="polite">
        {active ? (
          activeEdges.length > 0 ? (
            <>
              <p className="text-mono-meta text-ink-meta uppercase">
                {labelBySlug.get(active)} comparte con
              </p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {activeEdges.map((edge) => {
                  const other = edge.a === active ? edge.b : edge.a;
                  return (
                    <li key={other} className="text-body-sm text-ink-soft">
                      <span className="text-ink">{labelBySlug.get(other)}</span>
                      {" — "}
                      {edge.techs.join(", ")}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="text-body-sm text-ink-faint">
              {labelBySlug.get(active)} no comparte tecnología de stack con el resto — todavía
              es el único punto suelto del grafo.
            </p>
          )
        ) : (
          <p className="text-body-sm text-ink-faint">
            Pasa el ratón o el foco por un proyecto para ver qué tecnología comparte con los
            demás.
          </p>
        )}
      </div>
    </div>
  );
}
