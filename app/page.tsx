import type { Metadata } from "next";
import { SITE } from "@/content/site";
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
        <div className="soon-grid">
          <div>
            <p className="soon-cmd">
              <span>$</span> status --site
            </p>
            <h1>
              Próximamente<em>.</em>
            </h1>
            <p className="soon-lead">
              Estoy rehaciendo mi portfolio desde cero. Mientras termina de
              desplegarse, esta es la única página en pie — si quieres hablar,
              un email directo funciona mejor que esperar.
            </p>
            <div className="soon-actions">
              <a href={`mailto:${SITE.email}`} className="soon-btn soon-btn-primary">
                Escribir un email
              </a>
              <a href={SITE.github} className="soon-btn" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>

          <div className="soon-win" aria-label="Estado del despliegue">
            <div className="soon-win-bar">
              <div className="soon-dots" aria-hidden>
                <i />
                <i />
                <i />
              </div>
              <span>deploy — pablo-redondo.dev</span>
              <span />
            </div>
            <div className="soon-win-body">
              <div className="soon-status">
                <span aria-hidden className="soon-pulse" />
                EN CONSTRUCCIÓN
              </div>
              <ul className="soon-log">
                <li>
                  <span>portfolio nuevo</span>
                  <b className="run">
                    en preparación<span aria-hidden className="soon-caret" />
                  </b>
                </li>
                <li>
                  <span>contacto</span>
                  <b className="ok">abierto</b>
                </li>
                <li>
                  <span>publicación</span>
                  <b>pronto</b>
                </li>
              </ul>
            </div>
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
