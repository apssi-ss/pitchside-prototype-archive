import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCheck, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  Btn,
  Meter,
  PageHeader,
  Panel,
  Pill,
  SectionTitle,
  Segmented,
  Stat,
} from "@/components/kit";
import { roster, sessions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ssb_/training")({
  head: () => ({
    meta: [
      { title: "Latihan & Absensi · BolaID" },
      { name: "description", content: "Jadwal sesi latihan dan absensi pemain per kelompok usia." },
      { property: "og:title", content: "Latihan & Absensi · BolaID" },
      {
        property: "og:description",
        content: "Jadwal sesi latihan dan absensi pemain per kelompok usia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrainingPage,
});

type Mark = "H" | "I" | "A";
const marks: { v: Mark; label: string; on: string }[] = [
  { v: "H", label: "Hadir", on: "bg-success text-primary-foreground" },
  { v: "I", label: "Izin", on: "bg-warning text-primary-foreground" },
  { v: "A", label: "Absen", on: "bg-destructive text-destructive-foreground" },
];

const recap = [
  { team: "U8", pct: 95 },
  { team: "U10", pct: 94 },
  { team: "U12", pct: 88 },
  { team: "U14", pct: 86 },
];

function TrainingPage() {
  const [team, setTeam] = useState(sessions[0]?.team ?? "U10");
  const [att, setAtt] = useState<Record<string, Mark>>({});
  const [saved, setSaved] = useState(false);
  const session = sessions.find((x) => x.team === team) ?? sessions[0];
  if (!session) return null;
  // Demo roster only exists for U10; other groups reuse it with a label swap.
  const players = roster.map((p) => ({ ...p, key: `${team}-${p.id}` }));

  const set = (key: string, m: Mark) => {
    setSaved(false);
    setAtt((a) => ({ ...a, [key]: m }));
  };
  const marked = players.filter((p) => att[p.key]).length;
  const present = players.filter((p) => att[p.key] === "H").length;

  return (
    <div>
      <PageHeader eyebrow="SSB Garuda Muda · Hari ini" title="Latihan & Absensi" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Sesi hari ini" value={sessions.length} />
        <Stat label="Kehadiran minggu" value="91%" />
        <Stat label="Lapangan" value="2" />
        <Stat label="Pelatih aktif" value="6" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel>
          <SectionTitle eyebrow="Absensi sesi" title={`${session.team} · ${session.time}`} />
          <Segmented
            className="mb-3"
            value={team}
            onChange={(v) => {
              setTeam(v);
              setSaved(false);
            }}
            options={sessions.map((x) => ({ value: x.team, label: x.team }))}
          />
          <p className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {session.place} · {session.coach} · {session.plan}
          </p>

          <div className="mb-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-semibold">
                  {marked}/{players.length} ditandai
                </span>
                <span className="font-mono text-muted-foreground">{present} hadir</span>
              </div>
              <Meter value={marked} max={players.length} className="h-1.5" />
            </div>
            <Btn
              size="sm"
              variant="outline"
              onClick={() => {
                setSaved(false);
                setAtt((a) => ({
                  ...a,
                  ...Object.fromEntries(players.map((p) => [p.key, "H" as Mark])),
                }));
              }}
            >
              <CheckCheck className="h-3.5 w-3.5" /> Semua hadir
            </Btn>
          </div>

          <ul className="divide-y">
            {players.map((p) => (
              <li key={p.key} className="flex items-center gap-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {p.pos} · ID {p.id}
                  </p>
                </div>
                <div className="flex gap-1" role="radiogroup" aria-label={`Absensi ${p.name}`}>
                  {marks.map((m) => (
                    <button
                      key={m.v}
                      role="radio"
                      aria-checked={att[p.key] === m.v}
                      aria-label={m.label}
                      title={m.label}
                      onClick={() => set(p.key, m.v)}
                      className={cn(
                        "h-8 w-8 rounded-full text-xs font-bold transition-colors",
                        att[p.key] === m.v
                          ? m.on
                          : "bg-muted text-muted-foreground hover:bg-secondary",
                      )}
                    >
                      {m.v}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <Btn
            className="mt-4 w-full"
            disabled={marked < players.length || saved}
            onClick={() => {
              setSaved(true);
              toast.success(`Absensi ${session.team} disimpan`, {
                description: `${present} hadir dari ${players.length}. Wali pemain yang absen diberi kabar.`,
              });
            }}
          >
            {saved
              ? "Tersimpan"
              : marked < players.length
                ? `Tandai ${players.length - marked} pemain lagi`
                : "Simpan absensi"}
          </Btn>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <SectionTitle eyebrow="Hari ini" title="Jadwal sesi" />
            <ul className="divide-y">
              {sessions.map((x) => (
                <li key={x.team} className="flex items-center gap-3 py-2.5">
                  <Pill tone={x.team === team ? "signal" : "pitch"}>{x.team}</Pill>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{x.plan}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {x.time} · {x.place}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <SectionTitle eyebrow="4 minggu" title="Rekap absensi" />
            <ul className="space-y-3">
              {recap.map((r) => (
                <li key={r.team}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-semibold">{r.team}</span>
                    <span className="font-mono text-xs">{r.pct}%</span>
                  </div>
                  <Meter
                    value={r.pct}
                    className="h-1.5"
                    tone={r.pct < 90 ? "warning" : "primary"}
                  />
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
