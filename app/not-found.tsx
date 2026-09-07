import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { HeroGrid } from "@/components/HeroGrid";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <section className="hero-glow relative flex min-h-[calc(100svh-4rem)] items-center border-b border-line">
      <HeroGrid />
      <Container className="w-full">
        <div className="py-16 sm:py-20">
          <div data-enter="1">
            <SectionLabel>cat 404.md</SectionLabel>
          </div>

          <h1
            data-enter="lcp"
            className="mt-4 font-mono text-5xl font-bold tracking-tight sm:text-6xl"
          >
            404
          </h1>
          <span className="heading-rule mt-4 mb-5" aria-hidden />
          <p data-enter="3" className="max-w-[54ch] text-lg leading-relaxed text-ink-soft">
            No existe esa ruta. El enlace puede estar roto, o la página se
            movió de sitio.
          </p>

          <div data-enter="4" className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/" className="btn btn-primary">
              Volver a inicio
            </Link>
            <Link href="/proyectos" className="btn btn-secondary">
              Ver proyectos
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
