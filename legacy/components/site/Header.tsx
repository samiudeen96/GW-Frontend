/**
 * Purpose: Architectural site header — grid-locked dark forest bar with brass hairlines,
 *   centered wordmark, text-only navigation and an expanding collection panel.
 * Users: every visitor on every route.
 * Key actions: navigate, switch language/currency, open account, open cart drawer.
 * Integration points: cart store (useCart), i18n (useT), CurrencySelect, LanguageSwitcher.
 *   Presentation only — no business logic lives here.
 */
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useCart } from "@/lib/cart";
import { CurrencySelect } from "@/components/site/CurrencySelect";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { useT } from "@/lib/i18n";

const navLeft = [
  { to: "/shop", label: "Shop", key: "nav.shop" },
  { to: "/ingredients", label: "Ingredients", key: "nav.ingredients" },
  { to: "/hair-science", label: "Hair Science", key: "nav.hairScience" },
  { to: "/verify", label: "Authenticity", key: "nav.authenticity" },
];

const navRight = [
  { to: "/reviews", label: "Reviews", key: "nav.reviews" },
  { to: "/faq", label: "FAQ", key: "nav.faq" },
  { to: "/blogs", label: "Journal", key: "nav.journal" },
  { to: "/about", label: "About", key: "nav.about" },
  { to: "/wholesale", label: "Wholesale", key: "nav.wholesale" },
];

const nav = [...navLeft, ...navRight];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, setOpen } = useCart();
  const t = useT();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const linkClass =
    "whitespace-nowrap text-paper/80 text-[11px] font-mono uppercase tracking-[0.18em] border-b border-transparent pb-0.5 hover:text-brass hover:border-brass transition-colors";

  return (
    <>
      <div className="bg-brass text-forest text-[10px] tracking-[0.24em] uppercase">
        <div className="container-editorial flex items-center justify-center py-2 text-center">
          <span>{t("header.announce", "Worldwide delivery · Verify every product")}</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-forest border-b border-brass/50">
        <div className="grid h-14 md:h-16 grid-cols-[1fr_auto_1fr] items-stretch">
          {/* Left cell */}
          <div className="flex items-center justify-start gap-6 px-4 md:px-8 border-e border-brass/30">
            <button
              className="lg:hidden text-paper text-[11px] font-mono uppercase tracking-[0.2em]"
              onClick={() => setMobileOpen(true)}
            >
              {t("header.menu", "Menu")}
            </button>

            <nav className="hidden lg:flex items-center gap-7">
              {navLeft.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={linkClass}
                  activeProps={{ className: "text-brass border-brass" }}
                >
                  {t(n.key, n.label)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Centre wordmark */}
          <Link
            to="/"
            className="flex min-w-0 items-center justify-center px-6 md:px-12"
            aria-label={t("img.logoHome", "Green Wealth home")}
          >
            <img
              src="/brand-logo.svg"
              alt={t("img.logoAlt", "Green Wealth — authentic Neo Hair Lotion, Shampoo and Ghori hair care")}
              title={t("brand.name", "Green Wealth")}
              className="h-12 md:h-14 w-auto max-w-full scale-[1.45] md:scale-[1.6]"
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* Right cell */}
          <div className="flex items-center justify-end gap-4 md:gap-6 px-4 md:px-8 border-s border-brass/30">
            <nav className="hidden lg:flex items-center gap-7">
              {navRight.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={linkClass}
                  activeProps={{ className: "text-brass border-brass" }}
                >
                  {t(n.key, n.label)}
                </Link>
              ))}
            </nav>
            <LanguageSwitcher className="hidden lg:inline-block text-paper" />
            <Link
              to="/account"
              className="hidden sm:inline text-paper/80 text-[11px] font-mono uppercase tracking-[0.18em] hover:text-brass transition-colors"
            >
              {t("header.account", "Account")}
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center h-8 w-8 sm:w-auto sm:px-3 border border-brass/80 bg-forest text-brass hover:bg-brass hover:text-forest transition-colors"
              aria-label={t("header.bag", "Cart")}
            >
              <span className="relative inline-flex h-3.5 w-3.5 border border-current items-end justify-center">
                <span className="absolute -top-1.5 h-1.5 w-2.5 border-t border-x border-current rounded-t-xs"></span>
              </span>
              <span className="ml-1.5 text-[10px] font-mono tracking-wider hidden sm:inline">
                {String(count).padStart(2, "0")}
              </span>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-forest text-paper lg:hidden flex flex-col">
          <div className="container-editorial flex h-16 items-center justify-between gap-4 border-b border-brass/40">
            <span className="flex items-center px-4 py-1">
              <img
                src="/brand-logo.svg"
                alt={t("img.logoAlt", "Green Wealth — authentic Neo Hair Lotion, Shampoo and Ghori hair care")}
                title={t("brand.name", "Green Wealth")}
                className="h-10 w-auto scale-[1.4]"
                loading="lazy"
                decoding="async"
              />
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="shrink-0 text-[11px] font-mono uppercase tracking-[0.24em] px-2 py-2 text-brass"
            >
              {t("header.close", "Close")}
            </button>
          </div>

          {/* Quick actions — account, cart, currency, language */}
          <div className="container-editorial border-b border-brass/20 py-3">
            <div className="grid grid-cols-2 gap-2">
              {/* Account */}
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="group flex flex-col justify-between border border-brass/30 bg-forest-dark/20 p-3 min-h-[62px] hover:border-brass/60 hover:bg-forest-dark/30 transition-colors"
              >
                <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-brass">
                  {t("header.account", "Account")}
                </span>
                <span className="text-[13px] text-paper/90 leading-tight">
                  {t("account.title", "Profile & orders")}
                </span>
              </Link>

              {/* Cart */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setOpen(true);
                }}
                className="group flex flex-col justify-between border border-brass/30 bg-forest-dark/20 p-3 min-h-[62px] text-start hover:border-brass/60 hover:bg-forest-dark/30 transition-colors"
              >
                <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-brass">
                  {t("header.bag", "Cart")}
                </span>
                <span className="flex items-center gap-2 text-[13px] text-paper/90 leading-tight">
                  <span className="relative inline-flex h-4 w-3 border border-current items-end justify-center">
                    <span className="absolute -top-1.5 h-1.5 w-2 border-t border-x border-current rounded-t-xs"></span>
                  </span>
                  {t("cart.view", "View bag")}
                </span>
              </button>

              {/* Currency */}
              <div className="flex flex-col justify-between gap-1 border border-brass/30 bg-forest-dark/20 p-3 min-h-[62px]">
                <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-brass">
                  {t("commerce.currency.label", "Currency")}
                </span>
                <CurrencySelect tone="light" className="w-full" />
              </div>

              {/* Language */}
              <div className="flex flex-col justify-between border border-brass/30 bg-forest-dark/20 p-3 min-h-[62px]">
                <LanguageSwitcher variant="block" tone="dark" />
              </div>
            </div>
          </div>

          <nav className="container-editorial flex-1 overflow-y-auto flex flex-col py-5 gap-0">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className="group flex items-baseline py-3 border-b border-brass/20"
                activeProps={{ className: "text-brass" }}
              >
                <span className="font-serif text-2xl leading-none uppercase">{t(n.key, n.label)}</span>
              </Link>
            ))}
          </nav>

          <div className="container-editorial border-t border-brass/30 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-paper/50">
            {t("header.announce", "Worldwide delivery · Verify every product")}
          </div>
        </div>
      )}
    </>
  );
}
