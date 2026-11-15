import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck, Star, TrendingUp, SearchX, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Avatar, PageHeader, Panel, Pill, Segmented } from "@/components/kit";
import { scoutPool } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/scout")({
  head: () => ({
    meta: [
      { title: "Pencarian Pemain · BolaID Scout" },
      {
        name: "description",
        content:
          "Cari pemain muda berdasarkan umur, wilayah, posisi, dan pengalaman — hanya yang telah diizinkan wali.",
      },
      { property: "og:title", content: "Scouting Engine · BolaID" },
      {
        property: "og:description",
        content: "Talent discovery dengan privasi & persetujuan orang tua sebagai fondasi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScoutPage,
});

const ages = ["U10", "U12", "U14"] as const;
const positions = ["GK", "CB", "CM", "ST"] as const;
const feet = ["Semua", "Kanan", "Kiri"] as const;

function Chip({ on, children, onClick }: { on: boolean; children: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors",
        on ? "border-pitch bg-pitch text-pitch-foreground" : "bg-card hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

function ScoutPage() {
  const [age, setAge] = useState<string>("U12");
  const [pos, setPos] = useState<string>("CB");
  const [foot, setFoot] = useState<string>("Semua");
  const [minMatches, setMinMatches] = useState(15);
  const [view, setView] = useState<"results" | "shortlist">("results");
  const [shortlist, setShortlist] = useState<Set<string>>(new Set());

  const matched = useMemo(
    () =>
      scoutPool.filter(
        (p) =>
          p.age === age &&
          p.pos === pos &&
          (foot === "Semua" || p.foot === foot) &&
          p.matches >= minMatches,
      ),
    [age, pos, foot, minMatches],
  );
  const visible = matched.filter((p) => p.consent);
  const hidden = matched.length - visible.length;
  const list = view === "results" ? visible : scoutPool.filter((p) => shortlist.has(p.id));

  return (
    <div>
      <PageHeader eyebrow="Akademi XYZ · Scout terverifikasi" title="Cari pemain" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr] lg:items-start">
        <Panel className="space-y-4 lg:sticky lg:top-10">
          <p className="flex items-center gap-2 text-sm font-bold">
            <SlidersHorizontal className="h-4 w-4" /> Filter · Sulawesi Selatan
          </p>
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Kelompok umur</p>
            <div className="flex flex-wrap gap-2">
              {ages.map((a) => (
                <Chip key={a} on={age === a} onClick={() => setAge(a)}>
                  {a}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Posisi</p>
            <div className="flex flex-wrap gap-2">
              {positions.map((a) => (
                <Chip key={a} on={pos === a} onClick={() => setPos(a)}>
                  {a}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Kaki dominan</p>
            <div className="flex flex-wrap gap-2">
              {feet.map((a) => (
                <Chip key={a} on={foot === a} onClick={() => setFoot(a)}>
                  {a}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 flex justify-between text-xs">
              <label htmlFor="mm" className="font-semibold text-muted-foreground">
                Minimal pertandingan
              </label>
              <span className="font-mono font-bold">≥ {minMatches}</span>
            </div>
            <input
              id="mm"
              type="range"
              min={0}
              max={40}
              step={5}
              value={minMatches}
              onChange={(e) => setMinMatches(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </Panel>

        <div className="space-y-3">
          <Segmented
            options={
              [
                { value: "results", label: `Hasil (${visible.length})` },
                { value: "shortlist", label: `Shortlist (${shortlist.size})` },
              ] as const
            }
            value={view}
            onChange={setView}
          />

          {view === "results" && hidden > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-secondary p-3.5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-xs text-secondary-foreground">
                <span className="font-bold">{hidden} pemain lain cocok</span> tetapi tidak
                ditampilkan karena wali belum memberi izin scouting.
              </p>
            </div>
          )}

          {list.length === 0 ? (
            <Panel className="flex flex-col items-center gap-2 py-12 text-center">
              <SearchX className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-semibold">
                {view === "results" ? "Tidak ada pemain yang cocok" : "Shortlist masih kosong"}
              </p>
              <p className="text-xs text-muted-foreground">
                {view === "results"
                  ? "Coba longgarkan filter pertandingan atau posisi."
                  : "Ketuk bintang pada hasil pencarian."}
              </p>
            </Panel>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {list.map((p) => {
                const starred = shortlist.has(p.id);
                return (
                  <li key={p.id}>
                    <Panel className="animate-rise">
                      <div className="flex items-start gap-3">
                        <Avatar initials={p.initials} />
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-sm font-bold">
                            IDN-FB-{p.id.slice(0, 5)}•••{p.id.slice(-2)}
                          </p>
                          <p className="text-xs text-muted-foreground">{p.region}</p>
                        </div>
                        <button
                          onClick={() => {
                            setShortlist((s) => {
                              const n = new Set(s);
                              if (n.has(p.id)) n.delete(p.id);
                              else n.add(p.id);
                              return n;
                            });
                            if (!starred) toast.success("Ditambahkan ke shortlist");
                          }}
                          aria-label={starred ? "Hapus dari shortlist" : "Tambah ke shortlist"}
                          aria-pressed={starred}
                          className={cn(
                            "rounded-full p-2 transition-colors",
                            starred
                              ? "bg-signal text-signal-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          <Star className={cn("h-4 w-4", starred && "fill-current")} />
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <Pill tone="pitch">{p.age}</Pill>
                        <Pill tone="neutral">{p.pos}</Pill>
                        <Pill tone="neutral">Kaki {p.foot.toLowerCase()}</Pill>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center">
                        <div>
                          <p className="font-display text-lg font-extrabold tabular">{p.matches}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Laga
                          </p>
                        </div>
                        <div>
                          <p className="font-display text-lg font-extrabold tabular">
                            {p.score.toFixed(1)}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Skor dev
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center justify-center gap-0.5 font-display text-lg font-extrabold text-success tabular">
                            <TrendingUp className="h-3.5 w-3.5" />+{p.trend}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Tren
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          toast("Permintaan kontak dikirim ke wali", {
                            description: "Nama & kontak terbuka setelah wali menyetujui.",
                          })
                        }
                        className="mt-3 w-full rounded-full border py-2 text-sm font-bold transition-colors hover:bg-muted"
                      >
                        Minta kontak via wali
                      </button>
                    </Panel>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
