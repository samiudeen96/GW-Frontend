/**
 * Module: Admin design primitives.
 *
 * Purpose: dense, flat, hairline-ruled building blocks shared by every admin
 * console screen (panels, KPI tiles, status pills, currency formatting).
 * Users: Green Wealth owners / admins.
 * Integration points: none (presentation only).
 */

import type { ReactNode } from "react";

export function money(cents: number, currency: string) {
  const amount = (cents ?? 0) / 100;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function Panel({
  title,
  actions,
  children,
  className = "",
}: {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-paper ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b hairline px-5 py-3">
          {title && <h2 className="text-[11px] uppercase tracking-[0.18em] font-bold">{title}</h2>}
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-paper p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">{label}</p>
      <p className="font-serif text-3xl leading-none">{value}</p>
      {hint && <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

const STATUS_TONE: Record<string, string> = {
  received: "bg-ink/[0.06] text-ink",
  confirmed: "bg-moss/15 text-forest",
  processing: "bg-gold/20 text-ink",
  on_hold: "bg-destructive/10 text-destructive",
  shipped: "bg-forest/10 text-forest",
  delivered: "bg-forest text-paper",
  cancelled: "bg-destructive/15 text-destructive",
  refunded: "bg-ink/[0.12] text-ink",
};

export function StatusPill({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? "bg-ink/[0.06] text-ink";
  return (
    <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-[0.14em] font-semibold ${tone}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = "ghost",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base = "px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-semibold disabled:opacity-40 whitespace-nowrap";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={variant === "solid" ? `${base} bg-forest text-paper` : `${base} border hairline`}
    >
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export const inputClass = "w-full border hairline bg-transparent px-3 py-2 text-[13px]";

/** Flat 30-day bar series — no chart library, keeps the console light. */
export function Sparkbars({ data }: { data: { date: string; revenueCents: number; orders: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.revenueCents));
  return (
    <div className="flex items-end gap-[3px] h-24">
      {data.map((d) => (
        <div
          key={d.date}
          title={`${d.date} · ${d.orders} orders`}
          className="flex-1 bg-forest/80 min-h-[2px]"
          style={{ height: `${Math.max(2, (d.revenueCents / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}
