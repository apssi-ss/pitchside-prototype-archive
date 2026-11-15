import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Circle, Flag, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Btn, Meter, PageHeader, Panel, Pill, SectionTitle, Stat } from "@/components/kit";
import {
  availableRefs,
  organizerSteps,
  registrations,
  tournament,
  unassignedMatches,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizer")({
  head: () => ({
    meta: [
      { title: "Kelola Turnamen · Makassar Youth Cup 2027 · BolaID" },
      {
        name: "description",
        content:
          "Pendaftaran tim, pembayaran, verifikasi roster Football ID, drawing, dan penugasan wasit.",
      },
      { property: "og:title", content: "Kelola Turnamen · BolaID" },
      {
        property: "og:description",
        content: "Semua operasional turnamen usia dini dalam satu dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrganizerPage,
});

function OrganizerPage() {
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  const [picking, setPicking] = useState<string | null>(null);
  const refsDone = 18 + Object.keys(assigned).length;

  return (
    <div>
      <PageHeader
        eyebrow={`${tournament.dates} · ${tournament.categories.join(" · ")}`}
        title={tournament.name}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Tim terdaftar" value={tournament.teams} sub="16 per kategori" />
        <Stat
          label="Pemain"
          value={tournament.players.toLocaleString("id-ID")}
          sub={`${tournament.verified}% terverifikasi`}
        />
        <Stat label="Pendapatan" value="Rp96 jt" sub="58 dari 64 lunas" />
        <Stat label="Wasit" value={`${refsDone}/22`} sub="laga tertugaskan" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Panel>
          <SectionTitle eyebrow="Persiapan" title="Checklist turnamen" />
          <ol className="space-y-3">
            {organizerSteps.map((s) => {
              const total = s.label === "Penugasan wasit" ? 22 : s.total;
              const done = s.label === "Penugasan wasit" ? refsDone : s.done;
              const complete = done >= total;
              return (
                <li key={s.label} className="flex items-center gap-3">
                  {complete ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2 text-sm">
                      <span className={cn("font-semibold", complete && "text-muted-foreground")}>
                        {s.label}
                      </span>
                      <span className="font-mono text-xs">
                        {done.toLocaleString("id-ID")}/{total.toLocaleString("id-ID")}
                      </span>
                    </div>
                    {!complete && (
                      <Meter
                        value={done}
                        max={total}
                        className="mt-1 h-1.5"
                        tone={done === 0 ? "warning" : "primary"}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <SectionTitle
              eyebrow={`${unassignedMatches.length - Object.keys(assigned).length} laga`}
              title="Belum ada wasit"
            />
            <ul className="space-y-2">
              {unassignedMatches.map((m) => {
                const ref = assigned[m.id];
                return (
                  <li key={m.id} className="rounded-xl border p-3">
                    <div className="flex items-center gap-3">
                      <Flag
                        className={cn("h-4 w-4 shrink-0", ref ? "text-success" : "text-warning")}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{m.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.time} · {m.venue}
                        </p>
                      </div>
                      {ref ? (
                        <Pill tone="success">{ref}</Pill>
                      ) : (
                        <Btn
                          size="sm"
                          variant="outline"
                          onClick={() => setPicking(picking === m.id ? null : m.id)}
                        >
                          <UserPlus className="h-3.5 w-3.5" /> Tugaskan
                        </Btn>
                      )}
                    </div>
                    {picking === m.id && !ref && (
                      <div className="mt-3 flex flex-wrap gap-2 animate-rise">
                        {availableRefs.map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              setAssigned((a) => ({ ...a, [m.id]: r }));
                              setPicking(null);
                              toast.success(`${r} ditugaskan`, {
                                description: "Notifikasi dikirim ke aplikasi wasit.",
                              });
                            }}
                            className="rounded-full bg-muted px-3 py-1.5 text-xs font-bold hover:bg-secondary"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel className="p-0 sm:p-0">
            <div className="p-4 pb-2 sm:p-5 sm:pb-2">
              <SectionTitle eyebrow="Terbaru" title="Pendaftaran tim" />
            </div>
            <ul className="divide-y border-t">
              {registrations.map((r) => (
                <li key={r.team} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <Pill tone="pitch">{r.cat}</Pill>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{r.team}</p>
                    <p className="text-xs text-muted-foreground">Roster {r.roster}</p>
                  </div>
                  <Pill tone={r.paid ? "success" : "warning"}>
                    {r.paid ? "Lunas" : "Belum bayar"}
                  </Pill>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
