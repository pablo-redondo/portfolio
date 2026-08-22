import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { StackByCategory } from "@/components/StackByCategory";
import { Reveal } from "@/components/Reveal";
import { aboutStack } from "@/content/stack";
import { SITE } from "@/content/site";

const TITLE = "Sobre mí";
const DESCRIPTION = "De ASIR y redes al desarrollo web — trayectoria y stack de Pablo Redondo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · Pablo Redondo`, description: DESCRIPTION },
};

const TAKEAWAYS = [
  {
    title: "Depuración",
    body: "Un error de fetch, CORS o timeout se lee distinto cuando entiendes qué pasa en la capa de red que hay debajo, no solo el mensaje que enseña el navegador.",
  },
  {
    title: "Linux y CLI",
    body: "Terminal, Docker, systemd, logs de un servidor real. Cómodo operando fuera del editor, no solo dentro de él.",
  },
  {
    title: "La infraestructura bajo el código",
    body: "Por qué un servicio duerme en un plan gratuito, por qué un certificado caduca, o por qué un contenedor no puede abrir un raw socket. Son las preguntas que ASIR enseña a hacerse antes de que exploten en producción.",
  },
];

export default function SobreMiPage() {
  return (
    <>
      <section className="hero-glow border-b border-line">
        <Container>
          <div className="py-16 sm:py-20">
            <SectionLabel>cat sobre-mi.md</SectionLabel>
            <h1 className="mt-4 max-w-[20ch] font-mono text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
              Vengo de mantener la máquina, no solo de programarla
            </h1>

            <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-12">
              <p className="text-lg leading-relaxed text-ink-soft">
                Empecé en ASIR: administración de sistemas, redes, Linux, la
                parte de la infraestructura que la mayoría del desarrollo web da
                por sentada. De ahí pasé al desarrollo porque quería construir
                las aplicaciones, no solo mantener la máquina donde corren. Esa
                base no se quedó atrás: se convirtió en la lente con la que leo
                cualquier proyecto.
              </p>
              <p className="leading-relaxed text-ink-soft">
                Se nota en decisiones concretas, no en una frase de LinkedIn. En
                NetPulse, entender por qué un ping ICMP necesita privilegios
                elevados fue lo que llevó a construir los checks sobre TCP, TLS
                y un cliente NTP propio en vez de envolver un binario del
                sistema. En restaurant-web, saber que un servicio en un PaaS
                gratuito se duerme por inactividad es lo que explica el workflow
                de keepalive, no una sorpresa en producción.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              {SITE.cvUrl && (
                <a href={SITE.cvUrl} className="btn btn-primary">
                  Descargar CV
                </a>
              )}
              <Link href="/proyectos" className="btn btn-secondary">
                Ver proyectos
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-16">
        <Container>
          <Reveal>
            <p className="mb-2 font-mono text-[11px] tracking-wide text-accent uppercase">
              lo que traigo de sistemas
            </p>
            <h2 className="mb-8 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              Qué me llevo de ASIR
            </h2>
          </Reveal>
          <div className="grid gap-4 lg:grid-cols-3">
            {TAKEAWAYS.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 60}>
                <div className="surface-card h-full p-6">
                  <h3 className="font-mono text-base font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Reveal>
            <p className="mb-2 font-mono text-[11px] tracking-wide text-accent uppercase">
              el porqué de cada elección
            </p>
            <h2 className="mb-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              Stack
            </h2>
            <p className="mb-10 max-w-[62ch] text-ink-soft">
              No es una lista de logos: cada tecnología está aquí por un motivo
              concreto, el mismo que aparece en los casos de estudio.
            </p>
          </Reveal>
          <StackByCategory stack={aboutStack} />
        </Container>
      </section>
    </>
  );
}
