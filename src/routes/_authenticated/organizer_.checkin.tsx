import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, Circle, Keyboard, ShieldAlert } from "lucide-react";
import { Btn, PageHeader, Panel, Pill, SectionTitle, Stat } from "@/components/kit";
import { QrScanner } from "@/components/qr-scanner";
import { supabase } from "@/integrations/supabase/client";
import { checkinMessage, parsePassportCode, type CheckinResult } from "@/lib/passport";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/organizer_/checkin")({
  head: () => ({
    meta: [
      { title: "Check-in Pertandingan · BolaID" },
      {
        name: "description",
        content: "Panitia memindai QR Football Passport untuk mencatat kehadiran pemain di setiap laga.",
      },
      { property: "og:title", content: "Check-in Pertandingan · BolaID" },
      { property: "og:description", content: "Check-in pemain dengan QR Football Passport." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckinPage,
});

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}
function fmtKickoff(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CheckinPage() {
  const { user } = Route.useRouteContext();
  const roleQuery = useQuery({
    queryKey: ["my-roles", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (error) throw error;
      return data.map((r) => r.role);
    },
  });

  if (roleQuery.isLoading) return <p className="text-sm text-muted-foreground">Memuat akses…</p>;
  if (!roleQuery.data?.includes("organizer")) {
    return (
      <div className="mx-auto max-w-lg">
        <PageHeader eyebrow="Check-in pertandingan" title="Akses panitia belum aktif" />
        <Panel>
          <div className="flex gap-3">
            <ShieldAlert className="h-6 w-6 shrink-0 text-warning" />
            <div className="text-sm">
              <p>
                Akun <span className="font-semibold">{user.email}</span> belum ditetapkan sebagai panitia.
                Hanya akun yang ditunjuk pemilik turnamen yang dapat memindai dan melihat catatan check-in.
              </p>
              <p className="mt-2 text-muted-foreground">
                Kirim email ini ke pengelola BolaID untuk diaktifkan.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    );
  }
  return <OrganizerCheckin />;
}

type RosterRow = {
  team: string;
  shirt_number: number | null;
  player: { id: string; full_name: string; football_id: string };
};

function OrganizerCheckin() {
  const qc = useQueryClient();
  const [matchId, setMatchId] = useState<string | null>(null);
  const [last, setLast] = useState<CheckinResult | null>(null);
  const [manual, setManual] = useState("");

  const matchesQ = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("id, tournament_name, category, home_team, away_team, kickoff_at, venue")
        .order("kickoff_at");
      if (error) throw error;
      return data;
    },
  });
  const selectedId = matchId ?? matchesQ.data?.[0]?.id ?? null;
  const match = matchesQ.data?.find((m) => m.id === selectedId);

  const rosterQ = useQuery({
    queryKey: ["roster", selectedId],
    enabled: !!selectedId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_roster")
        .select("team, shirt_number, player:players(id, full_name, football_id)")
        .eq("match_id", selectedId!)
        .order("team")
        .order("shirt_number");
      if (error) throw error;
      return data as unknown as RosterRow[];
    },
  });

  const checkinsQ = useQuery({
    queryKey: ["checkins", selectedId],
    enabled: !!selectedId,
    refetchInterval: 10_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_checkins")
        .select("player_id, checked_in_at, method, checked_in_by")
        .eq("match_id", selectedId!);
      if (error) throw error;
      const officerIds = [...new Set(data.map((c) => c.checked_in_by))];
      const names = new Map<string, string>();
      if (officerIds.length) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", officerIds);
        profiles?.forEach((p) => names.set(p.id, p.display_name));
      }
      return new Map(
        data.map((c) => [c.player_id, { ...c, officer: names.get(c.checked_in_by) ?? "Panitia" }]),
      );
    },
  });

  const checkin = useMutation({
    mutationFn: async ({ code, method }: { code: string; method: "qr" | "manual" }) => {
      const parsed = parsePassportCode(code, method);
      if (parsed.kind === "invalid") return { status: "unknown" } as CheckinResult;
      const { data, error } = await supabase.rpc("check_in_player", {
        _match_id: selectedId!,
        _code: code.trim(),
        _method: method,
      });
      if (error) throw error;
      return data as unknown as CheckinResult;
    },
    onSuccess: (r) => {
      setLast(r);
      if (r.status === "ok") qc.invalidateQueries({ queryKey: ["checkins", selectedId] });
    },
    onError: () => setLast({ status: "invalid_method" }),
  });

  const roster = rosterQ.data ?? [];
  const checkins = checkinsQ.data ?? new Map();
  const teams = useMemo(() => [...new Set(roster.map((r) => r.team))], [roster]);
  const present = roster.filter((r) => checkins.has(r.player.id)).length;
  const msg = last ? checkinMessage(last) : null;

  function submitManual(e: FormEvent) {
    e.preventDefault();
    if (!manual.trim()) return;
    checkin.mutate({ code: manual, method: "manual" });
    setManual("");
  }

  return (
    <div>
      <PageHeader eyebrow={match?.tournament_name ?? "Check-in pertandingan"} title="Check-in pemain" />

      <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1">
        {matchesQ.data?.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMatchId(m.id);
              setLast(null);
            }}
            className={cn(
              "shrink-0 rounded-2xl border px-4 py-2.5 text-left",
              m.id === selectedId ? "border-primary bg-secondary" : "bg-card hover:bg-muted",
            )}
          >
            <p className="text-sm font-bold">
              {m.category} · {m.home_team} vs {m.away_team}
            </p>
            <p className="text-xs text-muted-foreground">
              {fmtKickoff(m.kickoff_at)} · {m.venue}
            </p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat label="Hadir" value={`${present}/${roster.length}`} sub="pemain roster" />
        <Stat label="Belum hadir" value={roster.length - present} sub="menunggu check-in" />
        <Stat label="Laga" value={match?.category ?? "-"} sub={match?.venue ?? ""} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className="space-y-4">
          <Panel>
            <SectionTitle eyebrow="Kamera" title="Pindai QR Passport" />
            <QrScanner
              disabled={!selectedId}
              onScan={(text) => checkin.mutate({ code: text, method: "qr" })}
            />
            {msg && (
              <div
                role="status"
                className={cn(
                  "mt-3 rounded-xl p-3 text-sm",
                  msg.tone === "success" && "bg-success-soft text-success",
                  msg.tone === "warning" && "bg-warning-soft text-warning",
                  msg.tone === "danger" && "bg-danger-soft text-destructive",
                )}
              >
                <p className="font-bold">{msg.title}</p>
                <p className="mt-0.5 text-foreground/80">{msg.detail}</p>
              </div>
            )}
          </Panel>
          <Panel>
            <SectionTitle eyebrow="Cadangan" title="Input manual" />
            <form onSubmit={submitManual} className="flex gap-2">
              <input
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="IDN-FB-2016-000123"
                aria-label="Football ID atau kode passport"
                className="h-10 min-w-0 flex-1 rounded-full border bg-background px-4 font-mono text-sm"
              />
              <Btn type="submit" disabled={!selectedId || checkin.isPending}>
                <Keyboard className="h-4 w-4" /> Catat
              </Btn>
            </form>
          </Panel>
        </div>

        <Panel className="p-0 sm:p-0">
          {teams.map((team) => (
            <div key={team}>
              <div className="border-b px-4 py-3 sm:px-5">
                <p className="font-display text-base font-bold">{team}</p>
              </div>
              <ul className="divide-y">
                {roster
                  .filter((r) => r.team === team)
                  .map((r) => {
                    const c = checkins.get(r.player.id);
                    return (
                      <li key={r.player.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                        {c ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                        ) : (
                          <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                        )}
                        <span className="w-6 font-mono text-xs text-muted-foreground">
                          {r.shirt_number ?? "-"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{r.player.full_name}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">{r.player.football_id}</p>
                        </div>
                        {c ? (
                          <div className="text-right">
                            <Pill tone="success">{fmtTime(c.checked_in_at)}</Pill>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {c.method === "qr" ? "QR" : "Manual"} · {c.officer}
                            </p>
                          </div>
                        ) : (
                          <Pill>Belum hadir</Pill>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
          {!roster.length && (
            <p className="p-5 text-sm text-muted-foreground">
              {rosterQ.isLoading ? "Memuat roster…" : "Belum ada roster untuk laga ini."}
            </p>
          )}
        </Panel>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Data laga dan pemain saat ini adalah contoh. <Link to="/organizer" className="underline">Kembali ke dashboard</Link>
      </p>
    </div>
  );
}
