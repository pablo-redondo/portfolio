import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta con Pablo Redondo — email, GitHub, LinkedIn y CV.",
};

export default function ContactoPage() {
  return (
    <Container>
      <section className="py-16 sm:py-24">
        <SectionLabel>cat contacto.md</SectionLabel>
        <h1 className="font-mono text-3xl font-bold tracking-tight">Contacto</h1>
        <p className="mt-4 max-w-[60ch] text-ink-soft">
          Email directo, GitHub, LinkedIn y botón de CV en PDF, pendientes del
          Paso 2.
        </p>
      </section>
    </Container>
  );
}
