// SEO helpers — single source of truth for canonical origin.
export const SITE_ORIGIN = "https://greenwealth.com";
export const abs = (path: string) =>
  path.startsWith("http") ? path : `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;

// Regions Green Wealth ships to. All pages are in English; hreflang signals
// regional intent so Google can surface the right currency/shipping context
// per country. `x-default` fallback is required by Google guidelines.
export const HREFLANG_LOCALES = [
  "en",
  "en-AE",
  "en-SA",
  "en-QA",
  "en-KW",
  "en-BH",
  "en-OM",
  "en-GB",
  "en-IE",
  "en-AU",
  "en-CA",
  "en-SG",
  "en-IN",
  "en-PK",
  "en-US",
] as const;

/** Absolute Arabic twin of a locale-agnostic path (`/shop` -> `.../ar/shop`). */
export const absAr = (path: string) => {
  const bare = path.replace(/^\/ar(?=\/|$)/i, "") || "/";
  return abs(bare === "/" ? "/ar" : `/ar${bare.startsWith("/") ? bare : `/${bare}`}`);
};

/**
 * Emit rel=alternate hreflang links for a page path (self-referencing per Google
 * guidance) plus the Arabic edition served under /ar/*.
 * Pass the locale-agnostic path; both editions are derived from it.
 */
export function hreflangLinks(path: string) {
  const href = abs(path);
  const arHref = absAr(path);
  const links: Array<{ rel: string; hrefLang: string; href: string }> =
    HREFLANG_LOCALES.map((locale) => ({ rel: "alternate", hrefLang: locale, href }));
  links.push({ rel: "alternate", hrefLang: "ar", href: arHref });
  links.push({ rel: "alternate", hrefLang: "ar-AE", href: arHref });
  links.push({ rel: "alternate", hrefLang: "ar-SA", href: arHref });
  links.push({ rel: "alternate", hrefLang: "x-default", href });
  return links;
}

/** BreadcrumbList JSON-LD helper. */
export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: abs(it.path),
      })),
    }),
  };
}

/** Canonical URL for a page path in the active locale. */
export const canonicalFor = (path: string, locale: string) =>
  locale === "ar" ? absAr(path) : abs(path);

/** Locale of the current match, readable from a route `head()` context. */
export const localeOf = (ctx: { match?: { context?: { localeRef?: { current?: string } } } }) =>
  ctx?.match?.context?.localeRef?.current === "ar" ? "ar" : "en";
