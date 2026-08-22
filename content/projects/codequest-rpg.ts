import type { Project } from "@/content/types";

export const codequestRpg: Project = {
  slug: "codequest-rpg",
  title: "CodeQuest RPG",
  tagline:
    "RPG en el navegador donde el combate es resolver código real: escribes JavaScript en un editor de verdad y tu solución se ejecuta en un Web Worker aislado.",
  status: "live",
  featured: true,
  tags: ["Educación"],
  repos: [{ label: "Repositorio", url: "https://github.com/pablo-redondo/codequest-rpg" }],
  demoUrl: "https://codequest-rpg.vercel.app",
  images: [],
  stack: [
    {
      name: "React 19",
      category: "frontend",
      why: "Rendimiento y estabilidad para una SPA con pantallas que se montan y desmontan mucho (mapa ↔ reto).",
    },
    {
      name: "TypeScript (strict)",
      category: "tooling",
      why: "Migración progresiva desde JS sin tipos, archivo por archivo; strict detecta los mismos bugs de estado que antes solo aparecían jugando.",
    },
    {
      name: "Vite",
      category: "tooling",
      why: "Arranque y HMR instantáneos, clave para iterar rápido en un proyecto que se reconstruyó por fases incrementales.",
    },
    {
      name: "Zustand + persist",
      category: "frontend",
      why: "Un único store organizado por dominios (player, challenge, session, skills) sin la ceremonia de Redux; persist(partialize) guarda solo player/skills, no la sesión de un reto en curso.",
    },
    {
      name: "CodeMirror 6",
      category: "frontend",
      why: "Editor con resaltado de sintaxis real, no un <textarea> — necesario para que \"el combate es código real\" se sienta de verdad.",
    },
    {
      name: "Vitest",
      category: "tooling",
      why: "Testea la lógica de negocio (store, sandbox, codeRunner) sin levantar un Worker real ni mockear timers.",
    },
    {
      name: "Playwright",
      category: "tooling",
      why: "Un único e2e del flujo completo (título → mapa → reto real → resultados), deliberadamente el único test que toca el navegador.",
    },
    {
      name: "GitHub Actions",
      category: "tooling",
      why: "CI gratuito para un proyecto personal: typecheck → lint → Vitest → Playwright antes de cada merge.",
    },
  ],
  caseStudy: {
    problem:
      "El proyecto empezó como una prueba de concepto abandonada a medias: una capa de trivia de opción múltiple con temática de RPG, sin persistencia, sin tipado y sin tests. Se retomó con una auditoría técnica honesta y se reconstruyó en fases incrementales, sin dejar el juego roto entre pasos.",
    decisions: [
      {
        title: "key={challenge.id} en vez de useEffect para resetear el editor",
        detail:
          "La primera versión usaba un useEffect que llamaba a setCode/setStatus al detectar un challenge.id distinto; eslint-plugin-react-hooks lo marcó como antipatrón (setState síncrono dentro de un efecto → renders en cascada). Remontar el subárbol con <ChallengeRunner key={challenge.id} /> hace que React destruya y recree la instancia en cada reto, con estado limpio sin sincronización manual.",
      },
      {
        title: "TypeScript progresivo, no una reescritura completa",
        detail:
          "La migración de .js/.jsx a .ts/.tsx se hizo archivo por archivo, verificando build y juego jugable en cada paso, en vez de una reescritura de una sola vez que arriesgaría romper algo a mitad de camino sin darse cuenta.",
      },
      {
        title: "Code-splitting de CodeMirror",
        detail:
          "CodeMirror es, con diferencia, la dependencia más pesada del proyecto. Cargar ChallengeScreen con React.lazy() + Suspense evita que TitleScreen y WorldMap paguen ese coste: el bundle inicial pasó de 734 kB a 216 kB (241,96 kB a 68,77 kB gzip), casi un 70% menos de JS en la carga inicial.",
      },
    ],
    challenge:
      "eval() o new Function() en el hilo principal comparte el mismo scope de ejecución que el resto de la app: un bucle infinito bloquea la UI de forma irrecuperable. Un Web Worker es un hilo real y aislado, sin memoria compartida ni acceso al DOM — y, el motivo decisivo, si el jugador escribe un bucle infinito, el hilo principal puede matarlo desde fuera. El propio worker no puede resolver su timeout si está colgado en un bucle síncrono, así que el reloj y el worker.terminate() viven deliberadamente en lib/codeRunner.ts (hilo principal), no dentro del worker.",
    result:
      "11 retos de código cubriendo las 6 zonas y los 6 conceptos definidos (variables, condicionales, bucles, arrays, funciones, recursión), con CI en verde (typecheck, lint, Vitest, e2e de Playwright) en cada push. Deliberadamente 100% client-side, sin backend ni cuentas: el progreso vive en localStorage del navegador, con las limitaciones que eso implica y que el propio README documenta sin disimularlas — por ejemplo, que los testCase.hidden no son seguridad real, solo un desincentivo pedagógico.",
  },
  timeline: [
    {
      order: 1,
      label: "Auditoría",
      summary: "Diagnóstico honesto de una PoC de trivia abandonada.",
      detail:
        "El proyecto era una capa de trivia de opción múltiple con temática de RPG: sin persistencia, sin tipado, sin tests. La auditoría decidió qué salvar (la ambientación y el mapa de zonas) y qué tirar por completo (la mecánica de trivia).",
      commitRange: "e9b911f–9a103c6",
    },
    {
      order: 2,
      label: "Refactor",
      summary: "Estado centralizado con Zustand, persistencia y TypeScript progresivo.",
      detail:
        "Se sustituyó el estado disperso por un único store organizado en dominios, con persist(partialize) y migración de JS a TS archivo por archivo, verificando el juego jugable en cada paso.",
      commitRange: "2d810d8",
    },
    {
      order: 3,
      label: "Core loop",
      summary: "La trivia se reemplaza por retos de código reales en un Web Worker aislado.",
      detail:
        "Editor CodeMirror real + ejecución en un Worker con timeout gestionado desde el hilo principal; encima, un sistema de maestría y hechizos con efectos mecánicos reales, no decorativos.",
      commitRange: "01b8f2d–76d6603",
    },
    {
      order: 4,
      label: "Contenido",
      summary: "De 4 a 11 retos, cubriendo las 6 zonas y conceptos.",
      detail:
        "Ampliación en dos tandas (7 retos/3 zonas, luego 4 retos más) para que los 6 conceptos tuvieran cobertura real y los hechizos fueran alcanzables sin repetir zona.",
      commitRange: "17fb41b, 99c2ecb",
    },
    {
      order: 5,
      label: "CI/CD",
      summary: "Pipeline typecheck → lint → Vitest → Playwright, y despliegue documentado.",
      detail:
        "GitHub Actions corre la suite completa en cada push; el deploy a Vercel usa la CLI (no la integración nativa) para que el mismo pipeline decida qué se despliega, y se salta en silencio si faltan los secrets.",
      commitRange: "9ef5487–f2d5c9e",
    },
    {
      order: 6,
      label: "Rediseño",
      summary: "Identidad pixel-art retro en 5 pasos, sin romper el juego entre pasos.",
      detail:
        "Paleta y tipografía retro → HP por segmentos → animaciones steps() → sonido vía Web Audio API → overlay CRT. Cada paso se integró jugable de principio a fin.",
      commitRange: "7998db1–95fb652",
    },
  ],
};
