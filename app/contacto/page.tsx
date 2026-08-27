import { statSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { HeroGrid } from "@/components/HeroGrid";
import { SectionSpine } from "@/components/SectionSpine";
import { WhoisCard } from "@/components/WhoisCard";
import { SocketsTable, type Socket } from "@/components/SocketsTable";
import { ContactShell } from "@/components/ContactShell";
import { Terminal } from "@/components/Terminal";
import { SITE } from "@/content/site";

const TITLE = "Contacto";
const DESCRIPTION = "Contacta con Pablo Redondo — email, GitHub, LinkedIn y CV.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · Pablo Redondo`, description: DESCRIPTION },
};

/** Tamaño real del PDF, no una cifra de muestra. */
function tamanoCV(): string | null {
  if (!SITE.cvUrl) return null;
  try {
    const bytes = statSync(join(process.cwd(), "public", SITE.cvUrl)).size;
    return `${Math.round(bytes / 1024)} kB`;
  } catch {
    return null;
  }
}

export default function ContactoPage() {
  const cvKb = tamanoCV();

  const sockets: Socket[] = [
    {
      nombre: "email",
      socket: "tcp/587",
      destino: SITE.email,
      href: `mailto:${SITE.email}`,
      dato: "smtp",
      accion: "escribir",
    },
    {
      nombre: "github",
      socket: "tcp/443",
      destino: SITE.github.replace(/^https:\/\//, ""),
      href: SITE.github,
      dato: "https",
      accion: "abrir",
    },
    ...(SITE.linkedin
      ? [
          {
            nombre: "linkedin",
            socket: "tcp/443",
            destino: SITE.linkedin.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
            href: SITE.linkedin,
            dato: "https",
            accion: "abrir",
          } satisfies Socket,
        ]
      : []),
    ...(SITE.cvUrl
      ? [
          {
            nombre: "cv",
            socket: "tcp/443",
            destino: SITE.cvUrl.replace(/^\//, ""),
            href: SITE.cvUrl,
            dato: cvKb ?? "pdf",
            accion: "descargar",
          } satisfies Socket,
        ]
      : []),
  ];

  return (
    <div className="relative">
      <SectionSpine />
      <section className="hero-glow border-b border-line">
        <HeroGrid />
        <Container>
          <div className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="min-w-0">
              <div data-enter="1">
                <SectionLabel>whois pablo</SectionLabel>
              </div>

              <h1 data-enter="lcp" className="text-h1 mt-5 max-w-[18ch] text-balance text-ink">
                Hablemos
              </h1>

              <p data-enter="3" className="text-body mt-6 max-w-[58ch] text-ink-soft">
                Busco mi primera posición como desarrollador full-stack. Sin
                formulario ni backend de por medio: un email directo funciona
                mejor.
              </p>

              <div data-enter="4" className="mt-8 flex flex-wrap gap-3">
                <a href={`mailto:${SITE.email}`} className="btn btn-primary">
                  Escribir un email
                </a>
                {SITE.cvUrl && (
                  <a href={SITE.cvUrl} className="btn btn-secondary">
                    Descargar CV
                  </a>
                )}
              </div>
            </div>

            <div data-enter="4" className="min-w-0 lg:w-full lg:max-w-md lg:justify-self-end">
              <WhoisCard />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-20">
        <Container>
          <SectionLabel>ss -ltn</SectionLabel>
          <h2 className="text-h2 mt-3 text-ink">Canales a la escucha</h2>
          <span className="heading-rule mt-4 mb-8" aria-hidden />

          <SocketsTable sockets={sockets} />
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionLabel>escribe help</SectionLabel>
          <h2 className="text-h2 mt-3 text-ink">¿Prefieres teclear?</h2>
          <span className="heading-rule mt-4 mb-8" aria-hidden />

          <Terminal
            title="pablo@galicia — ~/contacto"
            lines={[
              {
                command: "help",
                instant: true,
                output: "escribe un comando — o usa los canales de arriba, que funcionan igual sin JavaScript.",
              },
            ]}
          >
            <ContactShell
              email={SITE.email}
              github={SITE.github}
              linkedin={SITE.linkedin}
              cv={SITE.cvUrl}
            />
          </Terminal>
        </Container>
      </section>
    </div>
  );
}
