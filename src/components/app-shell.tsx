import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Check, ChevronDown, UserCircle } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Drawer } from "vaul";
import { cn } from "@/lib/utils";
import { activeTab, RoleProvider, roles, useRole, type RoleId } from "@/lib/roles";
import { unreadCount, useNotifications } from "@/lib/notifications";

export function Logo({ className, onDark }: { className?: string; onDark?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)} aria-label="BolaID beranda">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-signal">
        <span className="h-3.5 w-3.5 rounded-full border-2 border-pitch-deep" />
        <span className="absolute inset-y-1.5 left-1/2 w-0.5 -translate-x-1/2 bg-pitch-deep/80" />
      </span>
      <span
        className={cn(
          "font-display text-lg font-extrabold tracking-tight",
          onDark ? "text-sidebar-foreground" : "text-foreground",
        )}
      >
        Bola<span className={onDark ? "text-signal" : "text-primary"}>ID</span>
      </span>
    </Link>
  );
}

function useSwitchRole() {
  const { setRole } = useRole();
  const navigate = useNavigate();
  return (id: RoleId) => {
    const r = roles.find((x) => x.id === id);
    const firstTab = r?.tabs[0];
    if (!r || !firstTab) return;
    setRole(id);
    navigate({ to: firstTab.to });
  };
}

function RoleList({ onPick, dark }: { onPick: (id: RoleId) => void; dark?: boolean }) {
  const { role } = useRole();
  return (
    <ul className="grid gap-1.5">
      {roles.map((r) => {
        const Icon = r.icon;
        const on = r.id === role.id;
        return (
          <li key={r.id}>
            <button
              onClick={() => onPick(r.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                dark
                  ? on
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent"
                  : on
                    ? "bg-secondary"
                    : "hover:bg-muted",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  on ? "bg-signal text-signal-foreground" : dark ? "bg-sidebar-accent" : "bg-muted",
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold leading-tight">{r.label}</span>
                <span
                  className={cn(
                    "block truncate text-xs leading-tight",
                    dark ? "text-sidebar-foreground/55" : "text-muted-foreground",
                  )}
                >
                  {r.person}
                </span>
              </span>
              {on && <Check className={cn("h-4 w-4", dark ? "text-signal" : "text-primary")} />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function MobileRoleSwitcher() {
  const { role } = useRole();
  const switchRole = useSwitchRole();
  const [open, setOpen] = useState(false);
  const Icon = role.icon;
  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button
          className="flex h-9 items-center gap-1.5 rounded-full border bg-card py-1 pl-1 pr-2.5 text-sm font-bold"
          aria-label={`Peran aktif: ${role.label}. Ganti peran`}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal text-signal-foreground">
            <Icon className="h-3.5 w-3.5" />
          </span>
          {role.label}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-pitch-deep/50" />
        <Drawer.Content className="safe-bottom fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl bg-card px-4 pt-3 outline-none">
          <Drawer.Handle className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border" />
          <Drawer.Title className="font-display text-lg font-bold">Masuk sebagai</Drawer.Title>
          <Drawer.Description className="mb-3 text-xs text-muted-foreground">
            Satu akun, banyak peran. Menu bawah menyesuaikan peran Anda.
          </Drawer.Description>
          <div className="overflow-y-auto pb-4">
            <RoleList
              onPick={(id) => {
                setOpen(false);
                switchRole(id);
              }}
            />
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-bold hover:bg-muted"
            >
              <UserCircle className="h-[18px] w-[18px]" /> Akun & pengaturan
            </Link>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function ShellInner({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role } = useRole();
  const switchRole = useSwitchRole();
  const current = activeTab(role.tabs, pathname);
  const unread = unreadCount(useNotifications(role.id));

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col overflow-y-auto bg-sidebar p-5 text-sidebar-foreground lg:flex">
        <Logo onDark />
        <p className="mt-2 text-xs text-sidebar-foreground/60">
          Every player has a football journey.
        </p>

        <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/50">
          {role.label} · {role.product}
        </p>
        <nav className="mt-2 flex flex-col gap-1" aria-label="Menu peran">
          {role.tabs.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                current === to
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
              {label}
            </Link>
          ))}
        </nav>

        <nav
          className="mt-4 flex flex-col gap-1 border-t border-sidebar-border pt-4"
          aria-label="Akun"
        >
          {(
            [
              { to: "/notifications", label: "Notifikasi", icon: Bell, badge: unread },
              { to: "/account", label: "Akun & pengaturan", icon: UserCircle, badge: 0 },
            ] as const
          ).map(({ to, label, icon: Icon, badge }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                pathname === to
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="rounded-full bg-destructive px-1.5 font-mono text-[10px] font-bold text-destructive-foreground">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/50">
          Ganti peran
        </p>
        <div className="mt-2">
          <RoleList dark onPick={switchRole} />
        </div>

        <div className="mt-6 rounded-2xl border border-sidebar-border bg-sidebar-accent p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60">
            Pilot
          </p>
          <p className="mt-1 font-display text-sm font-semibold">Makassar · Sulawesi Selatan</p>
          <p className="mt-1 text-xs text-sidebar-foreground/60">Prototipe UI — data contoh</p>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b bg-background/85 px-4 backdrop-blur-md lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <MobileRoleSwitcher />
            <Link
              to="/notifications"
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full border bg-card",
                pathname === "/notifications" && "border-primary bg-secondary",
              )}
              aria-label={unread ? `Notifikasi, ${unread} belum dibaca` : "Notifikasi"}
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-mono text-[9px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          {children}
        </main>

        {/* Mobile bottom tab bar — tabs follow the active role */}
        <nav
          className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 px-2 pt-1.5 backdrop-blur-md lg:hidden"
          aria-label={`Navigasi ${role.label}`}
        >
          <ul
            className="mx-auto grid max-w-md"
            style={{ gridTemplateColumns: `repeat(${role.tabs.length}, minmax(0, 1fr))` }}
          >
            {role.tabs.map(({ to, label, icon: Icon }) => {
              const active = current === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10.5px] font-semibold transition-colors",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-12 items-center justify-center rounded-full transition-colors",
                        active && "bg-signal",
                      )}
                    >
                      <Icon className="h-[19px] w-[19px]" strokeWidth={active ? 2.4 : 2} />
                    </span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <RoleProvider>
      <ShellInner>{children}</ShellInner>
    </RoleProvider>
  );
}
