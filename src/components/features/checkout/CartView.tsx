/**
 * Cart page body: line items, free-shipping progress, promo code and order
 * summary. The cart lives in localStorage, so this island owns the page header
 * too (its copy depends on the item count). Social proof arrives as Astro slots.
 */
import { useStore } from "@nanostores/react";
import { useMemo, useState, type ReactNode } from "react";

import type { ShippingRule } from "@/data/shipping";
import { tierUnitPrice, type CartCatalog } from "@/lib/cart-types";
import type { IslandI18n } from "@/lib/i18n/core";
import { I18nProvider, useI18n } from "@/lib/i18n/react";
import { formatMoney, getCurrency } from "@/lib/pricing";
import { $cartItems, removeFromCart, setCartQty } from "@/lib/stores/cart";

import { LoadingBlock, PageHeading } from "./PageHeading";
import { useHydrated } from "./useHydrated";

type Props = {
  i18n: IslandI18n;
  catalog: CartCatalog;
  currency: string;
  /** Shipping band for the active currency (`shippingForCurrency`). */
  shipping: ShippingRule;
  /** Image title attributes by product slug. */
  imageTitles: Record<string, string>;
  /** Astro slot `trust-banner`: `<CartTrustBanner />`. */
  trustBanner?: ReactNode;
  /** Astro slot `quote`: `<CustomerQuote compact />`. */
  quote?: ReactNode;
};

const PROMO_CODE = "GW10";

