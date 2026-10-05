/**
 * Request middleware.
 *
 * - Redirects: legacy/alias URLs answer with a 301 to their canonical page,
 *   keeping the locale prefix.
 * - Locale: English is served at `/path`, Arabic at `/ar/path`. Arabic requests
 *   are rewritten to the bare route, so pages stay locale-agnostic and read
 *   `Astro.locals.locale` instead.
 * - Currency: read from the `gw-currency` cookie so prices render server-side.
 */
import { defineMiddleware } from "astro:middleware";

import { CURRENCY_COOKIE } from "@/lib/currency-cookie";
import { localeFromPath, stripLocalePrefix, withLocalePrefix } from "@/lib/i18n/locale";
import { DEFAULT_CURRENCY, isCurrency } from "@/lib/pricing";

const REDIRECTS: Record<string, string> = {
  "/testimonials": "/reviews",
  "/neo-hair-lotion-reviews": "/reviews",
  "/how-to-use-neo-hair-lotion": "/how-to-use",
  "/how-to-verify-original-neo-hair-lotion": "/verify",
  "/how-to-spot-fake-vs-original-neo-hair-lotion": "/real-vs-fake",
  "/buy-neo-hair-lotion-in-wholesale": "/wholesale",
};

function redirectTarget(barePath: string): string | undefined {
  const path = barePath.length > 1 ? barePath.replace(/\/$/, "") : barePath;
  if (REDIRECTS[path]) return REDIRECTS[path];
  const blog = path.match(/^\/blog\/([^/]+)$/);
  if (blog) return `/blogs/${blog[1]}`;
  return undefined;
}

export const onRequest = defineMiddleware((context, next) => {
  const { pathname, search } = context.url;
  const locale = localeFromPath(pathname);
  const barePath = stripLocalePrefix(pathname);

  const target = redirectTarget(barePath);
  if (target) return context.redirect(`${withLocalePrefix(target, locale)}${search}`, 301);

  const currency = context.cookies.get(CURRENCY_COOKIE)?.value;
  context.locals.locale = locale;
  context.locals.pathname = barePath;
  context.locals.currency = isCurrency(currency) ? currency : DEFAULT_CURRENCY;

  if (locale === "ar") return next(`${barePath}${search}`);
  return next();
});
