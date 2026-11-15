import type { ReactNode } from "react";
import { PageHeader, Panel, Pill, SectionTitle, Stat } from "@/components/kit";

type Tone = "neutral" | "success" | "warning" | "danger" | "signal" | "pitch";
export type Row = { title: string; sub?: string; meta?: string; tag?: string; tone?: Tone };
export type Section = { title: string; eyebrow?: string; rows: Row[] };

export function RolePage({
  eyebrow,
  title,
  stats,
  sections,
  children,
}: {
  eyebrow: string;
  title: string;
  stats?: { label: string; value: ReactNode; sub?: string }[];
  sections: Section[];
  children?: ReactNode;
}) {
  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} />
      {stats && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} {...(s.sub ? { sub: s.sub } : {})} />
          ))}
        </div>
      )}
      {children && <div className="mt-4">{children}</div>}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {sections.map((sec) => (
          <Panel key={sec.title}>
            <SectionTitle title={sec.title} {...(sec.eyebrow ? { eyebrow: sec.eyebrow } : {})} />
            <ul className="divide-y">
              {sec.rows.map((r) => (
                <li key={r.title + (r.sub ?? "")} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{r.title}</p>
                    {r.sub && <p className="truncate text-xs text-muted-foreground">{r.sub}</p>}
                  </div>
                  {r.meta && <span className="font-mono text-xs tabular text-muted-foreground">{r.meta}</span>}
                  {r.tag && <Pill tone={r.tone ?? "neutral"}>{r.tag}</Pill>}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}
