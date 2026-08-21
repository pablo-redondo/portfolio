import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: "De ASIR y redes al desarrollo web — trayectoria y stack de Pablo Redondo.",
};

export default function SobreMiPage() {
  return (
    <Container>
      <section className="py-16 sm:py-24">
        <SectionLabel>cat sobre-mi.md</SectionLabel>
        <h1 className="font-mono text-3xl font-bold tracking-tight">Sobre mí</h1>
        <p className="mt-4 max-w-[60ch] text-ink-soft">
          Narrativa del salto ASIR → desarrollo y la tabla de stack con el
          &ldquo;por qué&rdquo; de cada elección, pendientes del Paso 2.
        </p>
      </section>
    </Container>
  );
}
