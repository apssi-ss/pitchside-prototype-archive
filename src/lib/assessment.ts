import { z } from "zod";
import { assessmentTemplate } from "@/lib/mock-data";

export { assessmentTemplate };

export const ASSESSMENT_ITEMS: string[] = assessmentTemplate.flatMap((g) => g.items);

export type Scores = Record<string, number>;

export function defaultScores(): Scores {
  return Object.fromEntries(ASSESSMENT_ITEMS.map((i) => [i, 7]));
}

/** Every template item must be present with a score from 1 to 10 in steps of 0.5. */
export function validateScores(scores: Record<string, unknown>): scores is Scores {
  const keys = Object.keys(scores);
  if (keys.length !== ASSESSMENT_ITEMS.length) return false;
  return ASSESSMENT_ITEMS.every((item) => {
    const v = scores[item];
    return typeof v === "number" && v >= 1 && v <= 10 && Number.isInteger(v * 2);
  });
}

export function averageScore(scores: Scores): number {
  const v = ASSESSMENT_ITEMS.map((i) => scores[i] ?? 0);
  return Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 100) / 100;
}

export function groupAverages(scores: Scores): { group: string; average: number }[] {
  return assessmentTemplate.map((g) => ({
    group: g.group,
    average: Math.round((g.items.reduce((s, i) => s + (scores[i] ?? 0), 0) / g.items.length) * 10) / 10,
  }));
}

export function currentPeriod(date = new Date()): string {
  return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
}

export const developmentPlanSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  focus_areas: z.array(
    z.object({ area: z.string(), reason: z.string(), drills: z.array(z.string()) }),
  ),
  weekly_plan: z.array(
    z.object({ week: z.string(), focus: z.string(), activities: z.array(z.string()) }),
  ),
  parent_note: z.string(),
});
export type DevelopmentPlan = z.infer<typeof developmentPlanSchema>;

/** Keep AI output within the sizes the UI expects. */
export function normalizePlan(p: DevelopmentPlan): DevelopmentPlan {
  const s = (t: string, n = 400) => t.trim().slice(0, n);
  return {
    summary: s(p.summary, 600),
    strengths: p.strengths.slice(0, 4).map((t) => s(t, 160)),
    focus_areas: p.focus_areas.slice(0, 3).map((f) => ({
      area: s(f.area, 80),
      reason: s(f.reason, 300),
      drills: f.drills.slice(0, 4).map((d) => s(d, 200)),
    })),
    weekly_plan: p.weekly_plan.slice(0, 8).map((w) => ({
      week: s(w.week, 40),
      focus: s(w.focus, 120),
      activities: w.activities.slice(0, 4).map((a) => s(a, 200)),
    })),
    parent_note: s(p.parent_note, 500),
  };
}

/** Remove every part of the player's name from free text before it leaves the app. */
export function redactName(text: string, fullName: string): string {
  let out = text;
  for (const part of fullName.split(/\s+/).filter((w) => w.replace(/\W/g, "").length >= 2)) {
    const esc = part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(esc, "gi"), "[pemain]");
  }
  return out;
}

export type PlanInputSource = {
  player: { full_name: string; football_id: string; category: string; position: string; birth_year: number | null };
  assessments: { period: string; scores: Scores; note: string; created_at: string }[];
  attendance: { sessionsHeld: number; attended: number };
  now?: Date;
};

/** Minimal, de-identified data sent to the AI: no name, Football ID, team or passport token. */
export function buildPlanInput(src: PlanInputSource) {
  const year = (src.now ?? new Date()).getFullYear();
  return {
    kategori: src.player.category,
    perkiraan_usia: src.player.birth_year ? year - src.player.birth_year : null,
    posisi: src.player.position || null,
    kehadiran_latihan: {
      sesi_berlangsung: src.attendance.sessionsHeld,
      hadir: src.attendance.attended,
    },
    penilaian_terbaru: src.assessments.map((a) => ({
      periode: a.period,
      rata_rata: averageScore(a.scores),
      per_aspek: groupAverages(a.scores),
      skor: a.scores,
      catatan_pelatih: redactName(a.note, src.player.full_name),
    })),
  };
}
