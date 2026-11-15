// Demo data for the UI prototype. Nothing here is persisted.

export const player = {
  name: "Rizky Pratama",
  initials: "RP",
  footballId: "IDN-FB-2016-000123",
  birthYear: 2016,
  category: "U10",
  position: "CM / AM",
  foot: "Kanan",
  organization: "SSB Garuda Muda",
  city: "Makassar, Sulawesi Selatan",
  verified: true,
  guardian: "Sari Wulandari",
  stats: { matches: 34, minutes: 1840, goals: 9, assists: 14, attendance: 94 },
};

export type JourneyStep = {
  year: number;
  org: string;
  label: string;
  kind: "ssb" | "tournament" | "selection" | "academy";
  current?: boolean;
  upcoming?: boolean;
};

export const journey: JourneyStep[] = [
  { year: 2024, org: "SSB Garuda Muda", label: "Bergabung · U8", kind: "ssb" },
  { year: 2025, org: "SSB Garuda Muda", label: "Naik ke U9 · Kapten tim", kind: "ssb" },
  {
    year: 2026,
    org: "Makassar Youth Cup",
    label: "U10 · Juara 2 · 4 gol",
    kind: "tournament",
    current: true,
  },
  {
    year: 2026,
    org: "Seleksi Regional Sulsel",
    label: "Lolos tahap 1",
    kind: "selection",
    current: true,
  },
  { year: 2027, org: "Akademi XYZ", label: "Undangan trial U11", kind: "academy", upcoming: true },
];

export const developmentGroups = [
  { key: "Teknik", score: 7.6 },
  { key: "Taktik", score: 6.9 },
  { key: "Fisik", score: 7.4 },
  { key: "Mental", score: 8.1 },
  { key: "Sosial", score: 8.4 },
];

export const developmentTimeline = [
  { period: "2026 Q1", passing: 6.2, dribbling: 6.8, speed: 7.1 },
  { period: "2026 Q3", passing: 7.1, dribbling: 7.5, speed: 7.4 },
  { period: "2027 Q1", passing: 7.8, dribbling: 8.0, speed: 7.9 },
];

export const assessmentDetail = [
  {
    group: "Teknik",
    items: [
      ["Kontrol bola", 7.8],
      ["Passing", 7.8],
      ["Receiving", 6.6],
      ["Dribbling", 8.0],
      ["Shooting", 7.2],
    ],
  },
  {
    group: "Taktik",
    items: [
      ["Positioning", 6.8],
      ["Pengambilan keputusan", 7.0],
      ["Awareness", 6.9],
    ],
  },
  {
    group: "Mental",
    items: [
      ["Disiplin", 8.2],
      ["Kerja sama", 8.5],
      ["Percaya diri", 7.6],
      ["Mau dilatih", 8.3],
    ],
  },
] as const;

export const recentMatches = [
  {
    date: "02 Nov",
    comp: "Liga Grassroots Makassar",
    opp: "SSB Bintang Timur",
    score: "3–1",
    result: "M",
    mins: 50,
    contrib: "1 gol · 1 assist",
  },
  {
    date: "26 Okt",
    comp: "Makassar Youth Cup · Final",
    opp: "SSB Pelita Gowa",
    score: "1–2",
    result: "K",
    mins: 50,
    contrib: "1 assist",
  },
  {
    date: "25 Okt",
    comp: "Makassar Youth Cup · SF",
    opp: "SSB Maros Raya",
    score: "2–2",
    result: "S",
    mins: 45,
    contrib: "1 gol",
  },
  {
    date: "19 Okt",
    comp: "Uji coba",
    opp: "SSB Karebosi",
    score: "4–0",
    result: "M",
    mins: 30,
    contrib: "2 assist",
  },
] as const;

export const certificates = [
  { title: "Juara 2 · Makassar Youth Cup U10", issuer: "Panitia MYC", year: 2026 },
  { title: "Pemain Terbaik Bulan Agustus", issuer: "SSB Garuda Muda", year: 2026 },
];

