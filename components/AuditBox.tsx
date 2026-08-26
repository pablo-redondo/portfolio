import type { CaseStudyAudit } from "@/content/types";

/** Dos columnas: qué se salvó del estado anterior y qué se tiró. */
export function AuditBox({ audit }: { audit: CaseStudyAudit }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="audit-box" data-kind="keep">
        <p className="text-mono-meta text-ok uppercase">salvar · lo que ya funcionaba</p>
        <ul className="mt-3 flex flex-col gap-2">
          {audit.keep.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
              <span aria-hidden className="text-ok">
                +
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="audit-box" data-kind="cut">
        <p className="text-mono-meta text-crit uppercase">tirar · lo que hacía que no funcionara</p>
        <ul className="mt-3 flex flex-col gap-2">
          {audit.cut.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
              <span aria-hidden className="text-crit">
                −
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
