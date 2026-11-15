import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Lock } from "lucide-react";
import { Meter, PageHeader, Panel, SectionTitle, Stat } from "@/components/kit";
import { growth, nationTree, type Region } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/association")({
  head: () => ({
    meta: [
      { title: "Grassroots Football Dashboard · BolaID" },
      {
        name: "description",
        content:
          "Data agregat pemain, SSB, pelatih, dan pertandingan dari nasional hingga SSB untuk asosiasi & federasi.",
      },
      { property: "og:title", content: "Grassroots Football Dashboard · BolaID" },
      {
        property: "og:description",
        content: "Drill-down Indonesia → Provinsi → Kab/Kota → SSB, tanpa data pribadi anak.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssociationPage,
});

const fmt = (n: number) => n.toLocaleString("id-ID");

function AssociationPage() {
  // Path of names from the root to the selected region
  const [path, setPath] = useState<string[]>([]);
  const trail: Region[] = [nationTree];
  for (const name of path) {
    const next = trail.at(-1)?.children?.find((c) => c.name === name);
    if (next) trail.push(next);
  }
  const node = trail.at(-1) ?? nationTree;
  const kids = node.children ?? [];
  const maxPlayers = Math.max(1, ...kids.map((k) => k.players));
  const maxG = Math.max(...growth.map((g) => g.v));

  return (
    <div>
      <PageHeader
        eyebrow="Askot PSSI Makassar · akses wilayah"
        title="Grassroots Football Dashboard"
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Wilayah"
        className="no-scrollbar -mx-4 mb-4 flex items-center gap-1 overflow-x-auto px-4 text-sm sm:mx-0 sm:px-0"
      >
        {trail.map((r, i) => (
          <span key={r.name} className="flex shrink-0 items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            <button
              onClick={() => setPath(path.slice(0, i))}
              className={cn(
                "rounded-full px-3 py-1 font-semibold transition-colors",
                i === trail.length - 1
                  ? "bg-pitch text-pitch-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {r.name}
            </button>
          </span>
        ))}
      </nav>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Pemain terdaftar" value={fmt(node.players)} sub={node.level} />
        <Stat label="SSB aktif" value={fmt(node.ssb)} />
        <Stat label="Pelatih aktif" value={fmt(node.coaches)} />
        <Stat label="Pertandingan" value={fmt(node.matches)} sub="Musim 2026/27" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Panel>
          <SectionTitle
            eyebrow={kids.length ? `${kids.length} wilayah · ketuk untuk detail` : node.level}
            title={kids.length ? `Sebaran di ${node.name}` : node.name}
          />
          {kids.length === 0 ? (
            <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
              Level terendah yang dapat diakses asosiasi. Data per pemain hanya tersedia untuk SSB,
              pelatih, dan wali yang berwenang.
            </div>
          ) : (
            <ul className="space-y-1">
              {kids.map((k) => (
                <li key={k.name}>
                  <button
                    onClick={() => k.children && setPath([...path, k.name])}
                    disabled={!k.children}
                    className={cn(
                      "w-full rounded-xl p-2.5 text-left transition-colors",
                      k.children ? "hover:bg-muted" : "cursor-default",
                    )}
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="text-sm font-bold">{k.name}</span>
                      <span className="flex items-center gap-1 font-mono text-xs">
                        {fmt(k.players)}
                        {k.children && (
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </span>
                    </div>
                    <Meter value={k.players} max={maxPlayers} className="h-1.5" />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {fmt(k.ssb)} SSB · {fmt(k.coaches)} pelatih · {fmt(k.matches)} laga
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-4">
          <Panel>
            <SectionTitle eyebrow="Ribu pemain · nasional" title="Verified Active Players" />
            <div className="flex h-36 items-end gap-2">
              {growth.map((g, i) => (
                <div key={g.m} className="flex flex-1 flex-col items-center gap-1">
                  <span className="font-mono text-[10px] font-bold">{g.v}</span>
                  <div
                    className={cn(
                      "w-full rounded-t-lg",
                      i === growth.length - 1 ? "bg-signal" : "bg-primary",
                    )}
                    style={{ height: `${(g.v / maxG) * 100}%` }}
                  />
                  <span className="text-[11px] text-muted-foreground">{g.m}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="flex items-start gap-3 bg-secondary">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-xs text-secondary-foreground">
              <span className="font-bold">Hanya data agregat.</span> Asosiasi melihat data di
              wilayah kewenangannya tanpa identitas pribadi anak. Setiap akses tercatat di audit
              trail.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
