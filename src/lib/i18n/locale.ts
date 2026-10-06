/**
 * i18n · locale primitives
 *
 * Purpose: single source of truth for the locale set, URL prefixing rules and the
 * request-scoped locale reference used by the router rewrite.
 * Users: every page and shared component that renders copy.
 * Integration points: `src/router.tsx` (URL rewrite), `src/routes/__root.tsx`
 * (html lang/dir), `src/lib/seo.ts` (canonical + hreflang).
 *
 * URL model: English is served at the bare path (`/shop`), Arabic at a prefixed
 * path (`/ar/shop`). The router rewrites `/ar/*` -> `/*` on input and back on
 * output, so route files, `<Link to="...">` and loaders stay locale-agnostic.
 */

export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_META: Record<
  Locale,
  { label: string; nativeLabel: string; dir: "ltr" | "rtl"; htmlLang: string }
> = {
  en: { label: "English", nativeLabel: "English", dir: "ltr", htmlLang: "en" },
  ar: { label: "Arabic", nativeLabel: "العربية", dir: "rtl", htmlLang: "ar" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Locale implied by a pathname (`/ar/shop` -> `ar`). */
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.replace(/^\/+/, "").split("/")[0]?.toLowerCase() ?? "";
  return seg === "ar" ? "ar" : "en";
}

/** Remove a locale prefix, always returning a leading-slash path. */
export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/ar(?=\/|$)/i, "");
  return stripped === "" ? "/" : stripped.startsWith("/") ? stripped : `/${stripped}`;
}

/** Add the locale prefix for a locale-agnostic path. */
export function withLocalePrefix(pathname: string, locale: Locale): string {
  const bare = stripLocalePrefix(pathname);
  if (locale === "en") return bare;
  return bare === "/" ? "/ar" : `/ar${bare}`;
}

/** Mutable, router-instance-scoped locale holder (SSR-safe: one per request). */
export type LocaleRef = { current: Locale };
export const createLocaleRef = (initial: Locale = DEFAULT_LOCALE): LocaleRef => ({
  current: initial,
});
