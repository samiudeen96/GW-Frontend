import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Page";
import { useCart } from "@/lib/cart";
import { getProduct, productImageAlt, productImageTitle } from "@/lib/products";
import { formatMoney, unitPriceForQty, lineTotal, useRegion, getCurrency } from "@/lib/pricing";
import { CartTrustBanner, CustomerQuote } from "@/components/site/SocialProof";
import { shippingForCurrency } from "@/lib/shipping";
import { useT } from "@/lib/i18n";
import { localeOf, canonicalFor } from "@/lib/seo";

import { useMemo, useState } from "react";

export const Route = createFileRoute("/cart")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    return {
      meta: [
        {
          title: locale === "ar" ? "حقيبتك — Green Wealth" : "Your Bag — Green Wealth",
        },
        { name: "robots", content: "noindex" },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/cart", locale) }],
    };
  },
  component: CartPage,
});

function CartPage() {
  const t = useT();
  const { items, setQty, remove } = useCart();
  const { currency } = useRegion();
  const curMeta = getCurrency(currency);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<string | null>(null);

  const rule = shippingForCurrency(currency);
  const freeShipTarget = rule.freeOver ?? Infinity;
  const stdShip = rule.fee;


  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + lineTotal(i.slug, i.qty, currency), 0);
    const discount = promoApplied === "GW10" ? subtotal * 0.1 : 0;
    const afterDiscount = subtotal - discount;
    const freeShip = afterDiscount >= freeShipTarget;
    const shipping = freeShip || items.length === 0 ? 0 : stdShip;
    return { subtotal, discount, shipping, total: afterDiscount + shipping, freeShip };
  }, [items, currency, promoApplied, freeShipTarget, stdShip]);

  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  const freeShipProgress = Math.min(100, (totals.subtotal / freeShipTarget) * 100);

  if (items.length === 0) {
    return (
      <>
        <PageHeader
          eyebrow={t("commerce.cart.eyebrow", "Your Bag")}
          title={t("commerce.cart.emptyTitle", "Your bag is empty.")}
        />
        <div className="container-editorial py-16 md:py-24">
          <div className="max-w-xl mx-auto border hairline bg-paper p-10 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {t(
                "commerce.cart.emptyBody",
                "Nothing here yet. Explore our botanical hair care collection — trusted by thousands worldwide.",
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/shop"
                className="inline-block bg-forest text-ivory px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold"
              >
                {t("commerce.cart.shopCollection", "Shop the Collection")}
              </Link>
              <Link
                to="/how-to-use"
                className="inline-block border hairline px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold"
              >
                {t("commerce.cart.howToUse", "How to Use")}
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={`${t("commerce.cart.eyebrow", "Your Bag")} · ${itemCount} ${
          itemCount === 1 ? t("commerce.cart.item", "item") : t("commerce.cart.items", "items")
        }`}
        title={t("commerce.cart.reviewTitle", "Review your order.")}
      />
      <div className="container-editorial py-10 md:py-14 grid lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Items */}
        <div className="lg:col-span-8">
          {/* Verified trust banner — reduces cart abandonment */}
          <div className="mb-6">
            <CartTrustBanner />
          </div>

          {/* Free shipping progress */}
          {rule.freeOver !== null ? (
            <div className="mb-8 border hairline p-4 bg-ivory">
              <div className="flex justify-between text-[11px] uppercase tracking-[0.18em] font-semibold mb-2">
                <span>
                  {totals.freeShip
                    ? t("commerce.cart.freeShipUnlocked", "You unlocked free shipping")
                    : t("commerce.cart.freeShipProgress", "Free shipping progress")}
                </span>
                <span className="font-mono tabular-nums">
                  {formatMoney(Math.min(totals.subtotal, freeShipTarget), currency)} / {formatMoney(freeShipTarget, currency)}
                </span>
              </div>
              <div className="h-1 w-full bg-forest/10">
                <div
                  className="h-full bg-forest transition-all"
                  style={{ width: `${freeShipProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="mb-8 border hairline p-4 bg-ivory text-[11px] uppercase tracking-[0.18em] font-semibold">
              {t("commerce.cart.flatShipping", "Flat shipping")} {formatMoney(stdShip, currency)} · {rule.days}
            </div>
          )}


          <ul className="divide-y hairline border-y hairline">
            {items.map((i) => {
              const p = getProduct(i.slug);
              if (!p) return null;
              const unit = unitPriceForQty(i.slug, i.qty, currency);
              const line = unit * i.qty;
              return (
                <li key={i.slug} className="py-6 flex gap-4 md:gap-6">
                  <Link to="/product/$slug" params={{ slug: i.slug }} className="shrink-0">
                    <img
                      src={p.image}
                      alt={productImageAlt(p, 0, t)}
                      title={productImageTitle(p, t)}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover bg-ivory"
          loading="lazy"
          decoding="async"
        />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          to="/product/$slug"
                          params={{ slug: i.slug }}
                          className="font-serif text-lg md:text-xl hover:underline underline-offset-4 block truncate"
                        >
                          {p.name}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-1">{p.size}</div>
                        <div className="text-[11px] font-mono text-forest/60 mt-1 tabular-nums">
                          {formatMoney(unit, currency)} <span className="text-forest/40">/ {t("commerce.cart.unit", "unit")}</span>
                          {i.qty >= 2 && (
                            <span className="ml-2 uppercase tracking-[0.15em] text-forest">
                              {t("commerce.cart.tierPrice", "Tier price")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm md:text-base font-mono tabular-nums font-semibold shrink-0">
                        {formatMoney(line, currency)}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border hairline">
                        <button
                          onClick={() => setQty(i.slug, i.qty - 1)}
                          className="px-3 py-1.5 text-sm hover:bg-ivory"
                          aria-label={t("commerce.cart.decrease", "Decrease")}
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-mono tabular-nums">{i.qty}</span>
                        <button
                          onClick={() => setQty(i.slug, i.qty + 1)}
                          className="px-3 py-1.5 text-sm hover:bg-ivory"
                          aria-label={t("commerce.cart.increase", "Increase")}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(i.slug)}
                        className="text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 text-muted-foreground hover:text-forest"
                      >
                        {t("commerce.cart.remove", "Remove")}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-wrap gap-4 items-center justify-between">
            <Link
              to="/shop"
              className="text-xs uppercase tracking-[0.2em] underline underline-offset-4 hover:text-forest"
            >
              ← {t("commerce.cart.continueShopping", "Continue shopping")}
            </Link>
            <div className="text-[11px] text-muted-foreground uppercase tracking-[0.15em]">
              {t("commerce.cart.secureCheckout", "Secure checkout · SSL encrypted")}
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-4">
          <div className="bg-ivory p-6 md:p-8 lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-6">
              <div className="eyebrow">{t("commerce.summary.title", "Order Summary")}</div>
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-forest/60">
                {curMeta.code}
              </span>
            </div>

            {/* Promo */}
            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-[0.18em] font-semibold text-forest/60 block mb-2">
                {t("commerce.cart.promoCode", "Promo code")}
              </label>
              <div className="flex gap-0">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value.toUpperCase())}
                  placeholder={t("commerce.cart.enterCode", "Enter code")}
                  className="flex-1 border hairline h-10 px-3 bg-paper text-sm focus:outline-none focus:border-forest"
                />
                <button
                  onClick={() => {
                    if (promo === "GW10") setPromoApplied("GW10");
                    else setPromoApplied(null);
                  }}
                  className="bg-forest text-ivory px-4 text-[11px] uppercase tracking-[0.18em]"
                >
                  {t("commerce.cart.apply", "Apply")}
                </button>
              </div>
              {promoApplied && (
                <div className="text-[11px] text-forest mt-2">
                  {t("commerce.cart.codeApplied", "Code")} {promoApplied} {t("commerce.cart.appliedOff", "applied — 10% off")}
                </div>
              )}
              {promo && !promoApplied && promo.length > 2 && (
                <div className="text-[11px] text-muted-foreground mt-2">
                  {t("commerce.cart.tryCode", "Try code GW10")}
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm font-mono tabular-nums">
              <div className="flex justify-between">
                <span>{t("commerce.summary.subtotal", "Subtotal")}</span>
                <span>{formatMoney(totals.subtotal, currency)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-forest">
                  <span>{t("commerce.summary.discount", "Discount")}</span>
                  <span>− {formatMoney(totals.discount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>{t("commerce.summary.shipping", "Shipping")}</span>
                <span>{totals.shipping === 0 ? t("commerce.summary.free", "Free") : formatMoney(totals.shipping, currency)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t("commerce.summary.taxes", "Taxes")}</span>
                <span>{t("commerce.summary.incl", "Incl.")}</span>
              </div>
            </div>

            <div className="flex justify-between border-t hairline mt-4 pt-4 mb-6 text-base font-bold font-mono tabular-nums">
              <span>{t("commerce.summary.total", "Total")}</span>
              <span>{formatMoney(totals.total, currency)}</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full text-center bg-forest text-ivory py-4 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-forest/90"
            >
              {t("commerce.cart.proceedToCheckout", "Proceed to Checkout")}
            </Link>

            <div className="mt-6 pt-6 border-t hairline space-y-2 text-[11px] text-muted-foreground uppercase tracking-[0.15em]">
              <div>— {t("commerce.trust.authenticity", "Authenticity verified")}</div>
              <div>— {t("commerce.trust.worldwide", "Worldwide shipping · 90+ countries")}</div>
              <div>— {t("commerce.trust.exchange", "7-day exchange window")}</div>
            </div>
          </div>
          <div className="mt-6">
            <CustomerQuote compact />
          </div>
        </aside>
      </div>
    </>
  );
}
