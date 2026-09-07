/**
 * Tipo mínimo de KVNamespace, escrito a mano.
 *
 * `wrangler types` genera uno completo en cloudflare-env.d.ts, pero ese
 * archivo está en .gitignore a propósito (no es código, es un volcado del
 * runtime de Cloudflare) y el build de Cloudflare Workers no lo regenera
 * antes de compilar — así que sin esto el binding no existe para el
 * `tsc` de CI aunque funcione en local. Cubre solo los métodos que
 * /api/status usa de verdad, no la API completa.
 */
declare global {
  interface KVNamespace {
    get<T = unknown>(key: string, type: "json"): Promise<T | null>;
    get(key: string, type?: "text"): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  }

  interface CloudflareEnv {
    STATUS_HISTORY?: KVNamespace;
  }
}

export {};
