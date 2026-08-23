import Link from "next/link";
import { Container } from "@/components/Container";
import { SITE } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <Container>
        <div className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-sm font-bold text-ink">pablo-redondo.dev</p>
            <p className="mt-1 text-sm text-ink-faint">
              Desarrollador full-stack · React, TypeScript y Node.js
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
            <Link href="/proyectos" className="text-ink-soft hover:text-accent">
              Proyectos
            </Link>
            <Link href="/sobre-mi" className="text-ink-soft hover:text-accent">
              Sobre mí
            </Link>
            <a href={SITE.github} className="text-ink-soft hover:text-accent">
              GitHub
            </a>
            {SITE.linkedin && (
              <a href={SITE.linkedin} className="text-ink-soft hover:text-accent">
                LinkedIn
              </a>
            )}
            <a href={`mailto:${SITE.email}`} className="text-ink-soft hover:text-accent">
              Email
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
