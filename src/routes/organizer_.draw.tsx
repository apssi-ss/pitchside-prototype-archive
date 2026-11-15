import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/role-page";

export const Route = createFileRoute("/organizer_/draw")({
  head: () => ({
    meta: [
      { title: "Drawing & Jadwal · BolaID" },
      { name: "description", content: "Bagan grup, lapangan, dan wasit." },
      { property: "og:title", content: "Drawing & Jadwal · BolaID" },
      { property: "og:description", content: "Bagan grup, lapangan, dan wasit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: POrganizerdraw,
});

function POrganizerdraw() {
  return (
    <RolePage
      eyebrow="Makassar Youth Cup 2027"
      title="Drawing & Jadwal"
      stats={[
      { label: "Grup", value: "16", sub: "4 per kategori" },
      { label: "Laga", value: "112" },
      { label: "Lapangan", value: "4" },
      { label: "Wasit tertugas", value: "18/22" }
      ]}
      sections={[
      { title: "Grup U10", rows: [
        {"title": "Grup A", "sub": "Garuda Muda · Pelita · Bintang Timur · Celebes", "tag": "Terkunci", "tone": "success"},
        {"title": "Grup B", "sub": "Hasanuddin · Losari · Tamalate · Gowa FC", "tag": "Terkunci", "tone": "success"},
        {"title": "Grup C", "sub": "Belum diundi", "tag": "Draf", "tone": "warning"}
      ] },
      { title: "Alokasi lapangan", rows: [
        {"title": "Lap. A — Stadion Mattoangin", "sub": "Sab 08.00–16.00", "meta": "28 laga"},
        {"title": "Lap. B — GOR Sudiang", "sub": "Sab 08.00–14.00", "meta": "24 laga"}
      ] }
      ]}
    />
  );
}
