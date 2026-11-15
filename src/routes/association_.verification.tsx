import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, FileWarning, X } from "lucide-react";
import { toast } from "sonner";
import { Btn, PageHeader, Panel, Pill, Segmented, Stat } from "@/components/kit";

export const Route = createFileRoute("/association_/verification")({
  head: () => ({
    meta: [
      { title: "Verifikasi & Lisensi · BolaID" },
      {
        name: "description",
        content: "Antrian verifikasi SSB, lisensi pelatih, dan izin kompetisi.",
      },
      { property: "og:title", content: "Verifikasi & Lisensi · BolaID" },
      {
        property: "og:description",
        content: "Antrian verifikasi SSB, lisensi pelatih, dan izin kompetisi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VerificationPage,
});

type Kind = "ssb" | "license" | "competition";
type Status = "pending" | "missing" | "approved" | "rejected";
type Item = { id: string; kind: Kind; title: string; sub: string; status: Status };

const kindLabel: Record<Kind, string> = {
  ssb: "SSB",
  license: "Lisensi",
  competition: "Kompetisi",
};

const seed: Item[] = [
  {
    id: "1",
    kind: "ssb",
    title: "SSB Tamalate Muda",
    sub: "Kec. Tamalate · 42 pemain",
    status: "pending",
  },
  {
    id: "2",
    kind: "ssb",
    title: "Akademi Losari",
    sub: "Kec. Ujung Pandang · 30 pemain",
    status: "missing",
  },
  {
    id: "3",
    kind: "license",
    title: "Lisensi C — Coach Fajar",
    sub: "Unggah manual · SSB Garuda Muda",
    status: "pending",
  },
  {
    id: "4",
    kind: "competition",
    title: "Turnamen Losari Cup",
    sub: "U10–U12 · Desember",
    status: "pending",
  },
  {
    id: "5",
    kind: "ssb",
    title: "SSB Panakkukang",
    sub: "Kec. Panakkukang · 55 pemain",
    status: "pending",
  },
  {
    id: "6",
    kind: "license",
    title: "Lisensi D — Coach Reza",
    sub: "PSSI eLearning",
    status: "approved",
  },
  { id: "7", kind: "ssb", title: "SSB Sudiang", sub: "Kec. Biringkanaya", status: "approved" },
];

const statusPill: Record<
  Status,
  { tone: "warning" | "danger" | "success" | "neutral"; label: string }
> = {
  pending: { tone: "warning", label: "Menunggu" },
  missing: { tone: "danger", label: "Dokumen kurang" },
  approved: { tone: "success", label: "Disetujui" },
  rejected: { tone: "neutral", label: "Ditolak" },
};

function VerificationPage() {
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState<"open" | "done">("open");
  const [kind, setKind] = useState<"all" | Kind>("all");

  const isOpen = (i: Item) => i.status === "pending" || i.status === "missing";
  const shown = items.filter(
    (i) => (tab === "open" ? isOpen(i) : !isOpen(i)) && (kind === "all" || i.kind === kind),
  );
  const count = (k: Kind) => items.filter((i) => i.kind === k && isOpen(i)).length;

  const act = (i: Item, status: Status) => {
    setItems((all) => all.map((x) => (x.id === i.id ? { ...x, status } : x)));
    const msg =
      status === "approved"
        ? `${i.title} disetujui`
        : status === "rejected"
          ? `${i.title} ditolak`
          : `Dokumen diminta dari ${i.title}`;
    toast.success(msg, { description: "Pemohon diberi kabar lewat notifikasi." });
  };

  return (
    <div>
      <PageHeader eyebrow="Askot PSSI Makassar" title="Verifikasi & Lisensi" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="SSB menunggu" value={count("ssb")} />
        <Stat label="Lisensi pelatih" value={count("license")} sub="perlu cek" />
        <Stat label="Kompetisi" value={count("competition")} sub="perlu izin" />
        <Stat label="Selesai" value={items.filter((i) => !isOpen(i)).length} sub="bulan ini" />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Segmented
          className="sm:w-72"
          value={tab}
          onChange={setTab}
          options={[
            { value: "open", label: `Antrian (${items.filter(isOpen).length})` },
            { value: "done", label: "Selesai" },
          ]}
        />
        <Segmented
          className="sm:flex-1"
          value={kind}
          onChange={setKind}
          options={[
            { value: "all", label: "Semua" },
            { value: "ssb", label: "SSB" },
            { value: "license", label: "Lisensi" },
            { value: "competition", label: "Kompetisi" },
          ]}
        />
      </div>

      <Panel className="mt-4 p-0 sm:p-0">
        {shown.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Tidak ada pengajuan di sini.
          </p>
        ) : (
          <ul className="divide-y">
            {shown.map((i) => (
              <li
                key={i.id}
                className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Pill tone="pitch">{kindLabel[i.kind]}</Pill>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{i.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{i.sub}</p>
                  </div>
                  <Pill tone={statusPill[i.status].tone}>{statusPill[i.status].label}</Pill>
                </div>
                {isOpen(i) && (
                  <div className="flex gap-2">
                    {i.status === "pending" && (
                      <Btn size="sm" variant="outline" onClick={() => act(i, "missing")}>
                        <FileWarning className="h-3.5 w-3.5" /> Minta dokumen
                      </Btn>
                    )}
                    <Btn
                      size="sm"
                      variant="outline"
                      onClick={() => act(i, "rejected")}
                      aria-label={`Tolak ${i.title}`}
                    >
                      <X className="h-3.5 w-3.5" /> Tolak
                    </Btn>
                    <Btn
                      size="sm"
                      onClick={() => act(i, "approved")}
                      aria-label={`Setujui ${i.title}`}
                    >
                      <Check className="h-3.5 w-3.5" /> Setujui
                    </Btn>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
