# pablo-redondo.dev

Portfolio personal de Pablo Redondo — Next.js (App Router) + TypeScript + Tailwind CSS.

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

- `app/` — páginas (Home, Proyectos, Sobre mí, Contacto) y layout raíz.
- `content/` — modelo de contenido tipado (`types.ts`) y los proyectos (`content/projects/*.ts`).
- `components/` — Header, Footer y piezas de UI compartidas.

Las fuentes (JetBrains Mono, Source Serif 4) se autoalojan vía `next/font/google`.

## Estado

Scaffolding inicial: estructura de páginas y tokens visuales aplicados, sin contenido
real de proyectos todavía. El contenido de los 6 proyectos se añade en el siguiente paso.
