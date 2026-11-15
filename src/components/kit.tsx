import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-2xl border bg-card p-4 shadow-card sm:p-5", className)}>
      {children}
    </section>
  );
}

export function SectionTitle({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-semibold leading-tight sm:text-xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

const pillVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-5 whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-muted text-muted-foreground",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        danger: "bg-danger-soft text-destructive",
        signal: "bg-signal text-signal-foreground",
        pitch: "bg-pitch text-pitch-foreground",
        ghost: "bg-pitch-foreground/10 text-pitch-foreground",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Pill({
  tone,
  className,
  children,
}: VariantProps<typeof pillVariants> & { className?: string; children: ReactNode }) {
  return <span className={cn(pillVariants({ tone }), className)}>{children}</span>;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all active:scale-[0.97] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card",
        signal: "bg-signal text-signal-foreground hover:brightness-95 shadow-card",
        outline: "border bg-card text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        chalk: "bg-chalk text-pitch-deep hover:bg-chalk/90",
        chalkOutline:
          "border border-pitch-foreground/30 text-pitch-foreground hover:bg-pitch-foreground/10",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Btn({
  variant,
  size,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };

export function Avatar({
  initials,
  className,
  tone = "pitch",
}: {
  initials: string;
  className?: string;
  tone?: "pitch" | "signal" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold",
        tone === "pitch" && "bg-pitch text-pitch-foreground",
        tone === "signal" && "bg-signal text-signal-foreground",
        tone === "muted" && "bg-muted text-foreground",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function Meter({
  value,
  max = 100,
  className,
  tone = "primary",
}: {
  value: number;
  max?: number;
  className?: string;
  tone?: "primary" | "signal" | "warning";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-700",
          tone === "primary" && "bg-primary",
          tone === "signal" && "bg-signal",
          tone === "warning" && "bg-warning",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border bg-card p-3.5 shadow-card", className)}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold tabular leading-none">{value}</p>
      {sub && <div className="mt-1.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked ? "bg-primary" : "bg-border",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-card shadow-card transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "no-scrollbar flex gap-1 overflow-x-auto rounded-full border bg-card p-1",
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
            value === o.value
              ? "bg-pitch text-pitch-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-5 animate-rise">
      {eyebrow && (
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-1 text-[28px] font-bold leading-[1.05] sm:text-4xl">{title}</h1>
      {children}
    </header>
  );
}
