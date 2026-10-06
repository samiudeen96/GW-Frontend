/** Price (for the selected quantity) + "Add to bag" in the compact secondary CTA. */
import { useStore } from "@nanostores/react";

import type { PriceTier } from "@/data/pricing";
import { tierUnitPrice } from "@/lib/cart-types";
import { formatMoney } from "@/lib/pricing";
import { addToCart } from "@/lib/stores/cart";

import { $pdpQty } from "./store";

type Props = {
  slug: string;
  available: boolean;
  currency: string;
  tiers: PriceTier[];
  label: string;
};

export default function CompactCtaActions({ slug, available, currency, tiers, label }: Props) {
  const qty = useStore($pdpQty);
  return (
    <div className="flex shrink-0 items-center gap-3">
      <span className="hidden font-mono text-[13px] text-forest tabular-nums sm:block" data-ltr>
        {formatMoney(tierUnitPrice(tiers, qty), currency)}
      </span>
      <button
        type="button"
        disabled={!available}
        onClick={() => addToCart(slug, 1)}
        className="bg-forest px-4 py-2.5 font-mono text-[10.5px] font-bold tracking-[0.22em] text-paper uppercase transition-colors hover:bg-moss disabled:opacity-40 md:px-5"
      >
        {label}
      </button>
    </div>
  );
}
