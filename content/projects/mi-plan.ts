import type { Project } from "@/content/types";

export const miPlan: Project = {
  slug: "mi-plan",
  title: "Mi Plan",
  tagline:
    "App personal de nutrición, gimnasio y diario de entrenos adaptada a turnos de trabajo rotativos — desplegada y en uso real.",
  status: "live",
  featured: false,
  tags: ["Herramientas"],
  repos: [{ label: "Repositorio", url: "https://github.com/pablo-redondo/mi-plan" }],
  demoUrl: "https://mi-plan-zeta.vercel.app",
  images: [],
  stack: [
    {
      name: "Vite + React 19",
      category: "frontend",
      why: "Arranque instantáneo para una SPA personal, sin necesidad de SSR.",
    },
    {
      name: "TypeScript",
      category: "tooling",
      why: "Tipar el contenido del plan (src/types/plan.ts) obliga a que el JSON y los componentes no se desincronicen.",
    },
    {
      name: "Tailwind CSS v4 (CSS-first)",
      category: "frontend",
      why: "Theming vía @theme sin tailwind.config.js; paleta deliberadamente restringida a un único acento para no recargar la UI.",
    },
    {
      name: "vite-plugin-pwa",
      category: "tooling",
      why: "Instalable en el móvil y funciona offline — el caso de uso real es mirar el plan en el gimnasio o haciendo la compra, no siempre con buena cobertura.",
    },
    {
      name: "localStorage + export/import JSON",
      category: "frontend",
      why: "Sin backend por diseño; el diario de entrenos es la única fuente de verdad de meses de progresión, así que se le añadió una red de seguridad exportable en vez de un backend solo para eso.",
    },
    {
      name: "Vitest + Testing Library",
      category: "tooling",
      why: "Cobertura de la lógica de src/lib y src/hooks (conversión a envases, validación de la importación), no de una app trivial.",
    },
    {
      name: "GitHub Actions",
      category: "tooling",
      why: "CI (lint, test, build) en cada push y pull request.",
    },
    {
      name: "Vercel",
      category: "infra",
      why: "Despliegue automático, coherente con ser una app personal de un solo usuario sin necesidad de infraestructura propia.",
    },
  ],
  caseStudy: {
    problem:
      "Los planes de nutrición y gimnasio genéricos asumen horarios fijos: desayuno, comida, cena y entreno a la misma hora todos los días. Eso no funciona con turnos de trabajo rotativos, donde el turno de la semana determina qué comidas aplican y a qué hora. Nació como un prototipo HTML de una sola página y se reescribió en React + TypeScript cuando el HTML se volvió difícil de mantener — es una app personal en uso real, no un ejercicio de portfolio construido desde cero.",
    decisions: [
      {
        title: "Contenido editorial como JSON tipado, no JSX hardcodeado",
        detail:
          "Todo el contenido (comidas, macros, rutina, reglas) vive en src/data/plan.json, tipado por src/types/plan.ts; los componentes solo mapean sobre esos datos. Separa \"cambiar qué come Pablo esta semana\" (editar JSON) de \"cambiar cómo se ve la app\" (editar componentes) — el plan cambia con más frecuencia que el código.",
      },
      {
        title: "Sin backend, con red de seguridad para lo que sí importa",
        detail:
          "El diario de entrenos vive en localStorage y es la única fuente de verdad de meses de progresión de cargas. En vez de añadir un backend solo para eso, se implementó export/import a JSON con validación de forma (parseSessionsExport): un archivo malformado falla con un aviso en vez de corromper el historial.",
      },
      {
        title: "Paleta de un único acento",
        detail:
          "Corrección consciente tras una primera pasada que aplicaba un color de fondo distinto por categoría (turnos, tipos de comida, PUSH/PULL/LEGS) y quedaba recargada. Ahora esas categorías se diferencian por tipografía e iconos, y el color de acento queda reservado al estado interactivo.",
      },
    ],
    challenge:
      "La primera versión de la lista de la compra sumaba ingredientes y mostraba el peso total en gramos — técnicamente correcto, inútil en la práctica (\"Queso cottage 2400g\" no dice cuántos botes comprar). src/lib/shoppingList.ts mapea cada ingrediente a su formato de venta real (tarrina de 250g, cartón de 1L, docena de huevos...) y redondea hacia arriba al envase más cercano, mostrando el peso exacto solo como referencia secundaria. Es el tipo de detalle que solo aparece usando la app de verdad para hacer la compra, no diseñándola en abstracto.",
    result:
      "En uso real desde su reescritura: desplegada en Vercel, instalable como PWA en el móvil, con CI (lint, test, build) en cada push. El diario de entrenos acumula sesiones reales de progresión de cargas, con export/import como red de seguridad frente a la pérdida de datos de localStorage.",
  },
};
