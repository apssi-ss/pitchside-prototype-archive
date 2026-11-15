import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/role-page";

export const Route = createFileRoute("/referee_/profile")({
  head: () => ({
    meta: [
      { title: "Profil & Lisensi · BolaID" },
      { name: "description", content: "Lisensi, level, dan riwayat." },
      { property: "og:title", content: "Profil & Lisensi · BolaID" },
      { property: "og:description", content: "Lisensi, level, dan riwayat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PRefereeprofile,
});

function PRefereeprofile() {
  return (
    <RolePage
      eyebrow="Referee ID · RF-IDN-0442"
      title="Profil & Lisensi"
      stats={[
      { label: "Lisensi", value: "C2" },
      { label: "Wilayah", value: "Makassar" },
      { label: "Laga dipimpin", value: "64" },
      { label: "Rating", value: "4.7", sub: "dari panitia" }
      ]}
      sections={[
      { title: "Lisensi & sertifikasi", rows: [
        {"title": "Lisensi Wasit C2", "sub": "PSSI · berlaku s.d. Des 2027", "tag": "Aktif", "tone": "success"},
        {"title": "Kursus Laws of the Game 2026", "sub": "Selesai Agu 2026", "tag": "Terverifikasi", "tone": "success"},
        {"title": "Upgrade ke C1", "sub": "Pendaftaran Feb 2027", "tag": "Rencana", "tone": "neutral"}
      ] },
      { title: "Riwayat terakhir", rows: [
        {"title": "SSB Garuda vs SSB Pelita", "sub": "MYC 2027 · U10", "meta": "9 Nov"},
        {"title": "Akademi Celebes vs SSB Bintang", "sub": "Liga Askot", "meta": "2 Nov"}
      ] }
      ]}
    />
  );
}