export const children = [
  {
    id: "rizky",
    name: "Rizky",
    initials: "RP",
    category: "U10",
    org: "SSB Garuda Muda",
    attendance: 94,
    devScore: 7.7,
    devTrend: 0.4,
    training: { time: "16.00", place: "Lapangan Karebosi", coach: "Coach Andi" },
    match: {
      day: "Sabtu, 14 Nov",
      time: "08.30",
      opp: "SSB Bintang Timur",
      venue: "Stadion Mini Gowa",
    },
    invoice: { label: "Iuran November", amount: 150000, status: "unpaid" as const, due: "15 Nov" },
  },
  {
    id: "aisyah",
    name: "Aisyah",
    initials: "AP",
    category: "U8",
    org: "SSB Garuda Muda",
    attendance: 88,
    devScore: 7.1,
    devTrend: 0.6,
    training: { time: "15.30", place: "Lapangan Karebosi", coach: "Coach Dewi" },
    match: {
      day: "Minggu, 15 Nov",
      time: "09.00",
      opp: "SSB Pelita Gowa",
      venue: "Lapangan Hasanuddin",
    },
    invoice: { label: "Iuran November", amount: 150000, status: "paid" as const, due: "15 Nov" },
  },
];

export const parentMessages = [
  {
    from: "Coach Andi",
    role: "Pelatih U10",
    text: "Latihan hari ini fokus first touch. Bawa botol minum 1L ya.",
    time: "10.12",
  },
  {
    from: "Admin SSB",
    role: "SSB Garuda Muda",
    text: "Jersey musim baru sudah bisa diambil di sekretariat.",
    time: "Kemarin",
  },
  {
    from: "Panitia MYC",
    role: "Turnamen",
    text: "Sertifikat Juara 2 sudah masuk ke Football Passport.",
    time: "Sen",
  },
];

export const auditTrail = [
  { who: "Coach Andi", what: "melihat laporan perkembangan", when: "2 hari lalu" },
  { who: "Panitia MYC 2027", what: "memverifikasi Football ID untuk roster", when: "5 hari lalu" },
  { who: "Anda", what: "mematikan izin scouting", when: "3 minggu lalu" },
];

export const ssb = {
  name: "SSB Garuda Muda",
  city: "Makassar",
  orgId: "ORG-SSB-MKS-0042",
  players: 186,
  teams: 9,
  coaches: 12,
  collection: 82,
};

export const teams = [
  { name: "U7", players: 18 },
  { name: "U8", players: 22 },
  { name: "U9", players: 24 },
  { name: "U10", players: 26 },
  { name: "U11", players: 21 },
  { name: "U12", players: 25 },
  { name: "U13", players: 20 },
  { name: "U14", players: 17 },
  { name: "U15", players: 13 },
];

export const roster = [
  { name: "Rizky Pratama", id: "000123", team: "U10", pos: "CM", att: 94, fee: "unpaid" },
  { name: "Fajar Nugraha", id: "000131", team: "U10", pos: "GK", att: 97, fee: "paid" },
  { name: "Muh. Alif", id: "000188", team: "U10", pos: "CB", att: 81, fee: "paid" },
  { name: "Daffa Ramadhan", id: "000204", team: "U10", pos: "ST", att: 90, fee: "late" },
  { name: "Andi Baso", id: "000219", team: "U10", pos: "LW", att: 86, fee: "paid" },
  { name: "Yusuf Hakim", id: "000233", team: "U10", pos: "RB", att: 92, fee: "paid" },
  { name: "Naufal Akbar", id: "000241", team: "U10", pos: "CM", att: 78, fee: "unpaid" },
  { name: "Reza Mahendra", id: "000257", team: "U10", pos: "LB", att: 95, fee: "paid" },
] as const;

export const sessions = [
  {
    team: "U10",
    time: "16.00–17.30",
    coach: "Coach Andi",
    place: "Lapangan Karebosi",
    plan: "First touch & receiving under pressure",
  },
  {
    team: "U8",
    time: "15.30–16.30",
    coach: "Coach Dewi",
    place: "Lapangan Karebosi",
    plan: "Koordinasi & permainan kecil 4v4",
  },
  {
    team: "U13",
    time: "17.00–18.30",
    coach: "Coach Rahmat",
    place: "GOR Sudiang",
    plan: "Transisi menyerang",
  },
];

export const tournament = {
  name: "Makassar Youth Cup 2027",
  organizer: "Asosiasi Sepak Bola Usia Dini Makassar",
  dates: "13–21 Feb 2027",
  venues: 4,
  categories: ["U8", "U10", "U12", "U14"],
  teams: 64,
  players: 1280,
  referees: 22,
  verified: 98,
};

