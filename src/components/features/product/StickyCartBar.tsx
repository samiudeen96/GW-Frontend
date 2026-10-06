/**
 * Mobile sticky add-to-bag bar. Appears once the primary buy-box CTA
 * (`[data-cta="primary"]`) has scrolled above the viewport.
 */
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";

import type { PriceTier } from "@/data/pricing";
import { tierUnitPrice } from "@/lib/cart-types";
import { formatMoney } from "@/lib/pricing";
import { addToCart } from "@/lib/stores/cart";

import { $pdpQty, setPdpQty } from "./store";

type Props = {
  slug: string;
  available: boolean;
  currency: string;
  tiers: PriceTier[];
  labels: { decrease: string; increase: string; add: string; unavailable: string };
};

export default function StickyCartBar({ slug, available, currency, tiers, labels }: Props) {
  const qty = useStore($pdpQty);
  const [show, setShow] = useState(false);
  const lineSubtotal = tierUnitPrice(tiers, qty) * qty;

  useEffect(() => {
    const el = document.querySelector('[data-cta="primary"]');
    if (!el) return;
    const onScroll = () => setShow(el.getBoundingClientRect().bottom < 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-[3px] pb-[3px] lg:hidden">
      <div className="flex items-center gap-2 border hairline bg-paper p-2 shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center border hairline bg-paper">
          <button
            type="button"
            onClick={() => setPdpQty(qty - 1)}
            className="px-3 py-3 text-forest hover:text-moss"
            aria-label={labels.decrease}
          >
            −
          </button>
          <span className="w-8 text-center font-mono text-xs text-forest">{qty}</span>
          <button
            type="button"
            onClick={() => setPdpQty(qty + 1)}
            className="px-3 py-3 text-forest hover:text-moss"
            aria-label={labels.increase}
          >
            +
          </button>
        </div>
        <button
          type="button"
          disabled={!available}
          onClick={() => addToCart(slug, qty)}
          className="flex-1 bg-forest px-4 py-3 font-mono text-[11px] font-bold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-moss disabled:opacity-50"
        >
          {available
            ? `${labels.add} · ${formatMoney(lineSubtotal, currency)}`
            : labels.unavailable}
        </button>
      </div>
    </div>
  );
}
