import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  IdCard,
  CalendarDays,
  Trophy,
  Sparkles,
  Home,
  Wallet,
  Shield,
  LineChart,
  ClipboardCheck,
  LayoutDashboard,
  Flag,
  FileText,
  Settings2,
  Search,
  Landmark,
  Users,
  ShieldCheck,
  Shirt,
  BadgeCheck,
  Star,
  Network,
  BarChart3,
  ScanLine,
  type LucideIcon,
} from "lucide-react";

export type AppPath =
  | "/"
  | "/player"
  | "/parent"
  | "/payments"
  | "/schedule"
  | "/opportunities"
  | "/ssb"
  | "/ssb/finance"
  | "/coach"
  | "/coach/assessment"
  | "/referee"
  | "/referee/report"
  | "/scout"
  | "/organizer"
  | "/association"
  | "/tournament"
  | "/parent/consent"
  | "/ssb/roster"
  | "/ssb/training"
  | "/coach/teams"
  | "/coach/report"
  | "/referee/profile"
  | "/organizer/draw"
  | "/organizer/checkin"
  | "/organizer/results"
  | "/scout/watchlist"
  | "/association/verification"
  | "/notifications"
  | "/account";

export type RoleId =
  "player" | "parent" | "ssb" | "coach" | "referee" | "organizer" | "scout" | "association";

export type NavTab = { to: AppPath; label: string; icon: LucideIcon };

export type Role = {
  id: RoleId;
  label: string;
  person: string;
  initials: string;
  icon: LucideIcon;
  desc: string;
  product: string;
  /** Routes that belong only to this role; visiting one switches the active role. */
  owns: AppPath[];
  tabs: NavTab[];
};

export const roles: Role[] = [
  {
    id: "parent",
    label: "Orang Tua",
    person: "Sari Wulandari",
    initials: "SW",
    icon: Users,
    desc: "Jadwal, tagihan, dan izin data anak.",
    product: "Keluarga",
    owns: ["/parent", "/payments", "/parent/consent"],
    tabs: [
      { to: "/parent", label: "Beranda", icon: Home },
      { to: "/schedule", label: "Jadwal", icon: CalendarDays },
      { to: "/payments", label: "Tagihan", icon: Wallet },
      { to: "/parent/consent", label: "Izin", icon: ShieldCheck },
      { to: "/player", label: "Passport", icon: IdCard },
    ],
  },
  {
    id: "player",
    label: "Pemain",
    person: "Rizky Pratama",
    initials: "RP",
    icon: IdCard,
    desc: "Football Passport, riwayat & perkembangan.",
    product: "Football ID",
    owns: ["/player", "/opportunities"],
    tabs: [
      { to: "/player", label: "Passport", icon: IdCard },
      { to: "/schedule", label: "Jadwal", icon: CalendarDays },
      { to: "/tournament", label: "Turnamen", icon: Trophy },
      { to: "/opportunities", label: "Peluang", icon: Sparkles },
    ],
  },
  {
    id: "ssb",
    label: "Admin SSB",
    person: "SSB Garuda Muda",
    initials: "GM",
    icon: Shield,
    desc: "Roster, absensi, dan keuangan klub.",
    product: "Football OS",
    owns: ["/ssb", "/ssb/finance", "/ssb/roster", "/ssb/training"],
    tabs: [
      { to: "/ssb", label: "Dashboard", icon: LayoutDashboard },
      { to: "/ssb/roster", label: "Roster", icon: Users },
      { to: "/ssb/training", label: "Latihan", icon: CalendarDays },
      { to: "/ssb/finance", label: "Keuangan", icon: LineChart },
      { to: "/tournament", label: "Turnamen", icon: Trophy },
    ],
  },
  {
    id: "coach",
    label: "Pelatih",
    person: "Coach Andi",
    initials: "CA",
    icon: ClipboardCheck,
    desc: "Sesi latihan, absensi, dan penilaian.",
    product: "Coach",
    owns: ["/coach", "/coach/assessment", "/coach/teams", "/coach/report"],
    tabs: [
      { to: "/coach", label: "Dashboard", icon: LayoutDashboard },
      { to: "/coach/teams", label: "Tim", icon: Shirt },
      { to: "/coach/assessment", label: "Penilaian", icon: ClipboardCheck },
      { to: "/coach/report", label: "Laporan", icon: FileText },
      { to: "/schedule", label: "Jadwal", icon: CalendarDays },
    ],
  },
  {
    id: "referee",
    label: "Wasit",
    person: "Ahmad Syarif",
    initials: "AS",
    icon: Flag,
    desc: "Penugasan dan laporan pertandingan.",
    product: "Referee",
    owns: ["/referee", "/referee/report", "/referee/profile"],
    tabs: [
      { to: "/referee", label: "Penugasan", icon: Flag },
      { to: "/referee/report", label: "Laporan", icon: FileText },
      { to: "/schedule", label: "Jadwal", icon: CalendarDays },
      { to: "/referee/profile", label: "Profil", icon: BadgeCheck },
    ],
  },
  {
    id: "organizer",
    label: "Penyelenggara",
    person: "Panitia MYC 2027",
    initials: "MY",
    icon: Trophy,
    desc: "Pendaftaran, drawing, wasit & hasil.",
    product: "Competition",
    owns: ["/organizer", "/organizer/checkin", "/organizer/draw", "/organizer/results"],
    tabs: [
      { to: "/organizer", label: "Kelola", icon: Settings2 },
      { to: "/organizer/checkin", label: "Check-in", icon: ScanLine },
      { to: "/organizer/draw", label: "Drawing", icon: Network },
      { to: "/organizer/results", label: "Hasil", icon: BarChart3 },
      { to: "/tournament", label: "Klasemen", icon: Trophy },
    ],
  },
  {
    id: "scout",
    label: "Scout",
    person: "Hendra · Akademi XYZ",
    initials: "HX",
    icon: Search,
    desc: "Cari pemain yang telah diizinkan wali.",
    product: "Football Network",
    owns: ["/scout", "/scout/watchlist"],
    tabs: [
      { to: "/scout", label: "Cari", icon: Search },
      { to: "/scout/watchlist", label: "Watchlist", icon: Star },
      { to: "/tournament", label: "Turnamen", icon: Trophy },
      { to: "/opportunities", label: "Trial", icon: Sparkles },
    ],
  },
  {
    id: "association",
    label: "Asosiasi",
    person: "Askot PSSI Makassar",
    initials: "AK",
    icon: Landmark,
    desc: "Data agregat wilayah & kompetisi.",
    product: "Intelligence",
    owns: ["/association", "/association/verification"],
    tabs: [
      { to: "/association", label: "Dashboard", icon: Landmark },
      { to: "/association/verification", label: "Verifikasi", icon: BadgeCheck },
      { to: "/tournament", label: "Kompetisi", icon: Trophy },
    ],
  },
];

