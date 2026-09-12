# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Comandos

```bash
npm run dev              # Next dev server (localhost:3000); inicializa los bindings de Cloudflare en local
npm run build             # `next build` a secas — build "estándar" (también el que espera Vercel)
npm run build:cloudflare  # build de OpenNext para Cloudflare (por dentro invoca `npm run build`)
npm run preview           # build:cloudflare + Worker servido en local con wrangler
npm run deploy            # build:cloudflare + deploy a Cloudflare Workers
npm run lint               # eslint (flat config)
npx tsc --noEmit           # chequeo de tipos
npm run screenshots        # capturas de los despliegues con Playwright (normalmente solo en CI)
npm run cf-typegen         # regenera cloudflare-env.d.ts desde wrangler.jsonc (gitignored, regenerar tras tocar bindings)
```

No hay tests. La verificación es `npm run lint` + `npx tsc --noEmit` + `npm run build`.

## Idioma

Todo el repo está en español: copy de la UI, comentarios del código, mensajes de commit y
esta documentación. Mantenlo. Los comentarios explican **por qué** se tomó una decisión
(casi siempre una trampa concreta que se pisó, o una regla del sistema de diseño), no qué
hace el código — escribe en ese registro o no escribas comentario.

## Arquitectura

Portfolio personal (Next.js 16 App Router + React 19 + Tailwind v4), desplegado en
**Cloudflare Workers** vía `@opennextjs/cloudflare`. `npm run build` (`next build` puro) es
ahora el build por defecto porque otras plataformas (p. ej. Vercel) lo invocan así de serie;
el deploy real a Cloudflare pasa siempre por `build:cloudflare`, que envuelve ese mismo
`next build` y lo adapta al runtime de Workers.

### El contenido es la fuente de verdad

`content/` no es una carpeta de datos sueltos: es el modelo del que dependen las páginas,
el OG image, el sitemap, el endpoint de estado, el grafo de topología y el script de capturas.

- `content/types.ts` — el tipo `Project` (stack con el *porqué* de cada tecnología,
  `caseStudy` con `audit`/`decisions`/`challengeCode` opcionales, `timeline`, `metric`
  antes/después). Cambiarlo repercute en todo.
- `content/projects/*.ts` + `index.ts` — un archivo por proyecto; el orden del array de
  `index.ts` es el orden de la rejilla. `featured: true` solo en `codequest-rpg`. Incluye
  `pablo-redondo-dev.ts`: el propio portfolio listado como un proyecto más (con su
  `demoUrl` apuntando a producción, así que también entra en `/api/status`).
- `content/site.ts`, `home.ts`, `stack.ts` — datos del sitio, hero y stack de `/sobre-mi`.
- `content/topology.ts` / `stack-usage.ts` — derivan de `content/projects` en build/render
  (grafo de solapamiento de stack, conteo de uso por tecnología); no son contenido propio,
  no los edites a mano, edita los proyectos de los que salen.
- `content/tech-icons.ts` — **generado**, no editar a mano. Al añadir una tecnología nueva:
  `npm i --no-save simple-icons && node scripts/gen-tech-icons.mjs` (las reglas de
  resolución nombre→icono viven en ese script, y el orden de los patrones importa).

Añadir un proyecto = crear `content/projects/<slug>.ts` e importarlo en `index.ts`. La ruta
`/proyectos/[slug]`, el sitemap, el OG por proyecto y la comprobación de estado salen solos.

### Rutas y renderizado

Todo es estático salvo `app/api/status/route.ts`, que es `force-dynamic`. Ese endpoint:

- Comprueba en servidor los despliegues con `demoUrl` (desde el navegador la respuesta
  cross-origin sería opaca), con `http`/`https` de bajo nivel — no `fetch` — para poder
  leer los eventos de socket (`lookup`/`connect`/`secureConnect`) y sacar un desglose real
  por fase (dns/tcp/tls/ttfb), no un único RTT total.
- Cachea el resultado 5 min en memoria del proceso, para no martillear servicios ajenos.
- Persiste cada comprobación en el KV binding `STATUS_HISTORY` (declarado en
  `wrangler.jsonc`, leído vía `getCloudflareContext`) con una ventana de 30 días y un tope
  de 500 puntos, y calcula el `uptimePct` real a partir de ese histórico — nunca un valor
  de muestra. Si el binding no está disponible (p. ej. en local sin `wrangler`), el panel
  sigue funcionando sin histórico ni uptime en vez de romperse.

`app/opengraph-image.tsx` y `app/proyectos/[slug]/opengraph-image.tsx` generan las OG con
`ImageResponse`.

### Capturas de las demos

