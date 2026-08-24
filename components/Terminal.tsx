import type { CSSProperties, ReactNode } from "react";

export type TerminalLine = {
  /** Lo que se teclea después del prompt. */
  command: string;
  /** Lo que "responde" el comando. */
  output: ReactNode;
  /**
   * Ya impreso al llegar, sin teclearse ni entrar con animación. Para el
   * primer bloque: es el que contiene el <h1>, y una animación que arranca
   * en opacidad cero deja fuera al elemento del LCP, que Chrome no cuenta
   * mientras es invisible.
   */
  instant?: boolean;
};

/** Milisegundos por carácter tecleado. */
const POR_CARACTER = 18;
/** Pausa entre que termina de teclearse un comando y sale su respuesta. */
const ANTES_DE_RESPONDER = 90;
/** Pausa entre una respuesta y el comando siguiente. */
const ENTRE_BLOQUES = 110;

type Props = {
  /** Título de la barra de la ventana. */
  title: string;
  lines: TerminalLine[];
  /** Va al final de la sesión, cuando ya ha terminado de escribirse. */
  children?: ReactNode;
};

/**
 * Sesión de terminal. En /contacto no es un adorno dentro de la página: es
 * la página.
 *
 * Cada comando se teclea con el mismo mecanismo que las etiquetas de
 * sección (`--type-steps` + `steps()` sobre un clip-path) y su respuesta
 * entra después. Los retardos se acumulan aquí en vez de repartirse con
 * `nth-child`: las líneas no miden lo mismo, así que una cadencia fija
 * dejaría unas escribiéndose sobre otras.
 *
 * Sin JavaScript todo queda impreso desde el principio, que es justo lo que
 * tiene que pasar: el contenido son enlaces de verdad, no salida simulada.
 */
export function Terminal({ title, lines, children }: Props) {
  const conTiempos = lines.reduce<
    {
      linea: TerminalLine;
      tecleo: number;
      inicio: number;
      respuesta: number;
    }[]
  >((acc, linea) => {
    const anterior = acc[acc.length - 1];
    const inicio = anterior ? anterior.respuesta + ENTRE_BLOQUES : 0;
    const tecleo = linea.instant ? 0 : linea.command.length * POR_CARACTER;
    const respuesta = linea.instant
      ? inicio
      : inicio + tecleo + ANTES_DE_RESPONDER;
    return [...acc, { linea, tecleo, inicio, respuesta }];
  }, []);

  const total = conTiempos[conTiempos.length - 1]?.respuesta ?? 0;

  return (
    <div className="terminal">
      {/* Barra de la ventana. Decorativa: no hay nada que leer en ella. */}
      <div className="terminal-bar" aria-hidden>
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-title">{title}</span>
      </div>

      <div className="terminal-body">
        <dl>
          {conTiempos.map(({ linea, tecleo, inicio, respuesta }) => (
            <div key={linea.command} className="terminal-block">
              <dt
                className="terminal-cmd"
                style={
                  {
                    "--type-steps": linea.command.length,
                    "--type-dur": `${tecleo}ms`,
                    "--type-delay": `${inicio}ms`,
                  } as CSSProperties
                }
              >
                <span className="terminal-prompt" aria-hidden>
                  $
                </span>{" "}
                <span className={linea.instant ? "" : "type-in type-timed"}>
                  {linea.command}
                </span>
              </dt>
              <dd
                className={linea.instant ? "terminal-out" : "terminal-out terminal-out-anim"}
                style={{ "--type-delay": `${respuesta}ms` } as CSSProperties}
              >
                {linea.output}
              </dd>
            </div>
          ))}
        </dl>

        {children && (
          <div
            className="terminal-block terminal-hueco terminal-out-anim"
            style={
              { "--type-delay": `${total + ENTRE_BLOQUES}ms` } as CSSProperties
            }
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
