import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  averageScore,
  buildPlanInput,
  developmentPlanSchema,
  normalizePlan,
  validateScores,
  type Scores,
} from "@/lib/assessment";

const saveInput = z.object({
  playerId: z.string().uuid(),
  period: z.string().trim().min(2).max(40),
  scores: z.record(z.number()),
  note: z.string().max(1000),
});

export const saveAssessment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => saveInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: coach } = await supabase.rpc("is_coach", { _user_id: userId });
    if (!coach) return { ok: false as const, error: "Akun ini belum ditetapkan sebagai pelatih." };
    if (!validateScores(data.scores)) return { ok: false as const, error: "Skor penilaian tidak lengkap." };
    const { data: row, error } = await supabase
      .from("player_assessments")
      .insert({
        player_id: data.playerId,
        coach_id: userId,
        period: data.period,
        scores: data.scores,
        average: averageScore(data.scores),
        note: data.note.trim(),
      })
      .select("id")
      .single();
    if (error) {
      console.error("saveAssessment", error);
      return { ok: false as const, error: "Penilaian gagal disimpan." };
    }
    return { ok: true as const, id: row.id };
  });

const INSTRUCTIONS = `Anda adalah pelatih kepala pembinaan sepak bola usia dini di Indonesia (filosofi Kurikulum Sepak Bola Indonesia / Filanesia).
Susun rencana pengembangan individu 8 minggu dalam Bahasa Indonesia untuk satu pemain anak berdasarkan data penilaian (skala 1–10) dan kehadiran latihan.
Aturan:
- Sesuaikan dengan usia/kategori: utamakan kesenangan, sentuhan bola, permainan kecil; hindari beban fisik berlebih.
- summary: 2–3 kalimat. strengths: 2–4 poin. focus_areas: tepat 3 area prioritas, masing-masing 2–3 latihan konkret (nama + cara singkat).
- weekly_plan: tepat 4 blok ("Minggu 1–2", "Minggu 3–4", "Minggu 5–6", "Minggu 7–8") dengan 2–3 aktivitas.
- parent_note: pesan positif singkat untuk orang tua, dengan 1–2 kegiatan di rumah.
- Jika data kehadiran 0 sesi, jangan menyimpulkan kedisiplinan dari kehadiran.
- Sebut pemain sebagai "pemain"; jangan mengarang nama, diagnosis medis, atau data yang tidak ada.`;

export const generateDevelopmentPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ playerId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: coach } = await supabase.rpc("is_coach", { _user_id: userId });
    if (!coach) return { ok: false as const, error: "Akun ini belum ditetapkan sebagai pelatih." };

    const { data: player } = await supabase
      .from("players")
      .select("id, full_name, football_id, team, category, position, birth_year")
      .eq("id", data.playerId)
      .maybeSingle();
    if (!player) return { ok: false as const, error: "Pemain tidak ditemukan." };

    const { data: assessments } = await supabase
      .from("player_assessments")
      .select("id, period, scores, note, created_at")
      .eq("player_id", player.id)
      .order("created_at", { ascending: false })
      .limit(3);
    if (!assessments?.length) {
      return { ok: false as const, error: "Simpan minimal satu penilaian sebelum membuat rencana." };
    }

    const { data: sessions } = await supabase
      .from("training_sessions")
      .select("id")
      .eq("team", player.team)
      .lte("starts_at", new Date().toISOString());
    const sessionIds = (sessions ?? []).map((s) => s.id);
    let attended = 0;
    if (sessionIds.length) {
      const { count } = await supabase
        .from("training_attendance")
        .select("id", { count: "exact", head: true })
        .eq("player_id", player.id)
        .in("session_id", sessionIds);
      attended = count ?? 0;
    }

    const input = buildPlanInput({
      player,
      assessments: assessments.map((a) => ({ ...a, scores: a.scores as Scores })),
      attendance: { sessionsHeld: sessionIds.length, attended },
    });

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false as const, error: "Konfigurasi AI belum lengkap." };

    const { streamText, Output, NoObjectGeneratedError } = await import("ai");
    const { createGatewayResponsesProvider, gatewayErrorMessage, DEVELOPMENT_PLAN_MODEL } = await import(
      "@/lib/ai-gateway.server"
    );
    const provider = createGatewayResponsesProvider(apiKey);

    let plan;
    try {
      const result = streamText({
        model: provider.responses(DEVELOPMENT_PLAN_MODEL),
        instructions: INSTRUCTIONS,
        messages: [{ role: "user", content: `Data pemain:\n${JSON.stringify(input)}` }],
        output: Output.object({ schema: developmentPlanSchema }),
        maxRetries: 0,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      plan = normalizePlan(await result.output);
    } catch (error) {
      console.error("generateDevelopmentPlan", error);
      if (NoObjectGeneratedError.isInstance(error)) {
        return { ok: false as const, error: "AI tidak mengembalikan rencana yang lengkap. Coba lagi." };
      }
      return { ok: false as const, error: gatewayErrorMessage(error) };
    }

    const { data: row, error } = await supabase
      .from("development_plans")
      .insert({
        player_id: player.id,
        assessment_id: assessments[0]!.id,
        created_by: userId,
        plan,
        model: DEVELOPMENT_PLAN_MODEL,
      })
      .select("id, created_at")
      .single();
    if (error) {
      console.error("save plan", error);
      return { ok: false as const, error: "Rencana dibuat tetapi gagal disimpan." };
    }
    return { ok: true as const, id: row.id, created_at: row.created_at, plan };
  });
