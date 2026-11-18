import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, Btn, PageHeader, Panel, Pill, SectionTitle } from "@/components/kit";
import { AccessPending, useMyRoles } from "@/components/staff-access";
import { supabase } from "@/integrations/supabase/client";
import {
  assessmentTemplate,
  averageScore,
  currentPeriod,
  defaultScores,
  groupAverages,
  type DevelopmentPlan,
  type Scores,
} from "@/lib/assessment";
import { generateDevelopmentPlan, saveAssessment } from "@/lib/coach.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/coach_/assessment")({
  validateSearch: z.object({ player: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Penilaian Pemain & Rencana AI · BolaID" },
      {
        name: "description",
        content: "Pelatih menilai teknik, taktik, fisik, mental, dan sosial pemain, lalu membuat rencana pengembangan dengan AI.",
      },
      { property: "og:title", content: "Penilaian Pemain & Rencana AI · BolaID" },
      { property: "og:description", content: "Penilaian pelatih tersimpan dan rencana pengembangan individu berbasis AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AssessmentPage,
});

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
const initials = (n: string) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);

function AssessmentPage() {
  const { user } = Route.useRouteContext();
  const roles = useMyRoles(user.id);
  if (roles.isLoading) return <p className="text-sm text-muted-foreground">Memuat akses…</p>;
  if (!roles.data?.includes("coach")) {
    return <AccessPending eyebrow="Pelatih · Penilaian" email={user.email} roleLabel="pelatih" />;
  }
  return <Assessment />;
}

function Assessment() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const playersQ = useQuery({
    queryKey: ["roster-players"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("id, football_id, full_name, team, category, position, birth_year")
        .order("team")
        .order("full_name");
      if (error) throw error;
      return data;
    },
  });
  const players = playersQ.data ?? [];
  const selected = players.find((p) => p.id === search.player);
  const teams = useMemo(() => [...new Set(players.map((p) => p.team))], [players]);
  const [teamPick, setTeamPick] = useState<string | null>(null);
  const team = teamPick ?? selected?.team ?? teams[0] ?? null;
  const teamPlayers = players.filter((p) => p.team === team);
  const player = selected && selected.team === team ? selected : teamPlayers[0];

  if (playersQ.isLoading) return <p className="text-sm text-muted-foreground">Memuat pemain…</p>;

  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow={`${team ?? "Tim"} · Periode ${currentPeriod()}`} title="Penilaian pemain" />

      <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {teams.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTeamPick(t);
              navigate({ search: {} });
            }}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm",
              t === team ? "border-primary bg-primary text-primary-foreground" : "bg-card",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {teamPlayers.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate({ search: { player: p.id } })}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-3 py-2 transition-colors",
              p.id === player?.id ? "border-pitch bg-pitch text-pitch-foreground" : "bg-card",
            )}
          >
            <Avatar initials={initials(p.full_name)} tone={p.id === player?.id ? "signal" : "muted"} className="h-9 w-9 text-xs" />
            <span className="max-w-16 truncate text-[11px] font-bold">{p.full_name.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {player ? (
        <PlayerAssessment key={player.id} player={player} />
      ) : (
        <Panel>
          <p className="text-sm text-muted-foreground">
            Belum ada pemain. <Link to="/ssb/roster" className="underline">Tambah pemain di roster</Link>.
          </p>
        </Panel>
      )}
    </div>
  );
}

type Player = { id: string; football_id: string; full_name: string; team: string; category: string; position: string };

