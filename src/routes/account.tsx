import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight, Download, LogOut, Phone, ShieldCheck, KeyRound } from "lucide-react";
import { toast } from "sonner";
import {
  Avatar,
  Btn,
  PageHeader,
  Panel,
  Pill,
  SectionTitle,
  Segmented,
  Switch,
} from "@/components/kit";
import { roles, useRole, type RoleId } from "@/lib/roles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Akun & Peran · BolaID" },
      {
        name: "description",
        content: "Satu akun untuk semua peran: orang tua, pelatih, wasit, dan lainnya.",
      },
      { property: "og:title", content: "Akun & Peran · BolaID" },
      { property: "og:description", content: "Kelola peran, keamanan, notifikasi, dan data Anda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({
    whatsapp: true,
    email: false,
    reminder: true,
    weekly: true,
  });
  const [lang, setLang] = useState<"id" | "en">("id");

  const pick = (id: RoleId) => {
    const r = roles.find((x) => x.id === id);
    const firstTab = r?.tabs[0];
    if (!r || !firstTab) return;
    setRole(id);
    navigate({ to: firstTab.to });
  };

  const prefRows: { key: keyof typeof prefs; label: string; sub: string }[] = [
    { key: "whatsapp", label: "WhatsApp", sub: "Pengingat jadwal & tagihan" },
    { key: "email", label: "Email", sub: "Ringkasan & kuitansi" },
    { key: "reminder", label: "Pengingat H-1", sub: "Sehari sebelum latihan/laga" },
    { key: "weekly", label: "Ringkasan mingguan", sub: "Setiap Senin pagi" },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Akun" title="Akun & Peran" />

      <Panel className="flex items-center gap-4">
        <Avatar initials={role.initials} className="h-14 w-14 text-lg" tone="signal" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl font-bold">{role.person}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5" /> +62 812-••••-4471
            <Pill tone="success" className="ml-1">
              Terverifikasi
            </Pill>
          </p>
        </div>
      </Panel>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle eyebrow="Satu akun, banyak peran" title="Peran saya" />
          <ul className="grid gap-1.5">
            {roles.map((r) => {
              const Icon = r.icon;
              const on = r.id === role.id;
              return (
                <li key={r.id}>
                  <button
                    onClick={() => pick(r.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      on ? "bg-secondary" : "hover:bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        on ? "bg-signal text-signal-foreground" : "bg-muted",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold leading-tight">{r.label}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {r.product} · {r.person}
                      </span>
                    </span>
                    {on ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Prototipe: semua peran bisa dicoba. Di aplikasi nyata, hanya peran yang terhubung ke
            akun Anda yang tampil.
          </p>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <SectionTitle eyebrow="Pengingat" title="Notifikasi" />
            <ul className="divide-y">
              {prefRows.map((p) => (
                <li key={p.key} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.sub}</p>
                  </div>
                  <Switch
                    label={p.label}
                    checked={prefs[p.key]}
                    onChange={(v) => setPrefs((s) => ({ ...s, [p.key]: v }))}
                  />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <SectionTitle eyebrow="Tampilan" title="Bahasa" />
            <Segmented
              value={lang}
              onChange={(v) => {
                setLang(v);
                if (v === "en")
                  toast("Bahasa Inggris segera hadir", {
                    description: "Prototipe ini baru tersedia dalam Bahasa Indonesia.",
                  });
              }}
              options={[
                { value: "id", label: "Bahasa Indonesia" },
                { value: "en", label: "English" },
              ]}
            />
          </Panel>

          <Panel>
            <SectionTitle eyebrow="Keamanan & data" title="Privasi" />
            <ul className="divide-y">
              <li>
                <button
                  className="flex w-full items-center gap-3 py-2.5 text-left"
                  onClick={() =>
                    toast.success("PIN diperbarui", { description: "Contoh di prototipe." })
                  }
                >
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-sm font-semibold">Ubah PIN masuk</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </li>
              <li>
                <Link to="/parent/consent" className="flex w-full items-center gap-3 py-2.5">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-sm font-semibold">Izin data anak</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
              <li>
                <button
                  className="flex w-full items-center gap-3 py-2.5 text-left"
                  onClick={() =>
                    toast.success("Permintaan unduh data dikirim", {
                      description: "Tautan akan dikirim via WhatsApp.",
                    })
                  }
                >
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-sm font-semibold">Unduh data saya</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </li>
            </ul>
          </Panel>

          <Btn
            variant="outline"
            className="w-full"
            onClick={() =>
              toast("Anda keluar dari prototipe", { description: "Belum ada akun sungguhan." })
            }
          >
            <LogOut className="h-4 w-4" /> Keluar
          </Btn>
        </div>
      </div>
    </div>
  );
}
