import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Circle, Keyboard, ShieldAlert } from "lucide-react";
import { Btn, PageHeader, Panel, Pill, SectionTitle, Stat } from "@/components/kit";
import { QrScanner } from "@/components/qr-scanner";
import { supabase } from "@/integrations/supabase/client";
import { checkinMessage, parsePassportCode, type CheckinResult } from "@/lib/passport";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/ssb_/attendance")({
  head: () => ({
    meta: [
      { title: "Absen QR Latihan · BolaID" },
      { name: "description", content: "Absensi latihan SSB dengan memindai QR Football Passport pemain." },
      { property: "og:title", content: "Absen QR Latihan · BolaID" },
      { property: "og:description", content: "Absensi latihan dengan QR Football Passport." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AttendancePage,
});

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

function AttendancePage() {
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
        <PageHeader eyebrow="Absen QR latihan" title="Akses belum aktif" />
        <Panel>
          <div className="flex gap-3 text-sm">
            <ShieldAlert className="h-6 w-6 shrink-0 text-warning" />
            <p>
              Akun <span className="font-semibold">{user.email}</span> belum ditetapkan sebagai panitia/pelatih.
              Kirim email ini ke pengelola BolaID untuk diaktifkan.
            </p>
          </div>
        </Panel>
      </div>
    );
  }
  return <Attendance />;
}

function Attendance() {
  const qc = useQueryClient();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [last, setLast] = useState<CheckinResult | null>(null);
  const [manual, setManual] = useState("");

  const sessionsQ = useQuery({
    queryKey: ["training-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_sessions")
        .select("id, team, title, starts_at, venue")
        .order("starts_at");
      if (error) throw error;
      return data;
    },
  });
  const selId = sessionId ?? sessionsQ.data?.[0]?.id ?? null;
  const session = sessionsQ.data?.find((s) => s.id === selId);

  const playersQ = useQuery({
    queryKey: ["team-players", session?.team],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("id, full_name, football_id")
        .eq("team", session!.team)
        .order("full_name");
      if (error) throw error;
      return data;
    },
  });

  const attQ = useQuery({
    queryKey: ["training-attendance", selId],
    enabled: !!selId,
    refetchInterval: 10_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_attendance")
        .select("player_id, recorded_at, method")
        .eq("session_id", selId!);
      if (error) throw error;
      return new Map(data.map((a) => [a.player_id, a]));
    },
  });

  const record = useMutation({
    mutationFn: async ({ code, method }: { code: string; method: "qr" | "manual" }) => {
      if (parsePassportCode(code, method).kind === "invalid") return { status: "unknown" } as CheckinResult;
      const { data, error } = await supabase.rpc("record_training_attendance", {
        _session_id: selId!,
        _code: code.trim(),
        _method: method,
      });
      if (error) throw error;
      return data as unknown as CheckinResult;
    },
    onSuccess: (r) => {
      setLast(r);
      if (r.status === "ok") qc.invalidateQueries({ queryKey: ["training-attendance", selId] });
    },
    onError: () => setLast({ status: "invalid_method" }),
  });

  const players = playersQ.data ?? [];
  const att = attQ.data ?? new Map();
  const present = players.filter((p) => att.has(p.id)).length;
  const msg = last ? checkinMessage(last) : null;

  function submitManual(e: FormEvent) {
    e.preventDefault();
    if (!manual.trim()) return;
    record.mutate({ code: manual, method: "manual" });
    setManual("");
  }

  return (
    <div>
      <PageHeader eyebrow="SSB · Latihan" title="Absen QR Passport" />
      <div className="mb-4 flex flex-wrap gap-2">
        {sessionsQ.data?.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSessionId(s.id); setLast(null); }}
            className={cn(
              "rounded-full border px-4 py-2 text-left text-sm",
              s.id === selId ? "border-primary bg-primary text-primary-foreground" : "bg-card",
            )}
          >
            <span className="font-semibold">{s.team}</span> · {s.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat label="Hadir" value={`${present}/${players.length}`} sub="pemain tim" />
        <Stat label="Belum hadir" value={players.length - present} sub="menunggu scan" />
        <Stat label="Sesi" value={session ? fmtTime(session.starts_at) : "-"} sub={session?.venue ?? ""} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className="space-y-4">
          <Panel>
            <SectionTitle eyebrow="Kamera" title="Pindai QR Passport" />
            <QrScanner disabled={!selId} onScan={(t) => record.mutate({ code: t, method: "qr" })} />
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
              <Btn type="submit" disabled={!selId || record.isPending}>
                <Keyboard className="h-4 w-4" /> Catat
              </Btn>
            </form>
          </Panel>
        </div>

        <Panel className="p-0 sm:p-0">
          <div className="border-b px-4 py-3 sm:px-5">
            <p className="font-display text-base font-bold">{session?.team ?? "Daftar pemain"}</p>
          </div>
          <ul className="divide-y">
            {players.map((p) => {
              const a = att.get(p.id);
              return (
                <li key={p.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  {a ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.full_name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{p.football_id}</p>
                  </div>
                  {a ? (
                    <Pill tone="success">{fmtTime(a.recorded_at)} · {a.method === "qr" ? "QR" : "Manual"}</Pill>
                  ) : (
                    <Pill>Belum hadir</Pill>
                  )}
                </li>
              );
            })}
            {!players.length && <li className="p-5 text-sm text-muted-foreground">Belum ada pemain.</li>}
          </ul>
        </Panel>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Sesi dan pemain saat ini adalah contoh. <Link to="/organizer/checkin" className="underline">Check-in pertandingan</Link>
      </p>
    </div>
  );
}
