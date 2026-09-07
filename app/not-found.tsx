import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { HeroRoutes } from "@/components/HeroRoutes";
import { SectionSpine } from "@/components/SectionSpine";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <div className="relative">
      <SectionSpine />
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center pt-[72px] pb-[60px]">
        <Container rail className="w-full">
          <HeroRoutes />

          <div data-enter="1">
            <SectionLabel>cd ruta-solicitada</SectionLabel>
          </div>

          <p data-enter="2" className="text-mono-data text-crit mb-8">
            bash: cd: ruta-solicitada: no existe el archivo o el directorio
          </p>

          <h1 data-enter="lcp" className="text-display mb-6 max-w-[10ch] text-ink">
            404
          </h1>

          <p data-enter="3" className="text-body mb-9 max-w-[54ch] text-ink-soft">
            Esta ruta no existe. El enlace puede estar roto, o la página se
            movió de sitio.
          </p>

          <div data-enter="4" className="flex flex-wrap items-center gap-3">
            <Link href="/" className="btn btn-primary">
              Volver a inicio
            </Link>
            <Link href="/proyectos" className="btn btn-secondary">
              Ver proyectos
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
