import { Link } from "@tanstack/react-router";

import { useCart } from "@/lib/cart";
import { getProduct, formatPrice, productImageAlt, productImageTitle } from "@/lib/products";
import { useEffect } from "react";
import { useT } from "@/lib/i18n";

export function CartDrawer() {
  const t = useT();
  const { open, setOpen, items, setQty, remove, subtotalLabel } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t("commerce.cartDrawer.ariaLabel", "Shopping cart")}>
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-paper flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-6 py-5 border-b hairline">
          <div className="eyebrow">{t("commerce.cart.eyebrow", "Your Bag")}</div>
          <button onClick={() => setOpen(false)} aria-label={t("commerce.cartDrawer.close", "Close cart")} className="text-[11px] uppercase tracking-[0.2em] px-2 py-1">
            {t("commerce.cartDrawer.closeLabel", "Close")}
          </button>

        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-serif text-2xl">{t("commerce.cart.emptyTitle", "Your bag is empty.")}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("commerce.cartDrawer.emptyBody", "Discover our botanical hair-growth collection.")}
              </p>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="mt-6 inline-block bg-forest text-ivory px-6 py-3 text-xs uppercase tracking-[0.18em]"
              >
                {t("commerce.cartDrawer.shopAll", "Shop All")}
              </Link>
            </div>
          ) : (
            <ul>
              {items.map((i) => {
                const p = getProduct(i.slug);
                if (!p) return null;
                return (
                  <li key={i.slug} className="flex gap-4 p-6 border-b hairline">
                    <img src={p.image} alt={productImageAlt(p, 0, t)} title={productImageTitle(p, t)} className="w-20 h-20 object-cover bg-ivory"
          loading="lazy"
          decoding="async"
        />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div>
                          <div className="font-serif text-lg leading-tight">{p.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{p.size}</div>
                        </div>
                        <div className="text-sm">{formatPrice(p.price * i.qty)}</div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border hairline">
                          <button
                            onClick={() => setQty(i.slug, i.qty - 1)}
                            className="px-3 py-1 text-sm"
                            aria-label={t("commerce.cart.decrease", "Decrease")}
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm">{i.qty}</span>
                          <button
                            onClick={() => setQty(i.slug, i.qty + 1)}
                            className="px-3 py-1 text-sm"
                            aria-label={t("commerce.cart.increase", "Increase")}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => remove(i.slug)}
                          className="text-xs text-muted-foreground hover:text-forest underline underline-offset-4"
                        >
                          {t("commerce.cart.remove", "Remove")}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t hairline p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="eyebrow">{t("commerce.summary.subtotal", "Subtotal")}</span>
              <span>{subtotalLabel}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("commerce.cartDrawer.shippingNote", "Shipping and taxes calculated at checkout.")}
            </p>
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="block text-center bg-forest text-ivory px-6 py-4 text-xs uppercase tracking-[0.18em]"
            >
              {t("commerce.cartDrawer.reviewBag", "Review Bag")}
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
