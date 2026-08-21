import type { Metadata } from "next";
import { JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pablo-redondo.dev"),
  title: {
    default: "Pablo Redondo — Desarrollador full-stack",
    template: "%s · Pablo Redondo",
  },
  description:
    "Portfolio de Pablo Redondo, desarrollador full-stack en transición desde ASIR y redes hacia el desarrollo web.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Pablo Redondo",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${jetbrainsMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
