import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Btn, PageHeader, Panel, Pill } from "@/components/kit";
import { assessmentTemplate, roster } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/coach_/assessment")({
  head: () => ({
    meta: [
      { title: "Penilaian Pemain · BolaID" },
      {
        name: "description",
        content:
          "Nilai perkembangan pemain: teknik, taktik, fisik, mental, dan sosial — bukan hanya gol dan assist.",
      },
      { property: "og:title", content: "Penilaian Pemain · BolaID" },
      {
        property: "og:description",
        content: "Assessment periodik pelatih untuk perkembangan pemain usia dini.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssessmentPage,
});

const players = roster.filter((p) => p.team === "U10");
const initial = () =>
  Object.fromEntries(assessmentTemplate.flatMap((g) => g.items.map((i) => [i, 7]))) as Record<
    string,
    number
  >;

function AssessmentPage() {
  const [pid, setPid] = useState<string>(players[0]?.id ?? "");
  const [scores, setScores] = useState<Record<string, number>>(initial);
  const [openGroup, setOpenGroup] = useState<string>("Teknik");
  const [done, setDone] = useState<Set<string>>(new Set(["000131"]));
  const [note, setNote] = useState("");
  const player = players.find((p) => p.id === pid) ?? players[0];
  if (!player) return null;

  const avg = useMemo(() => {
    const v = Object.values(scores);
    return v.reduce((a, b) => a + b, 0) / v.length;
  }, [scores]);

  const groupAvg = (items: string[]) =>
    items.reduce((s, i) => s + (scores[i] ?? 0), 0) / items.length;

  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow="U10 · Periode Q4 2026" title="Penilaian pemain">
        <p className="mt-2 text-sm text-muted-foreground">
          {done.size}/{players.length} pemain selesai dinilai
        </p>
      </PageHeader>

      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {players.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setPid(p.id);
              setScores(initial());
              setNote("");
            }}
            className={cn(
              "relative flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-3 py-2 transition-colors",
              p.id === pid ? "border-pitch bg-pitch text-pitch-foreground" : "bg-card",
            )}
          >
            <Avatar
              initials={p.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
              tone={p.id === pid ? "signal" : "muted"}
              className="h-9 w-9 text-xs"
            />
            <span className="max-w-16 truncate text-[11px] font-bold">{p.name.split(" ")[0]}</span>
            {done.has(p.id) && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-success text-primary-foreground">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
            )}
          </button>
        ))}
      </div>

      <Panel className="mb-4 flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold leading-tight">{player.name}</p>
          <p className="font-mono text-xs text-muted-foreground">
            #{player.id} · {player.pos}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Rata-rata
          </p>
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
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
                  />
                </span>
              </button>
              {open && (
                <ul className="space-y-4 border-t px-4 py-4">
                  {g.items.map((item) => (
                    <li key={item}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <label htmlFor={item} className="font-semibold">
                          {item}
                        </label>
                        <span className="font-mono font-bold">
                          {(scores[item] ?? 0).toFixed(1)}
                        </span>
                      </div>
                      <input
                        id={item}
                        type="range"
                        min={1}
                        max={10}
                        step={0.5}
                        value={scores[item]}
                        onChange={(e) =>
                          setScores((s) => ({ ...s, [item]: Number(e.target.value) }))
                        }
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

      <Panel className="mt-4">
        <label htmlFor="note" className="text-sm font-bold">
          Catatan untuk pemain & orang tua
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Contoh: Fokus 3 bulan ke depan — receiving under pressure."
          className="mt-2 w-full resize-none rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </Panel>

      <Btn
        size="lg"
        className="mt-4 w-full"
        onClick={() => {
          setDone((s) => new Set(s).add(pid));
          toast.success(`Penilaian ${player.name} disimpan`, {
            description: "Masuk ke Football Passport & laporan orang tua.",
          });
          const next = players.find((p) => !done.has(p.id) && p.id !== pid);
          if (next) {
            setPid(next.id);
            setScores(initial());
            setNote("");
          }
        }}
      >
        Simpan & lanjut ke pemain berikutnya
      </Btn>
    </div>
  );
}
