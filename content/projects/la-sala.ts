import type { Project } from "@/content/types";

export const laSala: Project = {
  slug: "la-sala",
  title: "La Sala",
  tagline:
    "Explorador de películas y series sobre la API de TMDB, con disponibilidad real por plataforma de streaming en España.",
  status: "live",
  featured: false,
  tags: ["Herramientas"],
  repos: [{ label: "Repositorio", url: "https://github.com/pablo-redondo/la-sala" }],
  images: [],
  stack: [
    {
      name: "Next.js (App Router) + React 19",
      category: "frontend",
      why: "Server components para llamar a TMDB desde el servidor sin exponer la API key al navegador.",
    },
    {
      name: "TypeScript",
      category: "tooling",
      why: "Tipos propios para las respuestas de TMDB (TmdbMovieResult, TmdbCollection, TmdbTVSeason...) en vez de consumir la API sin tipar.",
    },
    {
      name: "TanStack Query",
      category: "frontend",
      why: "Para las interacciones de cliente (watchlist, filtros) que sí necesitan estado y revalidación en el navegador, sin duplicar la caché de servidor de Next.",
    },
    {
      name: "Tailwind CSS v4",
      category: "frontend",
      why: "Utilidades para el grueso de la maquetación de páginas de catálogo, ficha y descubrimiento.",
    },
    {
      name: "TMDB API",
      category: "infra",
      why: "Catálogo de películas, series, personas y temporadas, más disponibilidad por plataforma (datos de JustWatch) en un único proveedor con soporte de es-ES nativo.",
    },
    {
      name: "localStorage",
      category: "frontend",
      why: "La watchlist vive en el navegador, sin backend propio ni cuentas de usuario.",
    },
  ],
  caseStudy: {
    problem:
      "Encontrar qué ver y, sobre todo, dónde verlo: la mayoría de exploradores de películas se quedan en la ficha técnica y la nota media, sin decir en qué plataforma de streaming está disponible ahora mismo en España, ni distinguir si es una suscripción, un alquiler o una compra.",
    decisions: [
      {
        title: "La API key de TMDB nunca llega al navegador",
        detail:
          "Todas las peticiones a TMDB pasan por funciones de servidor (lib/tmdb.ts, services/tmdb.ts) consumidas desde server components; el cliente nunca ve la clave ni hace la petición directamente.",
      },
      {
        title: "Caché vía fetch + revalidate, no una capa propia",
        detail:
          "Cada petición usa next: { revalidate: 3600 }, apoyándose en la caché del App Router de Next en vez de montar una capa de caché manual para datos que cambian poco, como la ficha de una película o el catálogo de géneros.",
      },
      {
        title: "Filtros de Discover como estado de URL, no de React",
        detail:
          "Tipo, género, orden, nota mínima y año viven en los searchParams, no en un useState: los filtros son enlaces compartibles y funcionan con navegación server-rendered, sin sincronizar un estado de cliente con la URL a mano.",
      },
    ],
    challenge:
      "La disponibilidad por plataforma viene de los datos de JustWatch que expone la propia API de TMDB, ya segmentados en incluido en suscripción, alquiler y compra para la región de España. Esa consulta —y la de todo el catálogo— pasa por funciones que corren en el servidor, con la clave de API en una variable de entorno sin prefijo NEXT_PUBLIC_, así que nunca llega al bundle del cliente.",
    result:
      "Cobertura funcional amplia: descubrimiento con filtros (género, orden, nota mínima, año), fichas de película, serie y temporada, reparto y equipo, tráilers, reseñas, colecciones y fichas de persona, watchlist persistida en localStorage y disponibilidad real por plataforma de streaming. Usa tanto la API de TMDB como la de OMDb según la pantalla.",
  },
};