function Cart({ catalog, currency, shipping: rule, imageTitles, trustBanner, quote }: Props) {
  const { t, path } = useI18n();
  const hydrated = useHydrated();
  const items = useStore($cartItems);
  const curMeta = getCurrency(currency);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<string | null>(null);

  const freeShipTarget = rule.freeOver ?? Infinity;
  const stdShip = rule.fee;

  const lines = useMemo(
    () =>
      items.flatMap((i) => {
        const p = catalog[i.slug];
        if (!p) return [];
        const unit = tierUnitPrice(p.tiers, i.qty);
        return [{ ...i, p, unit, line: unit * i.qty }];
      }),
    [items, catalog],
  );

  const totals = useMemo(() => {
    const subtotal = lines.reduce((s, l) => s + l.line, 0);
    const discount = promoApplied === PROMO_CODE ? subtotal * 0.1 : 0;
    const afterDiscount = subtotal - discount;
    const freeShip = afterDiscount >= freeShipTarget;
    const shipping = freeShip || lines.length === 0 ? 0 : stdShip;
    return { subtotal, discount, shipping, total: afterDiscount + shipping, freeShip };
  }, [lines, promoApplied, freeShipTarget, stdShip]);

  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const freeShipProgress = Math.min(100, (totals.subtotal / freeShipTarget) * 100);

  if (!hydrated) {
    return (
      <>
        <PageHeading
          eyebrow={t("commerce.cart.eyebrow", "Your Bag")}
          title={t("commerce.cart.reviewTitle", "Review your order.")}
        />
        <div className="container-editorial py-10 md:py-14">
          <LoadingBlock />
        </div>
      </>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <PageHeading
          eyebrow={t("commerce.cart.eyebrow", "Your Bag")}
          title={t("commerce.cart.emptyTitle", "Your bag is empty.")}
        />
        <div className="container-editorial py-16 md:py-24">
          <div className="mx-auto max-w-xl border hairline bg-paper p-10 text-center">
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              {t(
                "commerce.cart.emptyBody",
                "Nothing here yet. Explore our botanical hair care collection — trusted by thousands worldwide.",
              )}
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={path("/shop")}
                className="inline-block bg-forest px-6 py-3 text-xs font-semibold tracking-[0.2em] text-ivory uppercase"
              >
                {t("commerce.cart.shopCollection", "Shop the Collection")}
              </a>
              <a
                href={path("/how-to-use")}
                className="inline-block border hairline px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase"
              >
                {t("commerce.cart.howToUse", "How to Use")}
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeading
        eyebrow={`${t("commerce.cart.eyebrow", "Your Bag")} · ${itemCount} ${
          itemCount === 1 ? t("commerce.cart.item", "item") : t("commerce.cart.items", "items")
        }`}
        title={t("commerce.cart.reviewTitle", "Review your order.")}
      />
      <div className="container-editorial grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-14">
        {/* Items */}
        <div className="lg:col-span-8">
          {/* Verified trust banner — reduces cart abandonment */}
          {trustBanner && <div className="mb-6">{trustBanner}</div>}

          {/* Free shipping progress */}
          {rule.freeOver !== null ? (
            <div className="mb-8 border hairline bg-ivory p-4">
              <div className="mb-2 flex justify-between text-[11px] font-semibold tracking-[0.18em] uppercase">
                <span>
                  {totals.freeShip
                    ? t("commerce.cart.freeShipUnlocked", "You unlocked free shipping")
                    : t("commerce.cart.freeShipProgress", "Free shipping progress")}
                </span>
                <span className="font-mono tabular-nums">
                  {formatMoney(Math.min(totals.subtotal, freeShipTarget), currency)} /{" "}
                  {formatMoney(freeShipTarget, currency)}
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
            <div className="mb-8 border hairline bg-ivory p-4 text-[11px] font-semibold tracking-[0.18em] uppercase">
              {t("commerce.cart.flatShipping", "Flat shipping")} {formatMoney(stdShip, currency)} ·{" "}
              {rule.days}
            </div>
          )}

          <ul className="divide-y border-y hairline">
            {lines.map(({ slug, qty, p, unit, line }) => (
              <li key={slug} className="flex gap-4 py-6 md:gap-6">
                <a href={p.href} className="shrink-0">
                  <img
                    src={p.image.src}
                    srcSet={p.image.srcSet}
                    sizes="(min-width: 768px) 128px, 96px"
                    alt={p.imageAlt}
                    title={imageTitles[slug]}
                    className="h-24 w-24 bg-ivory object-cover md:h-32 md:w-32"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <a
                        href={p.href}
                        className="block truncate font-serif text-lg underline-offset-4 hover:underline md:text-xl"
                      >
                        {p.name}
                      </a>
                      <div className="mt-1 text-xs text-muted-foreground">{p.size}</div>
                      <div className="mt-1 font-mono text-[11px] text-forest/60 tabular-nums">
                        {formatMoney(unit, currency)}{" "}
                        <span className="text-forest/40">/ {t("commerce.cart.unit", "unit")}</span>
                        {qty >= 2 && (
                          <span className="ms-2 tracking-[0.15em] text-forest uppercase">
                            {t("commerce.cart.tierPrice", "Tier price")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 font-mono text-sm font-semibold tabular-nums md:text-base">
                      {formatMoney(line, currency)}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border hairline">
                      <button
                        type="button"
                        onClick={() => setCartQty(slug, qty - 1)}
                        className="px-3 py-1.5 text-sm hover:bg-ivory"
                        aria-label={t("commerce.cart.decrease", "Decrease")}
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-mono text-sm tabular-nums">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setCartQty(slug, qty + 1)}
                        className="px-3 py-1.5 text-sm hover:bg-ivory"
                        aria-label={t("commerce.cart.increase", "Increase")}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(slug)}
                      className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase underline underline-offset-4 hover:text-forest"
                    >
                      {t("commerce.cart.remove", "Remove")}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <a
              href={path("/shop")}
              className="text-xs tracking-[0.2em] uppercase underline underline-offset-4 hover:text-forest"
            >
              ← {t("commerce.cart.continueShopping", "Continue shopping")}
            </a>
            <div className="text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
              {t("commerce.cart.secureCheckout", "Secure checkout · SSL encrypted")}
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-4">
          <div className="bg-ivory p-6 md:p-8 lg:sticky lg:top-24">
            <div className="mb-6 flex items-center justify-between">
              <div className="eyebrow">{t("commerce.summary.title", "Order Summary")}</div>
              <span className="font-mono text-[10px] tracking-[0.22em] text-forest/60 uppercase">
                {curMeta.code}
              </span>
            </div>

            {/* Promo */}
            <div className="mb-6">
              <label
                htmlFor="cart-promo"
                className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-forest/60 uppercase"
              >
                {t("commerce.cart.promoCode", "Promo code")}
              </label>
              <div className="flex gap-0">
                <input
                  id="cart-promo"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value.toUpperCase())}
                  placeholder={t("commerce.cart.enterCode", "Enter code")}
                  className="h-10 flex-1 border hairline bg-paper px-3 text-sm focus:border-forest focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setPromoApplied(promo === PROMO_CODE ? PROMO_CODE : null)}
                  className="bg-forest px-4 text-[11px] tracking-[0.18em] text-ivory uppercase"
                >
                  {t("commerce.cart.apply", "Apply")}
                </button>
              </div>
              {promoApplied && (
                <div className="mt-2 text-[11px] text-forest">
                  {t("commerce.cart.codeApplied", "Code")} {promoApplied}{" "}
                  {t("commerce.cart.appliedOff", "applied — 10% off")}
                </div>
              )}
              {promo && !promoApplied && promo.length > 2 && (
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {t("commerce.cart.tryCode", "Try code GW10")}
                </div>
              )}
            </div>

            <div className="space-y-2 font-mono text-sm tabular-nums">
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
                <span>
                  {totals.shipping === 0
                    ? t("commerce.summary.free", "Free")
                    : formatMoney(totals.shipping, currency)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t("commerce.summary.taxes", "Taxes")}</span>
                <span>{t("commerce.summary.incl", "Incl.")}</span>
              </div>
            </div>

            <div className="mt-4 mb-6 flex justify-between border-t hairline pt-4 font-mono text-base font-bold tabular-nums">
              <span>{t("commerce.summary.total", "Total")}</span>
              <span>{formatMoney(totals.total, currency)}</span>
            </div>

            <a
              href={path("/checkout")}
              className="block w-full bg-forest py-4 text-center text-xs font-semibold tracking-[0.2em] text-ivory uppercase hover:bg-forest/90"
            >
              {t("commerce.cart.proceedToCheckout", "Proceed to Checkout")}
            </a>

            <div className="mt-6 space-y-2 border-t hairline pt-6 text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
              <div>— {t("commerce.trust.authenticity", "Authenticity verified")}</div>
              <div>— {t("commerce.trust.worldwide", "Worldwide shipping · 90+ countries")}</div>
              <div>— {t("commerce.trust.exchange", "7-day exchange window")}</div>
            </div>
          </div>
          {quote && <div className="mt-6">{quote}</div>}
        </aside>
      </div>
    </>
  );
}

export default function CartView({ i18n, ...props }: Props) {
  return (
    <I18nProvider i18n={i18n}>
      <Cart i18n={i18n} {...props} />
    </I18nProvider>
  );
}
