import { describe, expect, it } from "vitest";
import {
  ASSESSMENT_ITEMS,
  averageScore,
  buildPlanInput,
  defaultScores,
  redactName,
  validateScores,
} from "@/lib/assessment";

describe("coach assessment rules", () => {
  it("accepts complete scores from 1 to 10 in steps of 0.5", () => {
    expect(validateScores({ ...defaultScores(), Passing: 9.5, Kecepatan: 1 })).toBe(true);
  });

  it("rejects missing items, out-of-range or off-step scores", () => {
    const { Passing: _omit, ...missing } = defaultScores();
    expect(validateScores(missing)).toBe(false);
    expect(validateScores({ ...defaultScores(), Passing: 11 })).toBe(false);
    expect(validateScores({ ...defaultScores(), Passing: 7.3 })).toBe(false);
  });

  it("averages all 18 items", () => {
    expect(ASSESSMENT_ITEMS).toHaveLength(18);
    expect(averageScore(defaultScores())).toBe(7);
  });
});

describe("AI plan input privacy", () => {
  const input = buildPlanInput({
    player: {
      full_name: "Rizky Pratama",
      football_id: "IDN-FB-2016-000123",
      category: "U10",
      position: "CM",
      birth_year: 2016,
    },
    assessments: [
      { period: "Q4 2026", scores: defaultScores(), note: "Rizky perlu lebih berani; pratama di passing.", created_at: "2026-11-18" },
    ],
    attendance: { sessionsHeld: 4, attended: 3 },
    now: new Date("2026-11-18"),
  });

  it("never sends the player's name or Football ID to the AI", () => {
    const text = JSON.stringify(input);
    expect(text).not.toMatch(/rizky/i);
    expect(text).not.toMatch(/pratama/i);
    expect(text).not.toContain("IDN-FB-2016-000123");
  });

  it("keeps age, category and attendance", () => {
    expect(input.perkiraan_usia).toBe(10);
    expect(input.kategori).toBe("U10");
    expect(input.kehadiran_latihan).toEqual({ sesi_berlangsung: 4, hadir: 3 });
  });

  it("redacts each part of the name", () => {
    expect(redactName("Ajak Rizky dan PRATAMA", "Rizky Pratama")).toBe("Ajak [pemain] dan [pemain]");
  });
});
