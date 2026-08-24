"use client";

import { useEffect, useState } from "react";

/**
 * Hora local de Galicia, en vivo.
 *
 * Arranca vacía y se rellena tras montar: la hora del servidor y la del
 * navegador no tienen por qué coincidir, y pintarla en el HTML daría un
 * desajuste de hidratación. El hueco se reserva con `min-width` para que al
 * aparecer no empuje la línea.
 */
export function LocalTime() {
  const [hora, setHora] = useState("");

  useEffect(() => {
    const formato = new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Madrid",
    });
    const tic = () => setHora(formato.format(new Date()));
    tic();
    // Cada segundo, no cada minuto: así el cambio de minuto se ve al
    // instante en vez de con hasta 59s de retraso. React descarta el
    // re-render cuando la cadena no cambia, así que sale gratis.
    const id = setInterval(tic, 1000);
    return () => clearInterval(id);
  }, []);

  if (!hora) return <span className="local-time" aria-hidden />;

  return (
    <span className="local-time">
      {hora}
      <span className="local-time-dot" aria-hidden />
    </span>
  );
}
