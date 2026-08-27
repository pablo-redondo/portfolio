import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { StackExplorer } from "@/components/StackExplorer";
import { CareerTraceroute, type TraceHop } from "@/components/CareerTraceroute";
import { Reveal } from "@/components/Reveal";
import { HeroRoutes } from "@/components/HeroRoutes";
import { MethodPipeline, type MethodStage } from "@/components/MethodPipeline";
import { SectionSpine } from "@/components/SectionSpine";
import { aboutStack } from "@/content/stack";
import { SITE } from "@/content/site";
import { projects } from "@/content/projects";
import { buildStackUsage } from "@/content/stack-usage";

const stackUsage = buildStackUsage(
  aboutStack.map((t) => t.name),
  projects,
);

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
//
// Van en el orden en que ocurren durante una incidencia — leer, diagnosticar,
// cambiar — porque el sistema de diseño los pinta como una tubería y no como
// tres virtudes sueltas. `cue` es lo que entra o sale de cada etapa.
const RASGOS: MethodStage[] = [
  {
    title: "Cómodo en código que no es mío",
    body: "En las prácticas en Indra no partía de cero: eran endpoints REST sobre microservicios ya en producción, con su propio flujo de revisión. Entender una convención ajena antes de tocarla es un hábito, no una excepción.",
    cue: "entrada: código que no es mío",
  },
  {
    title: "Diagnóstico antes que reinicio",
    body: "Dando soporte a una red corporativa en 24×7 aprendes a no conformarte con 'no responde': hay que mirar dónde se rompe de verdad. Es el mismo criterio detrás de NetPulse: checks reales por TCP, DNS y TLS, no un ping que solo dice sí o no.",
    cue: "salida: causa identificada",
  },
  {
    title: "Por fases, sin dejarlo roto entre pasos",
    body: "CodeQuest RPG era una prueba de concepto abandonada a medias. Lo reconstruí en fases: la migración a TypeScript fue archivo por archivo, comprobando build y juego jugable en cada paso, en vez de una reescritura de golpe que se rompe a mitad sin que te enteres.",
    cue: "salida: nada roto entre pasos",
  },
];

// Autocrítica honesta, no una virtud disfrazada de defecto ("trabajo
// demasiado", etc). Son las tres carencias reales frente a lo que pide un
// primer puesto de desarrollador.
const KNOWN_ISSUES = [
  "Todos los proyectos de esta web los he decidido yo. No he trabajado todavía en un equipo de producto grande, con roadmap ajeno y prioridades que no controlo — es exactamente lo que busco ahora.",
  "Docker y los PaaS los uso para desplegar lo mío, pero no he operado contenedores a escala ni montado observabilidad de verdad (métricas, trazas, alertas). Sé lo que falta porque lo he visto funcionar desde el otro lado.",
  "Mi experiencia con datos es relacional. NoSQL, colas y todo lo que va con procesamiento asíncrono lo he leído, no lo he puesto en producción.",
];

// Los cuatro puestos anteriores al desarrollo, tal como constan en el CV.
// Nada de resumen genérico: fecha, empresa y lo único que de verdad importa
// de cada uno. start/end en YYYY-MM: es lo que deja calcular la duración de
// verdad en vez de escribirla a mano y que se desactualice.
const EXPERIENCIA: TraceHop[] = [
  {
    role: "Técnico de redes y soporte",
    company: "EDNON",
    dates: "mar. 2024 → actualidad",
    start: "2024-03",
    end: null,
    detail:
      "Compaginado con la búsqueda de mi primera posición como desarrollador. Gestión, soporte y monitorización de una red corporativa 24×7 — datos, voz, WiFi y seguridad — con resolución de incidencias de primer nivel, tickets, informes periódicos y copias de seguridad.",
  },
  {
    role: "Desarrollador de aplicaciones web",
    company: "Indra · prácticas",
    dates: "oct. → dic. 2023",
    start: "2023-10",
    end: "2023-12",
    detail:
      "Backend sobre arquitectura de microservicios: endpoints REST, mantenimiento de la interfaz en React y refactorización de servicios existentes dentro del flujo de revisión del equipo.",
  },
  {
    role: "Técnico de redes y soporte",
    company: "EDNON",
    dates: "ago. 2022 → sept. 2023",
    start: "2022-08",
    end: "2023-09",
    detail: "Mismas funciones que el puesto actual.",
  },
  {
    role: "Técnico y administrador de sistemas",
    company: "Doezos Consultoría IT",
    dates: "2019 → 2020",
    // Solo se conoce el año, no el mes: mejor sin tiempo calculado que uno
    // de precisión inventada.
    start: null,
    end: null,
    detail:
      "Desarrollo y mantenimiento de webs de clientes en PrestaShop y WordPress, con el hosting, el dominio y el servidor detrás gestionados también por mí.",
  },
];

/**
 * Cabecera de sección del sistema de diseño: comando con su cifra a la
 * derecha, titular y entradilla. Sin regla bajo el h2 — en el mockup la
 * separación la hace el margen, no un trazo.
 */
function SectionHead({
  label,
  count,
  title,
  children,
}: {
  label: string;
  count: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <Reveal>
      <SectionLabel
        action={<span className="font-mono text-[11px] text-ink-meta">{count}</span>}
      >
        {label}
      </SectionLabel>
      <h2 className="text-h2 mb-2.5 text-ink">{title}</h2>
      {children}
    </Reveal>
  );
}

