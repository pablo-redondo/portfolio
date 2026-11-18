import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { SoonContact, SoonCopyButton } from "@/components/SoonContact";
import { HeroRoutes } from "@/components/HeroRoutes";
import "./proximamente.css";

const TITLE = "Próximamente · Pablo Redondo";
const DESCRIPTION =
  "Estoy rehaciendo mi portfolio. Vuelve pronto, o escríbeme si quieres hablar mientras tanto.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function ComingSoonPage() {
  return (
    <div className="soon">
      <div className="soon-bar">
        <span
          aria-hidden
          className="soon-pulse"
          style={{ animationDuration: "2.4s" }}
        />
        pablo-redondo.dev
      </div>

      <main className="soon-main">
        <HeroRoutes />
        <div className="soon-inner">
          <p data-enter="1" className="soon-cmd">
            <span>$</span> status --site
          </p>

          <h1 data-enter="lcp">
            Compilando algo <em>mejor.</em>
          </h1>

          <div className="soon-grid">
            <div>
              <p data-enter="3" className="soon-lead">
                Estoy rehaciendo mi portfolio desde cero. Mientras termina de
                desplegarse, esta es la única página en pie — si quieres
                hablar, elige un canal y escríbeme directamente.
              </p>
              <div data-enter="4" className="soon-actions">
                <SoonCopyButton email={SITE.email} />
                <a href="#canales" className="soon-btn soon-btn-ghost">
                  Otros canales
                </a>
              </div>
            </div>

            <div data-enter="4" id="canales" className="soon-side">
              <SoonContact email={SITE.email} github={SITE.github} linkedin={SITE.linkedin} />
            </div>
          </div>

          <div data-enter="4" className="soon-stats">
            <span>
              estado <b>en construcción</b>
            </span>
            <span>
              contacto <b>email directo</b>
            </span>
            <span className="soon-stats-end">pablo-redondo.dev</span>
          </div>
        </div>
      </main>

      <footer className="soon-foot">
        <span>© {new Date().getFullYear()} Pablo Redondo</span>
        <nav aria-label="Enlaces">
          <a href={SITE.github} rel="noreferrer">
            GitHub
          </a>
          {SITE.linkedin && (
            <a href={SITE.linkedin} rel="noreferrer">
              LinkedIn
            </a>
          )}
          <a href={`mailto:${SITE.email}`}>Email</a>
        </nav>
      </footer>
    </div>
  );
}
