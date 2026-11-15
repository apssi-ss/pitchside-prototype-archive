import { BadgeCheck } from "lucide-react";
import { player } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// Deterministic faux QR grid derived from the ID string
function IdGrid({ seed }: { seed: string }) {
  const cells = Array.from({ length: 49 }, (_, i) => {
    const ch = seed.charCodeAt(i % seed.length);
    return ((ch * (i + 7)) ^ (i * 13)) % 3 !== 0;
  });
  return (
    <div
      className="grid h-[68px] w-[68px] grid-cols-7 gap-[2px] rounded-lg bg-chalk p-1.5"
      aria-hidden
    >
      {cells.map((on, i) => (
        <span key={i} className={cn("rounded-[1px]", on ? "bg-pitch-deep" : "bg-transparent")} />
      ))}
    </div>
  );
}

export function FootballIdCard({ className }: { className?: string }) {
  const fields = [
    ["Tahun lahir", String(player.birthYear)],
    ["Posisi", player.position],
    ["Kaki", player.foot],
    ["Kategori", player.category],
  ];
  return (
    <article
      className={cn(
        "pitch-stripes relative overflow-hidden rounded-3xl p-5 text-pitch-foreground shadow-passport sm:p-6",
        className,
      )}
    >
      <div className="chalk-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-pitch-muted">
            Football Passport · Indonesia
          </p>
          <h2 className="mt-2 text-[26px] font-extrabold leading-none sm:text-3xl">
            {player.name}
          </h2>
          <p className="mt-1.5 text-sm text-pitch-foreground/75">{player.organization}</p>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-signal font-display text-xl font-extrabold text-signal-foreground">
          {player.initials}
        </span>
      </div>

      <div className="relative mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-pitch-muted">
            Football ID
          </p>
          <p className="mt-1 font-mono text-base font-bold tracking-wider sm:text-lg">
            {player.footballId}
          </p>
          {player.verified && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-pitch-foreground/10 px-2 py-0.5 text-[11px] font-semibold">
              <BadgeCheck className="h-3.5 w-3.5 text-signal" /> Wali terverifikasi
            </p>
          )}
        </div>
        <IdGrid seed={player.footballId} />
      </div>

      <dl className="relative mt-5 grid grid-cols-4 gap-2 border-t border-pitch-foreground/15 pt-4">
        {fields.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[10px] uppercase tracking-wider text-pitch-muted">{k}</dt>
            <dd className="mt-0.5 font-display text-sm font-bold">{v}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
