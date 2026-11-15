import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarRange, MapPin, Users, Flag, ShieldCheck } from "lucide-react";
import { Meter, Panel, Pill, SectionTitle, Segmented } from "@/components/kit";
import { fixtures, standings, tournament } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tournament")({
  head: () => ({
    meta: [
      { title: "Makassar Youth Cup 2027 · BolaID" },
      {
        name: "description",
        content:
          "Jadwal, hasil langsung, dan klasemen Makassar Youth Cup 2027 — roster terverifikasi lewat Football ID.",
      },
      { property: "og:title", content: "Makassar Youth Cup 2027 · BolaID" },
      {
        property: "og:description",
        content: "Kategori U8–U14 · 64 tim · hasil & klasemen real-time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TournamentPage,
});

type View = "matches" | "table";

function TournamentPage() {
  const [cat, setCat] = useState("U10");
  const [view, setView] = useState<View>("matches");

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="pitch-stripes -mx-4 -mt-5 overflow-hidden p-5 pt-6 text-pitch-foreground sm:mx-0 sm:mt-0 sm:rounded-3xl sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="signal">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-live" /> Berlangsung
          </Pill>
          <Pill tone="ghost">Hari 2 dari 9</Pill>
        </div>
        <h1 className="mt-3 text-[32px] font-extrabold leading-[1] sm:text-5xl">
          {tournament.name}
        </h1>
        <p className="mt-2 text-sm text-pitch-foreground/75">{tournament.organizer}</p>
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:flex sm:flex-wrap sm:gap-6">
          <span className="flex items-center gap-1.5">
            <CalendarRange className="h-4 w-4 text-signal" />
            {tournament.dates}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-signal" />
            {tournament.venues} venue
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-signal" />
            {tournament.teams} tim
          </span>
          <span className="flex items-center gap-1.5">
            <Flag className="h-4 w-4 text-signal" />
            {tournament.referees} wasit
          </span>
        </div>
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
          {tournament.categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2 font-display text-sm font-bold transition-colors",
                c === cat
                  ? "bg-chalk text-pitch-deep"
                  : "bg-pitch-foreground/10 hover:bg-pitch-foreground/20",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <Segmented
            options={
              [
                { value: "matches", label: "Jadwal & Hasil" },
                { value: "table", label: "Klasemen" },
              ] as const
            }
            value={view}
            onChange={setView}
            className="lg:hidden"
          />

          <div className={cn("space-y-3", view !== "matches" && "hidden lg:block")}>
            <SectionTitle eyebrow={`Kategori ${cat} · Sabtu 14 Feb`} title="Jadwal & hasil" />
            {fixtures.map((f, i) => (
              <article
                key={i}
                className="rounded-2xl border bg-card p-4 shadow-card animate-rise"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="mb-3 flex items-center justify-between text-[11px]">
                  <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                    {f.group}
                  </span>
                  {f.status === "live" && (
                    <Pill tone="danger">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-live" /> LIVE{" "}
                      {f.minute}
                    </Pill>
                  )}
                  {f.status === "done" && <Pill tone="neutral">Selesai</Pill>}
                  {f.status === "next" && <Pill tone="neutral">{f.minute} WITA</Pill>}
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <p className="text-sm font-bold leading-tight">{f.home}</p>
                  <div
                    className={cn(
                      "rounded-xl px-3 py-1.5 font-mono text-lg font-bold tabular",
                      f.status === "live" ? "bg-pitch text-pitch-foreground" : "bg-muted",
                    )}
                  >
                    {f.hs === null ? "vs" : `${f.hs} – ${f.as}`}
                  </div>
                  <p className="text-right text-sm font-bold leading-tight">{f.away}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {f.venue}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flag className="h-3 w-3" />
                    Wasit: {f.ref}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={cn("space-y-4", view !== "table" && "hidden lg:block")}>
          <Panel className="p-0 sm:p-0">
            <div className="p-4 pb-2 sm:p-5 sm:pb-2">
              <SectionTitle eyebrow={`${cat} · Grup A`} title="Klasemen" />
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pl-4 text-left font-semibold sm:pl-5">Tim</th>
                  <th className="py-2 font-semibold">M</th>
                  <th className="py-2 font-semibold">S</th>
                  <th className="py-2 font-semibold">K</th>
                  <th className="py-2 font-semibold">SG</th>
                  <th className="py-2 pr-4 font-semibold sm:pr-5">Poin</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {standings.map((r, i) => (
                  <tr key={r.team} className={cn(i < 2 && "bg-secondary/50")}>
                    <td className="py-3 pl-4 sm:pl-5">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "w-4 font-mono text-xs font-bold",
                            i < 2 ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className="font-semibold leading-tight">
                          {r.team.replace("SSB ", "")}
                        </span>
                      </div>
                    </td>
                    <td className="text-center font-mono tabular">{r.w}</td>
                    <td className="text-center font-mono tabular">{r.d}</td>
                    <td className="text-center font-mono tabular">{r.l}</td>
                    <td className="text-center font-mono tabular">
                      {r.gf - r.ga > 0 ? `+${r.gf - r.ga}` : r.gf - r.ga}
                    </td>
                    <td className="pr-4 text-center font-display text-base font-extrabold tabular sm:pr-5">
                      {r.pts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="p-4 text-[11px] text-muted-foreground sm:px-5">
              2 teratas lolos ke perempat final.
            </p>
          </Panel>

          <Panel>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-soft text-success">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold">Roster terverifikasi Football ID</p>
                <p className="text-xs text-muted-foreground">
                  {tournament.players.toLocaleString("id-ID")} pemain · tanpa daftar ulang
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Meter value={tournament.verified} />
                  <span className="font-mono text-xs font-bold">{tournament.verified}%</span>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
