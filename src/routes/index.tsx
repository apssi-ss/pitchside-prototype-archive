import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import hero from "@/assets/hero-grassroots.jpg.asset.json";
import { buttonVariants } from "@/components/kit";
import { cn } from "@/lib/utils";
import { roles } from "@/lib/roles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BolaID — Every Player Has a Football Journey" },
      {
        name: "description",
        content:
          "Infrastruktur digital sepak bola usia dini Indonesia: Football ID, passport pemain, dashboard orang tua, SSB, dan turnamen.",
      },
      { property: "og:title", content: "BolaID — Every Player Has a Football Journey" },
      {
        property: "og:description",
        content: "Satu identitas. Satu perjalanan. Satu ekosistem sepak bola usia dini.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/** Home role cards come from the same role list as the nav, so all roles stay in sync. */
const roleCards = roles.flatMap((r) => {
  const firstTab = r.tabs[0];
  return firstTab
    ? [{ to: firstTab.to, icon: r.icon, title: r.label, desc: r.desc, tag: r.product }]
    : [];
});

const journey = ["SSB", "U9", "Turnamen", "Seleksi", "Akademi"];

function Index() {
  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Hero */}
      <section className="relative -mx-4 -mt-5 overflow-hidden sm:mx-0 sm:mt-0 sm:rounded-3xl">
        <img
          src={hero.url}
          alt="Anak-anak bermain sepak bola di lapangan saat matahari terbenam"
          width={1600}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover object-[60%_center]"
        />
        <div className="bg-hero-fade absolute inset-0" />
        <div className="relative flex min-h-[520px] flex-col justify-end p-5 text-pitch-foreground sm:min-h-[560px] sm:p-10">
          <p className="w-fit rounded-full bg-signal px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-signal-foreground animate-rise">
            Grassroots Football · Indonesia
          </p>
          <h1 className="mt-4 max-w-2xl text-[40px] font-extrabold leading-[0.95] animate-rise sm:text-6xl lg:text-7xl">
            Every player has a football journey.
          </h1>
          <p className="mt-4 max-w-md text-base text-pitch-foreground/85 animate-rise sm:text-lg">
            Satu Football ID yang menemani anak dari latihan pertama di SSB sampai akademi.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 animate-rise sm:flex-row">
            <Link to="/player" className={cn(buttonVariants({ variant: "signal", size: "lg" }))}>
              Lihat Football Passport <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/ssb" className={cn(buttonVariants({ variant: "chalkOutline", size: "lg" }))}>
              Saya pengelola SSB
            </Link>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Masuk sebagai
            </p>
            <h2 className="text-2xl font-bold">Satu ekosistem, banyak peran</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pilih peran untuk membuka layar utamanya. Menu bawah ikut menyesuaikan.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {roleCards.map(({ to, icon: Icon, title, desc, tag }) => (
            <Link
              key={to}
              to={to}
              className="group flex min-h-[176px] flex-col rounded-2xl border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors group-hover:bg-signal group-hover:text-signal-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {tag}
              </p>
              <h3 className="mt-0.5 text-lg font-bold">{title}</h3>
              <p className="mb-3 mt-1 text-[13px] leading-snug text-muted-foreground">{desc}</p>
              <ArrowRight className="mt-auto h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* Journey + principle */}
      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="pitch-stripes overflow-hidden rounded-3xl p-5 text-pitch-foreground sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-pitch-muted">
            The player owns the journey
          </p>
          <h2 className="mt-2 max-w-md text-2xl font-bold sm:text-3xl">
            Pindah SSB? Riwayatnya tetap utuh.
          </h2>
          <p className="mt-2 max-w-md text-sm text-pitch-foreground/75">
            SSB hanya punya hubungan keanggotaan — bukan kepemilikan. Data pemain ikut ke mana pun
            ia bermain.
          </p>
          <ol className="no-scrollbar mt-6 flex items-center gap-1.5 overflow-x-auto pb-1">
            {journey.map((s, i) => (
              <li key={s} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold",
                    i === journey.length - 1
                      ? "bg-signal text-signal-foreground"
                      : "bg-pitch-foreground/10",
                  )}
                >
                  {s}
                </span>
                {i < journey.length - 1 && <span className="h-px w-4 bg-pitch-foreground/40" />}
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <div className="rounded-3xl border bg-card p-5 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Verified Active Players
            </p>
            <p className="mt-2 font-display text-4xl font-extrabold tabular">1.248</p>
            <p className="mt-1 text-xs text-muted-foreground">Pilot Makassar · 14 SSB</p>
          </div>
          <div className="rounded-3xl border bg-card p-5 shadow-card">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <p className="mt-2 font-display text-base font-bold leading-tight">
              Persetujuan wali di setiap data anak
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Scout hanya melihat pemain yang diizinkan.
            </p>
          </div>
        </div>
      </section>

      <p className="flex items-center justify-center gap-2 pb-2 text-center text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" /> One Identity. One Journey. One Football Ecosystem.
      </p>
    </div>
  );
}
