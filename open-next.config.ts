// Configuración del adaptador de OpenNext para Cloudflare Workers.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

const config = {
	...defineCloudflareConfig({
		// Para ISR/on-demand revalidation de verdad hace falta un bucket R2 como
		// caché incremental — sin él cae al fallback en memoria, que no
		// persiste entre invocaciones. No hay ninguna ruta con `revalidate` en
		// este sitio (todo es estático o `force-dynamic`), así que no bloquea
		// el deploy.
		// ver https://opennext.js.org/cloudflare/caching
		// incrementalCache: r2IncrementalCache,
	}),
	// Sin esto, `opennextjs-cloudflare build` construye el Next.js interno
	// con `npm run build` por defecto — y `npm run build` ES
	// `opennextjs-cloudflare build`, porque es el comando que corre
	// Cloudflare como paso de build. Eso se llama a sí mismo sin fin: cada
	// invocación lanza otra copia entera de sí misma, sin tope. Apuntando al
	// script que hace un `next build` normal se rompe el bucle.
	buildCommand: "npm run build:next",
};

export default config;