export const roleById = (id: RoleId) => {
  const role = roles.find((r) => r.id === id) ?? roles[0];
  if (!role) throw new Error("No roles are configured");
  return role;
};

const matches = (pathname: string, to: string) =>
  to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

/** The tab whose path is the longest match for the current pathname. */
export function activeTab(tabs: NavTab[], pathname: string) {
  return tabs.filter((t) => matches(pathname, t.to)).sort((a, b) => b.to.length - a.to.length)[0]
    ?.to;
}

/** Most specific role that owns this path (e.g. /ssb/finance → ssb). */
export function ownerOf(pathname: string): RoleId | undefined {
  let best: { id: RoleId; len: number } | undefined;
  for (const r of roles) {
    for (const p of r.owns) {
      if (matches(pathname, p) && (!best || p.length > best.len))
        best = { id: r.id, len: p.length };
    }
  }
  return best?.id;
}

/** Role to use after a navigation: keep the current role if it has a tab for the path. */
export function resolveRole(current: RoleId, pathname: string): RoleId {
  if (activeTab(roleById(current).tabs, pathname)) return current;
  return ownerOf(pathname) ?? current;
}

const STORAGE_KEY = "bolaid.role";
const DEFAULT_ROLE: RoleId = "parent";

type Ctx = { role: Role; setRole: (id: RoleId) => void };
const RoleContext = createContext<Ctx | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Derived from the URL only, so server and client render the same first frame.
  const [roleId, setRoleId] = useState<RoleId>(() => ownerOf(pathname) ?? DEFAULT_ROLE);

  // After hydration, restore the last chosen role on shared pages (Jadwal, Turnamen…).
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as RoleId | null;
    if (saved && roles.some((r) => r.id === saved))
      setRoleId((cur) => resolveRole(saved, pathname) ?? cur);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setRoleId((cur) => resolveRole(cur, pathname));
  }, [pathname]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, roleId);
  }, [roleId]);

  return (
    <RoleContext.Provider value={{ role: roleById(roleId), setRole: setRoleId }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}
