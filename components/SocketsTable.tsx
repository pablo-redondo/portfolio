export type Socket = {
  nombre: string;
  socket: string;
  destino: string;
  href?: string;
  /** Protocolo o dato real (tamaño de fichero, p. ej.) — no un tiempo de
      respuesta inventado. */
  dato: string;
  accion: string;
};

/**
 * «Canales a la escucha», como la salida de `ss -ltn`: un socket real por
 * fila. Todas están «up» — son enlaces estáticos, no servicios que puedan
 * caerse — así que el estado no es la parte interesante; lo es a dónde
 * lleva cada uno.
 */
export function SocketsTable({ sockets }: { sockets: Socket[] }) {
  return (
    <div className="status-table">
      <div className="status-head">
        <div className="sockets-grid !p-0">
          <span className="text-mono-meta text-ink-meta uppercase">estado</span>
          <span className="sockets-socket text-mono-meta text-ink-meta uppercase">socket</span>
          <span className="text-mono-meta text-ink-meta uppercase">destino</span>
          <span className="sockets-dato text-mono-meta text-right text-ink-meta uppercase">
            dato
          </span>
          <span className="text-mono-meta text-right text-ink-meta uppercase">acción</span>
        </div>
      </div>

      {sockets.map((s) => (
        <a
          key={s.nombre}
          href={s.href}
          className="status-row sockets-grid"
          {...(s.href?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          <span className="flex items-center gap-2 text-ok">
            <span aria-hidden className="pulse-dot h-1.5 w-1.5 rounded-full bg-current" />
            <span className="text-mono-meta normal-case">up</span>
          </span>
          <span className="sockets-socket text-mono-data text-ink-meta">{s.socket}</span>
          <span className="min-w-0 truncate font-semibold text-ink">{s.destino}</span>
          <span className="sockets-dato text-mono-data text-right text-ink-meta">{s.dato}</span>
          <span className="text-mono-cmd text-right text-accent">{s.accion}</span>
        </a>
      ))}
    </div>
  );
}
