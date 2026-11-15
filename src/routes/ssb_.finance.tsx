import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BellRing, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Btn, Meter, PageHeader, Panel, Pill, SectionTitle, Stat } from "@/components/kit";
import { rupiah, ssb, ssbFinance, teams } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ssb_/finance")({
  head: () => ({
    meta: [
      { title: "Keuangan SSB Garuda Muda · BolaID" },
      {
        name: "description",
        content: "Pantau tagihan iuran, tingkat pembayaran, dan tunggakan pemain SSB.",
      },
      { property: "og:title", content: "Keuangan SSB · BolaID" },
      {
        property: "og:description",
        content: "Iuran, invoice, dan pengingat pembayaran otomatis untuk SSB.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FinancePage,
});

const shortRp = (n: number) =>
  `Rp${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
// Demo collection rate per team
const teamRate = [96, 91, 88, 82, 79, 85, 74, 90, 93];

function FinancePage() {
  const [reminded, setReminded] = useState<Set<string>>(new Set());
  const pct = Math.round((ssbFinance.collected / ssbFinance.billed) * 100);
  const maxM = Math.max(...ssbFinance.months.map((m) => m.v));

  return (
    <div>
      <PageHeader eyebrow={`${ssb.name} · November 2026`} title="Keuangan" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Ditagihkan" value={shortRp(ssbFinance.billed)} sub="186 pemain" />
        <Stat
          label="Terkumpul"
          value={shortRp(ssbFinance.collected)}
          sub={<Meter value={pct} className="mt-1" />}
        />
        <Stat label="Tingkat bayar" value={`${pct}%`} sub="Target 90%" />
        <Stat label="Menunggak" value={ssbFinance.overdue} sub="pemain > 7 hari" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <Panel>
            <SectionTitle eyebrow="6 bulan terakhir" title="Tingkat pembayaran" />
            <div className="flex h-40 items-end gap-2 sm:gap-3">
              {ssbFinance.months.map((m, i) => (
                <div key={m.m} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="font-mono text-[10px] font-bold">{m.v}%</span>
                  <div
                    className={cn(
                      "w-full rounded-t-lg",
                      i === ssbFinance.months.length - 1 ? "bg-signal" : "bg-primary",
                    )}
                    style={{ height: `${(m.v / maxM) * 100}%` }}
                  />
                  <span className="text-[11px] text-muted-foreground">{m.m}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              November masih berjalan — jatuh tempo 15 Nov.
            </p>
          </Panel>

          <Panel>
            <SectionTitle eyebrow="Per tim" title="Pembayaran iuran" />
            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {teams.map((t, i) => (
                <li key={t.name}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-bold">{t.name}</span>
                    <span className="font-mono">{teamRate[i]}%</span>
                  </div>
                  <Meter
                    value={teamRate[i] ?? 0}
                    tone={(teamRate[i] ?? 0) < 80 ? "warning" : "primary"}
                  />
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel>
            <SectionTitle
              eyebrow="Perlu tindakan"
              title="Tunggakan"
              action={
                <Btn
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReminded(new Set(ssbFinance.overdueList.map((o) => o.name)));
                    toast.success("Pengingat dikirim ke semua wali", {
                      description: "Lewat notifikasi aplikasi & WhatsApp",
                    });
                  }}
                >
                  Ingatkan semua
                </Btn>
              }
            />
            <ul className="divide-y">
              {ssbFinance.overdueList.map((o) => {
                const done = reminded.has(o.name);
                return (
                  <li key={o.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Avatar
                      initials={o.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                      tone="muted"
                      className="h-9 w-9 text-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{o.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {o.team} · {rupiah(o.amount)} ·{" "}
                        <span className={cn(o.days > 30 && "font-bold text-destructive")}>
                          {o.days} hari
                        </span>
                      </p>
                    </div>
                    {done ? (
                      <Pill tone="success">
                        <CheckCircle2 className="h-3 w-3" /> Terkirim
                      </Pill>
                    ) : (
                      <Btn
                        size="sm"
                        variant="ghost"
                        aria-label={`Ingatkan wali ${o.name}`}
                        onClick={() => {
                          setReminded((s) => new Set(s).add(o.name));
                          toast(`Pengingat dikirim ke wali ${o.name}`);
                        }}
                      >
                        <BellRing className="h-4 w-4" />
                      </Btn>
                    )}
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel className="bg-secondary">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-bold text-secondary-foreground">
                  Paket Growth · Rp499rb/bulan
                </p>
                <p className="mt-0.5 text-xs text-secondary-foreground/70">
                  Hingga 250 pemain, pembayaran online, dan laporan perkembangan. Founding SSB:
                  gratis 6 bulan.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
