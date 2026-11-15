import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, QrCode, Landmark, Smartphone, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Btn, PageHeader, Panel, Pill, SectionTitle } from "@/components/kit";
import { parentInvoices, paymentHistory, rupiah } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Tagihan & Pembayaran · BolaID" },
      {
        name: "description",
        content:
          "Bayar iuran SSB dan biaya turnamen anak lewat QRIS, virtual account, atau e-wallet.",
      },
      { property: "og:title", content: "Tagihan & Pembayaran · BolaID" },
      { property: "og:description", content: "Semua tagihan sepak bola anak dalam satu tempat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentsPage,
});

const methods = [
  { id: "QRIS", icon: QrCode },
  { id: "VA BCA", icon: Landmark },
  { id: "GoPay", icon: Smartphone },
] as const;

function PaymentsPage() {
  const [paid, setPaid] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);
  const [method, setMethod] = useState<string>("QRIS");

  const isPaid = (id: string, status: string) => status === "paid" || paid.has(id);
  const outstanding = parentInvoices
    .filter((i) => !isPaid(i.id, i.status))
    .reduce((s, i) => s + i.amount, 0);

  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow="Keluarga Wulandari" title="Tagihan" />

      <div className="pitch-stripes mb-5 rounded-3xl p-5 text-pitch-foreground shadow-lift">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-pitch-muted">
          Total belum dibayar
        </p>
        <p className="mt-1 font-display text-4xl font-extrabold tabular">{rupiah(outstanding)}</p>
        <p className="mt-1 text-sm text-pitch-foreground/75">
          {outstanding === 0 ? "Semua tagihan lunas 🎉" : "Jatuh tempo terdekat 15 Nov"}
        </p>
      </div>

      <SectionTitle eyebrow="Aktif" title="Tagihan bulan ini" />
      <ul className="mb-6 space-y-3">
        {parentInvoices.map((inv) => {
          const done = isPaid(inv.id, inv.status);
          const expanded = open === inv.id && !done;
          return (
            <li key={inv.id}>
              <Panel className={cn(!done && "border-warning/40")}>
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      done ? "bg-success-soft text-success" : "bg-warning-soft text-warning",
                    )}
                  >
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <Receipt className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-snug">{inv.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {inv.child} · <span className="font-mono">{inv.id}</span>
                    </p>
                    <p className="mt-1 font-display text-lg font-bold tabular">
                      {rupiah(inv.amount)}
                    </p>
                  </div>
                  {done ? (
                    <Pill tone="success">Lunas</Pill>
                  ) : (
                    <div className="text-right">
                      <Pill tone="warning">Tempo {inv.due}</Pill>
                    </div>
                  )}
                </div>
                {!done && !expanded && (
                  <Btn className="mt-3 w-full" variant="signal" onClick={() => setOpen(inv.id)}>
                    Bayar sekarang
                  </Btn>
                )}
                {expanded && (
                  <div className="mt-3 animate-rise">
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">Pilih metode</p>
                    <div className="grid grid-cols-3 gap-2">
                      {methods.map(({ id, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setMethod(id)}
                          className={cn(
                            "flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-bold transition-colors",
                            method === id
                              ? "border-primary bg-secondary"
                              : "bg-card hover:bg-muted",
                          )}
                        >
                          <Icon className="h-5 w-5" /> {id}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Btn variant="outline" className="flex-1" onClick={() => setOpen(null)}>
                        Batal
                      </Btn>
                      <Btn
                        className="flex-1"
                        onClick={() => {
                          setPaid((s) => new Set(s).add(inv.id));
                          setOpen(null);
                          toast.success("Pembayaran berhasil", {
                            description: `${inv.label} · ${method}`,
                          });
                        }}
                      >
                        Bayar {rupiah(inv.amount)}
                      </Btn>
                    </div>
                  </div>
                )}
              </Panel>
            </li>
          );
        })}
      </ul>

      <Panel>
        <SectionTitle eyebrow="Riwayat" title="Pembayaran sebelumnya" />
        <ul className="divide-y">
          {paymentHistory.map((p) => (
            <li
              key={p.label}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{p.label}</p>
                <p className="text-xs text-muted-foreground">
                  {p.date} · {p.method}
                </p>
              </div>
              <p className="font-mono text-sm font-bold tabular">{rupiah(p.amount)}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