export const standings = [
  { team: "SSB Garuda Muda", p: 3, w: 2, d: 1, l: 0, gf: 8, ga: 3, pts: 7 },
  { team: "SSB Pelita Gowa", p: 3, w: 2, d: 0, l: 1, gf: 6, ga: 4, pts: 6 },
  { team: "SSB Maros Raya", p: 3, w: 1, d: 1, l: 1, gf: 5, ga: 5, pts: 4 },
  { team: "SSB Bintang Timur", p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 8, pts: 0 },
];

export const fixtures = [
  {
    status: "live" as const,
    minute: "34'",
    home: "SSB Garuda Muda",
    away: "SSB Karebosi",
    hs: 2,
    as: 1,
    venue: "Lapangan A · Karebosi",
    ref: "Ahmad S.",
    group: "Grup A",
  },
  {
    status: "done" as const,
    minute: "FT",
    home: "SSB Pelita Gowa",
    away: "SSB Maros Raya",
    hs: 1,
    as: 1,
    venue: "Lapangan B · Karebosi",
    ref: "Budi H.",
    group: "Grup A",
  },
  {
    status: "next" as const,
    minute: "14.00",
    home: "SSB Bintang Timur",
    away: "SSB Takalar FC",
    hs: null,
    as: null,
    venue: "Stadion Mini Gowa",
    ref: "Irfan M.",
    group: "Grup B",
  },
  {
    status: "next" as const,
    minute: "15.30",
    home: "SSB Hasanuddin",
    away: "SSB Pangkep Jaya",
    hs: null,
    as: null,
    venue: "Stadion Mini Gowa",
    ref: "Ahmad S.",
    group: "Grup B",
  },
];

// ── Jadwal (shared agenda) ───────────────────────────────────────────
import type { RoleId } from "@/lib/roles";

export const week = [
  { d: 9, day: "Sen" },
  { d: 10, day: "Sel" },
  { d: 11, day: "Rab" },
  { d: 12, day: "Kam" },
  { d: 13, day: "Jum" },
  { d: 14, day: "Sab" },
  { d: 15, day: "Min" },
];
export const TODAY = 11;

export type AgendaKind = "training" | "match" | "assignment" | "payment" | "admin";
export const agenda: {
  d: number;
  time: string;
  title: string;
  place: string;
  kind: AgendaKind;
  roles: RoleId[];
}[] = [
  {
    d: 9,
    time: "16.00",
    title: "Latihan U10",
    place: "Lapangan Karebosi",
    kind: "training",
    roles: ["player", "parent", "coach", "ssb"],
  },
  {
    d: 10,
    time: "19.00",
    title: "Rapat panitia MYC",
    place: "Online",
    kind: "admin",
    roles: ["organizer", "association"],
  },
  {
    d: 11,
    time: "15.30",
    title: "Latihan U8 · Aisyah",
    place: "Lapangan Karebosi",
    kind: "training",
    roles: ["parent", "ssb"],
  },
  {
    d: 11,
    time: "16.00",
    title: "Latihan U10 · First touch",
    place: "Lapangan Karebosi",
    kind: "training",
    roles: ["player", "parent", "coach", "ssb"],
  },
  {
    d: 11,
    time: "20.00",
    title: "Batas penilaian Q4",
    place: "Aplikasi",
    kind: "admin",
    roles: ["coach"],
  },
  {
    d: 13,
    time: "16.00",
    title: "Latihan U10 · Simulasi",
    place: "Lapangan Karebosi",
    kind: "training",
    roles: ["player", "parent", "coach", "ssb"],
  },
  {
    d: 14,
    time: "08.30",
    title: "Garuda Muda vs Bintang Timur",
    place: "Stadion Mini Gowa",
    kind: "match",
    roles: ["player", "parent", "coach", "ssb", "scout"],
  },
  {
    d: 14,
    time: "08.30",
    title: "Penugasan: Wasit utama",
    place: "Stadion Mini Gowa",
    kind: "assignment",
    roles: ["referee"],
  },
  {
    d: 14,
    time: "10.30",
    title: "Penugasan: Asisten 1",
    place: "Stadion Mini Gowa",
    kind: "assignment",
    roles: ["referee"],
  },
  {
    d: 15,
    time: "09.00",
    title: "Garuda Muda U8 vs Pelita Gowa",
    place: "Lapangan Hasanuddin",
    kind: "match",
    roles: ["parent", "ssb"],
  },
  {
    d: 15,
    time: "23.59",
    title: "Jatuh tempo iuran November",
    place: "SSB Garuda Muda",
    kind: "payment",
    roles: ["parent", "ssb"],
  },
  {
    d: 15,
    time: "14.00",
    title: "Liga Grassroots · Matchday 6",
    place: "4 venue",
    kind: "match",
    roles: ["organizer", "association", "scout", "referee"],
  },
];

