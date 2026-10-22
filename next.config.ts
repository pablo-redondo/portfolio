import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El dominio principal muestra solo la página «Próximamente»: las rutas
  // del portfolio antiguo siguen en el código, pero llevan a la portada.
  // Temporales (307) a propósito: volverán cuando se publique el nuevo.
  async redirects() {
    return [
      { source: "/proyectos/:path*", destination: "/", permanent: false },
      { source: "/proyectos", destination: "/", permanent: false },
      { source: "/sobre-mi", destination: "/", permanent: false },
      { source: "/contacto", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;

// Solo para `next dev`: expone en local los bindings de Cloudflare
// (assets, imágenes) que en producción pone el propio Worker. No afecta
// al build ni al deploy.
import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
