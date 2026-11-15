import { useSyncExternalStore } from "react";
import type { AppPath, RoleId } from "@/lib/roles";

export type NoticeKind = "jadwal" | "tagihan" | "izin" | "turnamen" | "laporan" | "sistem";

export type Notice = {
  id: string;
  kind: NoticeKind;
  title: string;
  body: string;
  when: string;
  to?: AppPath;
  unread: boolean;
};

/** Demo notifications per role (mock data — replace with real feed later). */
export const notificationsByRole: Record<RoleId, Notice[]> = {
  parent: [
    {
      id: "p1",
      kind: "tagihan",
      title: "Iuran November Rizky",
      body: "Rp150.000 jatuh tempo 15 Nov.",
      when: "1 jam lalu",
      to: "/payments",
      unread: true,
    },
    {
      id: "p2",
      kind: "izin",
      title: "Akademi XYZ meminta akses",
      body: "Scout ingin melihat profil ringkas Rizky.",
      when: "3 jam lalu",
      to: "/parent/consent",
      unread: true,
    },
    {
      id: "p3",
      kind: "jadwal",
      title: "Laga Sabtu dikonfirmasi",
      body: "vs SSB Bintang Timur · 08.30 · Stadion Mini Gowa",
      when: "Kemarin",
      to: "/schedule",
      unread: false,
    },
    {
      id: "p4",
      kind: "laporan",
      title: "Laporan perkembangan Q4",
      body: "Coach Andi mengirim laporan Rizky.",
      when: "2 hari lalu",
      to: "/player",
      unread: false,
    },
  ],
  player: [
    {
      id: "pl1",
      kind: "laporan",
      title: "Nilai passing naik 0.4",
      body: "Penilaian terbaru dari Coach Andi.",
      when: "2 jam lalu",
      to: "/player",
      unread: true,
    },
    {
      id: "pl2",
      kind: "turnamen",
      title: "Makassar Youth Cup 2027",
      body: "Kamu masuk roster U10 SSB Garuda Muda.",
      when: "Kemarin",
      to: "/tournament",
      unread: true,
    },
    {
      id: "pl3",
      kind: "sistem",
      title: "Trial Akademi Celebes dibuka",
      body: "Pendaftaran sampai 30 Nov.",
      when: "3 hari lalu",
      to: "/opportunities",
      unread: false,
    },
  ],
  ssb: [
    {
      id: "s1",
      kind: "tagihan",
      title: "12 iuran belum lunas",
      body: "Kirim pengingat ke wali sebelum 15 Nov.",
      when: "30 menit lalu",
      to: "/ssb/finance",
      unread: true,
    },
    {
      id: "s2",
      kind: "sistem",
      title: "Dokumen pemain kurang",
      body: "Akta lahir Bima S. (U10) belum diunggah.",
      when: "2 jam lalu",
      to: "/ssb/roster",
      unread: true,
    },
    {
      id: "s3",
      kind: "turnamen",
      title: "Roster MYC terverifikasi",
      body: "Tim U10 lolos verifikasi Football ID.",
      when: "Kemarin",
      to: "/tournament",
      unread: false,
    },
    {
      id: "s4",
      kind: "jadwal",
      title: "Absensi U14 turun",
      body: "Kehadiran minggu ini 86%.",
      when: "2 hari lalu",
      to: "/ssb/training",
      unread: false,
    },
  ],
  coach: [
    {
      id: "c1",
      kind: "jadwal",
      title: "Sesi U10 hari ini 16.00",
      body: "First touch & receiving · Lap. Karebosi",
      when: "1 jam lalu",
      to: "/schedule",
      unread: true,
    },
    {
      id: "c2",
      kind: "laporan",
      title: "Laporan laga tertunda",
      body: "vs SSB Bintang Timur belum dilaporkan.",
      when: "Kemarin",
      to: "/coach/report",
      unread: true,
    },
    {
      id: "c3",
      kind: "sistem",
      title: "Penilaian Q4 dibuka",
      body: "24 pemain menunggu penilaian.",
      when: "3 hari lalu",
      to: "/coach/assessment",
      unread: false,
    },
  ],
  referee: [
    {
      id: "r1",
      kind: "turnamen",
      title: "Penugasan baru",
      body: "U10 · Garuda Muda vs Pelita · Sab 08.30",
      when: "20 menit lalu",
      to: "/referee",
      unread: true,
    },
    {
      id: "r2",
      kind: "laporan",
      title: "Laporan laga belum dikirim",
      body: "Batas pengiriman 24 jam setelah laga.",
      when: "5 jam lalu",
      to: "/referee/report",
      unread: true,
    },
    {
      id: "r3",
      kind: "sistem",
      title: "Sertifikat penyegaran",
      body: "Kursus wasit usia dini tersedia.",
      when: "1 minggu lalu",
      to: "/referee/profile",
      unread: false,
    },
  ],
  organizer: [
    {
      id: "o1",
      kind: "turnamen",
      title: "4 laga belum ada wasit",
      body: "Tugaskan sebelum jadwal dikunci.",
      when: "15 menit lalu",
      to: "/organizer",
      unread: true,
    },
    {
      id: "o2",
      kind: "tagihan",
      title: "6 tim belum bayar",
      body: "Biaya pendaftaran MYC 2027.",
      when: "2 jam lalu",
      to: "/organizer",
      unread: true,
    },
    {
      id: "o3",
      kind: "jadwal",
      title: "Drawing Grup C belum dikunci",
      body: "U10 · 4 tim tersisa.",
      when: "Kemarin",
      to: "/organizer/draw",
      unread: false,
    },
  ],
  scout: [
    {
      id: "sc1",
      kind: "izin",
      title: "Akses profil disetujui",
      body: "Wali Rizky Pratama mengizinkan profil ringkas.",
      when: "1 jam lalu",
      to: "/scout/watchlist",
      unread: true,
    },
    {
      id: "sc2",
      kind: "turnamen",
      title: "Laga menarik Sabtu",
      body: "U10 Garuda Muda vs Bintang Timur.",
      when: "Kemarin",
      to: "/tournament",
      unread: false,
    },
  ],
  association: [
    {
      id: "a1",
      kind: "sistem",
      title: "5 SSB menunggu verifikasi",
      body: "Pendaftaran organisasi baru di Makassar.",
      when: "1 jam lalu",
      to: "/association/verification",
      unread: true,
    },
    {
      id: "a2",
      kind: "turnamen",
      title: "Losari Cup minta izin",
      body: "Kompetisi U10–U12 · Desember.",
      when: "Kemarin",
      to: "/association/verification",
      unread: true,
    },
    {
      id: "a3",
      kind: "laporan",
      title: "Rekap partisipasi Oktober",
      body: "Pemain aktif naik 6% di Sulsel.",
      when: "4 hari lalu",
      to: "/association",
      unread: false,
    },
  ],
};

// Tiny in-memory read store so the bell badge and the list stay in sync.
const read = new Set<string>();
const listeners = new Set<() => void>();
let version = 0;

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function markRead(ids: string[]) {
  let changed = false;
  for (const id of ids)
    if (!read.has(id)) {
      read.add(id);
      changed = true;
    }
  if (!changed) return;
  version++;
  listeners.forEach((l) => l());
}

export function useNotifications(roleId: RoleId): Notice[] {
  useSyncExternalStore(
    subscribe,
    () => version,
    () => 0,
  );
  return notificationsByRole[roleId].map((n) => ({ ...n, unread: n.unread && !read.has(n.id) }));
}

export const unreadCount = (list: Notice[]) => list.filter((n) => n.unread).length;
