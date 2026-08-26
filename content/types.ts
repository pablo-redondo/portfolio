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

export interface CaseStudyDecision {
  title: string;
  detail: string;
}

export interface CaseStudy {
  problem: string;
  decisions: CaseStudyDecision[];
  challenge: string;
  result: string;
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
