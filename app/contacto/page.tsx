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
const DESCRIPTION = "Contacta con Pablo Redondo — email, GitHub, LinkedIn y CV.";

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
  cta: string;
};

/**
 * Los mismos datos de la ficha de /sobre-mi, en el idioma de la web. Aquí no
 * son repetición gratuita: quien entra directo a contactar no debería tener
 * que irse a otra página para saber dónde estoy o en qué idiomas trabajo.
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

export default function ContactoPage() {
  const channels: Channel[] = [
    {
      icon: "email",
      label: "Email",
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      hint: "La vía más directa",
      cta: "Escribir",
    },
    {
      icon: "github",
      label: "GitHub",
      value: SITE.github.replace("https://", ""),
      href: SITE.github,
      hint: "El código de todo lo que hay aquí",
      cta: "Ver el perfil",
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
      cta: "Ir a LinkedIn",
    },
    {
      icon: "cv",
      label: "CV",
      value: SITE.cvUrl ? "descargar PDF" : "próximamente",
      href: SITE.cvUrl,
      hint: "Un folio, sin florituras",
      cta: "Descargar",
    },
  ];

  return (
    <>
      <section className="hero-glow">
        <HeroGrid />
        <Container>
          <div className="pt-16 pb-12 sm:pt-24 sm:pb-16">
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
              className="mt-5 max-w-[54ch] text-lg text-ink-soft"
            >
              Busco mi primera posición como desarrollador full-stack. Sin
              formulario ni backend de por medio: un email directo funciona
              mejor.
            </p>

            <Reveal stagger className="mt-12 grid gap-4 sm:grid-cols-2">
              {channels.map((channel) => {
                const body = (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <span className="channel-tile">
                        <ChannelIcon
                          name={channel.icon}
                          className="h-[18px] w-[18px]"
                        />
                      </span>
                      <span className="font-mono text-[11px] tracking-wider text-ink-faint uppercase">
                        {channel.label}
                      </span>
                    </div>

                    <p className="mt-5 font-mono text-[15px] break-all text-ink transition-colors group-hover:text-accent">
                      {channel.value}
                    </p>
                    <p className="mt-1.5 text-sm text-ink-soft">
                      {channel.hint}
                    </p>

                    <span className="channel-foot">
                      <span className="channel-cta">
                        {channel.cta}
                        <span aria-hidden className="card-cta-arrow">
                          →
                        </span>
                      </span>
                    </span>
                  </>
                );

                return channel.href ? (
                  <div key={channel.label} className="channel-slot relative">
                    <a
                      href={channel.href}
                      className="card-lift card-scan surface-card channel-card group flex h-full flex-col p-6"
                    >
                      {body}
                    </a>
                    {/* Fuera del <a>: un botón dentro de un enlace no es
                        marcado válido y el teclado se pierde entre los dos. */}
                    {channel.icon === "email" && <CopyEmail value={SITE.email} />}
                  </div>
                ) : (
                  <div key={channel.label} className="channel-slot relative">
                    <div className="surface-card channel-card flex h-full flex-col p-6 opacity-60">
                      {body}
                    </div>
                  </div>
                );
              })}
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
            <Reveal>
              <SectionLabel>whoami</SectionLabel>
              <h2 className="font-mono text-2xl font-bold tracking-tight">
                Lo básico
              </h2>
              <span className="heading-rule mt-4" aria-hidden />
              <p className="mt-5 text-ink-soft">
                Lo que se suele preguntar en el primer mensaje, resuelto antes
                de escribirlo.
              </p>
            </Reveal>

            <Reveal>
              <Terminal lines={SESION} />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
