/** Presentational pieces of the checkout form (used inside the CheckoutForm island). */
import type { ReactNode } from "react";

export function Section({
  step,
  stepLabel,
  title,
  children,
}: {
  step: string;
  stepLabel: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border hairline bg-paper">
      <div className="flex items-baseline gap-4 px-6 pt-6 md:px-8 md:pt-8">
        <span className="font-mono text-[10px] tracking-[0.22em] text-forest/50 uppercase">
          {stepLabel} · {step}
        </span>
        <h2 className="font-serif text-xl md:text-2xl">{title}</h2>
      </div>
      <div className="space-y-4 p-6 md:p-8">{children}</div>
    </section>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block" data-error={error ? "true" : undefined}>
      <span className="mb-1.5 block text-[10px] font-semibold tracking-[0.18em] text-forest/70 uppercase">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-[11px] text-red-600">{error}</span>}
    </label>
  );
}

export function inputCls(error?: string) {
  return `w-full border hairline h-11 px-3 bg-paper text-sm focus:outline-none focus:border-forest ${
    error ? "border-red-500" : ""
  }`;
}

export function ShipOption({
  active,
  onClick,
  title,
  meta,
  price,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  meta: string;
  price: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center justify-between border hairline p-4 text-start transition-colors ${
        active ? "border-forest bg-forest text-ivory" : "bg-paper hover:bg-ivory"
      }`}
    >
      <div className="flex items-center gap-4">
        <span
          className={`h-4 w-4 border ${active ? "border-ivory bg-ivory" : "border-forest/40"} shrink-0`}
        />
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className={`text-[11px] ${active ? "text-ivory/70" : "text-muted-foreground"}`}>
            {meta}
          </div>
        </div>
      </div>
      <span className="font-mono text-sm font-semibold tabular-nums">{price}</span>
    </button>
  );
}

export function PayTab({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`border hairline py-3 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors ${
        disabled
          ? "cursor-not-allowed bg-paper text-muted-foreground/40"
          : active
            ? "border-forest bg-forest text-ivory"
            : "bg-paper hover:bg-ivory"
      }`}
    >
      {children}
    </button>
  );
}

export function SubmitButton({ disabled, label }: { disabled: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full bg-forest py-4 text-xs font-semibold tracking-[0.2em] text-ivory uppercase hover:bg-forest/90 disabled:opacity-60"
    >
      {label}
    </button>
  );
}
