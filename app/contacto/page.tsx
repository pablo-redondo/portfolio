import { statSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { HeroRoutes } from "@/components/HeroRoutes";
import { SectionSpine } from "@/components/SectionSpine";
import { WhoisCard } from "@/components/WhoisCard";
import { SocketsTable, type Socket } from "@/components/SocketsTable";
import { SITE } from "@/content/site";
import { projects } from "@/content/projects";

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

/** Repos públicos reales, contados a partir de los que cada proyecto ya declara. */
function contarRepos(): number {
  const urls = new Set<string>();
  for (const project of projects) {
    for (const repo of project.repos) urls.add(repo.url);
  }
  return urls.size;
}

export default function ContactoPage() {
  const cvKb = tamanoCV();
  const repoCount = contarRepos();

  const sockets: Socket[] = [
    {
      nombre: "email",
      socket: "tcp/587",
      destino: SITE.email,
      href: `mailto:${SITE.email}`,
      protocolo: "smtp",
      respuesta: "< 24 h",
      accion: "escribir",
    },
    {
      nombre: "github",
      socket: "tcp/443",
      destino: SITE.github.replace(/^https:\/\//, ""),
      href: SITE.github,
      protocolo: "https",
      respuesta: `${repoCount} repos públicos`,
      accion: "abrir",
    },
    ...(SITE.linkedin
      ? [
          {
            nombre: "linkedin",
            socket: "tcp/443",
            destino: SITE.linkedin.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
            href: SITE.linkedin,
            protocolo: "https",
            respuesta: "< 24 h",
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
            protocolo: "https",
            respuesta: cvKb ?? "pdf",
            accion: "descargar",
          } satisfies Socket,
        ]
      : []),
  ];

  return (
    <div className="relative">
      <SectionSpine />
      <section className="relative pt-[74px] pb-16">
        <Container rail>
          <HeroRoutes />

          <div data-enter="1">
            <SectionLabel>whois pablo</SectionLabel>
          </div>

          <div className="relative grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_344px]">
            <div className="min-w-0">
              <h1 data-enter="lcp" className="text-h1 mb-5 max-w-[18ch] text-balance text-ink">
                Hablemos
              </h1>

              <p data-enter="3" className="text-body mb-8 max-w-[58ch] text-ink-soft">
                Busco mi primera posición como desarrollador full-stack. Sin
                formulario ni backend de por medio: un email directo funciona
                mejor.
              </p>

              <div data-enter="4" className="flex flex-wrap gap-3">
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

            <div data-enter="4" className="min-w-0">
              <WhoisCard />
            </div>
          </div>
        </Container>
      </section>

      <section className="pt-[84px] pb-[130px]">
        <Container rail>
          <SectionLabel
            action={
              <span className="font-mono text-[11px] text-ink-meta">
                {sockets.length} sockets
              </span>
            }
          >
            ss -ltn
          </SectionLabel>
          <h2 className="text-h2 mb-2.5 text-ink">Canales a la escucha</h2>
          <p className="text-body mb-[26px] max-w-[60ch] text-ink-soft">
            Cuatro sockets abiertos, cada uno con su tiempo de respuesta real.
            El correo es el que atiendo antes.
          </p>

          <SocketsTable sockets={sockets} />
        </Container>
      </section>
    </div>
  );
}
