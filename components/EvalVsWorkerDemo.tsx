"use client";

import { useState } from "react";

/**
 * Simulación del reto técnico, no una ejecución real: pintar un
 * `eval("while(true){}")` de verdad en el hilo principal congelaría esta
 * misma página. El botón demuestra el CONCEPTO (uno se bloquea, el otro se
 * recupera) con dos temporizadores inertes, y lo dice explícitamente.
 */
export function EvalVsWorkerDemo() {
  const [estado, setEstado] = useState<"idle" | "corriendo" | "terminado">("idle");

  const ejecutar = () => {
    setEstado("corriendo");
    window.setTimeout(() => setEstado("terminado"), 1600);
  };

  return (
    <div className="mb-7">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-crit/30 bg-crit/5 p-4">
          <p className="text-mono-meta text-crit uppercase">eval() en el hilo principal</p>
          <p className="text-body-sm mt-2 text-ink-soft">
            Mismo scope que el resto de la app: un bucle infinito bloquea la UI sin
            retorno.
          </p>
          <p className="text-mono-data mt-3 text-crit">
            {estado === "idle" && "en espera"}
            {estado === "corriendo" && "◼ hilo bloqueado…"}
            {estado === "terminado" && "◼ seguiría bloqueado (no hay quien lo pare)"}
          </p>
        </div>
        <div className="rounded-lg border border-ok/30 bg-ok/5 p-4">
          <p className="text-mono-meta text-ok uppercase">worker aislado + terminate()</p>
          <p className="text-body-sm mt-2 text-ink-soft">
            Hilo real y aislado; el principal puede matarlo desde fuera si se
            cuelga.
          </p>
          <p className="text-mono-data mt-3 text-ok">
            {estado === "idle" && "en espera"}
            {estado === "corriendo" && "◼ ejecutando, con timeout armado…"}
            {estado === "terminado" && "✓ worker.terminate() tras 1.6 s"}
          </p>
        </div>
      </div>

      <button type="button" onClick={ejecutar} className="btn btn-secondary mt-4">
        {estado === "idle" ? "Ejecutar while (true) {}" : "Ejecutar de nuevo"}
      </button>
      <p className="text-mono-meta mt-2 text-ink-faint">
        simulado — no se ejecuta código arbitrario en esta página
      </p>
    </div>
  );
}
