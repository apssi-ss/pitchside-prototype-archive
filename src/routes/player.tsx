import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Share2, TrendingUp, Flag, GraduationCap, Shield, Trophy } from "lucide-react";
import { toast } from "sonner";
import { FootballIdCard } from "@/components/football-id-card";
import { RadarChart } from "@/components/radar-chart";
import { Btn, Meter, Panel, Pill, SectionTitle, Segmented, Stat } from "@/components/kit";
import {
  assessmentDetail,
  certificates,
  developmentGroups,
  developmentTimeline,
  journey,
  player,
  recentMatches,
  type JourneyStep,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/player")({
  head: () => ({
    meta: [
      { title: "Football Passport — Rizky Pratama · BolaID" },
      {
        name: "description",
        content:
          "Football ID, perjalanan, perkembangan, dan riwayat pertandingan pemain dalam satu passport digital.",
      },
      { property: "og:title", content: "Football Passport · BolaID" },
      {
        property: "og:description",
        content:
          "Identitas sepak bola seumur hidup: riwayat SSB, turnamen, dan perkembangan pemain.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlayerPage,
});

type Tab = "journey" | "dev" | "matches";
const tabs = [
  { value: "journey", label: "Journey" },
  { value: "dev", label: "Perkembangan" },
  { value: "matches", label: "Pertandingan" },
] as const;

const kindIcon: Record<JourneyStep["kind"], typeof Shield> = {
  ssb: Shield,
  tournament: Trophy,
  selection: Flag,
  academy: GraduationCap,
};

function PlayerPage() {
  const [tab, setTab] = useState<Tab>("journey");
  const s = player.stats;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[400px_1fr] lg:items-start lg:gap-8">
      <div className="space-y-4 lg:sticky lg:top-10">
        <FootballIdCard className="animate-rise" />
        <div className="flex gap-2">
          <Btn
            variant="outline"
            className="flex-1"
            onClick={() =>
              toast.success("Tautan passport disalin", {
                description: "Hanya data level Football yang dibagikan.",
              })
            }
          >
            <Share2 className="h-4 w-4" /> Bagikan
          </Btn>
          <Btn
            variant="primary"
            className="flex-1"
            onClick={() => toast("QR Football ID ditampilkan untuk check-in turnamen")}
          >
            Tampilkan QR
          </Btn>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            ["Laga", s.matches],
            ["Gol", s.goals],
            ["Assist", s.assists],
            ["Hadir", `${s.attendance}%`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl border bg-card p-2.5 text-center shadow-card">
              <p className="font-display text-xl font-extrabold tabular">{v}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {k}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Segmented
          options={tabs}
          value={tab}
          onChange={setTab}
          className="sticky top-16 z-20 lg:static"
        />

        {tab === "journey" && (
          <Panel className="animate-rise">
            <SectionTitle eyebrow="Football Journey" title="Perjalanan Rizky" />
            <ol className="relative ml-2 border-l-2 border-dashed border-border pl-6">
              {journey.map((j, i) => {
                const Icon = kindIcon[j.kind];
                return (
                  <li key={i} className="relative pb-6 last:pb-0">
                    <span
                      className={cn(
                        "absolute -left-[37px] flex h-7 w-7 items-center justify-center rounded-full border-2 border-background",
                        j.upcoming
                          ? "bg-signal text-signal-foreground"
                          : j.current
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <p className="font-mono text-[11px] font-bold text-muted-foreground">
                      {j.year}
                    </p>
                    <p className="font-display text-base font-bold">{j.org}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <p className="text-sm text-muted-foreground">{j.label}</p>
                      {j.upcoming && <Pill tone="signal">Berikutnya</Pill>}
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-5 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
              Riwayat ini milik pemain. SSB hanya memiliki hubungan keanggotaan (2024–sekarang).
            </div>
          </Panel>
        )}

        {tab === "dev" && (
          <div className="space-y-4 animate-rise">
            <Panel>
              <SectionTitle
                eyebrow="Assessment pelatih · Q1 2027"
                title="Profil perkembangan"
                action={
                  <Pill tone="success">
                    <TrendingUp className="h-3 w-3" /> +0.4
                  </Pill>
                }
              />
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                <RadarChart data={developmentGroups} />
                <div className="w-full space-y-3">
                  {developmentTimeline.at(-1) &&
                    (["passing", "dribbling", "speed"] as const).map((k) => (
                      <div key={k}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="font-semibold capitalize">{k}</span>
                          <span className="font-mono text-muted-foreground">
                            {developmentTimeline.map((t) => t[k].toFixed(1)).join(" → ")}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {developmentTimeline.map((t, i) => (
                            <Meter
                              key={t.period}
                              value={t[k]}
                              max={10}
                              tone={i === developmentTimeline.length - 1 ? "primary" : "signal"}
                              className={cn(i < 2 && "opacity-60")}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  <p className="text-[11px] text-muted-foreground">2026 Q1 → 2026 Q3 → 2027 Q1</p>
                </div>
              </div>
            </Panel>

            <Panel className="border-primary/30 bg-secondary">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-secondary-foreground/70">
                Catatan pelatih
              </p>
              <p className="mt-1.5 font-display text-base font-semibold leading-snug text-secondary-foreground">
                “Area yang paling perlu perhatian 3 bulan ke depan: receiving under pressure.”
              </p>
              <p className="mt-2 text-xs text-secondary-foreground/70">
                Coach Andi · Lisensi D PSSI
              </p>
            </Panel>

            <div className="grid gap-3 sm:grid-cols-3">
              {assessmentDetail.map((g) => (
                <Panel key={g.group} className="p-4">
                  <h3 className="text-sm font-bold">{g.group}</h3>
                  <ul className="mt-2 space-y-2">
                    {g.items.map(([name, v]) => (
                      <li key={name}>
                        <div className="flex justify-between text-xs">
                          <span>{name}</span>
                          <span className="font-mono font-bold">{v.toFixed(1)}</span>
                        </div>
                        <Meter
                          value={v}
                          max={10}
                          className="mt-1 h-1.5"
                          tone={v < 7 ? "warning" : "primary"}
                        />
                      </li>
                    ))}
                  </ul>
                </Panel>
              ))}
            </div>
          </div>
        )}

        {tab === "matches" && (
          <div className="space-y-4 animate-rise">
            <div className="grid grid-cols-2 gap-3">
              <Stat
                label="Menit bermain"
                value={s.minutes.toLocaleString("id-ID")}
                sub="Musim 2026/27"
              />
              <Stat
                label="Kontribusi gol"
                value={s.goals + s.assists}
                sub={`${s.goals} gol · ${s.assists} assist`}
              />
            </div>
            <Panel className="p-0 sm:p-0">
              <div className="p-4 pb-2 sm:p-5 sm:pb-2">
                <SectionTitle eyebrow="Match data" title="Pertandingan terakhir" />
              </div>
              <ul className="divide-y">
                {recentMatches.map((m) => (
                  <li key={m.date + m.opp} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-sm font-extrabold",
                        m.result === "M" && "bg-success-soft text-success",
                        m.result === "S" && "bg-muted text-muted-foreground",
                        m.result === "K" && "bg-danger-soft text-destructive",
                      )}
                    >
                      {m.result}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">vs {m.opp}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {m.date} · {m.comp}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold">{m.score}</p>
                      <p className="text-[11px] text-muted-foreground">{m.contrib}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel>
              <SectionTitle eyebrow="Diterbitkan otomatis" title="Sertifikat & prestasi" />
              <ul className="space-y-2">
                {certificates.map((c) => (
                  <li key={c.title} className="flex items-center gap-3 rounded-xl bg-muted p-3">
                    <Award className="h-5 w-5 shrink-0 text-warning" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{c.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.issuer} · {c.year}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        )}
      </div>
    </div>
  );
}
