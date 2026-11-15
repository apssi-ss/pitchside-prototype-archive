import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/role-page";

export const Route = createFileRoute("/coach_/teams")({
  head: () => ({
    meta: [
      { title: "Tim & Taktik · BolaID" },
      { name: "description", content: "Susunan pemain dan catatan taktik." },
      { property: "og:title", content: "Tim & Taktik · BolaID" },
      { property: "og:description", content: "Susunan pemain dan catatan taktik." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PCoachteams,
});

function PCoachteams() {
  return (
    <RolePage
      eyebrow="Coach Andi · U10"
      title="Tim & Taktik"
      stats={[
      { label: "Pemain", value: "24" },
      { label: "Formasi", value: "2-3-1", sub: "7 vs 7" },
      { label: "Cedera", value: "1" },
      { label: "Rata nilai", value: "7.6" }
      ]}
      sections={[
      { title: "Starting line-up", rows: [
        {"title": "Rizky Pratama", "sub": "Gelandang · #10", "meta": "7.9"},
        {"title": "Bima Sakti", "sub": "Bek tengah · #4", "meta": "7.2"},
        {"title": "Fikri A.", "sub": "Penyerang · #9", "meta": "7.7"},
        {"title": "Dafa R.", "sub": "Kiper · #1", "meta": "7.4", "tag": "Cedera ringan", "tone": "warning"}
      ] },
      { title: "Catatan taktik", rows: [
        {"title": "Pressing setelah kehilangan bola", "sub": "Fokus 5 detik pertama", "tag": "Prioritas", "tone": "signal"},
        {"title": "Bangun serangan dari kiper", "sub": "Variasi umpan pendek", "tag": "Latihan", "tone": "neutral"}
      ] }
      ]}
    />
  );
}
