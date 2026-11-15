import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BellOff,
  CalendarDays,
  CheckCheck,
  ChevronRight,
  FileText,
  Info,
  ShieldCheck,
  Trophy,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Btn, PageHeader, Panel, Segmented } from "@/components/kit";
import { markRead, unreadCount, useNotifications, type NoticeKind } from "@/lib/notifications";
import { useRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifikasi · BolaID" },
      {
        name: "description",
        content: "Pengingat jadwal, tagihan, izin data, dan turnamen sesuai peran Anda.",
      },
      { property: "og:title", content: "Notifikasi · BolaID" },
      { property: "og:description", content: "Semua pengingat penting dalam satu tempat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NotificationsPage,
});

const kindIcon: Record<NoticeKind, LucideIcon> = {
  jadwal: CalendarDays,
  tagihan: Wallet,
  izin: ShieldCheck,
  turnamen: Trophy,
  laporan: FileText,
  sistem: Info,
};

const kindLabel: Record<NoticeKind, string> = {
  jadwal: "Jadwal",
  tagihan: "Tagihan",
  izin: "Izin data",
  turnamen: "Turnamen",
  laporan: "Laporan",
  sistem: "Info",
};

function NotificationsPage() {
  const { role } = useRole();
  const list = useNotifications(role.id);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const unread = unreadCount(list);
  const shown = filter === "unread" ? list.filter((n) => n.unread) : list;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader eyebrow={`${role.label} · ${role.person}`} title="Notifikasi">
        <p className="mt-2 text-sm text-muted-foreground">
          {unread > 0 ? `${unread} belum dibaca` : "Semua sudah dibaca"}
        </p>
      </PageHeader>

      <div className="mb-4 flex items-center gap-3">
        <Segmented
          className="flex-1"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: `Semua (${list.length})` },
            { value: "unread", label: `Belum dibaca (${unread})` },
          ]}
        />
        <Btn
          variant="outline"
          size="sm"
          disabled={unread === 0}
          onClick={() => markRead(list.map((n) => n.id))}
        >
          <CheckCheck className="h-3.5 w-3.5" /> Tandai dibaca
        </Btn>
      </div>

      {shown.length === 0 ? (
        <Panel className="flex flex-col items-center py-10 text-center">
          <BellOff className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">Tidak ada notifikasi baru</p>
          <p className="text-sm text-muted-foreground">Kami akan mengabari Anda di sini.</p>
        </Panel>
      ) : (
        <Panel className="p-0 sm:p-0">
          <ul className="divide-y">
            {shown.map((n) => {
              const Icon = kindIcon[n.kind];
              const inner = (
                <>
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      n.unread
                        ? "bg-signal text-signal-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {kindLabel[n.kind]} · {n.when}
                      </span>
                      {n.unread && (
                        <span
                          className="h-2 w-2 rounded-full bg-destructive"
                          aria-label="Belum dibaca"
                        />
                      )}
                    </span>
                    <span className={cn("block text-sm", n.unread ? "font-bold" : "font-semibold")}>
                      {n.title}
                    </span>
                    <span className="block text-xs text-muted-foreground">{n.body}</span>
                  </span>
                  {n.to && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
                </>
              );
              const cls =
                "flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/60 sm:px-5";
              return (
                <li key={n.id}>
                  {n.to ? (
                    <Link to={n.to} className={cls} onClick={() => markRead([n.id])}>
                      {inner}
                    </Link>
                  ) : (
                    <button className={cls} onClick={() => markRead([n.id])}>
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </div>
  );
}