// ── Peluang ──────────────────────────────────────────────────────────
export const opportunities = [
  {
    id: "trial-xyz",
    type: "Trial",
    title: "Trial Akademi XYZ · U11",
    org: "Akademi XYZ Makassar",
    deadline: "30 Nov",
    fit: 92,
    slots: 24,
    invited: true,
  },
  {
    id: "sel-sulsel",
    type: "Seleksi",
    title: "Seleksi Regional Sulsel · Tahap 2",
    org: "Asprov PSSI Sulsel",
    deadline: "6 Des",
    fit: 88,
    slots: 40,
    invited: false,
  },
  {
    id: "beasiswa",
    type: "Beasiswa",
    title: "Beasiswa Pemain Muda 2027",
    org: "Yayasan Bola Timur",
    deadline: "20 Des",
    fit: 74,
    slots: 10,
    invited: false,
  },
  {
    id: "camp",
    type: "Camp",
    title: "Holiday Football Camp U10–U12",
    org: "Coaching Clinic Celebes",
    deadline: "15 Des",
    fit: 100,
    slots: 60,
    invited: false,
  },
];

// ── Tagihan orang tua ────────────────────────────────────────────────
export const parentInvoices = [
  {
    id: "INV-2611-0123",
    child: "Rizky",
    label: "Iuran November · U10",
    amount: 150000,
    due: "15 Nov",
    status: "unpaid" as const,
  },
  {
    id: "INV-2611-MYC1",
    child: "Rizky",
    label: "Biaya Makassar Youth Cup 2027",
    amount: 250000,
    due: "30 Nov",
    status: "unpaid" as const,
  },
  {
    id: "INV-2611-0124",
    child: "Aisyah",
    label: "Iuran November · U8",
    amount: 150000,
    due: "15 Nov",
    status: "paid" as const,
  },
];
export const paymentHistory = [
  { label: "Iuran Oktober · Rizky", amount: 150000, date: "08 Okt", method: "QRIS" },
  { label: "Iuran Oktober · Aisyah", amount: 150000, date: "08 Okt", method: "QRIS" },
  { label: "Jersey musim 2026/27", amount: 185000, date: "21 Sep", method: "VA BCA" },
  { label: "Iuran September · Rizky", amount: 150000, date: "05 Sep", method: "GoPay" },
];

// ── Keuangan SSB ─────────────────────────────────────────────────────
export const ssbFinance = {
  billed: 27900000,
  collected: 22878000,
  overdue: 14,
  months: [
    { m: "Jun", v: 71 },
    { m: "Jul", v: 78 },
    { m: "Agu", v: 84 },
    { m: "Sep", v: 88 },
    { m: "Okt", v: 91 },
    { m: "Nov", v: 82 },
  ],
  overdueList: [
    { name: "Daffa Ramadhan", team: "U10", amount: 300000, days: 18 },
    { name: "Bima Saputra", team: "U12", amount: 150000, days: 12 },
    { name: "Nabila Putri", team: "U9", amount: 150000, days: 9 },
    { name: "Raka Pratama", team: "U13", amount: 450000, days: 41 },
  ],
};

// ── Coach ────────────────────────────────────────────────────────────
export const coach = {
  name: "Coach Andi Rahman",
  coachId: "IDN-CO-1988-004211",
  license: "Lisensi D PSSI",
  teams: ["U10", "U11"],
  players: 47,
  pendingAssessments: 9,
};
export const sessionPlan = [
  { min: 10, title: "Pemanasan dengan bola", note: "Koordinasi + mobilitas" },
  { min: 15, title: "Rondo 4v1", note: "Sentuhan pertama ke ruang" },
  { min: 20, title: "Receiving under pressure", note: "Badan terbuka, scanning" },
  { min: 15, title: "Small-sided game 5v5", note: "Tantangan: 2 sentuhan" },
  { min: 5, title: "Pendinginan & refleksi", note: "Apa yang dipelajari hari ini?" },
];
export const assessmentTemplate = [
  { group: "Teknik", items: ["Kontrol bola", "Passing", "Receiving", "Dribbling", "Shooting"] },
  { group: "Taktik", items: ["Positioning", "Pengambilan keputusan", "Awareness"] },
  { group: "Fisik", items: ["Kecepatan", "Kelincahan", "Koordinasi"] },
  { group: "Mental", items: ["Disiplin", "Kerja sama", "Percaya diri", "Mau dilatih"] },
  { group: "Sosial", items: ["Respek", "Fair play", "Komunikasi"] },
];

