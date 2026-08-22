import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { SITE } from "@/content/site";

const TITLE = "Contacto";
const DESCRIPTION = "Contacta con Pablo Redondo — email, GitHub, LinkedIn y CV.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · Pablo Redondo`, description: DESCRIPTION },
};

type Channel = {
  label: string;
  value: string;
  href?: string;
  hint: string;
  arrow?: boolean;
};

export default function ContactoPage() {
  const channels: Channel[] = [
    {
      label: "Email",
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      hint: "La vía más directa",
    },
    {
      label: "GitHub",
      value: SITE.github.replace("https://", ""),
      href: SITE.github,
      hint: "El código de todo lo que hay aquí",
    },
    {
      label: "LinkedIn",
      value: SITE.linkedin ? SITE.linkedin.replace("https://www.", "") : "próximamente",
      href: SITE.linkedin,
      hint: "Para conectar",
    },
    {
      label: "CV",
      value: SITE.cvUrl ? "descargar PDF" : "próximamente",
      href: SITE.cvUrl,
      hint: "Un folio, sin florituras",
      arrow: true,
    },
  ];

  return (
    <section className="hero-glow">
      <Container>
        <div className="py-16 sm:py-24">
          <SectionLabel>cat contacto.md</SectionLabel>
          <h1 className="mt-4 font-mono text-4xl font-bold tracking-tight sm:text-5xl">
            Hablemos
          </h1>
          <p className="mt-5 max-w-[54ch] text-lg text-ink-soft">
            Busco mi primera posición como desarrollador full-stack. Sin
            formulario ni backend de por medio: un email directo funciona mejor.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {channels.map((channel) => {
              const inner = (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs tracking-wide text-ink-faint uppercase">
                      {channel.label}
                    </span>
                    {channel.href && (
                      <span
                        aria-hidden
                        className={`font-mono text-sm text-ink-faint transition-colors group-hover:text-accent ${
                          channel.arrow ? "btn-arrow" : ""
                        }`}
                      >
                        {channel.arrow ? "↓" : "↗"}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 font-mono text-base break-all text-ink transition-colors group-hover:text-accent">
                    {channel.value}
                  </p>
                  <p className="mt-1.5 text-sm text-ink-soft">{channel.hint}</p>
                </>
              );

              return channel.href ? (
                <a
                  key={channel.label}
                  href={channel.href}
                  className="card-lift surface-card group block p-6"
                >
                  {inner}
                </a>
              ) : (
                <div key={channel.label} className="surface-card block p-6 opacity-60">
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
