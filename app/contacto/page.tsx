import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionLabel } from "@/components/SectionLabel";
import { SITE } from "@/content/site";

const TITLE = "Contacto";
const DESCRIPTION = "Contacta con Pablo Redondo — email, GitHub, LinkedIn y CV.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · Pablo Redondo`, description: DESCRIPTION },
};

export default function ContactoPage() {
  return (
    <Container>
      <section className="py-16 sm:py-24">
        <SectionLabel>cat contacto.md</SectionLabel>
        <h1 className="font-mono text-3xl font-bold tracking-tight">Contacto</h1>
        <p className="mt-4 max-w-[60ch] text-ink-soft">
          Sin formulario ni backend de por medio — un email directo funciona mejor.
        </p>

        <div className="mt-10 flex flex-col divide-y divide-line border-y border-line">
          <a
            href={`mailto:${SITE.email}`}
            className="flex items-center justify-between py-4 font-mono text-sm text-ink hover:text-accent"
          >
            <span>Email</span>
            <span className="text-ink-soft">{SITE.email}</span>
          </a>
          <a
            href={SITE.github}
            className="flex items-center justify-between py-4 font-mono text-sm text-ink hover:text-accent"
          >
            <span>GitHub</span>
            <span className="text-ink-soft">{SITE.github.replace("https://", "")}</span>
          </a>
          {SITE.linkedin ? (
            <a
              href={SITE.linkedin}
              className="flex items-center justify-between py-4 font-mono text-sm text-ink hover:text-accent"
            >
              <span>LinkedIn</span>
              <span className="text-ink-soft">{SITE.linkedin.replace("https://", "")}</span>
            </a>
          ) : (
            <div className="flex items-center justify-between py-4 font-mono text-sm text-ink-faint">
              <span>LinkedIn</span>
              <span>próximamente</span>
            </div>
          )}
          {SITE.cvUrl ? (
            <a
              href={SITE.cvUrl}
              className="flex items-center justify-between py-4 font-mono text-sm text-ink hover:text-accent"
            >
              <span>CV (PDF)</span>
              <span className="text-ink-soft">descargar ↓</span>
            </a>
          ) : (
            <div className="flex items-center justify-between py-4 font-mono text-sm text-ink-faint">
              <span>CV (PDF)</span>
              <span>próximamente</span>
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
