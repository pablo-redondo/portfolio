import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { StackExplorer } from "@/components/StackExplorer";
import { CareerRail, type Job } from "@/components/CareerRail";
import { Reveal } from "@/components/Reveal";
import { aboutStack } from "@/content/stack";
import { SITE } from "@/content/site";

const TITLE = "Sobre mí";
const DESCRIPTION =
  "Cómo trabajo: reconstruir por fases sin romper nada, diagnosticar antes que parchear, moverme cómodo en código que no escribí yo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · Pablo Redondo`, description: DESCRIPTION },
};

/**
 * Ficha del hero. Da peso al lado derecho, igual que el panel de estado en
 * la home, y resuelve de un vistazo lo que un reclutador busca primero.
 */
const FICHA: { label: string; value: string }[] = [
  { label: "Formación", value: "DAW (2024) · ASIR (2018)" },
  { label: "Ubicación", value: "Galicia, España" },
  { label: "Idiomas", value: "Español · Gallego · Inglés" },
  { label: "Buscando", value: "Primera posición como desarrollador" },
];

// Cada tarjeta es un rasgo con una prueba real detrás, no una virtud
// declarada. La prueba es el dato que hace que la frase no sea intercambiable
// con la de cualquier otro portfolio.
const RASGOS = [
  {
    title: "Por fases, sin dejarlo roto entre pasos",
    body: "CodeQuest RPG era una prueba de concepto abandonada a medias. Lo reconstruí en fases: la migración a TypeScript fue archivo por archivo, comprobando build y juego jugable en cada paso, en vez de una reescritura de golpe que se rompe a mitad sin que te enteres.",
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
const EXPERIENCIA: Job[] = [
  {
    role: "Técnico de redes y soporte",
    company: "EDNON",
    dates: "mar. 2024 → actualidad",
    year: "24",
    detail:
      "Compaginado con la búsqueda de mi primera posición como desarrollador. Gestión, soporte y monitorización de una red corporativa 24×7 — datos, voz, WiFi y seguridad — con resolución de incidencias de primer nivel, tickets, informes periódicos y copias de seguridad.",
  },
  {
    role: "Desarrollador de aplicaciones web",
    company: "Indra · prácticas",
    dates: "oct. → dic. 2023",
    year: "23",
    detail:
      "Backend sobre arquitectura de microservicios: endpoints REST, mantenimiento de la interfaz en React y refactorización de servicios existentes dentro del flujo de revisión del equipo.",
  },
  {
    role: "Técnico de redes y soporte",
    company: "EDNON",
    dates: "ago. 2022 → sept. 2023",
    year: "22",
    detail: "Mismas funciones que el puesto actual.",
  },
  {
    role: "Técnico y administrador de sistemas",
    company: "Doezos Consultoría IT",
    dates: "2019 → 2020",
    year: "19",
    detail:
      "Desarrollo y mantenimiento de webs de clientes en PrestaShop y WordPress, con el hosting, el dominio y el servidor detrás gestionados también por mí.",
  },
];

function SectionHead({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <Reveal className="mb-10">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      <span className="heading-rule mt-4" aria-hidden />
      {children}
    </Reveal>
  );
}

export default function SobreMiPage() {
  return (
    <>
      {/* Hero a dos columnas, como el de la home: el texto no se queda solo
          ocupando media pantalla con el otro lado vacío. */}
      <section className="hero-glow border-b border-line">
        <Container>
          <div className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="min-w-0">
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
                className="mt-7 max-w-[58ch] text-lg leading-relaxed text-ink-soft"
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
                <Link href="/contacto" className="btn btn-secondary">
                  Hablemos
                </Link>
              </div>
            </div>

            <div
              data-enter="4"
              className="min-w-0 lg:w-full lg:max-w-md lg:justify-self-end"
            >
              <div className="surface-card overflow-hidden">
                <div className="border-b border-line bg-surface-2 px-4 py-2.5">
                  <span className="font-mono text-[11px] text-ink-faint">
                    <span className="text-accent">$</span> cat perfil.json
                  </span>
                </div>
                <dl className="divide-y divide-line">
                  {FICHA.map((fact) => (
                    <div key={fact.label} className="fact-row">
                      <dt className="font-mono text-[11px] tracking-wide text-ink-faint uppercase">
                        {fact.label}
                      </dt>
                      <dd className="font-mono text-[13px] text-ink">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-20">
        <Container>
          <SectionHead label="cat metodo.txt" title="Cómo trabajo" />

          <Reveal stagger className="grid gap-4 lg:grid-cols-3">
            {RASGOS.map((item, i) => (
              <div
                key={item.title}
                className="card-lift card-scan surface-card group relative h-full overflow-hidden p-6"
              >
                <span className="trait-index" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="max-w-[24ch] font-mono text-base font-semibold text-balance text-ink">
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

      <section className="border-b border-line py-20">
        <Container>
          <SectionHead label="git log --author=pablo" title="Por dónde he pasado">
            <p className="mt-6 max-w-[62ch] text-ink-soft">
              Cuatro puestos antes de dedicarme al desarrollo. Cada uno se
              despliega con lo que de verdad aporta.
            </p>
          </SectionHead>

          <CareerRail jobs={EXPERIENCIA} />
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHead label="ls stack/" title="Stack">
            <p className="mt-6 max-w-[62ch] text-ink-soft">
              No es una lista de logos: cada tecnología está aquí por un motivo
              concreto, el mismo que aparece en los casos de estudio. Filtra
              por capa si buscas una en concreto.
            </p>
          </SectionHead>

          <StackExplorer stack={aboutStack} />
        </Container>
      </section>
    </>
  );
}
