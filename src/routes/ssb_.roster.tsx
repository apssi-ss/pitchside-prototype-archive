import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/role-page";

export const Route = createFileRoute("/ssb_/roster")({
  head: () => ({
    meta: [
      { title: "Roster & Tim · BolaID" },
      { name: "description", content: "Daftar pemain & dokumen per kelompok usia." },
      { property: "og:title", content: "Roster & Tim · BolaID" },
      { property: "og:description", content: "Daftar pemain & dokumen per kelompok usia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PSsbroster,
});

function PSsbroster() {
  return (
    <RolePage
      eyebrow="SSB Garuda Muda · Football OS"
      title="Roster & Tim"
      stats={[
      { label: "Pemain aktif", value: "126" },
      { label: "Tim", value: "6", sub: "U8\u2013U14" },
      { label: "Dokumen kurang", value: "9" },
      { label: "Transfer masuk", value: "3", sub: "musim ini" }
      ]}
      sections={[
      { title: "Kelompok usia", rows: [
        {"title": "U8", "sub": "18 pemain · Coach Dimas", "tag": "Lengkap", "tone": "success"},
        {"title": "U10", "sub": "24 pemain · Coach Andi", "tag": "2 dokumen", "tone": "warning"},
        {"title": "U12", "sub": "22 pemain · Coach Reza", "tag": "Lengkap", "tone": "success"},
        {"title": "U14", "sub": "20 pemain · Coach Fajar", "tag": "4 dokumen", "tone": "warning"}
      ] },
      { title: "Perlu tindakan", rows: [
        {"title": "Akta lahir — Bima S.", "sub": "U10", "tag": "Kurang", "tone": "danger"},
        {"title": "Transfer dari SSB Bintang", "sub": "Arga P. · U12", "tag": "Menunggu", "tone": "warning"},
        {"title": "Football ID baru", "sub": "Nayla R. · U8", "tag": "Diterbitkan", "tone": "success"}
      ] }
      ]}
    />
  );
}
