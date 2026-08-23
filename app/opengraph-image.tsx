import { ImageResponse } from "next/og";
import { HOME_HERO } from "@/content/home";

export const alt = "Pablo Redondo — Desarrollador full-stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0B0F14";
const INK = "#E9EFF6";
const INK_SOFT = "#A7B6C7";
const ACCENT = "#FFB44D";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: ACCENT }}>$ whoami --stack</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Mismo titular que el hero de la home (content/home.ts): que la
              imagen que se comparte en redes no pueda desalinearse del texto
              real de la página. */}
          <div style={{ display: "flex", fontSize: 60, fontWeight: 700, color: INK, lineHeight: 1.15 }}>
            {HOME_HERO.headline}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: INK_SOFT }}>
            Pablo Redondo — desarrollador full-stack
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: ACCENT }}>pablo-redondo.dev</div>
      </div>
    ),
    { ...size }
  );
}