// ── Wasit ────────────────────────────────────────────────────────────
export const referee = {
  name: "Ahmad Syarif",
  refId: "IDN-RF-1990-000877",
  license: "Lisensi C2",
  level: "Askot Makassar",
  region: "Sulawesi Selatan",
  matches: 48,
};
export const assignments = [
  {
    id: "a1",
    comp: "Makassar Youth Cup · U10",
    home: "SSB Garuda Muda",
    away: "SSB Bintang Timur",
    date: "Sab, 14 Nov",
    time: "08.30",
    venue: "Stadion Mini Gowa",
    role: "Wasit utama",
    crew: "Asisten: Budi H., Irfan M.",
    status: "pending" as const,
  },
  {
    id: "a2",
    comp: "Makassar Youth Cup · U12",
    home: "SSB Pelita Gowa",
    away: "SSB Maros Raya",
    date: "Sab, 14 Nov",
    time: "10.30",
    venue: "Stadion Mini Gowa",
    role: "Asisten 1",
    crew: "Wasit: Budi H.",
    status: "confirmed" as const,
  },
  {
    id: "a3",
    comp: "Liga Grassroots · MD6",
    home: "SSB Hasanuddin",
    away: "SSB Takalar FC",
    date: "Min, 15 Nov",
    time: "14.00",
    venue: "Lapangan Karebosi",
    role: "Wasit utama",
    crew: "Asisten: Rudi A.",
    status: "pending" as const,
  },
];
export const reportSquads = {
  home: {
    name: "SSB Garuda Muda",
    players: [
      ["4", "Fajar N."],
      ["7", "Rizky P."],
      ["9", "Daffa R."],
      ["11", "Andi B."],
      ["5", "Muh. Alif"],
    ],
  },
  away: {
    name: "SSB Bintang Timur",
    players: [
      ["3", "Ilham S."],
      ["8", "Yoga P."],
      ["10", "Arif M."],
      ["14", "Dimas K."],
      ["6", "Rafi A."],
    ],
  },
} as const;

// ── Penyelenggara ────────────────────────────────────────────────────
export const organizerSteps = [
  { label: "Kategori & regulasi", done: 4, total: 4 },
  { label: "Pendaftaran tim", done: 64, total: 64 },
  { label: "Pembayaran", done: 58, total: 64 },
  { label: "Roster via Football ID", done: 1254, total: 1280 },
  { label: "Drawing grup", done: 16, total: 16 },
  { label: "Penugasan wasit", done: 18, total: 22 },
  { label: "Sertifikat digital", done: 0, total: 1280 },
];
export const registrations = [
  { team: "SSB Garuda Muda", cat: "U10", roster: "18/18", paid: true },
  { team: "SSB Pelita Gowa", cat: "U10", roster: "18/18", paid: true },
  { team: "SSB Maros Raya", cat: "U12", roster: "16/18", paid: false },
  { team: "SSB Takalar FC", cat: "U8", roster: "15/15", paid: false },
  { team: "SSB Pangkep Jaya", cat: "U14", roster: "20/20", paid: true },
];
export const unassignedMatches = [
  { id: "m1", label: "U12 · Hasanuddin vs Karebosi", time: "Sab 13.00", venue: "Lap. B" },
  { id: "m2", label: "U14 · Pangkep vs Maros", time: "Sab 15.00", venue: "Stadion Mini" },
  { id: "m3", label: "U8 · Takalar vs Gowa", time: "Min 08.00", venue: "Lap. A" },
  { id: "m4", label: "U10 · Bintang vs Pelita", time: "Min 09.30", venue: "Lap. A" },
];
export const availableRefs = ["Rudi A.", "Irfan M.", "Siti N.", "Budi H."];

