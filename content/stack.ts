import type { TechChoice } from "@/content/types";

/**
 * Stack general para /sobre-mi, curado a partir del criterio ya escrito en
 * content/projects/*.ts (mismo "por qué", generalizado fuera de un proyecto
 * concreto) — no una justificación nueva por tecnología.
 */
export const aboutStack: TechChoice[] = [
  {
    name: "React",
    category: "frontend",
    why: "Rendimiento y estabilidad en interfaces con pantallas que se montan y desmontan mucho, no solo formularios estáticos.",
  },
  {
    name: "Next.js (App Router)",
    category: "frontend",
    why: "Server components para no exponer claves de API al navegador y cachear datos con fetch + revalidate, sin montar una capa de caché propia.",
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    why: "Utilidades para iterar rápido en la maquetación sin mantener una hoja de estilos propia a mano.",
  },
  {
    name: "Zustand",
    category: "frontend",
    why: "Un único store organizado por dominios, sin la ceremonia de Redux para el estado que de verdad necesita ser global.",
  },
  {
    name: "Node.js + Express",
    category: "backend",
    why: "API REST clásica cuando el cliente ya es un proyecto frontend separado, sin necesidad de un framework full-stack.",
  },
  {
    name: "NestJS",
    category: "backend",
    why: "Estructura por módulos y servicios que encaja con patrones de estrategia (un tipo de comprobación, una clase) y con schedulers propios.",
  },
  {
    name: "PostgreSQL",
    category: "backend",
    why: "Relaciones reales (FKs, UNIQUE constraints) y agregados con índices compuestos que encajan mejor en un modelo relacional que en un documento.",
  },
  {
    name: "Prisma",
    category: "backend",
    why: "Migraciones versionadas y modelo tipado, en vez de escribir SQL a mano en cada cambio de esquema.",
  },
  {
    name: "Docker",
    category: "infra",
    why: "Build multi-stage con runtime final solo con el compilado y las dependencias de producción — imagen más pequeña, sin el toolchain de compilación.",
  },
  {
    name: "Fly.io / Render",
    category: "infra",
    why: "PaaS con capa gratuita, barata para un proyecto de portfolio, a cambio de cold starts que hay que mitigar explícitamente (keepalive, reintentos).",
  },
  {
    name: "Vercel",
    category: "infra",
    why: "Despliegue automático desde main, sin infraestructura propia que mantener para el frontend.",
  },
  {
    name: "TypeScript",
    category: "tooling",
    why: "Tipado en cliente y servidor; strict cuando el proyecto lo permite desde el principio, progresivo cuando se parte de JS existente.",
  },
  {
    name: "Vitest + Playwright",
    category: "tooling",
    why: "Vitest para la lógica de negocio sin levantar navegador; Playwright para un e2e real del flujo completo cuando hace falta.",
  },
  {
    name: "pnpm",
    category: "tooling",
    why: "Workspaces para compartir tipos entre backend y frontend en un monorepo sin duplicar interfaces que se desincronizan.",
  },
  {
    name: "GitHub Actions",
    category: "tooling",
    why: "CI (lint, typecheck, test) en cada push y pull request, gratuito para proyectos personales.",
  },
];
