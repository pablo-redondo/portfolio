import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

// Mientras el dominio principal muestra «Próximamente», la portada es la
// única URL real: el resto redirige a ella.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url, changeFrequency: "weekly", priority: 1 }];
}
