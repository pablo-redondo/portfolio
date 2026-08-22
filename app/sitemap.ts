import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { SITE } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/proyectos`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/sobre-mi`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE.url}/contacto`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE.url}/proyectos/${project.slug}`,
    changeFrequency: "monthly",
    priority: project.featured ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
