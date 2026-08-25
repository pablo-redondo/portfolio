// Configuración del adaptador de OpenNext para Cloudflare Workers.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
	// Para ISR/on-demand revalidation de verdad hace falta un bucket R2 como
	// caché incremental — sin él cae al fallback en memoria, que no persiste
	// entre invocaciones. No hay ninguna ruta con `revalidate` en este sitio
	// (todo es estático o `force-dynamic`), así que no bloquea el deploy.
	// ver https://opennext.js.org/cloudflare/caching
	// incrementalCache: r2IncrementalCache,
});
