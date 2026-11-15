import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/role-page";

export const Route = createFileRoute("/scout_/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist · BolaID" },
      { name: "description", content: "Pemain yang Anda pantau." },
      { property: "og:title", content: "Watchlist · BolaID" },
      { property: "og:description", content: "Pemain yang Anda pantau." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PScoutwatchlist,
});

function PScoutwatchlist() {
  return (
    <RolePage
      eyebrow="Hendra · Akademi XYZ"
      title="Watchlist"
      stats={[
      { label: "Dipantau", value: "8" },
      { label: "Undangan trial", value: "3" },
      { label: "Diterima wali", value: "2" },
      { label: "Turnamen aktif", value: "4" }
      ]}
      sections={[
      { title: "Pemain dipantau", rows: [
        {"title": "Rizky P. · U10", "sub": "Gelandang · Makassar", "meta": "7.9", "tag": "Trial diundang", "tone": "signal"},
        {"title": "Fikri A. · U10", "sub": "Penyerang · Gowa", "meta": "7.7", "tag": "Dipantau", "tone": "neutral"},
        {"title": "Nadia K. · U12", "sub": "Bek · Maros", "meta": "7.5", "tag": "Wali setuju", "tone": "success"}
      ] },
      { title: "Turnamen untuk dipantau", rows: [
        {"title": "Makassar Youth Cup 2027", "sub": "U8–U14 · 64 tim", "meta": "Sab"},
        {"title": "Liga Askot U12", "sub": "Pekan 6", "meta": "Min"}
      ] }
      ]}
    />
  );
}
