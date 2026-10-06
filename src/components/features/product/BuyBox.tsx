/**
 * PDP acquisition panel (dark forest column): title + rating, tier pricing,
 * quantity, add to bag, delivery estimate, trust pillars and the line summary.
 * Copy arrives pre-translated; tiers are resolved on the server for the active
 * currency. Quantity is shared with the sticky bar via `$pdpQty`.
 */
import { useStore } from "@nanostores/react";

import type { PriceTier } from "@/data/pricing";
import { tierUnitPrice } from "@/lib/cart-types";
import { formatMoney } from "@/lib/pricing";
import { addToCart } from "@/lib/stores/cart";

import { $pdpQty, setPdpQty } from "./store";

export type BuyBoxLabels = {
  save: string;
  inclTaxes: string;
  freeShipWorldwide: string;
  choosePack: string;
  unit: string;
  units: string;
  quantity: string;
  decrease: string;
  increase: string;
  addToBag: string;
  unavailable: string;
  buyItNow: string;
  taxes: string;
  incl: string;
  shipping: string;
  freeWorldwide: string;
  youSave: string;
  total: string;
  verifiedRating: string;
};

type Props = {
  slug: string;
  available: boolean;
  currency: string;
  tiers: PriceTier[];
  header: {
    category: string;
    sku: string;
    tagline: string;
    name: string;
    rating: number;
    /** "120 ml · USD" */
    sizeLine: string;
  };
  delivery: {
    title: string;
    arrival: string;
    window: string;
    days: string;
    orderIn: string;
    next24h: string;
    shipsToday: string;
  };
  pillars: { k: string; v: string }[];
  labels: BuyBoxLabels;
};

const mono = "font-mono uppercase";

