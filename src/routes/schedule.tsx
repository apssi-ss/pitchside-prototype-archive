import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarX2, Dumbbell, Flag, MapPin, Trophy, Wallet, ClipboardList } from "lucide-react";
import { PageHeader, Panel, Pill } from "@/components/kit";
import { agenda, TODAY, week, type AgendaKind } from "@/lib/mock-data";
import { useRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Jadwal Minggu Ini · BolaID" },
      {
        name: "description",
        content:
          "Agenda latihan, pertandingan, penugasan wasit, dan jatuh tempo — menyesuaikan peran Anda.",
      },
      { property: "og:title", content: "Jadwal · BolaID" },
      {
        property: "og:description",
        content: "Satu kalender untuk pemain, orang tua, SSB, pelatih, dan wasit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SchedulePage,
});

const kindMeta: Record<
  AgendaKind,
  {
    label: string;
    icon: typeof Dumbbell;
    tone: "success" | "signal" | "warning" | "pitch" | "neutral";
  }
> = {
  training: { label: "Latihan", icon: Dumbbell, tone: "success" },
  match: { label: "Pertandingan", icon: Trophy, tone: "signal" },
  assignment: { label: "Penugasan", icon: Flag, tone: "pitch" },
  payment: { label: "Pembayaran", icon: Wallet, tone: "warning" },
  admin: { label: "Agenda", icon: ClipboardList, tone: "neutral" },
};

function SchedulePage() {
  const { role } = useRole();
  const [day, setDay] = useState<number | "all">("all");
  const mine = agenda.filter((a) => a.roles.includes(role.id));
  const shown = mine.filter((a) => day === "all" || a.d === day);
  const days = [...new Set(shown.map((a) => a.d))];

  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow={`9–15 November · ${role.label}`} title="Jadwal minggu ini" />

      <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setDay("all")}
          className={cn(
            "flex h-16 shrink-0 flex-col items-center justify-center rounded-2xl border px-4 text-xs font-bold",
            day === "all" ? "border-pitch bg-pitch text-pitch-foreground" : "bg-card",
          )}
        >
          Semua
          <span className="font-mono text-[10px] opacity-70">{mine.length}</span>
        </button>
        {week.map((w) => {
          const count = mine.filter((a) => a.d === w.d).length;
          const on = day === w.d;
          return (
            <button
              key={w.d}
              onClick={() => setDay(w.d)}
              className={cn(
                "relative flex h-16 w-12 shrink-0 flex-col items-center justify-center rounded-2xl border transition-colors",
                on ? "border-pitch bg-pitch text-pitch-foreground" : "bg-card",
                w.d === TODAY && !on && "border-primary",
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase",
                  on ? "text-pitch-foreground/70" : "text-muted-foreground",
                )}
              >
                {w.day}
              </span>
              <span className="font-display text-lg font-extrabold leading-tight">{w.d}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "absolute bottom-1.5 h-1 w-1 rounded-full",
                    on ? "bg-signal" : "bg-primary",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <Panel className="flex flex-col items-center gap-2 py-12 text-center">
          <CalendarX2 className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-semibold">Tidak ada agenda di hari ini</p>
          <p className="text-xs text-muted-foreground">
            Pilih hari lain atau lihat semua agenda minggu ini.
          </p>
        </Panel>
      ) : (
        <div className="space-y-5">
          {days.map((d) => {
            const w = week.find((x) => x.d === d);
            if (!w) return null;
            return (
              <section key={d}>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-bold">
                  {w.day}, {d} Nov {d === TODAY && <Pill tone="signal">Hari ini</Pill>}
                </h2>
                <ul className="space-y-2">
                  {shown
                    .filter((a) => a.d === d)
                    .map((a) => {
                      const m = kindMeta[a.kind];
                      const Icon = m.icon;
                      return (
                        <li
                          key={a.title + a.time}
                          className="flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-card animate-rise"
                        >
                          <div className="w-12 shrink-0 text-center">
                            <p className="font-mono text-sm font-bold">{a.time}</p>
                          </div>
                          <span className="h-10 w-px bg-border" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">{a.title}</p>
                            <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 shrink-0" /> {a.place}
                            </p>
                          </div>
                          <Pill tone={m.tone} className="hidden sm:inline-flex">
                            <Icon className="h-3 w-3" /> {m.label}
                          </Pill>
                          <Icon
                            className="h-4 w-4 shrink-0 text-muted-foreground sm:hidden"
                            aria-label={m.label}
                          />
                        </li>
                      );
                    })}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
