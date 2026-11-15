import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/role-page";

export const Route = createFileRoute("/organizer_/results")({
  head: () => ({
    meta: [
      { title: "Hasil & Sertifikat · BolaID" },
      { name: "description", content: "Skor, klasemen, dan sertifikat." },
      { property: "og:title", content: "Hasil & Sertifikat · BolaID" },
      { property: "og:description", content: "Skor, klasemen, dan sertifikat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: POrganizerresults,
});

function POrganizerresults() {
  return (
    <RolePage
      eyebrow="Makassar Youth Cup 2027"
      title="Hasil & Sertifikat"
      stats={[
      { label: "Laga selesai", value: "46/112" },
      { label: "Gol", value: "158" },
      { label: "Top scorer", value: "Fikri A.", sub: "7 gol" },
      { label: "Sertifikat", value: "412", sub: "terbit" }
      ]}
      sections={[
      { title: "Hasil terbaru", rows: [
        {"title": "Garuda Muda 3–1 Bintang Timur", "sub": "U10 · Grup A", "tag": "Final", "tone": "success"},
        {"title": "Losari 0–0 Gowa FC", "sub": "U12 · Grup B", "tag": "Final", "tone": "success"},
        {"title": "Pelita vs Celebes", "sub": "U10 · Grup A", "meta": "LIVE", "tag": "Berlangsung", "tone": "signal"}
      ] },
      { title: "Sertifikat digital", rows: [
        {"title": "Partisipasi U8", "sub": "64 pemain", "tag": "Terbit", "tone": "success"},
        {"title": "Partisipasi U10", "sub": "96 pemain", "tag": "Terbit", "tone": "success"},
        {"title": "Juara & Best Player", "sub": "Setelah final", "tag": "Menunggu", "tone": "neutral"}
      ] }
      ]}
    />
  );
}
