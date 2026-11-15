import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Search, UserPlus, MapPin, ClipboardList, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Btn, Meter, Panel, PageHeader, Pill, SectionTitle, Stat } from "@/components/kit";
import { roster, sessions, ssb, teams } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ssb")({
  head: () => ({
    meta: [
      { title: "Football OS — Dashboard SSB · BolaID" },
      {
        name: "description",
        content:
          "Kelola pemain, tim, absensi latihan, dan iuran SSB — terhubung langsung dengan Football ID pemain.",
      },
      { property: "og:title", content: "Football OS untuk SSB · BolaID" },
      {
        property: "og:description",
        content: "Roster, absensi, dan keuangan SSB dalam satu dashboard mobile.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SsbPage,
});

const feeTone = { paid: "success", unpaid: "warning", late: "danger" } as const;
const feeLabel = { paid: "Lunas", unpaid: "Belum", late: "Telat" } as const;

function SsbPage() {
  const [team, setTeam] = useState("U10");
  const [query, setQuery] = useState("");
  const [present, setPresent] = useState<Set<string>>(
    new Set(["000123", "000131", "000204", "000257"]),
  );
  const [lookup, setLookup] = useState("");
  const [found, setFound] = useState(false);

  const list = useMemo(
    () =>
      roster.filter(
        (p) =>
          p.team === team &&
          (p.name.toLowerCase().includes(query.toLowerCase()) || p.id.includes(query)),
      ),
    [team, query],
  );
  const teamRoster = roster.filter((p) => p.team === team);

  const toggle = (id: string) =>
    setPresent((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div>
      <PageHeader eyebrow={`${ssb.orgId} · ${ssb.city}`} title={ssb.name} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Pemain aktif" value={ssb.players} sub="+12 bulan ini" />
        <Stat label="Tim" value={ssb.teams} sub="U7 – U15" />
        <Stat label="Pelatih" value={ssb.coaches} sub="9 berlisensi" />
        <Stat
          label="Iuran terkumpul"
          value={`${ssb.collection}%`}
          sub={<Meter value={ssb.collection} className="mt-1" />}
        />
      </div>

      {/* Team chips */}
      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {teams.map((t) => (
          <button
            key={t.name}
            onClick={() => setTeam(t.name)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors",
              t.name === team
                ? "border-pitch bg-pitch text-pitch-foreground"
                : "bg-card text-foreground hover:bg-muted",
            )}
          >
            {t.name}{" "}
            <span
              className={cn(
                "ml-1 font-mono text-xs",
                t.name === team ? "text-pitch-foreground/70" : "text-muted-foreground",
              )}
            >
              {t.players}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {/* Today's sessions */}
          <Panel>
            <SectionTitle
              eyebrow="Hari ini"
              title="Sesi latihan"
              action={<Pill tone="neutral">{sessions.length} sesi</Pill>}
            />
            <ul className="space-y-2.5">
              {sessions.map((s) => (
                <li
                  key={s.team}
                  className={cn(
                    "rounded-xl border p-3",
                    s.team === team && "border-primary bg-secondary",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Pill tone={s.team === team ? "pitch" : "neutral"}>{s.team}</Pill>
                    <span className="font-mono text-xs font-bold">{s.time}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-snug">{s.plan}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {s.place} · {s.coach}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Add via Football ID */}
          <Panel>
            <SectionTitle eyebrow="Registrasi" title="Tambah pemain via Football ID" />
            <p className="-mt-1 mb-3 text-xs text-muted-foreground">
              Tanpa isi ulang data. Riwayat pemain tetap milik pemain.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setFound(lookup.trim().length >= 4);
                if (lookup.trim().length < 4) toast.error("Masukkan minimal 4 digit Football ID");
              }}
            >
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
                  IDN-FB-
                </span>
                <input
                  value={lookup}
                  onChange={(e) => {
                    setLookup(e.target.value);
                    setFound(false);
                  }}
                  placeholder="2016-000412"
                  inputMode="numeric"
                  className="h-10 w-full rounded-full border bg-background pl-[68px] pr-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Btn type="submit" size="icon" aria-label="Cari">
                <Search className="h-4 w-4" />
              </Btn>
            </form>
            {found && (
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-muted p-3 animate-rise">
                <Avatar initials="IS" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-sm font-bold">
                    Ilham Saputra <BadgeCheck className="h-4 w-4 text-primary" />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    2016 · ST · sebelumnya SSB Maros Raya
                  </p>
                </div>
                <Btn
                  size="sm"
                  variant="signal"
                  onClick={() => {
                    toast.success("Permintaan keanggotaan dikirim", {
                      description: "Menunggu persetujuan wali Ilham.",
                    });
                    setFound(false);
                    setLookup("");
                  }}
                >
                  <UserPlus className="h-3.5 w-3.5" /> Ajukan
                </Btn>
              </div>
            )}
          </Panel>
        </div>

        {/* Roster with attendance */}
        <Panel className="p-0 sm:p-0">
          <div className="p-4 pb-3 sm:p-5 sm:pb-3">
            <SectionTitle
              eyebrow={`Tim ${team}`}
              title="Absensi & roster"
              action={
                <span className="font-mono text-sm font-bold tabular">
                  {teamRoster.filter((p) => present.has(p.id)).length}/{teamRoster.length}
                </span>
              }
            />
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama atau ID"
                className="h-10 w-full rounded-full border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          {list.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <ClipboardList className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-semibold">Belum ada pemain di tampilan ini</p>
              <p className="text-xs text-muted-foreground">Data contoh hanya tersedia untuk U10.</p>
            </div>
          ) : (
            <ul className="divide-y border-t">
              {list.map((p) => {
                const on = present.has(p.id);
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => toggle(p.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted sm:px-5"
                      aria-pressed={on}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
                          on
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border",
                        )}
                      >
                        {on && <Check className="h-4 w-4" strokeWidth={3} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{p.name}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          #{p.id} · {p.pos} · hadir {p.att}%
                        </p>
                      </div>
                      <Pill tone={feeTone[p.fee]}>{feeLabel[p.fee]}</Pill>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="border-t p-4 sm:p-5">
            <Btn
              className="w-full"
              size="lg"
              onClick={() =>
                toast.success("Absensi disimpan", {
                  description: `${teamRoster.filter((p) => present.has(p.id)).length} pemain hadir · notifikasi dikirim ke orang tua`,
                })
              }
            >
              Simpan absensi
            </Btn>
          </div>
        </Panel>
      </div>
    </div>
  );
}
