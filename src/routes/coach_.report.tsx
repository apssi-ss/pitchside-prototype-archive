import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/role-page";

export const Route = createFileRoute("/coach_/report")({
  head: () => ({
    meta: [
      { title: "Laporan Pertandingan · BolaID" },
      { name: "description", content: "Evaluasi pertandingan & perkembangan." },
      { property: "og:title", content: "Laporan Pertandingan · BolaID" },
      { property: "og:description", content: "Evaluasi pertandingan & perkembangan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PCoachreport,
});

function PCoachreport() {
  return (
    <RolePage
      eyebrow="Coach Andi · Laporan"
      title="Laporan Pertandingan"
      stats={[
      { label: "Laga dilaporkan", value: "8", sub: "musim ini" },
      { label: "Menang", value: "5" },
      { label: "Gol", value: "21" },
      { label: "Laporan tertunda", value: "1" }
      ]}
      sections={[
      { title: "Pertandingan", rows: [
        {"title": "vs SSB Bintang Timur", "sub": "Sab 9 Nov · 3–1", "tag": "Perlu laporan", "tone": "warning"},
        {"title": "vs SSB Pelita", "sub": "2 Nov · 2–2", "tag": "Selesai", "tone": "success"},
        {"title": "vs Akademi Celebes", "sub": "26 Okt · 1–0", "tag": "Selesai", "tone": "success"}
      ] },
      { title: "Laporan perkembangan", rows: [
        {"title": "Rizky Pratama", "sub": "Passing naik 0.4", "meta": "Q4", "tag": "Terkirim ke wali", "tone": "success"},
        {"title": "Bima Sakti", "sub": "Positioning perlu diasah", "meta": "Q4", "tag": "Draf", "tone": "neutral"}
      ] }
      ]}
    />
  );
}
