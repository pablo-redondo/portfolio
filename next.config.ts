import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// Solo para `next dev`: expone en local los bindings de Cloudflare
// (assets, imágenes) que en producción pone el propio Worker. No afecta
// al build ni al deploy.
import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
