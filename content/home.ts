/**
 * Textos del hero de la home.
 *
 * Fuera del componente, igual que el resto del contenido del sitio: cambiar
 * cómo te presentas no debería obligar a tocar JSX.
 */
export const HOME_HERO = {
  /**
   * El titular va en dos tramos porque el sistema de diseño pinta el
   * segundo en el color de acento. Es el mismo texto, partido donde cambia
   * el color — no dos frases distintas.
   */
  headline: "Construyo los sistemas que ",
  headlineAccent: "antes sostenía.",
  // Aquí sí de dónde vengo: es lo que explica el titular. Los cuatro años
  // dando soporte a una red 24×7 no son biografía de relleno — son la razón
  // de que el criterio de esta web sea "¿dónde miro cuando algo falla?" en
  // vez de solo "¿qué construyo?".
  intro:
    "React, Next.js, Node y TypeScript sobre PostgreSQL, con tests, CI y despliegue real. Vengo de administrar infraestructura en 24×7, y eso decide cómo trabajo: cuando algo va lento o se cae, sé por dónde empezar a mirar — la petición, la latencia, el proceso que falla.",
};
