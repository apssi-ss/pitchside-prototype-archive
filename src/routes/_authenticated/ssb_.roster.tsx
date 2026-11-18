import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";
import { ClipboardCheck, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Btn, PageHeader, Panel, Pill, SectionTitle, Stat } from "@/components/kit";
import { AccessPending, useMyRoles } from "@/components/staff-access";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/ssb_/roster")({
  head: () => ({
    meta: [
      { title: "Roster Pemain SSB · BolaID" },
      { name: "description", content: "Roster pemain SSB tersimpan: tim, kategori usia, Football ID, dan status penilaian." },
      { property: "og:title", content: "Roster Pemain SSB · BolaID" },
      { property: "og:description", content: "Kelola roster pemain SSB dan pendaftaran Football ID." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RosterPage,
});

const CATEGORIES = ["U6", "U8", "U10", "U12", "U13", "U14", "U15", "U16", "U17"];

function RosterPage() {
  const { user } = Route.useRouteContext();
  const roles = useMyRoles(user.id);
  if (roles.isLoading) return <p className="text-sm text-muted-foreground">Memuat akses…</p>;
  const r = roles.data ?? [];
  if (!r.includes("coach") && !r.includes("organizer")) {
    return <AccessPending eyebrow="SSB · Roster" email={user.email} roleLabel="pelatih atau panitia" />;
  }
  return <Roster isCoach={r.includes("coach")} />;
}

function Roster({ isCoach }: { isCoach: boolean }) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [team, setTeam] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

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

  const assessQ = useQuery({
    queryKey: ["roster-assessments"],
    enabled: isCoach,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_assessments")
        .select("player_id, average, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const latest = new Map<string, { average: number; created_at: string }>();
      for (const a of data) if (!latest.has(a.player_id)) latest.set(a.player_id, a);
      return latest;
    },
  });

  const players = playersQ.data ?? [];
  const teams = useMemo(() => [...new Set(players.map((p) => p.team))], [players]);
  const filtered = players.filter(
    (p) =>
      (!team || p.team === team) &&
      (!q.trim() ||
        p.full_name.toLowerCase().includes(q.trim().toLowerCase()) ||
        p.football_id.toLowerCase().includes(q.trim().toLowerCase())),
  );
  const latest = assessQ.data ?? new Map();
  const assessed = players.filter((p) => latest.has(p.id)).length;

  return (
    <div>
      <PageHeader eyebrow="SSB · Roster tersimpan" title="Roster pemain">
        <p className="mt-2 text-sm text-muted-foreground">
          Data tersimpan untuk pelatih dan panitia yang ditetapkan.
        </p>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Pemain" value={players.length} />
        <Stat label="Tim" value={teams.length} />
        <Stat label="Sudah dinilai" value={isCoach ? `${assessed}/${players.length}` : "-"} />
        <Stat label="Kategori" value={new Set(players.map((p) => p.category)).size} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama atau Football ID"
            aria-label="Cari pemain"
            className="h-10 w-full rounded-full border bg-background pl-9 pr-4 text-sm"
          />
        </div>
        <Btn variant="outline" onClick={() => setShowForm((s) => !s)}>
          <UserPlus className="h-4 w-4" /> Tambah pemain
        </Btn>
      </div>

      {showForm && (
        <AddPlayerForm
          teams={teams}
          onDone={() => {
            setShowForm(false);
            qc.invalidateQueries({ queryKey: ["roster-players"] });
          }}
        />
      )}

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {[null, ...teams].map((t) => (
          <button
            key={t ?? "all"}
            onClick={() => setTeam(t)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm",
              team === t ? "border-primary bg-primary text-primary-foreground" : "bg-card",
            )}
          >
            {t ?? "Semua tim"}
          </button>
        ))}
      </div>

      <Panel className="mt-3 p-0 sm:p-0">
        <ul className="divide-y">
          {filtered.map((p) => {
            const a = latest.get(p.id);
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.full_name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {p.football_id} · {p.team}
                  </p>
                </div>
                <Pill>{p.category}</Pill>
                {p.position && <Pill tone="pitch">{p.position}</Pill>}
                {isCoach && (
                  <>
                    {a ? <Pill tone="success">Nilai {Number(a.average).toFixed(1)}</Pill> : <Pill tone="warning">Belum dinilai</Pill>}
                    <Link
                      to="/coach/assessment"
                      search={{ player: p.id }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      <ClipboardCheck className="h-3.5 w-3.5" /> Nilai
                    </Link>
                  </>
                )}
              </li>
            );
          })}
          {playersQ.isLoading && <li className="p-5 text-sm text-muted-foreground">Memuat pemain…</li>}
          {!playersQ.isLoading && !filtered.length && (
            <li className="p-5 text-sm text-muted-foreground">Tidak ada pemain yang cocok.</li>
          )}
        </ul>
      </Panel>
      <p className="mt-4 text-xs text-muted-foreground">Pemain awal adalah data contoh.</p>
    </div>
  );
}

function AddPlayerForm({ teams, onDone }: { teams: string[]; onDone: () => void }) {
  const [form, setForm] = useState({ name: "", team: teams[0] ?? "", category: "U10", birthYear: "2016", position: "" });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const add = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("register_player", {
        _full_name: form.name,
        _team: form.team,
        _category: form.category,
        _birth_year: Number(form.birthYear),
        _position: form.position,
      });
      if (error) throw error;
      return data as { status: string; football_id?: string };
    },
    onSuccess: (r) => {
      if (r.status === "ok") {
        toast.success(`${form.name} terdaftar`, { description: `Football ID ${r.football_id}` });
        onDone();
      } else if (r.status === "forbidden") toast.error("Akun ini tidak punya akses menambah pemain.");
      else toast.error("Data belum valid. Periksa nama, tim, kategori, dan tahun lahir.");
    },
    onError: () => toast.error("Pemain gagal disimpan."),
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    add.mutate();
  }

  const input = "h-10 w-full rounded-xl border bg-background px-3 text-sm";
  return (
    <Panel className="mt-3">
      <SectionTitle eyebrow="Pendaftaran" title="Pemain baru" />
      <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-xs font-semibold lg:col-span-2">
          Nama lengkap
          <input required minLength={2} maxLength={80} value={form.name} onChange={set("name")} className={cn(input, "mt-1")} />
        </label>
        <label className="text-xs font-semibold">
          Tim / SSB
          <input required list="team-options" minLength={2} maxLength={80} value={form.team} onChange={set("team")} className={cn(input, "mt-1")} />
          <datalist id="team-options">
            {teams.map((t) => <option key={t} value={t} />)}
          </datalist>
        </label>
        <label className="text-xs font-semibold">
          Kategori
          <select value={form.category} onChange={set("category")} className={cn(input, "mt-1")}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold">
          Tahun lahir
          <input required type="number" min={2005} max={2024} value={form.birthYear} onChange={set("birthYear")} className={cn(input, "mt-1")} />
        </label>
        <label className="text-xs font-semibold">
          Posisi (opsional)
          <input maxLength={10} placeholder="CM, GK…" value={form.position} onChange={set("position")} className={cn(input, "mt-1")} />
        </label>
        <div className="flex items-end sm:col-span-2 lg:col-span-4">
          <Btn type="submit" disabled={add.isPending}>
            {add.isPending ? "Menyimpan…" : "Simpan pemain"}
          </Btn>
        </div>
      </form>
    </Panel>
  );
}
