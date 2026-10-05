/** Slide-in cart. Product data arrives pre-resolved in `catalog` (see lib/cart-catalog). */
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

import { tierUnitPrice, type CartCatalog } from "@/lib/cart-types";
import type { IslandI18n } from "@/lib/i18n/core";
import { I18nProvider, useI18n } from "@/lib/i18n/react";
import { formatMoney } from "@/lib/pricing";
import { $cartItems, $cartOpen, removeFromCart, setCartQty } from "@/lib/stores/cart";

type Props = {
  i18n: IslandI18n;
  catalog: CartCatalog;
  currency: string;
};

function Drawer({ catalog, currency }: Omit<Props, "i18n">) {
  const { t, path, isRtl } = useI18n();
  const open = useStore($cartOpen);
  const items = useStore($cartItems);
  const close = () => $cartOpen.set(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const lines = items.flatMap((i) => {
    const p = catalog[i.slug];
    return p ? [{ ...i, p, total: tierUnitPrice(p.tiers, i.qty) * i.qty }] : [];
  });
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={t("commerce.cartDrawer.ariaLabel", "Shopping cart")}
    >
      <div className="absolute inset-0 bg-ink/40" onClick={close} aria-hidden="true" />
      <aside
        className={`absolute top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-xl ${isRtl ? "left-0" : "right-0"}`}
      >
        <div className="flex items-center justify-between border-b hairline px-6 py-5">
          <div className="eyebrow">{t("commerce.cart.eyebrow", "Your Bag")}</div>
          <button
            type="button"
            onClick={close}
            aria-label={t("commerce.cartDrawer.close", "Close cart")}
            className="px-2 py-1 text-[11px] tracking-[0.2em] uppercase"
          >
            {t("commerce.cartDrawer.closeLabel", "Close")}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {lines.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-serif text-2xl">
                {t("commerce.cart.emptyTitle", "Your bag is empty.")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(
                  "commerce.cartDrawer.emptyBody",
                  "Discover our botanical hair-growth collection.",
                )}
              </p>
              <a
                href={path("/shop")}
                className="mt-6 inline-block bg-forest px-6 py-3 text-xs tracking-[0.18em] text-ivory uppercase"
              >
                {t("commerce.cartDrawer.shopAll", "Shop All")}
              </a>
            </div>
          ) : (
            <ul>
              {lines.map(({ slug, qty, p, total }) => (
                <li key={slug} className="flex gap-4 border-b hairline p-6">
                  <img
                    src={p.image.src}
                    srcSet={p.image.srcSet}
                    sizes="80px"
                    alt={p.imageAlt}
                    className="h-20 w-20 bg-ivory object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <div>
                        <a
                          href={p.href}
                          className="font-serif text-lg leading-tight hover:text-forest"
                        >
                          {p.name}
                        </a>
                        <div className="mt-0.5 text-xs text-muted-foreground">{p.size}</div>
                      </div>
                      <div className="text-sm" data-ltr>
                        {formatMoney(total, currency)}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border hairline">
                        <button
                          type="button"
                          onClick={() => setCartQty(slug, qty - 1)}
                          className="px-3 py-1 text-sm"
                          aria-label={t("commerce.cart.decrease", "Decrease")}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setCartQty(slug, qty + 1)}
                          className="px-3 py-1 text-sm"
                          aria-label={t("commerce.cart.increase", "Increase")}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(slug)}
                        className="text-xs text-muted-foreground underline underline-offset-4 hover:text-forest"
                      >
                        {t("commerce.cart.remove", "Remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="space-y-4 border-t hairline p-6">
            <div className="flex justify-between text-sm">
              <span className="eyebrow">{t("commerce.summary.subtotal", "Subtotal")}</span>
              <span data-ltr>{formatMoney(subtotal, currency)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("commerce.cartDrawer.shippingNote", "Shipping and taxes calculated at checkout.")}
            </p>
            <a
              href={path("/cart")}
              className="block bg-forest px-6 py-4 text-center text-xs tracking-[0.18em] text-ivory uppercase"
            >
              {t("commerce.cartDrawer.reviewBag", "Review Bag")}
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}

export default function CartDrawer({ i18n, ...props }: Props) {
  return (
    <I18nProvider i18n={i18n}>
      <Drawer {...props} />
    </I18nProvider>
  );
}
