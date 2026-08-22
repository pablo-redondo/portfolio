import { ImageResponse } from "next/og";

export const alt = "Pablo Redondo — Desarrollador full-stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#14181a";
const INK = "#edeae2";
const INK_SOFT = "#a7ada8";
const ACCENT = "#e08a3e";

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
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, color: INK, lineHeight: 1.15 }}>
            De la sala de servidores al código
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
