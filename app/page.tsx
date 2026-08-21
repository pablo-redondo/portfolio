import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";

export default function HomePage() {
  return (
    <Container>
      <section className="py-16 sm:py-24">
        <SectionLabel>whoami --stack</SectionLabel>
        <h1 className="max-w-[18ch] font-mono text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          De la sala de servidores al código
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg text-ink-soft">
          Desarrollador full-stack con base en ASIR y redes — entiendo lo que hay
          debajo del código, no solo lo que se ve en el navegador. (Contenido
          definitivo del hero pendiente del Paso 2.)
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/proyectos"
            className="rounded-sm bg-accent px-4 py-2 font-mono text-sm font-medium text-accent-ink"
          >
            Ver proyectos
          </Link>
          <span className="rounded-sm border border-line px-4 py-2 font-mono text-sm text-ink-faint">
            Descargar CV (próximamente)
          </span>
        </div>
      </section>

      <section className="border-t border-line py-16">
        <SectionLabel>ls proyectos/ --featured</SectionLabel>
        <p className="max-w-[60ch] text-ink-soft">
          Aquí irá el teaser del proyecto insignia (codequest-rpg) y el grid del
          resto de proyectos. Contenido real en el Paso 2.
        </p>
      </section>
    </Container>
  );
}