function PlayerAssessment({ player }: { player: Player }) {
  const qc = useQueryClient();
  const save = useServerFn(saveAssessment);
  const generate = useServerFn(generateDevelopmentPlan);
  const [scores, setScores] = useState<Scores>(defaultScores);
  const [openGroup, setOpenGroup] = useState("Teknik");
  const [note, setNote] = useState("");
  const [period, setPeriod] = useState(currentPeriod());
  const avg = averageScore(scores);

  const historyQ = useQuery({
    queryKey: ["assessments", player.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_assessments")
        .select("id, period, scores, average, note, created_at")
        .eq("player_id", player.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });
  const planQ = useQuery({
    queryKey: ["development-plan", player.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("development_plans")
        .select("id, plan, created_at")
        .eq("player_id", player.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const saveM = useMutation({
    mutationFn: () => save({ data: { playerId: player.id, period, scores, note } }),
    onSuccess: (r) => {
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      toast.success(`Penilaian ${player.full_name} disimpan`);
      setNote("");
      qc.invalidateQueries({ queryKey: ["assessments", player.id] });
      qc.invalidateQueries({ queryKey: ["roster-assessments"] });
    },
    onError: () => toast.error("Penilaian gagal disimpan."),
  });

  const planM = useMutation({
    mutationFn: () => generate({ data: { playerId: player.id } }),
    onSuccess: (r) => {
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      toast.success("Rencana pengembangan dibuat");
      qc.invalidateQueries({ queryKey: ["development-plan", player.id] });
    },
    onError: () => toast.error("Rencana belum berhasil dibuat. Coba lagi."),
  });

  const history = historyQ.data ?? [];
  const groupAvg = (items: string[]) => items.reduce((s, i) => s + (scores[i] ?? 0), 0) / items.length;

  return (
    <>
      <Panel className="mb-4 flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold leading-tight">{player.full_name}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {player.football_id} · {player.category}
            {player.position ? ` · ${player.position}` : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Rata-rata</p>
          <p className="font-display text-3xl font-extrabold tabular">{avg.toFixed(1)}</p>
        </div>
      </Panel>

      <div className="space-y-2">
        {assessmentTemplate.map((g) => {
          const open = openGroup === g.group;
          return (
            <Panel key={g.group} className="p-0 sm:p-0">
              <button
                onClick={() => setOpenGroup(open ? "" : g.group)}
                className="flex w-full items-center justify-between gap-3 p-4"
                aria-expanded={open}
              >
                <span className="font-display text-base font-bold">{g.group}</span>
                <span className="flex items-center gap-2">
                  <Pill tone="neutral">{groupAvg(g.items).toFixed(1)}</Pill>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                </span>
              </button>
              {open && (
                <ul className="space-y-4 border-t px-4 py-4">
                  {g.items.map((item) => (
                    <li key={item}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <label htmlFor={item} className="font-semibold">{item}</label>
                        <span className="font-mono font-bold">{(scores[item] ?? 0).toFixed(1)}</span>
                      </div>
                      <input
                        id={item}
                        type="range"
                        min={1}
                        max={10}
                        step={0.5}
                        value={scores[item]}
                        onChange={(e) => setScores((s) => ({ ...s, [item]: Number(e.target.value) }))}
                        className="h-2 w-full cursor-pointer accent-primary"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          );
        })}
      </div>

      <Panel className="mt-4 space-y-3">
        <label className="block text-sm font-bold">
          Periode
          <input
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            maxLength={40}
            className="mt-2 h-10 w-full rounded-xl border bg-background px-3 text-sm font-normal"
          />
        </label>
        <label htmlFor="note" className="block text-sm font-bold">Catatan pelatih</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Contoh: Receiving under pressure masih ragu; sangat semangat di permainan kecil."
          className="w-full resize-none rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </Panel>

      <Btn size="lg" className="mt-4 w-full" disabled={saveM.isPending || period.trim().length < 2} onClick={() => saveM.mutate()}>
        {saveM.isPending ? "Menyimpan…" : "Simpan penilaian"}
      </Btn>

      <Panel className="mt-6">
        <SectionTitle eyebrow="Riwayat" title="Penilaian tersimpan" />
        {history.length ? (
          <ul className="divide-y">
            {history.map((h) => (
              <li key={h.id} className="py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{h.period} · {fmtDate(h.created_at)}</p>
                  <Pill tone="success">{Number(h.average).toFixed(1)}</Pill>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {groupAverages(h.scores as Scores).map((g) => (
                    <Pill key={g.group}>{g.group} {g.average.toFixed(1)}</Pill>
                  ))}
                </div>
                {h.note && <p className="mt-1.5 text-xs text-muted-foreground">{h.note}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{historyQ.isLoading ? "Memuat…" : "Belum ada penilaian untuk pemain ini."}</p>
        )}
      </Panel>

      <Panel className="mt-4">
        <SectionTitle
          eyebrow="Lovable AI"
          title="Rencana pengembangan individu"
          action={
            <Btn variant="signal" size="sm" disabled={!history.length || planM.isPending} onClick={() => planM.mutate()}>
              <Sparkles className="h-4 w-4" />
              {planM.isPending ? "Menyusun…" : planQ.data ? "Buat ulang" : "Buat rencana"}
            </Btn>
          }
        />
        <p className="mb-3 text-xs text-muted-foreground">
          AI hanya menerima skor, catatan (tanpa nama), kategori usia, posisi, dan kehadiran latihan — tanpa nama atau Football ID.
        </p>
        {planM.isPending && <p className="text-sm text-muted-foreground">AI sedang menyusun rencana, biasanya kurang dari satu menit…</p>}
        {!planM.isPending && planQ.data && (
          <PlanView plan={planQ.data.plan as DevelopmentPlan} createdAt={planQ.data.created_at} />
        )}
        {!planM.isPending && !planQ.data && (
          <p className="text-sm text-muted-foreground">
            {history.length ? "Belum ada rencana. Tekan “Buat rencana”." : "Simpan penilaian terlebih dahulu."}
          </p>
        )}
      </Panel>
    </>
  );
}

function PlanView({ plan, createdAt }: { plan: DevelopmentPlan; createdAt: string }) {
  return (
    <div className="space-y-4 text-sm">
      <p className="text-xs text-muted-foreground">Dibuat {fmtDate(createdAt)} · periksa sebelum dibagikan</p>
      <p>{plan.summary}</p>
      {plan.strengths.length > 0 && (
        <div>
          <p className="mb-1.5 font-bold">Kekuatan</p>
          <div className="flex flex-wrap gap-1.5">
            {plan.strengths.map((s) => <Pill key={s} tone="success">{s}</Pill>)}
          </div>
        </div>
      )}
      <div className="space-y-3">
        <p className="font-bold">Fokus pengembangan</p>
        {plan.focus_areas.map((f) => (
          <div key={f.area} className="rounded-xl border p-3">
            <p className="font-semibold">{f.area}</p>
            <p className="mt-0.5 text-muted-foreground">{f.reason}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {f.drills.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-2 font-bold">Rencana 8 minggu</p>
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {plan.weekly_plan.map((w) => (
            <li key={w.week} className="rounded-xl bg-muted p-3">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{w.week}</p>
              <p className="font-semibold">{w.focus}</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs">
                {w.activities.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </div>
      <div className="rounded-xl bg-success-soft p-3">
        <p className="font-bold text-success">Untuk orang tua</p>
        <p className="mt-0.5">{plan.parent_note}</p>
      </div>
    </div>
  );
}
