import type { CaseStudyCodeChange } from "@/content/types";

/**
 * Antes/después de un cambio de código. Ilustra la decisión ya descrita en
 * el párrafo que acompaña — no es un diff literal del repositorio, es la
 * forma más clara de enseñar el mismo cambio que el texto ya cuenta.
 */
export function CodeDiff({ change }: { change: CaseStudyCodeChange }) {
  return (
    <div className="code-diff">
      {change.file && <p className="code-diff-file">{change.file}</p>}
      <pre className="code-diff-before">
        {change.before
          .split("\n")
          .map((line, i) => (
            <span key={i} className="block">
              <span className="code-diff-mark">− </span>
              {line}
            </span>
          ))}
      </pre>
      <pre className="code-diff-after">
        {change.after
          .split("\n")
          .map((line, i) => (
            <span key={i} className="block">
              <span className="code-diff-mark">+ </span>
              {line}
            </span>
          ))}
      </pre>
    </div>
  );
}
