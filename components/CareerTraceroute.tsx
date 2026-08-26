export type TraceHop = {
  role: string;
  company: string;
  dates: string;
  /**
   * YYYY-MM, o `null` si solo se conoce el año (no hay mes real que dar
   * como preciso). `end: null` con `start` presente = en curso, se
   * calcula contra hoy.
   */
  start: string | null;
  end: string | null;
  detail: string;
};

function duracion(start: string | null, end: string | null): string | null {
  if (!start) return null;
  const [y1, m1] = start.split("-").map(Number);
  if (!y1 || !m1) return null;

  let y2: number;
  let m2: number;
  if (end) {
    const parts = end.split("-").map(Number);
    if (!parts[0] || !parts[1]) return null;
    [y2, m2] = parts;
  } else {
    const now = new Date();
    y2 = now.getFullYear();
    m2 = now.getMonth() + 1;
  }

  const meses = (y2 - y1) * 12 + (m2 - m1) + 1;
  if (meses <= 0) return null;

  const años = Math.floor(meses / 12);
  const resto = meses % 12;
  if (años === 0) return `${meses} m`;
  if (resto === 0) return `${años} a`;
  return `${años} a ${resto} m`;
}

/**
 * «Por dónde he pasado» como una traza: cada salto es un puesto, con su
 * host (empresa) y cuánto duró — calculado de verdad desde start/end, no
 * escrito a mano, así que no se desactualiza mientras el puesto actual
 * siga en curso.
 */
export function CareerTraceroute({ hops }: { hops: TraceHop[] }) {
  return (
    <div className="status-table">
      <div className="status-head">
        <div className="trace-grid !p-0">
          <span className="text-mono-meta text-ink-meta uppercase">hop</span>
          <span className="text-mono-meta text-ink-meta uppercase">puesto</span>
          <span className="trace-host text-mono-meta text-ink-meta uppercase">host</span>
          <span className="trace-window text-mono-meta text-ink-meta uppercase">ventana</span>
          <span className="text-mono-meta text-right text-ink-meta uppercase">tiempo</span>
        </div>
      </div>

      {hops.map((hop, i) => {
        const tiempo = duracion(hop.start, hop.end);
        return (
          <details key={`${hop.company}-${hop.dates}`} className="status-row" open={i === 0}>
            <summary className="trace-grid cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="text-mono-data text-ink-meta tabular-nums">{i + 1}</span>
              <span className="min-w-0">
                <span className="block truncate font-semibold text-ink">{hop.role}</span>
                {hop.start && !hop.end && (
                  <span className="text-mono-meta text-ok normal-case">actual</span>
                )}
              </span>
              <span className="trace-host text-mono-data min-w-0 truncate text-accent">
                {hop.company}
              </span>
              <span className="trace-window text-mono-data min-w-0 truncate text-ink-soft">
                {hop.dates}
              </span>
              <span className="text-mono-data text-right text-ink tabular-nums">
                {tiempo ?? "—"}
              </span>
            </summary>

            <div className="detail-in px-5 pb-4">
              <p className="max-w-[65ch] text-sm leading-relaxed text-ink-soft">{hop.detail}</p>
            </div>
          </details>
        );
      })}

      <p className="text-mono-meta px-5 py-3.5 text-ink-meta">
        destino alcanzado · desarrollo full-stack
      </p>
    </div>
  );
}
