import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { useRegion } from "@/lib/pricing";
import { formatMoney, getBasePrice } from "@/lib/pricing";
import { productImageAlt, productImageTitle, type Product } from "@/lib/products";
import { useT } from "@/lib/i18n";

export function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const t = useT();
  const { add } = useCart();
  const { currency } = useRegion();
  const [qty, setQty] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const price = getBasePrice(product.slug, currency);
  const total = price * qty;

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${t("shop.quickView.ariaQuickView", "Quick view")} ${product.name}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-forest/60 backdrop-blur-sm"
        aria-label={t("shop.quickView.ariaClose", "Close quick view")}
      />
      <div className="relative w-full max-w-4xl max-h-[90dvh] overflow-y-auto bg-paper border hairline shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-0">
          {/* Image */}
          <div className="aspect-square md:aspect-auto md:min-h-[420px] bg-ivory border-b md:border-b-0 md:border-r hairline flex items-center justify-center p-8 md:p-12">
            <img
              src={product.image}
              alt={productImageAlt(product, 0, t)}
              title={productImageTitle(product, t)}
              className="w-full h-full object-contain"
          loading="lazy"
          decoding="async"
        />
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 lg:p-10 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.28em] font-mono text-moss">
                  {product.brand ?? "Green Wealth"}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-forest mt-1 leading-tight">
                  {product.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 border hairline px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-mono text-forest hover:bg-forest hover:text-paper transition-colors"
              >
                {t("shop.quickView.close", "Close")}
              </button>
            </div>

            <p className="text-[13px] leading-[1.65] text-forest/75 font-serif mb-6">
              {product.overview}
            </p>

            {product.benefits && product.benefits.length > 0 && (
              <ul className="space-y-2 mb-6">
                {product.benefits.slice(0, 3).map((b, i) => (
                  <li key={i} className="flex gap-2.5 text-[12px] leading-[1.55] text-forest/85">
                    <span className="text-gold shrink-0" aria-hidden="true">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto pt-6 border-t hairline">
              <div className="flex items-baseline justify-between mb-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-forest/60">{t("shop.quickView.price", "Price")}</span>
                <span className="font-serif text-2xl md:text-3xl text-forest tabular-nums">
                  {formatMoney(total, currency)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center border hairline bg-paper">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2.5 text-forest hover:text-moss font-mono"
                    aria-label={t("shop.quickView.decreaseQty", "Decrease quantity")}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-xs font-mono text-forest">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-2.5 text-forest hover:text-moss font-mono"
                    aria-label={t("shop.quickView.increaseQty", "Increase quantity")}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  disabled={!product.available}
                  onClick={() => {
                    add(product.slug, qty);
                    onClose();
                  }}
                  className="flex-1 bg-forest text-paper py-2.5 px-4 text-[11px] tracking-[0.18em] font-bold uppercase font-mono hover:bg-moss transition-colors disabled:opacity-50"
                >
                  {product.available ? `${t("shop.quickView.add", "Add")} · ${formatMoney(total, currency)}` : t("shop.quickView.unavailable", "Unavailable")}
                </button>
              </div>

              <Link
                to="/product/$slug"
                params={{ slug: product.slug }}
                onClick={onClose}
                className="block w-full text-center border hairline py-2.5 text-[10px] uppercase tracking-[0.2em] font-mono text-forest hover:bg-forest hover:text-paper transition-colors"
              >
                {t("shop.quickView.viewFullDetails", "View full details")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
