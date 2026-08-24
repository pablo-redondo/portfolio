import { Fragment } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { Reveal } from "@/components/Reveal";
import { HeroGrid } from "@/components/HeroGrid";
import { ChannelIcon, type ChannelIconName } from "@/components/ChannelIcon";
import { CopyEmail } from "@/components/CopyEmail";
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

type Channel = {
  icon: ChannelIconName;
  label: string;
  value: string;
  href?: string;
  hint: string;
};

/**
 * La ficha de datos, contada como una sesión de shell. Va en el hero, al
 * lado del titular: es lo que se pregunta en el primer mensaje, así que
 * llega antes de que haga falta preguntarlo.
 */
const SESION: TerminalLine[] = [
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
  {
    command: "echo $BUSCANDO",
    output: "primera posición como desarrollador full-stack",
  },
];

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

export default function ContactoPage() {
  const channels: Channel[] = [
    {
      icon: "email",
      label: "Email",
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      hint: "La vía más directa",
    },
    {
      icon: "github",
      label: "GitHub",
      value: SITE.github.replace("https://", ""),
      href: SITE.github,
      hint: "El código de todo lo que hay aquí",
    },
    {
      icon: "linkedin",
      label: "LinkedIn",
      // Sin la barra final: en móvil se quedaba sola en una segunda línea.
      value: SITE.linkedin
        ? SITE.linkedin.replace("https://www.", "").replace(/\/$/, "")
        : "próximamente",
      href: SITE.linkedin,
      hint: "Para conectar",
    },
    {
      icon: "cv",
      label: "CV",
      value: SITE.cvUrl ? "descargar PDF" : "próximamente",
      href: SITE.cvUrl,
      hint: "Un folio, sin florituras",
    },
  ];

  return (
    <section className="hero-glow">
      <HeroGrid />
      <Container>
        {/* Titular y terminal a la misma altura: `items-center` reparte el
            aire sobrante arriba y abajo del bloque más corto en vez de
            dejarlo todo debajo. */}
        <div className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-16">
          <div>
            <div data-enter="1">
              <SectionLabel>cat contacto.md</SectionLabel>
            </div>
            <h1
              data-enter="lcp"
              className="mt-4 font-mono text-4xl font-bold tracking-tight sm:text-5xl"
            >
              Hablemos
            </h1>
            <p
              data-enter="3"
              className="mt-5 max-w-[46ch] text-lg text-ink-soft"
            >
              Busco mi primera posición como desarrollador full-stack. Sin
              formulario ni backend de por medio: un email directo funciona
              mejor.
            </p>
          </div>

          {/* Sin `Reveal`: está sobre el pliegue, así que se teclea al cargar.
              Retenerla hasta entrar en pantalla la dejaría escrita antes de
              que nadie la viese. */}
          <div data-enter="4" className="min-w-0">
            <Terminal lines={SESION} />
          </div>
        </div>

        {/* El relleno inferior va en el envoltorio, no en la lista: puesto
            en ella quedaba dentro de su borde y abría un hueco muerto bajo
            la última fila. */}
        <div className="pb-16 sm:pb-24">
          <Reveal stagger as="ul" className="channel-list">
            {channels.map((channel) => {
              const cuerpo = (
                <>
                  <span className="channel-tile">
                    <ChannelIcon
                      name={channel.icon}
                      className="h-[18px] w-[18px]"
                    />
                  </span>

                  <span className="min-w-0">
                    <span className="channel-label">{channel.label}</span>
                    <span className="channel-value">
                      {conCortes(channel.value)}
                    </span>
                  </span>

                  <span className="channel-hint">{channel.hint}</span>

                  <span aria-hidden className="channel-go">
                    →
                  </span>
                </>
              );

              const esEmail = channel.icon === "email";

              return (
                <li key={channel.label} className="channel-item">
                  {channel.href ? (
                    <a
                      href={channel.href}
                      className={`channel-row group ${esEmail ? "channel-row-copy" : ""}`}
                    >
                      {cuerpo}
                    </a>
                  ) : (
                    <span className="channel-row opacity-60">{cuerpo}</span>
                  )}

                  {/* Fuera del <a>: un botón dentro de un enlace no es marcado
                    válido y el teclado se pierde entre los dos. */}
                  {esEmail && channel.href && <CopyEmail value={SITE.email} />}
                </li>
              );
            })}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
