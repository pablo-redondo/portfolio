import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { ProjectCard } from "@/components/ProjectCard";
import { StackSummary } from "@/components/StackSummary";
import { Reveal } from "@/components/Reveal";
import { DeploymentStatusPanel } from "@/components/DeploymentStatus";
import { HeroGrid } from "@/components/HeroGrid";
import { projects } from "@/content/projects";
import { aboutStack } from "@/content/stack";
import { SITE } from "@/content/site";
import { HOME_HERO } from "@/content/home";

const TITLE = "Pablo Redondo — Desarrollador full-stack";
const DESCRIPTION =
  "Full-stack con base de infraestructura real: React, Next.js, Node.js y TypeScript, con pruebas automatizadas, CI y despliegue real. Proyectos, stack y casos de estudio.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function HomePage() {

  return (
    <>
      {/* El hero no lleva reveal (depende de hidratación y de que el
          observer dispare). Entra con `data-enter`: una secuencia CSS
          escalonada que arranca con el primer pintado. El h1 es el
          elemento LCP, así que el suyo mueve solo el transform y nunca la
          opacidad: Chrome no contabiliza un elemento en opacity 0. */}
      {/* El hero ocupa la primera pantalla entera (menos la cabecera, que
          es sticky y sí ocupa sitio en el flujo). `svh` y no `dvh`: dvh
          cambia cuando el navegador móvil esconde su barra, y eso movería
          el bloque a mitad de scroll. `min-h` en vez de `h` para que en
          pantallas bajas el contenido siga creciendo en vez de cortarse. */}
      <section className="hero-glow relative flex min-h-[calc(100svh-4rem)] items-center border-b border-line">
        <HeroGrid />
        <Container className="w-full">
          <div className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="min-w-0">
              <div data-enter="1">
                <SectionLabel>whoami --stack</SectionLabel>
              </div>

              <h1 data-enter="lcp" className="mt-4 max-w-[15ch] font-mono text-[1.75rem] leading-[1.05] font-bold tracking-tight text-balance min-[400px]:text-4xl sm:text-5xl lg:text-6xl">
                {HOME_HERO.headline}
              </h1>

              <p
                data-enter="3"
                className="mt-7 max-w-[58ch] text-lg leading-relaxed text-ink-soft"
              >
                {HOME_HERO.intro}
              </p>

              <div data-enter="4" className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/proyectos" className="btn btn-primary">
                  Ver proyectos
                </Link>
                {SITE.cvUrl ? (
                  <a href={SITE.cvUrl} className="btn btn-secondary">
                    Descargar CV
                  </a>
                ) : (
                  <span className="btn btn-secondary opacity-60">
                    Descargar CV (próximamente)
                  </span>
                )}
              </div>
            </div>

            {/* El portfolio comprobando sus propios despliegues. Da peso al
                lado derecho del hero y enseña el criterio de infraestructura
                en la primera pantalla, en vez de solo contarlo. */}
            {/* Sin self-start: hereda el items-center de la rejilla, así el
                panel queda centrado respecto a la columna de la izquierda
                en vez de alineado por arriba. */}
            <div
              data-enter="4"
              className="min-w-0 lg:w-full lg:max-w-md lg:justify-self-end"
            >
              <DeploymentStatusPanel />
            </div>
          </div>

          {/* Con la primera pantalla completa no queda ni un borde que
              insinúe que hay más abajo. Un trazo que recorre hacia abajo lo
              sugiere sin texto ni flecha. Decorativo: aria-hidden. */}
          <span className="scroll-hint" aria-hidden />
        </Container>
      </section>

      {/* Los seis en la misma rejilla y con el mismo peso: sacar uno a una
          banda aparte partía la sección en dos y dejaba a los otros cinco
          descuadrados. */}
      <section className="border-b border-line py-20">
        <Container>
          <Reveal>
            <SectionLabel>ls proyectos/</SectionLabel>
            <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              Proyectos
            </h2>
            <span className="heading-rule mt-4 mb-5" aria-hidden />
            <p className="mb-8 max-w-[62ch] text-ink-soft">
              Los seis, cada uno con su caso de estudio: qué problema
              resuelven, qué decidí y por qué.
            </p>
          </Reveal>

          {/* `stagger`: la rejilla entera comparte un observador y el CSS
              reparte el retardo por hijo, en vez de montar un observador
              por card. */}
          <Reveal
            stagger
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          {/* El enlace al porqué va en la cabecera, no colgando bajo las
              cards: ahí ocupa el hueco que dejaba el titular y queda a la
              altura de la línea, en vez de suelto al final. */}
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
            <div>
              <SectionLabel>cat stack.txt</SectionLabel>
              <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
                Stack actual
              </h2>
              <span className="heading-rule mt-4 mb-5" aria-hidden />
              <p className="max-w-[54ch] text-ink-soft">
                Agrupado por la capa en la que trabaja cada cosa. El motivo
                concreto de cada elección está en los casos de estudio.
              </p>
            </div>
            <Link href="/sobre-mi" className="btn btn-secondary">
              Por qué cada elección
            </Link>
          </Reveal>

          <StackSummary stack={aboutStack} />
        </Container>
      </section>
    </>
  );
}
