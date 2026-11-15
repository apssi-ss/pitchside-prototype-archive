import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, CalendarClock, Users, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Btn, Meter, PageHeader, Panel, Pill } from "@/components/kit";
import { opportunities } from "@/lib/mock-data";
import { useRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Peluang: Trial, Seleksi & Beasiswa · BolaID" },
      {
        name: "description",
        content:
          "Temukan trial akademi, seleksi regional, beasiswa, dan football camp yang cocok dengan profil pemain.",
      },
      { property: "og:title", content: "Peluang Pemain · BolaID" },
      { property: "og:description", content: "Daftar trial dan seleksi dengan satu Football ID." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OpportunitiesPage,
});

const filters = ["Semua", "Trial", "Seleksi", "Beasiswa", "Camp"] as const;

function OpportunitiesPage() {
  const { role } = useRole();
  const [f, setF] = useState<(typeof filters)[number]>("Semua");
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const list = opportunities.filter((o) => f === "Semua" || o.type === f);
  const isScout = role.id === "scout";

  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow={isScout ? "Akademi XYZ · Trial terbuka" : "Untuk Rizky · U10"}
        title={isScout ? "Trial & seleksi" : "Peluang untukmu"}
      />

      {!isScout && (
        <Panel className="mb-5 flex items-start gap-3 border-warning/40 bg-warning-soft">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div className="flex-1">
            <p className="text-sm font-bold">Profilmu belum terlihat oleh scout</p>
            <p className="text-xs text-muted-foreground">
              Orang tua mematikan izin scouting. Kamu tetap bisa mendaftar trial secara langsung.
            </p>
          </div>
          <Link
            to="/parent"
            className="shrink-0 text-xs font-bold text-primary underline-offset-2 hover:underline"
          >
            Minta izin
          </Link>
        </Panel>
      )}

      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {filters.map((x) => (
          <button
            key={x}
            onClick={() => setF(x)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-bold transition-colors",
              f === x ? "border-pitch bg-pitch text-pitch-foreground" : "bg-card",
            )}
          >
            {x}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {list.map((o) => {
          const done = applied.has(o.id);
          return (
            <li key={o.id}>
              <Panel className={cn("animate-rise", o.invited && "border-primary/40")}>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="pitch">{o.type}</Pill>
                  {o.invited && (
                    <Pill tone="signal">
                      <Star className="h-3 w-3" /> Diundang
                    </Pill>
                  )}
                </div>
                <h2 className="mt-2 text-lg font-bold leading-snug">{o.title}</h2>
                <p className="text-sm text-muted-foreground">{o.org}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" /> Tutup {o.deadline}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {o.slots} slot
                  </span>
                </div>
                {!isScout && (
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-semibold">Kecocokan profil</span>
                      <span className="font-mono font-bold">{o.fit}%</span>
                    </div>
                    <Meter value={o.fit} />
                  </div>
                )}
                <div className="mt-4">
                  {isScout ? (
                    <Btn
                      variant="outline"
                      className="w-full"
                      onClick={() => toast("Daftar pendaftar dibuka")}
                    >
                      Lihat {Math.round(o.slots * 1.6)} pendaftar
                    </Btn>
                  ) : done ? (
                    <p className="flex items-center justify-center gap-1.5 rounded-full bg-success-soft py-2.5 text-sm font-bold text-success">
                      <CheckCircle2 className="h-4 w-4" /> Terdaftar · menunggu persetujuan wali
                    </p>
                  ) : (
                    <Btn
                      className="w-full"
                      variant={o.invited ? "signal" : "primary"}
                      onClick={() => {
                        setApplied((s) => new Set(s).add(o.id));
                        toast.success("Pendaftaran dikirim dengan Football ID", {
                          description: "Orang tua akan menerima permintaan persetujuan.",
                        });
                      }}
                    >
                      Daftar dengan Football ID
                    </Btn>
                  )}
                </div>
              </Panel>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
