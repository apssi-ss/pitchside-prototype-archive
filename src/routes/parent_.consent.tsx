import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { History, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  Btn,
  PageHeader,
  Panel,
  Pill,
  SectionTitle,
  Segmented,
  Stat,
  Switch,
} from "@/components/kit";
import { children } from "@/lib/mock-data";

export const Route = createFileRoute("/parent_/consent")({
  head: () => ({
    meta: [
      { title: "Izin & Privasi Anak · BolaID" },
      {
        name: "description",
        content: "Kendalikan siapa yang boleh melihat data anak dan lihat jejak aksesnya.",
      },
      { property: "og:title", content: "Izin & Privasi Anak · BolaID" },
      {
        property: "og:description",
        content: "Kendalikan siapa yang boleh melihat data anak dan lihat jejak aksesnya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ConsentPage,
});

type Purpose = { id: string; label: string; sub: string };
const purposes: Purpose[] = [
  { id: "scout", label: "Scouting", sub: "Scout terverifikasi melihat profil ringkas" },
  { id: "public", label: "Profil publik", sub: "Nama & foto di hasil turnamen" },
  { id: "video", label: "Video pertandingan", sub: "Dibagikan ke akademi" },
  { id: "report", label: "Laporan perkembangan", sub: "Dibagikan ke pelatih SSB lain saat trial" },
];

type Access = {
  id: string;
  org: string;
  why: string;
  until: string;
  kind: "member" | "temp";
  active: boolean;
};
type Log = { what: string; who: string; when: string; tone?: "danger" | "success" };

const initial = () => ({
  on: { scout: true, public: true, video: false, report: true } as Record<string, boolean>,
  access: [
    {
      id: "ssb",
      org: "SSB Garuda Muda",
      why: "Keanggotaan · latihan & absensi",
      until: "Selama anggota",
      kind: "member",
      active: true,
    },
    {
      id: "myc",
      org: "Panitia MYC 2027",
      why: "Verifikasi roster turnamen",
      until: "s.d. 20 Nov",
      kind: "temp",
      active: true,
    },
    {
      id: "xyz",
      org: "Akademi XYZ · Hendra",
      why: "Scouting · profil ringkas",
      until: "s.d. 31 Des",
      kind: "temp",
      active: true,
    },
  ] as Access[],
  log: [
    { what: "Akademi XYZ melihat profil", who: "Hendra · Scout", when: "10 Nov" },
    { what: "Panitia MYC verifikasi roster", who: "Football ID", when: "8 Nov" },
    { what: "Izin video dimatikan", who: "oleh Anda", when: "2 Nov", tone: "danger" },
  ] as Log[],
});

function ConsentPage() {
  const [childId, setChildId] = useState(children[0]?.id ?? "");
  const [state, setState] = useState(
    () =>
      Object.fromEntries(children.map((c) => [c.id, initial()])) as Record<
        string,
        ReturnType<typeof initial>
      >,
  );
  const child = children.find((c) => c.id === childId) ?? children[0];
  if (!child) return null;
  const s = state[childId] ?? initial();

  const update = (fn: (cur: ReturnType<typeof initial>) => ReturnType<typeof initial>) =>
    setState((all) => ({ ...all, [childId]: fn(all[childId] ?? initial()) }));

  const toggle = (p: Purpose, v: boolean) => {
    update((cur) => ({
      ...cur,
      on: { ...cur.on, [p.id]: v },
      log: [
        {
          what: `Izin ${p.label.toLowerCase()} ${v ? "dinyalakan" : "dimatikan"}`,
          who: "oleh Anda",
          when: "Baru saja",
          tone: v ? "success" : "danger",
        },
        ...cur.log,
      ],
    }));
    toast.success(`${p.label} ${v ? "diizinkan" : "dimatikan"}`, {
      description: `Berlaku untuk ${child.name}.`,
    });
  };

  const revoke = (a: Access) => {
    update((cur) => ({
      ...cur,
      access: cur.access.map((x) => (x.id === a.id ? { ...x, active: false } : x)),
      log: [
        { what: `Akses ${a.org} dicabut`, who: "oleh Anda", when: "Baru saja", tone: "danger" },
        ...cur.log,
      ],
    }));
    toast.success(`Akses ${a.org} dicabut`, {
      description: "Mereka tidak bisa lagi melihat data anak.",
    });
  };

  const activeCount = purposes.filter((p) => s.on[p.id]).length;
  const accessCount = s.access.filter((a) => a.active).length;

  return (
    <div>
      <PageHeader eyebrow="Guardian consent" title="Izin & Privasi Anak">
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Data milik anak dan keluarga. Anda yang menentukan siapa boleh melihat, dan bisa
          mencabutnya kapan saja.
        </p>
      </PageHeader>

      <Segmented
        className="mb-4 max-w-sm"
        value={childId}
        onChange={setChildId}
        options={children.map((c) => ({ value: c.id, label: `${c.name} · ${c.category}` }))}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Izin aktif" value={`${activeCount}/${purposes.length}`} />
        <Stat label="Akses berjalan" value={accessCount} sub="organisasi" />
        <Stat label="Scouting" value={s.on["scout"] ? "Ya" : "Tidak"} />
        <Stat label="Log akses" value={s.log.length} sub="tercatat" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle eyebrow={child.name} title="Siapa boleh melihat" />
          <ul className="divide-y">
            {purposes.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.sub}</p>
                </div>
                <Switch label={p.label} checked={!!s.on[p.id]} onChange={(v) => toggle(p, v)} />
              </li>
            ))}
            <li className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <Lock className="h-3.5 w-3.5" /> Data medis
                </p>
                <p className="text-xs text-muted-foreground">Hanya SSB & panitia saat laga</p>
              </div>
              <Pill tone="warning">Terbatas</Pill>
            </li>
          </ul>
        </Panel>

        <Panel>
          <SectionTitle eyebrow="Saat ini" title="Akses yang berjalan" />
          <ul className="space-y-2">
            {s.access.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-xl border p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{a.org}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.why} · {a.until}
                  </p>
                </div>
                {!a.active ? (
                  <Pill tone="danger">Dicabut</Pill>
                ) : a.kind === "member" ? (
                  <Pill tone="pitch">Keanggotaan</Pill>
                ) : (
                  <Btn size="sm" variant="outline" onClick={() => revoke(a)}>
                    Cabut
                  </Btn>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            SSB hanya punya hubungan keanggotaan — perjalanan sepak bola tetap milik {child.name}.
          </p>
        </Panel>

        <Panel className="lg:col-span-2">
          <SectionTitle
            eyebrow="Audit trail"
            title="Jejak akses"
            action={<History className="h-4 w-4 text-muted-foreground" />}
          />
          <ul className="divide-y">
            {s.log.map((l, i) => (
              <li key={l.what + i} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{l.what}</p>
                  <p className="truncate text-xs text-muted-foreground">{l.who}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{l.when}</span>
                {l.tone && (
                  <Pill tone={l.tone}>{l.tone === "danger" ? "Dicabut" : "Diizinkan"}</Pill>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
