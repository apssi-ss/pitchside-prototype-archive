import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  ClipboardCheck,
  FileText,
  MapPin,
  Timer,
  Users,
  ChevronRight,
} from "lucide-react";
import {
  Avatar,
  Meter,
  PageHeader,
  Panel,
  Pill,
  SectionTitle,
  Stat,
  buttonVariants,
} from "@/components/kit";
import { coach, roster, sessionPlan } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "Dashboard Pelatih · BolaID" },
      {
        name: "description",
        content:
          "Sesi latihan hari ini, absensi tim, dan penilaian perkembangan pemain untuk pelatih SSB.",
      },
      { property: "og:title", content: "Dashboard Pelatih · BolaID" },
      {
        property: "og:description",
        content: "Rencana latihan, absensi, dan penilaian pemain dalam satu layar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoachPage,
});

function CoachPage() {
  const total = sessionPlan.reduce((s, b) => s + b.min, 0);
  const needs = roster.filter((p) => p.att < 90).slice(0, 3);

  return (
    <div>
      <PageHeader eyebrow={`${coach.coachId}`} title={coach.name}>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Pill tone="success">
            <BadgeCheck className="h-3 w-3" /> {coach.license}
          </Pill>
          SSB Garuda Muda · {coach.teams.join(", ")}
        </p>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Tim" value={coach.teams.length} />
        <Stat label="Pemain" value={coach.players} />
        <Stat label="Belum dinilai" value={coach.pendingAssessments} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          {/* Today's session */}
          <div className="pitch-stripes rounded-3xl p-5 text-pitch-foreground shadow-lift">
            <div className="flex items-center justify-between">
              <Pill tone="signal">Hari ini · U10</Pill>
              <span className="font-mono text-lg font-bold">16.00</span>
            </div>
            <h2 className="mt-3 text-xl font-bold leading-tight">
              First touch & receiving under pressure
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-pitch-foreground/75">
              <MapPin className="h-4 w-4" /> Lapangan Karebosi · <Timer className="h-4 w-4" />{" "}
              {total} menit
            </p>
            <ol className="mt-4 space-y-1.5">
              {sessionPlan.map((b, i) => (
                <li
                  key={b.title}
                  className="flex items-center gap-3 rounded-xl bg-pitch-foreground/10 px-3 py-2"
                >
                  <span className="font-mono text-xs font-bold text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{b.title}</p>
                    <p className="truncate text-[11px] text-pitch-foreground/65">{b.note}</p>
                  </div>
                  <span className="font-mono text-xs">{b.min}′</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to="/ssb" className={cn(buttonVariants({ variant: "chalk" }))}>
                <Users className="h-4 w-4" /> Absensi
              </Link>
              <Link to="/coach/assessment" className={cn(buttonVariants({ variant: "signal" }))}>
                <ClipboardCheck className="h-4 w-4" /> Penilaian
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Panel>
            <SectionTitle eyebrow="Sabtu, 14 Nov · 08.30" title="Pertandingan berikutnya" />
            <div className="flex items-center justify-between rounded-xl bg-muted p-3">
              <span className="text-sm font-bold">Garuda Muda</span>
              <span className="font-mono text-xs text-muted-foreground">vs</span>
              <span className="text-sm font-bold">Bintang Timur</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Line-up dipilih</span>
              <span className="font-mono font-bold">11/14</span>
            </div>
            <Meter value={11} max={14} className="mt-1" />
          </Panel>

          <Panel>
            <SectionTitle eyebrow="Perlu perhatian" title="Kehadiran menurun" />
            <ul className="space-y-2">
              {needs.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <Avatar
                    initials={p.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                    tone="muted"
                    className="h-9 w-9 text-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.pos} · hadir {p.att}%
                    </p>
                  </div>
                  <Pill tone="warning">{p.att}%</Pill>
                </li>
              ))}
            </ul>
          </Panel>

          <Link
            to="/coach/assessment"
            className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card transition-colors hover:bg-muted"
          >
            <FileText className="h-5 w-5 text-primary" />
            <span className="flex-1">
              <span className="block text-sm font-bold">
                {coach.pendingAssessments} penilaian Q4 belum selesai
              </span>
              <span className="block text-xs text-muted-foreground">
                Batas hari ini pukul 20.00
              </span>
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}