export default function BuyBox({
  slug,
  available,
  currency,
  tiers,
  header,
  delivery,
  pillars,
  labels,
}: Props) {
  const qty = useStore($pdpQty);
  const unit = tierUnitPrice(tiers, qty);
  const lineSubtotal = unit * qty;
  const base = tiers[0]?.price ?? 0;
  const savePct = tiers.length > 1 && unit < base ? Math.round((1 - unit / base) * 100) : 0;

  return (
    <>
      <div className="border-b border-paper/10 p-5 sm:p-7 lg:p-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gold"
            />
            <span className={`${mono} truncate text-[10px] tracking-[0.28em] text-paper/70`}>
              {header.category}
            </span>
          </div>
          <span className="border border-paper/20 px-1.5 py-0.5 font-mono text-[10px] text-paper/60 tabular-nums">
            {header.sku}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <span aria-hidden="true" className="h-px w-6 bg-gold" />
          <p className={`${mono} text-[10px] tracking-[0.28em] text-gold`}>{header.tagline}</p>
        </div>

        <h1 className="mt-3 font-serif text-[28px] leading-[1.03] tracking-[-0.02em] text-balance text-paper sm:text-[34px] lg:text-[36px] xl:text-[42px]">
          {header.name}
        </h1>

        <a href="#reviews" className="group mt-4 inline-flex items-center gap-2">
          <span className="flex gap-0.5" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 ${i < Math.round(header.rating) ? "bg-gold" : "bg-paper/20"}`}
              />
            ))}
          </span>
          <span className="font-mono text-[10.5px] text-paper tabular-nums">
            {header.rating.toFixed(1)}
          </span>
          <span
            className={`${mono} text-[10px] tracking-[0.22em] text-paper/60 group-hover:text-gold`}
          >
            · {labels.verifiedRating}
          </span>
        </a>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-paper/15 pt-5">
          <div>
            <div className="flex items-baseline gap-3">
              <div
                className="font-serif text-[34px] leading-none text-paper tabular-nums md:text-[40px]"
                data-ltr
              >
                {formatMoney(unit, currency)}
              </div>
              {savePct > 0 && (
                <span
                  className={`${mono} bg-gold px-1.5 py-0.5 text-[9.5px] tracking-[0.22em] text-forest tabular-nums`}
                >
                  {labels.save} {savePct}%
                </span>
              )}
            </div>
            <p className={`${mono} mt-2 text-[10.5px] tracking-[0.18em] text-paper/60`}>
              {header.sizeLine}
            </p>
          </div>
          <div className="shrink-0 pb-1 text-end">
            <p className={`${mono} text-[9.5px] tracking-[0.28em] text-paper/50`}>
              {labels.inclTaxes}
            </p>
            <p className={`${mono} mt-1 text-[9.5px] tracking-[0.28em] text-gold`}>
              {labels.freeShipWorldwide}
            </p>
          </div>
        </div>

        {tiers.length > 1 && (
          <div className="mt-4">
            <p className={`${mono} mb-2 text-[9.5px] tracking-[0.28em] text-paper/50`}>
              {labels.choosePack}
            </p>
            <div
              className="grid divide-x divide-paper/15 border border-paper/15"
              style={{
                gridTemplateColumns: `repeat(${Math.min(tiers.length, 4)}, minmax(0, 1fr))`,
              }}
            >
              {tiers.slice(0, 4).map((tier) => {
                const active = unit === tier.price;
                const save = tier.price < base ? Math.round((1 - tier.price / base) * 100) : 0;
                return (
                  <button
                    type="button"
                    key={tier.minQty}
                    onClick={() => setPdpQty(tier.minQty)}
                    aria-pressed={active}
                    className={`p-2.5 text-center transition-colors ${active ? "bg-gold text-forest" : "hover:bg-paper/5"}`}
                  >
                    <p
                      className={`${mono} text-[9px] tracking-[0.22em] ${active ? "text-forest/80" : "text-paper/60"}`}
                    >
                      {tier.minQty}+ {tier.minQty === 1 ? labels.unit : labels.units}
                    </p>
                    <p
                      className={`mt-1 font-mono text-[12.5px] tabular-nums ${active ? "text-forest" : "text-paper"}`}
                      data-ltr
                    >
                      {formatMoney(tier.price, currency)}
                    </p>
                    {save > 0 && (
                      <p
                        className={`${mono} mt-0.5 text-[8.5px] tracking-[0.18em] ${active ? "text-forest/70" : "text-gold"}`}
                      >
                        −{save}%
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border-b border-paper/10 p-5 sm:p-7 lg:p-8">
        <p className={`${mono} text-[10px] tracking-[0.28em] text-gold`}>{labels.quantity}</p>
        <div className="flex items-stretch gap-3">
          <div className="flex shrink-0 items-center border border-paper/20">
            <button
              type="button"
              onClick={() => setPdpQty(qty - 1)}
              className="px-4 py-3.5 text-lg leading-none text-paper hover:bg-paper/5"
              aria-label={labels.decrease}
            >
              −
            </button>
            <span className="w-10 text-center font-mono text-sm text-paper tabular-nums">
              {String(qty).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setPdpQty(qty + 1)}
              className="px-4 py-3.5 text-lg leading-none text-paper hover:bg-paper/5"
              aria-label={labels.increase}
            >
              +
            </button>
          </div>
          <div data-cta="primary" className="flex-1">
            <button
              type="button"
              disabled={!available}
              onClick={() => addToCart(slug, qty)}
              className={`${mono} h-full w-full bg-gold py-3 text-[11px] font-bold tracking-[0.24em] text-forest transition-colors hover:bg-paper disabled:opacity-50`}
            >
              {available
                ? `${labels.addToBag} · ${formatMoney(lineSubtotal, currency)}`
                : labels.unavailable}
            </button>
          </div>
        </div>

        {/* TODO: express checkout. The original button had no action either. */}
        <button
          type="button"
          className={`${mono} w-full border border-paper/30 py-4 text-[11px] font-bold tracking-[0.28em] text-paper transition-colors hover:bg-paper hover:text-forest`}
        >
          {labels.buyItNow}
        </button>

        <div className="border border-paper/15 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className={`${mono} text-[9.5px] tracking-[0.28em] text-gold`}>{delivery.title}</p>
              <p className="mt-1 text-[12px] leading-tight text-paper">
                {delivery.arrival} <span className="font-mono tabular-nums">{delivery.window}</span>
              </p>
              <p className={`${mono} mt-1 text-[9.5px] tracking-[0.22em] text-paper/60`}>
                {delivery.days}
              </p>
            </div>
            <div className="shrink-0 text-end">
              <p className={`${mono} text-[9.5px] tracking-[0.28em] text-paper/50`}>
                {delivery.orderIn}
              </p>
              <p className="mt-1 font-mono text-[12px] text-gold tabular-nums">
                {delivery.next24h}
              </p>
              <p className={`${mono} mt-1 text-[9.5px] tracking-[0.22em] text-paper/60`}>
                {delivery.shipsToday}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-paper/15 border border-paper/15 [&>*:nth-child(n+3)]:border-t [&>*:nth-child(n+3)]:border-paper/15">
          {pillars.map((pillar) => (
            <div key={pillar.k} className="p-2.5">
              <p className={`${mono} text-[9px] tracking-[0.22em] text-gold`}>{pillar.k}</p>
              <p className="mt-1 text-[10.5px] leading-tight text-paper/75">{pillar.v}</p>
            </div>
          ))}
        </div>

        <dl className="space-y-1.5 border-t border-paper/10 pt-4 font-mono text-[11px] tabular-nums">
          <div className="flex justify-between text-paper/70">
            <dt data-ltr>
              {qty} × {formatMoney(unit, currency)}
            </dt>
            <dd data-ltr>{formatMoney(lineSubtotal, currency)}</dd>
          </div>
          <div className="flex justify-between text-paper/60">
            <dt>{labels.taxes}</dt>
            <dd>{labels.incl}</dd>
          </div>
          <div className="flex justify-between text-paper/60">
            <dt>{labels.shipping}</dt>
            <dd>{labels.freeWorldwide}</dd>
          </div>
          {savePct > 0 && (
            <div className="flex justify-between text-gold">
              <dt>{labels.youSave}</dt>
              <dd>−{savePct}%</dd>
            </div>
          )}
          <div className="mt-1 flex justify-between border-t border-paper/15 pt-2 font-bold text-paper">
            <dt>{labels.total}</dt>
            <dd data-ltr>{formatMoney(lineSubtotal, currency)}</dd>
          </div>
        </dl>
      </div>
    </>
  );
}
