import type { Project } from "@/content/types";

export const restaurant: Project = {
  slug: "restaurant",
  title: "Marqués — Sistema de Reservas",
  tagline:
    "Sistema de reservas full-stack para un restaurante: API REST (Node, Express, PostgreSQL) y frontend Next.js desplegados por separado y comunicándose en producción.",
  status: "live",
  featured: false,
  tags: ["Full-stack"],
  repos: [
    { label: "API", url: "https://github.com/pablo-redondo/restaurant-api" },
    { label: "Web", url: "https://github.com/pablo-redondo/restaurant-web" },
  ],
  demoUrl: "https://restaurant-web-lilac.vercel.app",
  demoNote:
    "La web es instantánea, pero la API vive en Fly.io y duerme por inactividad: la primera petición tras un rato puede tardar unos segundos mientras arranca la máquina.",
  images: [],
  stack: [
    {
      name: "Next.js 14 (App Router) + React 18",
      category: "frontend",
      why: "Encaja con un sitio mayormente de contenido (home, carta) más unas pocas rutas autenticadas (reservas, panel de administración).",
    },
    {
      name: "TypeScript",
      category: "tooling",
      why: "Tipos compartidos (User, Reservation, Table, Review) entre las llamadas a la API y la UI.",
    },
    {
      name: "Tailwind CSS",
      category: "frontend",
      why: "Estilado rápido para un sitio con bastante superficie (home editorial, carta, panel admin) sin mantener una hoja de estilos propia.",
    },
    {
      name: "Node.js + Express 5",
      category: "backend",
      why: "API REST clásica; no hace falta un framework full-stack cuando el cliente ya es un proyecto Next.js separado.",
    },
    {
      name: "PostgreSQL",
      category: "backend",
      why: "Relaciones reales entre reservas, mesas y reseñas (FKs, UNIQUE constraints) que encajan mejor en un modelo relacional que en un documento.",
    },
    {
      name: "JWT + bcryptjs",
      category: "backend",
      why: "Autenticación stateless entre dos servicios desplegados por separado (Vercel / Fly.io), sin sesión de servidor compartida.",
    },
    {
      name: "Fly.io",
      category: "infra",
      why: "Despliegue del backend con máquinas que se apagan en inactividad: barato para un proyecto de portfolio, a cambio de cold starts.",
    },
    {
      name: "Vercel",
      category: "infra",
      why: "Despliegue del frontend Next.js con CI/CD nativo desde main.",
    },
    {
      name: "GitHub Actions",
      category: "tooling",
      why: "CI (lint, typecheck, tests) en la API, y un workflow de keepalive que hace ping a /health para mitigar el cold start de Fly.io.",
    },
  ],
  caseStudy: {
    problem:
      "Sistema de reservas real para un restaurante: comprobar disponibilidad de mesa sin dobles reservas, gestionar el ciclo de vida de una reserva (pendiente → confirmada → cancelada) y permitir reseñas solo a quien realmente tuvo una reserva confirmada — con un backend y un frontend que se despliegan y evolucionan por separado.",
    decisions: [
      {
        title: "Disponibilidad garantizada a nivel de base de datos, no solo de aplicación",
        detail:
          "La restricción UNIQUE(table_id, date, time) en PostgreSQL evita reservas duplicadas de la misma mesa en el mismo turno a nivel de base de datos, además de la comprobación de disponibilidad en la capa de aplicación — la garantía real vive en la BD, no solo en el código.",
      },
      {
        title: "Autorización por rol a nivel de middleware, no de controlador",
        detail:
          "Las reglas de acceso (customer / admin) quedan explícitas en la definición de las rutas en vez de esparcidas dentro de cada handler, así son visibles de un vistazo.",
      },
      {
        title: "El frontend no tiene lógica de negocio propia",
        detail:
          "restaurant-web no tiene base de datos ni reglas propias: toda la comunicación con el backend pasa por una única variable de entorno (NEXT_PUBLIC_API_URL) y un cliente fetch propio, sin proxy ni API routes intermedias — separación limpia entre dos despliegues independientes.",
      },
    ],
    challenge:
      "El manejo de errores está centralizado en un único middleware (errorHandler) que traduce excepciones de negocio (AppError) y códigos nativos de Postgres (23505 duplicado, 23503 FK inválida) a respuestas HTTP consistentes, evitando try/catch repetido en cada controlador (patrón asyncHandler). En producción, el backend en Fly.io \"duerme\" tras un rato de inactividad: la primera petición tras la inactividad puede tardar varios segundos en responder (cold start) mientras la máquina arranca. La mitigación es un workflow de GitHub Actions (keepalive.yml) que hace ping periódico a /health — el mismo endpoint pensado originalmente para probes de un orquestador, reutilizado para mantener la máquina despierta.",
    result:
      "Ambos servicios están desplegados y comunicándose en producción de forma independiente: la web en Vercel, la API en Fly.io, vía HTTPS y JWT. La API tiene su propia suite de tests (Jest + Supertest, mocks de Postgres, sin dependencias externas) centrada en lógica de negocio — disponibilidad, ownership, reglas de reseñas — no en CRUDs triviales, y CI ejecuta lint, typecheck y tests en cada push y pull request.",
  },
};
