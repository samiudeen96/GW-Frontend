/** SEO helpers: canonical origin, hreflang alternates and JSON-LD builders. */
import { PUBLIC_SITE_URL } from "astro:env/client";

export const SITE_ORIGIN = (PUBLIC_SITE_URL ?? "https://greenwealth.com").replace(/\/$/, "");
export const SITE_NAME = "Green Wealth";
export const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/53af62b8-75f2-4089-89bd-23ad81470b51";

export const abs = (path: string) =>
  path.startsWith("http") ? path : `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;

/** Absolute Arabic twin of a locale-agnostic path (`/shop` -> `.../ar/shop`). */
export const absAr = (path: string) => {
  const bare = path.replace(/^\/ar(?=\/|$)/i, "") || "/";
  return abs(bare === "/" ? "/ar" : `/ar${bare.startsWith("/") ? bare : `/${bare}`}`);
};

export const canonicalFor = (path: string, locale: string) =>
  locale === "ar" ? absAr(path) : abs(path);

/** Regions we ship to; hreflang signals regional intent for the English edition. */
const HREFLANG_EN = [
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

export function hreflangLinks(path: string): Array<{ hreflang: string; href: string }> {
  const href = abs(path);
  const arHref = absAr(path);
  return [
    ...HREFLANG_EN.map((hreflang) => ({ hreflang, href })),
    { hreflang: "ar", href: arHref },
    { hreflang: "ar-AE", href: arHref },
    { hreflang: "ar-SA", href: arHref },
    { hreflang: "x-default", href },
  ];
}

export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_ORIGIN}/#organization`,
  name: SITE_NAME,
  alternateName: ["Green Wealth Neo Hair", "greenwealth.com"],
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/brand-logo.png`,
  image: `${SITE_ORIGIN}/brand-logo.png`,
  description:
    "Authorised distributor of original Neo Hair Lotion, Neo Hair Shampoo, Ghori Rosemary & Biotin Oil and the Ghori Dermaroller. Every unit is scratch-code verifiable and shipped worldwide.",
  slogan: "Batch-verified botanical hair care.",
  knowsAbout: [
    "Neo Hair Lotion",
    "Neo Hair Shampoo",
    "botanical hair regrowth",
    "saw palmetto and ginseng scalp treatment",
    "scratch-code authenticity verification",
    "counterfeit Neo Hair Lotion detection",
  ],
  sameAs: [
    "https://www.instagram.com/greenwealth.official",
    "https://www.facebook.com/greenwealthofficial",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    url: `${SITE_ORIGIN}/contact`,
    availableLanguage: ["en", "ar", "hi", "ur"],
  },
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_ORIGIN}/#website`,
  name: SITE_NAME,
  url: SITE_ORIGIN,
  inLanguage: "en",
  publisher: { "@id": `${SITE_ORIGIN}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_ORIGIN}/shop?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};
