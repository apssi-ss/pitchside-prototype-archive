import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  TrendingUp,
  Wallet,
  Eye,
  Lock,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Avatar,
  Btn,
  Meter,
  Panel,
  PageHeader,
  Pill,
  SectionTitle,
  Switch,
} from "@/components/kit";
import { auditTrail, children, parentMessages, rupiah } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/parent")({
  head: () => ({
    meta: [
      { title: "Dashboard Orang Tua · BolaID" },
      {
        name: "description",
        content:
          "Pantau jadwal latihan, pertandingan, perkembangan, pembayaran, dan izin data anak Anda.",
      },
      { property: "og:title", content: "Dashboard Orang Tua · BolaID" },
      {
        property: "og:description",
        content: "Bukan hanya berapa gol — lihat bagaimana anak Anda berkembang.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ParentPage,
});

const consentItems = [
  {
    key: "scouting",
    title: "Izinkan scouting",
    desc: "Akademi & scout terverifikasi dapat menemukan profil anak.",
  },
  {
    key: "tournament",
    title: "Bagikan ke panitia turnamen",
    desc: "Data identitas & roster untuk pendaftaran otomatis.",
  },
  {
    key: "photo",
    title: "Tampilkan foto publik",
    desc: "Foto muncul di halaman hasil pertandingan.",
  },
] as const;

function ParentPage() {
  const [childId, setChildId] = useState<string>("rizky");
  const [paid, setPaid] = useState<Record<string, boolean>>({});
  const [consent, setConsent] = useState({ scouting: false, tournament: true, photo: false });
  const child = children.find((c) => c.id === childId) ?? children[0];
  if (!child) return null;
  const isPaid = child.invoice.status === "paid" || paid[child.id];

  return (
    <div>
      <PageHeader eyebrow="Rabu, 11 November" title="Halo, Bu Sari 👋" />

      {/* Child switcher */}
      <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {children.map((c) => (
          <button
            key={c.id}
            onClick={() => setChildId(c.id)}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 transition-colors",
              c.id === childId ? "border-pitch bg-pitch text-pitch-foreground" : "bg-card",
            )}
          >
            <Avatar
              initials={c.initials}
              tone={c.id === childId ? "signal" : "muted"}
              className="h-8 w-8 text-xs"
            />
            <span className="text-left">
              <span className="block text-sm font-bold leading-tight">{c.name}</span>
              <span
                className={cn(
                  "block text-[11px] leading-tight",
                  c.id === childId ? "text-pitch-foreground/70" : "text-muted-foreground",
                )}
              >
                {c.category} · {c.org}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          {/* Today */}
          <div
            key={child.id}
            className="pitch-stripes rounded-3xl p-5 text-pitch-foreground shadow-lift animate-rise"
          >
            <div className="flex items-center justify-between">
              <Pill tone="signal">Latihan hari ini</Pill>
              <span className="font-mono text-2xl font-bold">{child.training.time}</span>
            </div>
            <p className="mt-4 font-display text-xl font-bold">{child.training.coach}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-pitch-foreground/75">
              <MapPin className="h-4 w-4" /> {child.training.place}
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-pitch-foreground/10 p-3">
              <CalendarDays className="h-5 w-5 shrink-0 text-signal" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wider text-pitch-muted">
                  Pertandingan berikutnya
                </p>
                <p className="truncate text-sm font-semibold">vs {child.match.opp}</p>
                <p className="truncate text-xs text-pitch-foreground/70">
                  {child.match.day} · {child.match.time} · {child.match.venue}
                </p>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3">
            <Panel className="p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Kehadiran
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold tabular">
                {child.attendance}%
              </p>
              <Meter value={child.attendance} className="mt-2" />
            </Panel>
            <Panel className="p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Skor perkembangan
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold tabular">
                {child.devScore.toFixed(1)}
              </p>
              <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-success">
                <TrendingUp className="h-3.5 w-3.5" /> +{child.devTrend} dari kuartal lalu
              </p>
            </Panel>
          </div>

          {/* Payment */}
          <Panel className={cn(!isPaid && "border-warning/40")}>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  isPaid ? "bg-success-soft text-success" : "bg-warning-soft text-warning",
                )}
              >
                {isPaid ? <CheckCircle2 className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{child.invoice.label}</p>
                <p className="text-xs text-muted-foreground">
                  {rupiah(child.invoice.amount)} ·{" "}
                  {isPaid ? "Lunas" : `Jatuh tempo ${child.invoice.due}`}
                </p>
              </div>
              {isPaid ? (
                <Pill tone="success">Lunas</Pill>
              ) : (
                <Btn
                  variant="signal"
                  size="sm"
                  onClick={() => {
                    setPaid((p) => ({ ...p, [child.id]: true }));
                    toast.success("Pembayaran berhasil", {
                      description: `${child.invoice.label} — ${rupiah(child.invoice.amount)}`,
                    });
                  }}
                >
                  Bayar
                </Btn>
              )}
            </div>
          </Panel>

          <Link
            to="/player"
            className="flex items-center justify-between rounded-2xl border bg-card p-4 shadow-card transition-colors hover:bg-muted"
          >
            <span>
              <span className="block text-sm font-bold">Buka Football Passport {child.name}</span>
              <span className="block text-xs text-muted-foreground">
                Journey, perkembangan & sertifikat
              </span>
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>

        <div className="space-y-4">
          {/* Messages */}
          <Panel>
            <SectionTitle eyebrow="Komunikasi" title="Pesan terbaru" />
            <ul className="space-y-3">
              {parentMessages.map((m) => (
                <li key={m.text} className="flex gap-3">
                  <Avatar
                    initials={m.from
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                    tone="muted"
                    className="h-9 w-9 text-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-bold">{m.from}</p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{m.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{m.role}</p>
                    <p className="mt-1 text-sm leading-snug">{m.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Consent */}
          <Panel>
            <SectionTitle
              eyebrow="Privasi & persetujuan"
              title="Kendali data anak"
              action={<Lock className="h-4 w-4 text-muted-foreground" />}
            />
            <ul className="divide-y">
              {consentItems.map((c) => (
                <li key={c.key} className="flex items-center gap-3 py-3 first:pt-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{c.title}</p>
                    <p className="text-xs leading-snug text-muted-foreground">{c.desc}</p>
                  </div>
                  <Switch
                    label={c.title}
                    checked={consent[c.key]}
                    onChange={(v) => {
                      setConsent((s) => ({ ...s, [c.key]: v }));
                      toast(v ? `${c.title}: AKTIF` : `${c.title}: NONAKTIF`, {
                        description: "Tercatat di jejak audit.",
                      });
                    }}
                  />
                </li>
              ))}
            </ul>
            <div className="mt-3 rounded-xl bg-muted p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold">
                <Eye className="h-3.5 w-3.5" /> Siapa yang mengakses data
              </p>
              <ul className="space-y-1.5">
                {auditTrail.map((a) => (
                  <li key={a.what} className="flex justify-between gap-2 text-xs">
                    <span>
                      <span className="font-semibold">{a.who}</span>{" "}
                      <span className="text-muted-foreground">{a.what}</span>
                    </span>
                    <span className="shrink-0 text-muted-foreground">{a.when}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Diperbarui 2 menit lalu
          </p>
        </div>
      </div>
    </div>
  );
}
