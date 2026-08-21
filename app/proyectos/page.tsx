import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Proyectos full-stack, herramientas y experimentos de Pablo Redondo.",
};

export default function ProyectosPage() {
  return (
    <Container>
      <section className="py-16 sm:py-24">
        <SectionLabel>ls proyectos/</SectionLabel>
        <h1 className="font-mono text-3xl font-bold tracking-tight">Proyectos</h1>
        <p className="mt-4 max-w-[60ch] text-ink-soft">
          Listado filtrable por etiqueta pendiente del Paso 2. Ahora mismo hay{" "}
          {projects.length} proyectos cargados.
        </p>
      </section>
    </Container>
  );
}
