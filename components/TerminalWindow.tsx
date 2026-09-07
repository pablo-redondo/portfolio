import type { ReactNode } from "react";

type Props = {
  /** Lo que va centrado en la barra, tipo "comando — contexto". */
  title: string;
  children: ReactNode;
  className?: string;
};

/**
 * El marco de ventana de terminal (`.win`) del sistema de diseño — barra de
 * título con los tres puntos y cuerpo hundido — extraído a un componente
 * en vez de repetir el marcado en cada sitio que lo usa. RequestTrace,
 * WhoisCard y TechRankBar ya lo llevaban por separado, cada uno con su
 * propia copia de la barra.
 */
export function TerminalWindow({ title, children, className }: Props) {
  return (
    <div className={`win${className ? ` ${className}` : ""}`}>
      <div className="win-bar">
        <div className="win-dots" aria-hidden>
          <span className="win-dot" />
          <span className="win-dot" />
          <span className="win-dot" />
        </div>
        <span className="win-title">{title}</span>
        <span />
      </div>

      {children}
    </div>
  );
}
