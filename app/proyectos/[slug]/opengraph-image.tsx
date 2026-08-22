import { ImageResponse } from "next/og";
import { projects } from "@/content/projects";

export const alt = "Case study de un proyecto de Pablo Redondo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

const BG = "#0B0F14";
const INK = "#E9EFF6";
const INK_SOFT = "#A7B6C7";
const ACCENT = "#FFB44D";
const LINE = "rgba(233,239,246,0.16)";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const title = project?.title ?? "Pablo Redondo";
  const tagline = project?.tagline ?? "";
  const tags = project?.tags ?? [];

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
        <div style={{ display: "flex", fontSize: 26, color: "#7A8A9C" }}>
          $ cat proyectos/{slug}.md
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: INK, lineHeight: 1.15 }}>
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: INK_SOFT, lineHeight: 1.4, maxWidth: 980 }}>
            {tagline}
          </div>
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    fontSize: 22,
                    color: INK_SOFT,
                    border: `1px solid ${LINE}`,
                    borderRadius: 4,
                    padding: "6px 14px",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: ACCENT }}>pablo-redondo.dev</div>
      </div>
    ),
    { ...size }
  );
}