`scripts/capture-screenshots.ts` (tsx + Playwright) lee las `demoUrl` de `content/projects` y
escribe `public/screenshots/<slug>.png`. Corre **solo en CI** (`.github/workflows/screenshots.yml`,
semanal + manual, commitea los cambios) — nunca en el build, que no puede depender de que los
sitios ajenos estén levantados. `lib/screenshots.ts` comprueba en el servidor si el PNG existe
antes de que `LiveDemo` lo pida, para no dejar un 404 en consola. Ausencia de captura es un
estado válido.

### Estilos

Tailwind v4 sin `tailwind.config`: todo vive en `app/globals.css`. **Tema único oscuro** —
no hay variante clara ni `prefers-color-scheme`, ese soporte se quitó a propósito.

El archivo está en migración por fases (comentario "Fase 1 del rediseño" al inicio del
bloque de tokens): los tokens nuevos del sistema de diseño (`--bg-base`, `--bg-panel`,
`--ink-body`, `--ok`/`--warn`/`--crit`/`--meta`...) son la fuente de verdad, y los nombres
antiguos que ya consumen los componentes (`--surface`, `--ink-soft`, `--line`...) son alias
sobre ellos. Ambos juegos están expuestos como utilidades Tailwind vía `@theme inline`
(`bg-surface` y `bg-bg-panel` pintan lo mismo hoy). Al tocar un componente, usa las
utilidades nuevas del sistema de diseño si vas a tocar esa clase de todos modos; no hace
falta migrar en masa.

Las piezas visuales recurrentes son clases CSS propias en `globals.css` (~220 selectores),
no componentes: `.surface-card`/`.surface-panel`, `.btn-primary`/`.btn-secondary`, `.chip`,
`.terminal*`, `.project-index*`, `.stage-*` (tabs con `<input type="radio">`, sin JS),
`.text-display`/`.text-h1`/`.text-mono-*` (escala tipográfica). Antes de inventar una, busca
si ya existe ahí.

La entrada del hero usa `[data-enter="1"|"2"|"3"|"4"|"lcp"]` (CSS puro, arranca con el
primer pintado) en vez de `<Reveal>`: el hero no depende de hidratación ni de que el
IntersectionObserver dispare, y el elemento LCP (`data-enter="lcp"`) anima solo `transform`,
nunca `opacity` — Chrome no contabiliza como LCP lo que está invisible.

### Client components

Casi todo es server component. Cliente: `Header`, `Reveal`, `LiveDemo`, `CopyEmail`,
`LocalTime`, `DeploymentStatus`, y el resto de piezas interactivas/animadas del home y de
`/sobre-mi` — `SectionSpine`, `TopologyGraph`, `RequestTrace`, `HeroRoutes`, `HeroStats`,
`HopScrollSpy`, `Typewriter`, `RttBadge`, `Sparkline`, `PhaseTabs`, `EvalVsWorkerDemo`. Dos
reglas que ya se pagaron caras:

- `<Reveal>` envuelve contenido renderizado en servidor sin convertirlo en cliente, pero
  **no envuelvas el primer bloque above-the-fold**: arranca en `opacity: 0` y Chrome no
  contabiliza como LCP lo que está invisible (de ahí el mecanismo `data-enter` aparte para
  el hero — ver arriba).
- Con `stagger`, el `<Reveal>` *es* el contenedor de la lista: pásale las clases del grid por
  `className` y ajusta `as` (`ol`/`ul`/`dl`) para no romper el marcado.

### Despliegue en Cloudflare

- `wrangler.jsonc` — el `name` es por-rama, no por-repo: Workers Builds registra un Worker
  distinto según qué rama conectada dispara el deploy, y el build de una rama falla en
  silencio (deploy "verde" pero publicado bajo el nombre equivocado, dominio personalizado
  sin recibir nada) si el `name` de aquí no coincide con lo que esa rama tiene asignado —
  el propio CI lo dice en el log ("the CI system expected '<nombre>'") cuando no cuadra. En
  `main` es `portfolio-pre` (→ pre.pablo-redondo.dev); la rama de producción tiene su propio
  `wrangler.jsonc` con `portfolio` (→ pablo-redondo.dev). El binding `WORKER_SELF_REFERENCE`
  tiene que apuntar a ese mismo nombre, siempre. El binding KV `STATUS_HISTORY` respalda el
  histórico de `/api/status` (ver arriba); tiene `id` y `preview_id` reales, no de plantilla.
- `open-next.config.ts` — `buildCommand: "npm run build"` está fijado a mano (aunque ya
  coincide con el valor por defecto) para no depender de qué signifique "build" en
  `package.json` si vuelve a cambiar.
- No hay caché incremental en R2 (está comentada). No introduzcas rutas con `revalidate` sin
  activarla antes: el fallback en memoria no persiste entre invocaciones de Worker.
- `public/_headers` fija el `Cache-Control` inmutable de `/_next/static/*`.
