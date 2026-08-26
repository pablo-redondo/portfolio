export type ProjectStatus = "live" | "in-progress" | "archived";

export const PROJECT_TAGS = ["Full-stack", "Educación", "Redes/Infra", "Herramientas"] as const;

export type TechCategory = "frontend" | "backend" | "infra" | "tooling";

export interface TechChoice {
  name: string;
  category: TechCategory;
  /** Por qué se eligió esta tecnología en este proyecto, no una descripción genérica. */
  why: string;
}

export interface TimelinePhase {
  order: number;
  label: string;
  summary: string;
  detail: string;
  commitRange?: string;
}

export interface CaseStudyCodeChange {
  file?: string;
  before: string;
  after: string;
}

export interface CaseStudyDecision {
  title: string;
  detail: string;
  /** Solo cuando la propia `detail` ya describe un cambio a nivel de código. */
  code?: CaseStudyCodeChange;
}

/**
 * Qué se salvó y qué se tiró al retomar un proyecto abandonado a medias.
 * No es contenido nuevo: reformatea en lista lo que `problem` ya cuenta en
 * prosa, para poder mostrarlo como el propio audit que fue.
 */
export interface CaseStudyAudit {
  keep: string[];
  cut: string[];
}

export interface CaseStudy {
  problem: string;
  /** Presente solo si el proyecto se retomó de un estado previo real. */
  audit?: CaseStudyAudit;
  decisions: CaseStudyDecision[];
  challenge: string;
  /** Fragmento real que ilustra la solución que describe `challenge`. */
  challengeCode?: { file: string; code: string };
  result: string;
  /** Una cifra suelta que `result` ya menciona en prosa (p. ej. «11 retos»). */
  stat?: { label: string; value: string };
}

export interface ProjectImage {
  src: string;
  alt: string;
}

/**
 * Un antes/después medido del proyecto, para destacarlo como dato suelto
 * fuera del cuerpo del caso de estudio. No es contenido nuevo: los dos
 * números salen del propio `caseStudy` y solo se sacan aquí para poder
 * pintarlos como dato y no como párrafo.
 */
export interface ProjectMetric {
  label: string;
  before: { value: string; note: string };
  after: { value: string; note: string };
  note: string;
}

export interface ProjectRepo {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  /**
   * Título para la card de la rejilla, cuando el completo es demasiado
   * largo ahí. La página del proyecto sigue usando `title`.
   */
  cardTitle?: string;
  tagline: string;
  status: ProjectStatus;
  /** Solo true para el proyecto insignia (codequest-rpg). */
  featured: boolean;
  tags: string[];
  stack: TechChoice[];
  repos: ProjectRepo[];
  demoUrl?: string;
  /**
   * Aviso honesto sobre la demo antes de cargarla: por ejemplo, que el
   * backend duerme por inactividad y la primera petición tarda.
   */
  demoNote?: string;
  images: ProjectImage[];
  caseStudy: CaseStudy;
  /** Solo presente en codequest-rpg. */
  timeline?: TimelinePhase[];
  /** Antes/después medido, si el proyecto tiene uno que destacar. */
  metric?: ProjectMetric;
}
