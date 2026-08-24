import { Fragment } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { HeroGrid } from "@/components/HeroGrid";
import { ChannelIcon, type ChannelIconName } from "@/components/ChannelIcon";
import { ContactShell } from "@/components/ContactShell";
import { LocalTime } from "@/components/LocalTime";
import { Terminal, type TerminalLine } from "@/components/Terminal";
import { SITE } from "@/content/site";

const TITLE = "Contacto";
const DESCRIPTION =
  "Contacta con Pablo Redondo — email, GitHub, LinkedIn y CV.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · Pablo Redondo`, description: DESCRIPTION },
};

/**
 * Puntos por donde puede partirse un valor largo en pantallas estrechas.
 *
 * Sin esto, `overflow-wrap: anywhere` corta por donde le toca —el email
 * acababa partido en "…@gma / il.com"—. Marcando `@` y `/` como
 * oportunidades de corte, el navegador parte por la costura natural y solo
 * recurre a cortar a mitad de palabra si ni así cabe.
 */
function conCortes(value: string) {
  const trozos = value.split(/(?<=[@/])/);
  return trozos.map((trozo, i) => (
    <Fragment key={i}>
      {trozo}
      {i < trozos.length - 1 && <wbr />}
    </Fragment>
  ));
}

type Canal = {
  icon: ChannelIconName;
  /** Como aparecería en un `ls`: el nombre de la "entrada". */
  nombre: string;
  valor: string;
  href?: string;
  nota: string;
};

/**
 * Los canales, como salida de un `ls`. No son tarjetas ni pastillas: son
 * las líneas que imprime el comando de encima, cada una con su enlace.
 */
function Listado({ canales }: { canales: Canal[] }) {
  return (
    <ul className="ls">
      {canales.map((canal) => {
        const cuerpo = (
          <>
            <ChannelIcon name={canal.icon} className="ls-glyph" />
            {/* Nombre y valor van juntos en un envoltorio para poder
                apilarlos en pantalla estrecha; a partir de `56rem` el
                envoltorio se desvanece con `display: contents` y los dos
                vuelven a ser columnas de la rejilla. */}
            <span className="ls-id">
              <span className="ls-name">{canal.nombre}</span>
              <span className="ls-value">{conCortes(canal.valor)}</span>
            </span>
            <span className="ls-note">{canal.nota}</span>
            <span aria-hidden className="ls-arrow">
              →
            </span>
          </>
        );

        return (
          <li key={canal.nombre}>
            {canal.href ? (
              <a href={canal.href} className="ls-row">
                {cuerpo}
              </a>
            ) : (
              <span className="ls-row opacity-60">{cuerpo}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function ContactoPage() {
  const canales: Canal[] = [
    {
      icon: "email",
      nombre: "email",
      valor: SITE.email,
      href: `mailto:${SITE.email}`,
      nota: "la vía directa",
    },
    {
      icon: "github",
      nombre: "github",
      valor: SITE.github.replace(/^https:\/\/github\.com\//, ""),
      href: SITE.github,
      nota: "el código de todo esto",
    },
    {
      icon: "linkedin",
      nombre: "linkedin",
      valor: SITE.linkedin
        ? SITE.linkedin
            .replace(/^https:\/\/www\.linkedin\.com\/in\//, "")
            .replace(/\/$/, "")
        : "próximamente",
      href: SITE.linkedin,
      nota: "para conectar",
    },
    {
      icon: "cv",
      nombre: "cv",
      valor: SITE.cvUrl ? SITE.cvUrl.replace(/^\//, "") : "próximamente",
      href: SITE.cvUrl,
      nota: "un folio, sin florituras",
    },
  ];

  // El primer bloque va `instant`: contiene el <h1>, y una animación que
  // arranca en opacidad cero deja fuera al elemento del LCP. Además cuadra
  // con la ficción — se llega a una sesión que ya tiene algo impreso.
  const sesion: TerminalLine[] = [
    {
      command: "cat contacto.md",
      instant: true,
      output: (
        <>
          <h1 className="terminal-h1">Hablemos</h1>
          <p className="terminal-parrafo">
            Busco mi primera posición como desarrollador full-stack. Sin
            formulario ni backend de por medio: un email directo funciona
            mejor.
          </p>
        </>
      ),
    },
    {
      command: "ls -l canales/",
      output: <Listado canales={canales} />,
    },
    { command: "whoami", output: "pablo-redondo · desarrollador full-stack" },
    {
      command: "pwd",
      output: (
        <>
          Galicia, España{" "}
          <span className="terminal-muted">
            — son las <LocalTime /> aquí
          </span>
        </>
      ),
    },
    { command: "cat idiomas.txt", output: "español · gallego · inglés" },
  ];

  return (
    <section className="hero-glow">
      <HeroGrid />
      <Container>
        <div className="py-12 sm:py-16">
          <Terminal title="pablo@galicia — ~/contacto" lines={sesion}>
            <ContactShell
              email={SITE.email}
              github={SITE.github}
              linkedin={SITE.linkedin}
              cv={SITE.cvUrl}
            />
          </Terminal>
        </div>
      </Container>
    </section>
  );
}