// ── Scout ────────────────────────────────────────────────────────────
export const scoutPool = [
  {
    id: "2014-000318",
    initials: "MA",
    age: "U12",
    pos: "CB",
    foot: "Kanan",
    region: "Kota Makassar",
    matches: 31,
    trend: 0.7,
    score: 7.8,
    consent: true,
  },
  {
    id: "2014-000452",
    initials: "RS",
    age: "U12",
    pos: "CB",
    foot: "Kiri",
    region: "Kab. Gowa",
    matches: 24,
    trend: 0.5,
    score: 7.4,
    consent: true,
  },
  {
    id: "2014-000510",
    initials: "YP",
    age: "U12",
    pos: "CM",
    foot: "Kanan",
    region: "Kab. Maros",
    matches: 28,
    trend: 0.9,
    score: 8.0,
    consent: true,
  },
  {
    id: "2014-000611",
    initials: "FD",
    age: "U12",
    pos: "ST",
    foot: "Kanan",
    region: "Kota Makassar",
    matches: 22,
    trend: 0.3,
    score: 7.1,
    consent: true,
  },
  {
    id: "2016-000123",
    initials: "RP",
    age: "U10",
    pos: "CM",
    foot: "Kanan",
    region: "Kota Makassar",
    matches: 34,
    trend: 0.4,
    score: 7.7,
    consent: false,
  },
  {
    id: "2016-000204",
    initials: "DR",
    age: "U10",
    pos: "ST",
    foot: "Kanan",
    region: "Kota Makassar",
    matches: 29,
    trend: 0.6,
    score: 7.5,
    consent: true,
  },
  {
    id: "2012-000077",
    initials: "AH",
    age: "U14",
    pos: "CB",
    foot: "Kanan",
    region: "Kab. Takalar",
    matches: 45,
    trend: 0.2,
    score: 7.6,
    consent: true,
  },
  {
    id: "2014-000733",
    initials: "KN",
    age: "U12",
    pos: "CB",
    foot: "Kanan",
    region: "Kab. Bone",
    matches: 19,
    trend: 0.8,
    score: 7.3,
    consent: false,
  },
  {
    id: "2012-000102",
    initials: "BS",
    age: "U14",
    pos: "GK",
    foot: "Kanan",
    region: "Kota Parepare",
    matches: 38,
    trend: 0.4,
    score: 7.9,
    consent: true,
  },
];

// ── Asosiasi ─────────────────────────────────────────────────────────
export type Region = {
  name: string;
  level: string;
  players: number;
  ssb: number;
  coaches: number;
  matches: number;
  children?: Region[];
};
export const nationTree: Region = {
  name: "Indonesia",
  level: "Nasional",
  players: 128450,
  ssb: 1420,
  coaches: 4830,
  matches: 18421,
  children: [
    {
      name: "Sulawesi Selatan",
      level: "Provinsi",
      players: 31200,
      ssb: 342,
      coaches: 1105,
      matches: 5210,
      children: [
        {
          name: "Kota Makassar",
          level: "Kab/Kota",
          players: 12840,
          ssb: 118,
          coaches: 402,
          matches: 2104,
          children: [
            {
              name: "SSB Garuda Muda",
              level: "SSB",
              players: 186,
              ssb: 1,
              coaches: 12,
              matches: 142,
            },
            { name: "SSB Karebosi", level: "SSB", players: 164, ssb: 1, coaches: 10, matches: 118 },
            {
              name: "SSB Hasanuddin",
              level: "SSB",
              players: 151,
              ssb: 1,
              coaches: 9,
              matches: 104,
            },
          ],
        },
        {
          name: "Kab. Gowa",
          level: "Kab/Kota",
          players: 5320,
          ssb: 61,
          coaches: 188,
          matches: 870,
        },
        {
          name: "Kab. Maros",
          level: "Kab/Kota",
          players: 3110,
          ssb: 37,
          coaches: 104,
          matches: 512,
        },
        { name: "Kab. Bone", level: "Kab/Kota", players: 2860, ssb: 33, coaches: 91, matches: 401 },
      ],
    },
    {
      name: "Jawa Timur",
      level: "Provinsi",
      players: 24310,
      ssb: 288,
      coaches: 912,
      matches: 3820,
    },
    {
      name: "Jawa Barat",
      level: "Provinsi",
      players: 21980,
      ssb: 251,
      coaches: 840,
      matches: 3412,
    },
    {
      name: "Sumatera Utara",
      level: "Provinsi",
      players: 9870,
      ssb: 119,
      coaches: 360,
      matches: 1390,
    },
    {
      name: "Sulawesi Tengah",
      level: "Provinsi",
      players: 4120,
      ssb: 52,
      coaches: 140,
      matches: 610,
    },
  ],
};
export const growth = [
  { m: "Jun", v: 61 },
  { m: "Jul", v: 70 },
  { m: "Agu", v: 82 },
  { m: "Sep", v: 95 },
  { m: "Okt", v: 112 },
  { m: "Nov", v: 128 },
];

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
