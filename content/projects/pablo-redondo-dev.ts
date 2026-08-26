import type { Project } from "@/content/types";

export const pabloRedondoDev: Project = {
  slug: "pablo-redondo-dev",
  title: "pablo-redondo.dev",
  cardTitle: "pablo-redondo.dev",
  tagline:
    "Este mismo portfolio: Next.js con App Router, sistema de diseño propio y un tema oscuro único, autoalojado en Cloudflare Workers.",
  status: "live",
  featured: false,
  tags: ["Full-stack"],
  repos: [{ label: "Repositorio", url: "https://github.com/pablo-redondo/portfolio" }],
  demoUrl: "https://pablo-redondo.dev",
  images: [],
  stack: [
    {
      name: "Next.js 16 (App Router)",
      category: "frontend",
      why: "Server Components por defecto para el contenido estático de content/, y un puñado de islas cliente (el filtro del stack, el terminal de /contacto) solo donde hace falta interactividad.",
    },
    {
      name: "React 19 + TypeScript estricto",
      category: "frontend",
      why: "El contenido de cada proyecto vive tipado en content/types.ts: un caso de estudio sin `challenge` o un badge de estado con un valor que no sea `live`/`in-progress`/`archived` no compila.",
    },
    {
      name: "Tailwind CSS v4 (CSS-first, @theme)",
      category: "frontend",
      why: "Sin tailwind.config.js: los tokens del sistema de diseño (superficies, tinta, acento, estados semánticos, escala tipográfica) se definen una vez como custom properties en globals.css y @theme inline los expone como utilidades.",
    },
    {
      name: "next/font (Manrope + JetBrains Mono)",
      category: "frontend",
      why: "Autoalojadas con next/font/google — cero peticiones a fonts.googleapis.com y cero salto de layout por fuente de sistema mientras cargan.",
    },
    {
      name: "OpenNext + Cloudflare Workers",
      category: "infra",
      why: "opennextjs-cloudflare adapta el output de Next.js al runtime de Workers; el propio portfolio se sirve así en vez de en una plataforma pensada solo para Next.",
    },
    {
      name: "Playwright",
      category: "tooling",
      why: "Un script en CI (scripts/capture-screenshots.ts) navega a cada demo desplegada, incluido este sitio, y guarda su captura — sin mantener una lista de imágenes a mano.",
    },
    {
      name: "GitHub Actions",
      category: "tooling",
      why: "CI en cada push: lint, typecheck y build antes de que Cloudflare Workers Builds despliegue.",
    },
  ],
  caseStudy: {
    problem:
      "Un portfolio que enumera tecnologías es una lista de la compra. Este sitio intenta ser, además, la prueba: un panel de estado que monitoriza en vivo los despliegues del resto de proyectos (incluido el suyo propio), un sistema de diseño con tokens y escala tipográfica documentados en el propio CSS en vez de valores sueltos por componente, y una página de contacto que es literalmente una terminal interactiva en vez de un formulario.",
    decisions: [
      {
        title: "Tema único, sin alternar claro/oscuro",
        detail:
          "El sistema de diseño se pensó para un solo tema oscuro deliberado, no para una versión clara reducida a negativo. Menos superficie de mantenimiento y menos pares de contraste que verificar, a cambio de no ofrecer modo claro.",
      },
      {
        title: "Contraste verificado con la fórmula real, no a ojo",
        detail:
          "Cada par texto/superficie del sistema (por ejemplo --ink-meta sobre --bg-raised) se comprobó con un script que implementa sRGB → luminancia relativa → ratio de contraste de WCAG 2, no con una herramienta de terceros de la que fiarse a ciegas.",
      },
      {
        title: "Alias de tokens para migrar sin tocar componentes",
        detail:
          "Al rediseñar la paleta, los nombres de utilidad que ya usaban los componentes (bg-surface, text-ink-soft, border-line...) se mantuvieron como alias hacia los tokens nuevos. El color de todo el sitio cambió sin editar una sola página, y los componentes migran a los nombres nuevos de forma progresiva.",
      },
    ],
    challenge:
      "El estado de cada despliegue (DeploymentStatusPanel) hace una comprobación HTTP real desde el servidor contra las demos de los demás proyectos — no un badge estático que miente en cuanto algo se cae. Vive cacheada 5 minutos en memoria del proceso para no lanzar una ronda de peticiones contra servicios ajenos cada vez que alguien abre la página, el mismo criterio de discreción que aplica NetPulse con sus propios checks.",
    result:
      "Desplegado en Cloudflare Workers bajo dominio propio, con puntuaciones de Lighthouse en producción habitualmente entre 97 y 100. Sigue siendo un proyecto vivo: este mismo rediseño visual se está haciendo por fases (tokens, componentes, páginas, movimiento) para poder revisar cada una antes de pasar a la siguiente.",
  },
};
