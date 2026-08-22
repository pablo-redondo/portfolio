import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { StackByCategory } from "@/components/StackByCategory";
import { Reveal } from "@/components/Reveal";
import { aboutStack } from "@/content/stack";

const TITLE = "Sobre mí";
const DESCRIPTION = "De ASIR y redes al desarrollo web — trayectoria y stack de Pablo Redondo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · Pablo Redondo`, description: DESCRIPTION },
};

export default function SobreMiPage() {
  return (
    <Container>
      <section className="py-16 sm:py-24">
        <SectionLabel>cat sobre-mi.md</SectionLabel>
        <h1 className="font-mono text-3xl font-bold tracking-tight">Sobre mí</h1>

        <div className="mt-6 flex max-w-[65ch] flex-col gap-4 text-ink-soft">
          <p>
            Empecé en ASIR: administración de sistemas, redes, Linux, la parte
            de la infraestructura que la mayoría del desarrollo web da por
            sentada. De ahí pasé al desarrollo web porque quería construir las
            aplicaciones, no solo mantener la máquina donde corren — pero esa
            base no se quedó atrás, se convirtió en la lente con la que leo
            cualquier proyecto.
          </p>
          <p>
            Eso se nota en decisiones concretas, no en una frase de LinkedIn:
            en NetPulse, por ejemplo, entender por qué un ping ICMP necesita
            privilegios elevados fue lo que llevó a construir los checks sobre
            TCP, TLS y un cliente NTP propio en vez de envolver un binario del
            sistema. En restaurant-web, saber que un servicio en un PaaS
            gratuito se duerme por inactividad es lo que explica el workflow
            de keepalive, no una sorpresa en producción.
          </p>
          <p>
            Hoy construyo full-stack: del modelo de datos al pixel, con
            TypeScript de un lado a otro cuando el proyecto lo permite. Los
            proyectos de abajo son la prueba de eso, no una lista de logos.
          </p>
        </div>
      </section>

      <section className="border-t border-line py-16">
        <Reveal>
        <SectionLabel>cat stack.json --grouped</SectionLabel>
        <h2 className="mb-6 font-mono text-lg font-bold tracking-tight">Stack</h2>
        <StackByCategory stack={aboutStack} />
        </Reveal>
      </section>

      <section className="border-t border-line py-16">
        <Reveal>
        <SectionLabel>cat asir.log</SectionLabel>
        <h2 className="mb-4 font-mono text-lg font-bold tracking-tight">
          Qué me llevo de sistemas y redes
        </h2>
        <ul className="flex max-w-[65ch] flex-col gap-4 text-ink-soft">
          <li>
            <span className="font-mono text-sm font-semibold text-ink">Depuración. </span>
            Un error de fetch, CORS o timeout se lee distinto cuando entiendes
            qué pasa en la capa de red que hay debajo, no solo el mensaje que
            enseña el navegador.
          </li>
          <li>
            <span className="font-mono text-sm font-semibold text-ink">Linux y CLI. </span>
            Terminal, Docker, systemd, logs de un servidor real — cómodo
            operando fuera del editor, no solo dentro de él.
          </li>
          <li>
            <span className="font-mono text-sm font-semibold text-ink">
              Entender la infraestructura bajo el código.
            </span>{" "}
            Saber por qué un servicio duerme en un plan gratuito, por qué un
            certificado caduca, o por qué un contenedor no tiene privilegios
            para abrir un raw socket — son las preguntas que ASIR enseña a
            hacerse antes de que exploten en producción.
          </li>
        </ul>
        </Reveal>
      </section>
    </Container>
  );
}
