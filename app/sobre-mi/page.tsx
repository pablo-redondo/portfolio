import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { StackByCategory } from "@/components/StackByCategory";
import { Reveal } from "@/components/Reveal";
import { aboutStack } from "@/content/stack";
import { SITE } from "@/content/site";

const TITLE = "Sobre mí";
const DESCRIPTION =
  "Cómo trabajo: diagnosticar antes que parchear, moverme cómodo en código que no escribí yo, hacerme cargo del ciclo completo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · Pablo Redondo`, description: DESCRIPTION },
};

// Cada tarjeta es un rasgo con una prueba real detrás, no una virtud
// declarada. La prueba es el dato que hace que la frase no sea intercambiable
// con la de cualquier otro portfolio.
const RASGOS = [
  {
    title: "Entiendo el ciclo completo, no solo el código",
    body: "En Doezos no me limitaba a la web del cliente: el hosting, el dominio y el servidor detrás también corrían por mi cuenta. Eso es lo que me hace preguntarme, antes de escribir una línea, dónde va a vivir de verdad lo que estoy construyendo.",
  },
  {
    title: "Diagnóstico antes que reinicio",
    body: "Dando soporte a una red corporativa en 24×7 aprendes a no conformarte con 'no responde': hay que mirar dónde se rompe de verdad. Es el mismo criterio detrás de NetPulse: checks reales por TCP, DNS y TLS, no un ping que solo dice sí o no.",
  },
  {
    title: "Cómodo en código que no es mío",
    body: "En las prácticas en Indra no partía de cero: eran endpoints REST sobre microservicios ya en producción, con su propio flujo de revisión. Entender una convención ajena antes de tocarla es un hábito, no una excepción.",
  },
];

// Los cuatro puestos anteriores al desarrollo, tal como constan en el CV.
// Nada de resumen genérico: fecha, empresa y lo único que de verdad importa
// de cada uno.
const EXPERIENCIA = [
  {
    role: "Técnico de redes y soporte",
    company: "EDNON",
    dates: "mar. 2024 → actualidad",
    detail:
      "Compaginado con la búsqueda de mi primera posición como desarrollador. Diagnóstico y resolución de incidencias en una red corporativa 24×7 — datos, voz, WiFi y seguridad — con gestión de tickets, informes y copias de seguridad.",
  },
  {
    role: "Desarrollador de aplicaciones web",
    company: "Indra · prácticas",
    dates: "oct. → dic. 2023",
    detail:
      "Backend sobre arquitectura de microservicios: endpoints REST, mantenimiento de la interfaz en React y refactorización de servicios existentes dentro del flujo de revisión del equipo.",
  },
  {
    role: "Técnico de redes y soporte",
    company: "EDNON",
    dates: "ago. 2022 → sept. 2023",
    detail:
      "Mismas funciones que el puesto actual.",
  },
  {
    role: "Técnico y administrador de sistemas",
    company: "Doezos Consultoría IT",
    dates: "2019 → 2020",
    detail:
      "Desarrollo y mantenimiento de webs de clientes en PrestaShop y WordPress, con el hosting, el dominio y el servidor detrás gestionados también por mí.",
  },
];

export default function SobreMiPage() {
  return (
    <>
      <section className="hero-glow border-b border-line">
        <Container>
          <div className="py-16 sm:py-20">
            <div data-enter="1">
              <SectionLabel>cat sobre-mi.md</SectionLabel>
            </div>
            <h1
              data-enter="lcp"
              className="mt-4 max-w-[22ch] font-mono text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl"
            >
              Antes de escribir la solución, quiero entender qué se rompe de verdad
            </h1>

            <p
              data-enter="3"
              className="mt-8 max-w-[62ch] text-lg leading-relaxed text-ink-soft"
            >
              Soy desarrollador full-stack, titulado en Desarrollo de
              Aplicaciones Web. Pero antes de tocar el primer componente ya
              llevaba años dando soporte a sistemas en producción 24×7, y eso
              cambia cómo abordo un problema: primero busco la causa, no el
              parche más rápido. Debajo van tres ejemplos reales de eso, no
              adjetivos sueltos.
            </p>

            <div data-enter="4" className="mt-9 flex flex-wrap gap-3">
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
              tres ejemplos, no tres adjetivos
            </p>
            <h2 className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              Cómo trabajo
            </h2>
            <span className="heading-rule mt-4 mb-8" aria-hidden />
          </Reveal>
          <Reveal stagger className="grid gap-4 lg:grid-cols-3">
            {RASGOS.map((item) => (
              <div
                key={item.title}
                data-spot
                className="surface-card group h-full p-6"
              >
                <span className="spot-glow" aria-hidden />
                <h3 className="font-mono text-base font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line py-16">
        <Container>
          <Reveal>
            <p className="mb-2 font-mono text-[11px] tracking-wide text-accent uppercase">
              antes del desarrollo
            </p>
            <h2 className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              Por dónde he pasado
            </h2>
            <span className="heading-rule mt-4 mb-8" aria-hidden />
          </Reveal>

          <Reveal stagger className="flex flex-col gap-3">
            {EXPERIENCIA.map((job) => (
              <div key={`${job.company}-${job.dates}`} className="surface-card p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-mono text-sm font-semibold text-ink">
                    {job.role}
                    <span className="ml-2 font-normal text-ink-faint">
                      · {job.company}
                    </span>
                  </h3>
                  <span className="font-mono text-[11px] whitespace-nowrap text-ink-faint">
                    {job.dates}
                  </span>
                </div>
                <p className="mt-2.5 max-w-[70ch] text-sm leading-relaxed text-ink-soft">
                  {job.detail}
                </p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Reveal>
            <p className="mb-2 font-mono text-[11px] tracking-wide text-accent uppercase">
              el porqué de cada elección
            </p>
            <h2 className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              Stack
            </h2>
            <span className="heading-rule mt-4 mb-3" aria-hidden />
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
