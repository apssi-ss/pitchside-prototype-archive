import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, CalendarDays, MapPin, Users, FileText } from "lucide-react";
import { toast } from "sonner";
import { Btn, PageHeader, Panel, Pill, SectionTitle, Stat, buttonVariants } from "@/components/kit";
import { assignments, referee } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/referee")({
  head: () => ({
    meta: [
      { title: "Penugasan Wasit · BolaID" },
      {
        name: "description",
        content: "Profil, lisensi, dan penugasan pertandingan wasit sepak bola usia dini.",
      },
      { property: "og:title", content: "Penugasan Wasit · BolaID" },
      {
        property: "og:description",
        content: "Konfirmasi penugasan dan kirim laporan pertandingan dari HP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RefereePage,
});

function RefereePage() {
  const [status, setStatus] = useState<Record<string, "pending" | "confirmed" | "declined">>(
    Object.fromEntries(assignments.map((a) => [a.id, a.status])),
  );
  const [first, ...rest] = assignments;

  return (
    <div>
      <PageHeader eyebrow={referee.refId} title={referee.name}>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Pill tone="success">
            <BadgeCheck className="h-3 w-3" /> {referee.license}
          </Pill>
          {referee.level} · {referee.region}
        </p>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Laga dipimpin" value={referee.matches} />
        <Stat label="Minggu ini" value={assignments.length} />
        <Stat label="Laporan tertunda" value={1} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
        {first && (
          <div className="pitch-stripes rounded-3xl p-5 text-pitch-foreground shadow-lift">
            <div className="flex items-center justify-between">
              <Pill tone="signal">Penugasan berikutnya</Pill>
              <span className="text-xs text-pitch-foreground/70">{first.comp}</span>
            </div>
            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <p className="font-display text-base font-bold leading-tight">{first.home}</p>
              <span className="rounded-lg bg-pitch-foreground/10 px-2 py-1 font-mono text-xs">
                vs
              </span>
              <p className="font-display text-base font-bold leading-tight">{first.away}</p>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-pitch-muted">Peran</dt>
                <dd className="font-semibold">{first.role}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-pitch-muted">Waktu</dt>
                <dd className="font-semibold">
                  {first.date} · {first.time}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-pitch-muted">Venue</dt>
                <dd className="font-semibold">{first.venue}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-pitch-muted">Tim wasit</dt>
                <dd className="font-semibold">{first.crew.replace("Asisten: ", "")}</dd>
              </div>
            </dl>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {status[first.id] === "pending" ? (
                <>
                  <Btn
                    variant="chalkOutline"
                    onClick={() => {
                      setStatus((s) => ({ ...s, [first.id]: "declined" }));
                      toast("Penugasan ditolak — panitia diberi tahu");
                    }}
                  >
                    Tolak
                  </Btn>
                  <Btn
                    variant="signal"
                    onClick={() => {
                      setStatus((s) => ({ ...s, [first.id]: "confirmed" }));
                      toast.success("Penugasan dikonfirmasi");
                    }}
                  >
                    Konfirmasi
                  </Btn>
                </>
              ) : (
                <>
                  <p className="flex items-center justify-center rounded-full bg-pitch-foreground/10 text-sm font-bold">
                    {status[first.id] === "confirmed" ? "Dikonfirmasi ✓" : "Ditolak"}
                  </p>
                  <Link to="/referee/report" className={cn(buttonVariants({ variant: "chalk" }))}>
                    <FileText className="h-4 w-4" /> Laporan
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        <Panel>
          <SectionTitle eyebrow="Jadwal" title="Penugasan lainnya" />
          <ul className="space-y-3">
            {rest.map((a) => {
              const st = status[a.id];
              return (
                <li key={a.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Pill tone="neutral">{a.role}</Pill>
                    <Pill
                      tone={
                        st === "confirmed" ? "success" : st === "declined" ? "danger" : "warning"
                      }
                    >
                      {st === "confirmed"
                        ? "Dikonfirmasi"
                        : st === "declined"
                          ? "Ditolak"
                          : "Menunggu"}
                    </Pill>
                  </div>
                  <p className="mt-2 text-sm font-bold">
                    {a.home} vs {a.away}
                  </p>
                  <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {a.date} · {a.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {a.venue}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {a.crew}
                    </span>
                  </p>
                  {st === "pending" && (
                    <Btn
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => {
                        setStatus((s) => ({ ...s, [a.id]: "confirmed" }));
                        toast.success("Penugasan dikonfirmasi");
                      }}
                    >
                      Konfirmasi
                    </Btn>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
