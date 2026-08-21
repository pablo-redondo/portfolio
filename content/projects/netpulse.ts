import type { Project } from "@/content/types";

export const netpulse: Project = {
  slug: "netpulse",
  title: "NetPulse",
  tagline:
    "Dashboard de monitorización de red: checks reales de HTTP, DNS, TCP, TLS y NTP contra 21 servicios públicos, con incidentes y una vista de segmentación de red.",
  status: "live",
  featured: false,
  tags: ["Redes/Infra", "Full-stack"],
  repos: [{ label: "Repositorio", url: "https://github.com/pablo-redondo/netpulse" }],
  images: [],
  stack: [
    {
      name: "NestJS",
      category: "backend",
      why: "Estructura por módulos y servicios que encaja con el patrón de estrategia por tipo de check (CheckStrategy) y con @nestjs/schedule para el scheduler.",
    },
    {
      name: "Prisma + PostgreSQL",
      category: "backend",
      why: "Migraciones versionadas y agregados (HourlyStat) con índices compuestos, necesarios para calcular uptime sobre semanas de histórico sin recorrer todas las filas.",
    },
    {
      name: "Next.js (App Router) + Tailwind",
      category: "frontend",
      why: "Server components que llaman a la API desde el servidor, no desde el navegador — evita tener que configurar CORS.",
    },
    {
      name: "pnpm workspaces (monorepo)",
      category: "tooling",
      why: "packages/shared-types comparte los mismos tipos (CheckType, MonitoredService, CheckResult) entre apps/api y apps/web, evitando que las interfaces se dupliquen y se desincronicen sin avisar.",
    },
    {
      name: "node:dgram (cliente NTP propio)",
      category: "backend",
      why: "El check de NTP implementa el protocolo a mano sobre un socket UDP normal en vez de envolver una librería: el hueco que dejó descartar el ping, sin depender de ningún binario del sistema.",
    },
    {
      name: "Render",
      category: "infra",
      why: "Proceso persistente para el backend, necesario porque el scheduler tiene que seguir vivo entre peticiones, no solo responder bajo demanda.",
    },
    {
      name: "Vercel",
      category: "infra",
      why: "El frontend es un conjunto de páginas servidas bajo demanda; encaja mejor en un modelo serverless que en un proceso persistente.",
    },
  ],
  caseStudy: {
    problem:
      "Comprobar de verdad si un servicio de internet sigue en pie no es solo lanzar un HTTP GET: distintos protocolos fallan de formas distintas (un DNS que no resuelve no es lo mismo que un socket que no conecta, ni que un certificado a punto de caducar), y las herramientas típicas como ping no están disponibles sin privilegios elevados en un contenedor de un PaaS. NetPulse nació para juntar en un proyecto las dos mitades de lo que se estudia: redes (ASIR) y desarrollo web (DAW).",
    decisions: [
      {
        title: "Por qué no hay ping",
        detail:
          "Un ping ICMP necesita CAP_NET_RAW o invocar el binario del sistema con child_process, que no está garantizado en un contenedor de un PaaS y falla de forma fea cuando no lo está. El check TCP (net.Socket, API de primera clase en Node) responde a la misma pregunta —¿llego, y cuánto tardo?— y mide algo más representativo, porque incluye el establecimiento de conexión.",
      },
      {
        title: "Monorepo con pnpm workspaces por shared-types",
        detail:
          "Backend y frontend comparten las mismas formas de datos. Tenerlas en un paquete del workspace evita el baile de duplicar interfaces que se desincronizan sin que nadie se entere hasta que algo falla en producción.",
      },
      {
        title: "HourlyStat como agregado, no calculado al vuelo",
        detail:
          "Calcular el uptime de un mes contando filas de CheckResult son unas 8.600 filas por servicio en cada carga del panel; con el agregado por hora son unas 720 filas sobre un índice compuesto. La media incremental usa un divisor propio (latencyChecks, no totalChecks) para que un timeout sin latencia no arrastre la media hacia abajo.",
      },
      {
        title: "Paleta validada en OKLCH, no elegida a ojo",
        detail:
          "El verde fósforo de la identidad y el verde de 'estado OK' competían por significado; se separaron en capas (saturado solo para OK/identidad, desaturado para el resto del chrome, cian para la serie de datos) y los valores se validaron con un script que exige distinguibilidad también bajo protanopia y deuteranopia.",
      },
    ],
    challenge:
      "Cada tipo de comprobación (HTTP, DNS, TCP, TLS, NTP) es una estrategia con la misma interfaz (CheckStrategy), elegida en tiempo de ejecución según el tipo de servicio — añadir un cuarto tipo de check no toca el scheduler. El scheduler lanza todos los checks activos en paralelo con Promise.allSettled para que el timeout de uno no arrastre a los demás. El caso más particular es el check de NTP: en vez de envolver una librería, implementa el protocolo a mano sobre node:dgram (paquete NTPv3 de 48 bytes) y aplica la fórmula clásica de sincronización con las cuatro marcas de tiempo (T1–T4) para calcular el desfase de reloj.",
    result:
      "Desplegado y funcionando: backend en Render (con su scheduler corriendo de verdad contra los 21 servicios del catálogo) y frontend en Vercel, comunicándose servidor a servidor sin CORS que configurar. Los tests cubren las estrategias de check (fetch/dns/net mockeados) y la aritmética del agregado horario con una función pura, incluyendo un test que reproduce literalmente un bug real de la media. Pendiente: el plan free de Render duerme el servicio a los 15 minutos de inactividad, dejando huecos en el histórico — pasar a un plan de pago es el siguiente paso para que sea un monitor de verdad.",
  },
};
