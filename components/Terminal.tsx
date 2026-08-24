import type { CSSProperties, ReactNode } from "react";

export type TerminalLine = {
  /** Lo que se teclea después del prompt. */
  command: string;
  /** Lo que "responde" el comando. */
  output: ReactNode;
};

/** Milisegundos por carácter tecleado. */
const POR_CARACTER = 26;
/** Pausa entre que termina de teclearse un comando y sale su respuesta. */
const ANTES_DE_RESPONDER = 130;
/** Pausa entre una respuesta y el comando siguiente. */
const ENTRE_BLOQUES = 180;

/**
 * Bloque con forma de sesión de terminal.
 *
 * Cada comando se teclea con el mismo mecanismo que las etiquetas de
 * sección (`--type-steps` + `steps()` sobre un clip-path), y las respuestas
 * entran después. Los retardos se acumulan aquí en vez de repartirse con
 * `nth-child`: las líneas no miden lo mismo, así que una cadencia fija
 * dejaría unas escribiéndose sobre otras.
 *
 * Sin JavaScript: el envoltorio `Reveal` retiene la animación hasta que el
 * bloque entra en pantalla, y sin JS todo queda visible desde el principio.
 */
export function Terminal({ lines }: { lines: TerminalLine[] }) {
  const conTiempos = lines.reduce<
    {
      command: string;
      output: ReactNode;
      tecleo: number;
      inicio: number;
      respuesta: number;
    }[]
  >((acc, { command, output }) => {
    const anterior = acc[acc.length - 1];
    const inicio = anterior ? anterior.respuesta + ENTRE_BLOQUES : 0;
    const tecleo = command.length * POR_CARACTER;
    return [
      ...acc,
      { command, output, tecleo, inicio, respuesta: inicio + tecleo + ANTES_DE_RESPONDER },
    ];
  }, []);

  return (
    <div className="terminal">
      {/* Barra de la ventana. Decorativa: no hay nada que leer en ella. */}
      <div className="terminal-bar" aria-hidden>
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-title">pablo@galicia — ~/contacto</span>
      </div>

      <dl className="terminal-body">
        {conTiempos.map(({ command, output, tecleo, inicio, respuesta }) => (
          <div key={command} className="terminal-block">
            <dt
              className="terminal-cmd"
              style={
                {
                  "--type-steps": command.length,
                  "--type-dur": `${tecleo}ms`,
                  "--type-delay": `${inicio}ms`,
                } as CSSProperties
              }
            >
              <span className="text-accent">$</span>{" "}
              <span className="type-in type-timed">{command}</span>
            </dt>
            <dd
              className="terminal-out"
              style={{ "--type-delay": `${respuesta}ms` } as CSSProperties}
            >
              {output}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