export default function SobreMiPage() {
  return (
    <div className="relative">
      <SectionSpine />
      <section className="relative pt-[74px] pb-16">
        <Container rail>
          <HeroRoutes />

          <div data-enter="1">
            <SectionLabel>cat sobre-mi.md</SectionLabel>
          </div>

          <div className="relative grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_356px]">
            <div className="min-w-0">
              <h1
                data-enter="lcp"
                className="text-h1 mb-5 max-w-[22ch] text-balance text-ink"
              >
                Antes de escribir la solución, quiero entender qué se rompe de verdad
              </h1>

              <p
                data-enter="3"
                className="text-body mb-8 max-w-[58ch] text-ink-soft"
              >
                Soy desarrollador full-stack, titulado en Desarrollo de
                Aplicaciones Web. Pero antes de tocar el primer componente ya
                llevaba años dando soporte a sistemas en producción 24×7, y eso
                cambia cómo abordo un problema: primero busco la causa, no el
                parche más rápido. Debajo van tres ejemplos reales de eso, no
                adjetivos sueltos.
              </p>

              <div data-enter="4" className="flex flex-wrap gap-3">
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

            <div data-enter="4" className="min-w-0">
              <div className="win">
                <div className="win-bar">
                  <div className="win-dots" aria-hidden>
                    <span className="win-dot" />
                    <span className="win-dot" />
                    <span className="win-dot" />
                  </div>
                  <span className="win-title">pablo@dev — zsh</span>
                  <span />
                </div>
                <div className="px-5 pt-4 pb-2">
                  <p className="font-mono text-xs text-ink-meta">
                    <span className="text-accent">$</span> uname -a
                  </p>
                </div>
                {/* Cada dato en su propia fila con separador, como una
                    salida tabulada de terminal y no una lista suelta. */}
                <dl className="pb-1.5">
                  {FICHA.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-baseline justify-between gap-4 border-t border-[var(--bg-raised)] px-5 py-3"
                    >
                      <dt className="font-mono text-xs text-ink-meta">{fact.label}</dt>
                      <dd className="text-mono-data text-right text-ink">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* El recorrido va antes que el método: primero por dónde se pasó,
          luego qué se aprendió ahí. Es el orden del sistema de diseño. */}
      <section className="pt-[92px]">
        <Container rail>
          <SectionHead
            label="traceroute carrera"
            count={`${EXPERIENCIA.length} saltos`}
            title="Por dónde he pasado"
          >
            <p className="text-body mb-[30px] max-w-[62ch] text-ink-soft">
              Cuatro puestos antes de dedicarme al desarrollo. Cada uno se
              despliega con lo que de verdad aporta.
            </p>
          </SectionHead>

          <CareerTraceroute hops={EXPERIENCIA} />
        </Container>
      </section>

      <section className="pt-[92px]">
        <Container rail>
          <SectionHead
            label="runbook --incidente"
            count={`${RASGOS.length} etapas`}
            title="Cómo trabajo"
          >
            <p className="text-body mb-[30px] max-w-[62ch] text-ink-soft">
              Lo mismo que hacía con una incidencia a las tres de la mañana,
              aplicado a escribir código. Tres etapas en orden, cada una con un
              proyecto que la demuestra.
            </p>
          </SectionHead>

          <Reveal>
            <MethodPipeline stages={RASGOS} />
          </Reveal>

          {/* Prueba de la primera etapa: no es solo la anécdota de Indra, es
              algo que se puede ir a comprobar en un proyecto propio. */}
          <Reveal className="surface-panel mt-4 overflow-hidden !p-0">
            <div className="flex flex-wrap items-center gap-2.5 border-b border-line px-6 py-3.5">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono text-xs text-ink">--codigo-ajeno</span>
              <span className="ml-auto font-mono text-[11px] text-ink-meta">
                partiendo de un repo existente
              </span>
            </div>

            <div className="grid gap-9 px-6 py-[26px] lg:grid-cols-[minmax(0,1fr)_306px]">
              <p className="max-w-[70ch] text-[17px] leading-relaxed text-ink-soft">
                En Sistema de Reservas, la API y el frontend son dos repositorios
                separados que se despliegan por separado (Fly.io / Vercel) y
                solo se hablan por una variable de entorno — el mismo criterio
                de tratar un servicio ajeno como una caja negra con un contrato,
                no como código propio a medio camino.
              </p>

              <div className="lg:border-l lg:border-line lg:pl-6">
                <p className="text-mono-meta mb-3 text-ink-meta uppercase">evidencia</p>
                <p className="mb-4 text-sm leading-relaxed text-ink">
                  API y frontend separados, cada uno con su contrato y su
                  despliegue.
                </p>
                <Link href="/proyectos/restaurant" className="btn btn-sm btn-primary">
                  Ver Sistema de Reservas
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal className="surface-panel mt-6 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-warn/15 text-warn rounded font-mono text-[10px] tracking-wide uppercase px-2 py-1">
                Known issues
              </span>
              <span className="text-mono-meta text-ink-meta">lo que todavía no sé hacer</span>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-3">
              {KNOWN_ISSUES.map((text, i) => (
                <div key={i} className="flex flex-col gap-2.5">
                  <span className="text-warn font-mono text-[11px] font-medium">
                    #{i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink-soft">{text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="pt-[92px] pb-[130px]">
        <Container rail>
          <SectionHead
            label="lsof -i stack"
            count={`${aboutStack.length} elecciones`}
            title="Stack, con el motivo de cada elección"
          >
            <p className="text-body mb-[30px] max-w-[62ch] text-ink-soft">
              No es una lista de logos: cada tecnología está aquí por un motivo
              concreto, el mismo que aparece en los casos de estudio. Los siete
              puntos de cada ficha marcan en qué proyectos está viva.
            </p>
          </SectionHead>

          <StackExplorer stack={aboutStack} usage={stackUsage} totalProyectos={projects.length} />
        </Container>
      </section>
    </div>
  );
}
