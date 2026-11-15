import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, Goal, Square, Repeat, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Btn, PageHeader, Panel, Pill, SectionTitle, Segmented } from "@/components/kit";
import { reportSquads } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/referee_/report")({
  head: () => ({
    meta: [
      { title: "Laporan Wasit Pertandingan · BolaID" },
      {
        name: "description",
        content: "Catat skor, kartu, pergantian, dan insiden pertandingan langsung dari lapangan.",
      },
      { property: "og:title", content: "Laporan Wasit Pertandingan · BolaID" },
      {
        property: "og:description",
        content: "Match report wasit yang langsung memperbarui hasil dan klasemen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportPage,
});

type Side = "home" | "away";
type EventType = "goal" | "yellow" | "red" | "sub" | "incident";
type MatchEvent = { id: number; minute: number; side: Side; type: EventType; player: string };

const eventMeta: Record<EventType, { label: string; icon: typeof Goal; cls: string }> = {
  goal: { label: "Gol", icon: Goal, cls: "bg-success-soft text-success" },
  yellow: { label: "Kuning", icon: Square, cls: "bg-signal text-signal-foreground" },
  red: { label: "Merah", icon: Square, cls: "bg-danger-soft text-destructive" },
  sub: { label: "Ganti", icon: Repeat, cls: "bg-muted text-foreground" },
  incident: { label: "Insiden", icon: AlertTriangle, cls: "bg-warning-soft text-warning" },
};

const phases = [
  { value: "pre", label: "Belum" },
  { value: "h1", label: "Babak 1" },
  { value: "h2", label: "Babak 2" },
  { value: "ft", label: "Selesai" },
] as const;

function ReportPage() {
  const [phase, setPhase] = useState<(typeof phases)[number]["value"]>("h1");
  const [minute, setMinute] = useState(18);
  const [events, setEvents] = useState<MatchEvent[]>([
    { id: 1, minute: 7, side: "home", type: "goal", player: "7 · Rizky P." },
    { id: 2, minute: 12, side: "away", type: "yellow", player: "8 · Yoga P." },
  ]);
  const [side, setSide] = useState<Side>("home");
  const [type, setType] = useState<EventType>("goal");

  const score = (s: Side) => events.filter((e) => e.side === s && e.type === "goal").length;
  const squad = reportSquads[side];

  const add = (player: string) => {
    setEvents((ev) =>
      [...ev, { id: Date.now(), minute, side, type, player }].sort((a, b) => a.minute - b.minute),
    );
    toast(`${eventMeta[type].label} · ${player} (${minute}′)`);
  };

  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow="Makassar Youth Cup · U10 · Grup A" title="Laporan pertandingan" />

      {/* Scoreboard */}
      <div className="pitch-stripes rounded-3xl p-5 text-pitch-foreground shadow-lift">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
          <p className="font-display text-sm font-bold leading-tight sm:text-base">
            {reportSquads.home.name}
          </p>
          <p className="rounded-2xl bg-pitch-deep/60 px-4 py-2 font-mono text-4xl font-bold tabular">
            {score("home")}–{score("away")}
          </p>
          <p className="font-display text-sm font-bold leading-tight sm:text-base">
            {reportSquads.away.name}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Btn
            variant="chalkOutline"
            size="icon"
            aria-label="Kurangi menit"
            onClick={() => setMinute((m) => Math.max(0, m - 1))}
          >
            <Minus className="h-4 w-4" />
          </Btn>
          <span className="min-w-20 text-center font-mono text-2xl font-bold">{minute}′</span>
          <Btn
            variant="chalkOutline"
            size="icon"
            aria-label="Tambah menit"
            onClick={() => setMinute((m) => Math.min(70, m + 1))}
          >
            <Plus className="h-4 w-4" />
          </Btn>
        </div>
      </div>

      <Segmented options={phases} value={phase} onChange={setPhase} className="mt-4" />

      {/* Event entry */}
      <Panel className="mt-4">
        <SectionTitle eyebrow="Tambah kejadian" title="Catat event" />
        <div className="grid grid-cols-2 gap-2">
          {(["home", "away"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              className={cn(
                "truncate rounded-xl border px-3 py-2 text-sm font-bold transition-colors",
                side === s ? "border-pitch bg-pitch text-pitch-foreground" : "bg-card",
              )}
            >
              {reportSquads[s].name.replace("SSB ", "")}
            </button>
          ))}
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {(Object.keys(eventMeta) as EventType[]).map((t) => {
            const M = eventMeta[t];
            const Icon = M.icon;
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold ring-2 transition-all",
                  M.cls,
                  type === t ? "ring-pitch" : "ring-transparent opacity-70",
                )}
              >
                <Icon className="h-3.5 w-3.5" /> {M.label}
              </button>
            );
          })}
        </div>
        <p className="mb-2 mt-4 text-xs font-semibold text-muted-foreground">
          Pilih pemain (ketuk untuk mencatat)
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {squad.players.map(([no, name]) => (
            <button
              key={no}
              onClick={() => add(`${no} · ${name}`)}
              className="flex items-center gap-2 rounded-xl border bg-card p-2.5 text-left text-sm font-semibold transition-colors hover:bg-muted active:scale-[0.98]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted font-mono text-xs font-bold">
                {no}
              </span>
              <span className="truncate">{name}</span>
            </button>
          ))}
        </div>
      </Panel>

      {/* Timeline */}
      <Panel className="mt-4">
        <SectionTitle eyebrow={`${events.length} kejadian`} title="Kronologi" />
        {events.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Belum ada kejadian tercatat.
          </p>
        ) : (
          <ul className="space-y-2">
            {events.map((e) => {
              const M = eventMeta[e.type];
              const Icon = M.icon;
              return (
                <li
                  key={e.id}
                  className={cn(
                    "flex items-center gap-3",
                    e.side === "away" && "flex-row-reverse text-right",
                  )}
                >
                  <span className="w-9 shrink-0 text-center font-mono text-xs font-bold">
                    {e.minute}′
                  </span>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      M.cls,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{e.player}</p>
                    <p className="text-[11px] text-muted-foreground">{M.label}</p>
                  </div>
                  <button
                    onClick={() => setEvents((ev) => ev.filter((x) => x.id !== e.id))}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                    aria-label="Hapus kejadian"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <Btn
        size="lg"
        className="mt-4 w-full"
        disabled={phase !== "ft"}
        onClick={() =>
          toast.success("Laporan terkirim", {
            description: "Hasil & klasemen turnamen diperbarui otomatis.",
          })
        }
      >
        {phase === "ft" ? "Kirim laporan resmi" : "Kirim setelah pertandingan selesai"}
      </Btn>
      {phase !== "ft" && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Ubah status ke <Pill tone="neutral">Selesai</Pill> untuk mengirim.
        </p>
      )}
    </div>
  );
}
