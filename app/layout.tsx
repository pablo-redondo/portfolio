import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Spotlight } from "@/components/Spotlight";
import { SITE } from "@/content/site";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const DEFAULT_TITLE = "Pablo Redondo — Desarrollador full-stack";
const DEFAULT_DESCRIPTION =
  "Portfolio de Pablo Redondo, desarrollador full-stack. Cada proyecto con su caso de estudio: React, Next.js, Node.js y TypeScript, con pruebas automatizadas y despliegue real.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: DEFAULT_TITLE,
    template: "%s · Pablo Redondo",
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Pablo Redondo",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${jetbrainsMono.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Progreso de lectura. Es puro CSS guiado por scroll: donde el
            navegador no lo soporta, la regla entera no aplica y no se
            pinta una barra muerta a cero. */}
        <div className="scroll-progress" aria-hidden />
        <Spotlight />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
