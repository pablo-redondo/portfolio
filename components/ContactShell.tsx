"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  email: string;
  github: string;
  linkedin?: string;
  cv?: string;
};

type Entrada = { id: number; comando: string; salida: ReactNode };

const AYUDA = [
  ["email", "escribir un correo"],
  ["copiar", "copiar la dirección al portapapeles"],
  ["github", "abrir el perfil de GitHub"],
  ["linkedin", "abrir LinkedIn"],
  ["cv", "descargar el CV en PDF"],
  ["proyectos", "ir a la página de proyectos"],
  ["clear", "limpiar lo escrito"],
];

/**
 * Prompt al final de la sesión, que acepta comandos de verdad.
 *
 * Es una capa de más, no la única forma de llegar a nada: los cuatro
 * canales están arriba como enlaces normales, que funcionan sin JavaScript
 * y con el teclado. Esto solo le da a quien tenga la curiosidad de probar
 * lo que espera encontrarse en una terminal.
 *
 * Se monta en el cliente, así que sin JavaScript no aparece un campo que no
 * haría nada.
 */
export function ContactShell({ email, github, linkedin, cv }: Props) {
  const router = useRouter();
  const [historial, setHistorial] = useState<Entrada[]>([]);
  const [valor, setValor] = useState("");
  const campo = useRef<HTMLInputElement>(null);
  const contador = useRef(0);

  // La sesión de arriba tarda un par de segundos en escribirse sola; el
  // prompt aparece cuando ha terminado, no antes.
  const [listo, setListo] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setListo(true), 100);
    return () => clearTimeout(id);
  }, []);

  const responder = async (crudo: string): Promise<ReactNode> => {
    const cmd = crudo.trim().toLowerCase();

    switch (cmd) {
      case "":
        return null;

      case "help":
      case "ayuda":
      case "?":
        return (
          <dl className="shell-help">
            {AYUDA.map(([nombre, que]) => (
              <div key={nombre}>
                <dt>{nombre}</dt>
                <dd>{que}</dd>
              </div>
            ))}
          </dl>
        );

      case "email":
      case "mail":
        window.location.href = `mailto:${email}`;
        return `abriendo el cliente de correo → ${email}`;

      case "copiar":
      case "copy":
        try {
          await navigator.clipboard.writeText(email);
          return `${email} copiado al portapapeles`;
        } catch {
          return `no he podido copiarlo: ${email}`;
        }

      case "github":
      case "gh":
        window.open(github, "_blank", "noopener,noreferrer");
        return `abriendo ${github}`;

      case "linkedin":
      case "in":
        if (!linkedin) return "todavía no hay LinkedIn que abrir";
        window.open(linkedin, "_blank", "noopener,noreferrer");
        return `abriendo ${linkedin}`;

      case "cv":
        if (!cv) return "todavía no hay CV que descargar";
        window.location.href = cv;
        return "descargando el CV";

      case "proyectos":
      case "ls":
        router.push("/proyectos");
        return "yendo a /proyectos";

      case "clear":
      case "cls":
        setHistorial([]);
        return null;

      case "sudo":
      case "sudo su":
        return "pablo no está en el fichero de sudoers. Se informará del incidente.";

      default:
        return (
          <span className="shell-error">
            comando no encontrado: {crudo.trim()} — prueba con{" "}
            <code>help</code>
          </span>
        );
    }
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const comando = valor;
    setValor("");
    const salida = await responder(comando);
    if (comando.trim().toLowerCase() === "clear") return;
    contador.current += 1;
    setHistorial((prev) => [
      ...prev,
      { id: contador.current, comando, salida },
    ]);
  };

  if (!listo) return null;

  return (
    <div className="shell" onClick={() => campo.current?.focus()}>
      {/* `aria-live`: la respuesta llega después de pulsar Enter, así que
          hay que anunciarla; si no, quien no ve la pantalla no sabe que ha
          pasado algo. */}
      <div aria-live="polite">
        {historial.map((entrada) => (
          <div key={entrada.id} className="terminal-block">
            <p className="terminal-cmd">
              <span className="terminal-prompt" aria-hidden>
                $
              </span>{" "}
              {entrada.comando}
            </p>
            {entrada.salida !== null && (
              <div className="terminal-out">{entrada.salida}</div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={enviar} className="shell-line">
        <label htmlFor="shell-input" className="sr-only">
          Consola: escribe un comando y pulsa Enter. Escribe help para ver
          los disponibles.
        </label>
        <span className="terminal-prompt" aria-hidden>
          $
        </span>
        <input
          id="shell-input"
          ref={campo}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="shell-input"
          placeholder="escribe help"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
