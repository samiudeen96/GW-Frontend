/**
 * Server-side helpers for the product page: translation shortcuts, derived
 * ledger content, delivery ETA, rating distribution and review selection.
 * Pure functions of the product record (plus `t`); never imported by islands.
 */
import { getImage } from "astro:assets";

import type { Product } from "@/data/products";
import { productStats, reviews, type Review } from "@/data/reviews";
import type { TranslateFn } from "@/lib/i18n/core";
import { isImageMetadata, type ImageSource } from "@/lib/images";
import { abs } from "@/lib/seo";

export type ProductT = (field: string, fallback: string) => string;

/** Product-scoped translation helper: `product.<slug>.<field>`. */
export const productT =
  (t: TranslateFn, slug: string): ProductT =>
  (field, fallback) =>
    t(`product.${slug}.${field}`, fallback);

/** Index-matched descriptive alt text with a safe, still-descriptive fallback. */
export function altFor(p: Product, i: number, t: TranslateFn) {
  const fallback = p.imageAlts?.[i] ?? `${p.name} — product photograph ${i + 1}`;
  return t(`product.${p.slug}.imageAlts.${i}`, fallback);
}

export const productSku = (p: Product) => p.slug.toUpperCase().slice(0, 8);

export const productGallery = (p: Product): ImageSource[] =>
  p.images && p.images.length > 0 ? p.images : [p.image];

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** `pairsWith` products, or the first three other products. */
export function relatedProducts(p: Product, all: Product[]): Product[] {
  if (p.pairsWith && p.pairsWith.length > 0) {
    return p.pairsWith
      .map((s) => all.find((x) => x.slug === s))
      .filter((x): x is Product => Boolean(x));
  }
  return all.filter((x) => x.slug !== p.slug).slice(0, 3);
}

/** Absolute URL for an image (optimised JPEG for bundled assets), for meta tags and JSON-LD. */
export async function absImageUrl(src: ImageSource): Promise<string> {
  if (!isImageMetadata(src)) return abs(src);
  const img = await getImage({ src, format: "jpg", width: Math.min(1200, src.width) });
  return abs(img.src);
}

/** Description trimmed to ~160 chars on a word boundary. */
export function metaDescription(text: string): string {
  const raw = text.replace(/\s+/g, " ").trim();
  if (raw.length <= 160) return raw;
  const cut = raw.slice(0, 157);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 100 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\-–—]$/, "")}…`;
}

// ── Delivery ETA ────────────────────────────────────────────────────────────

const ETA_BY_COUNTRY: Record<string, string> = {
  "United States": "5–8 business days",
  "United Kingdom": "4–7 business days",
  Eurozone: "4–7 business days",
  UAE: "3–5 business days",
  "Saudi Arabia": "3–5 business days",
  Qatar: "3–5 business days",
  Kuwait: "3–5 business days",
  Bahrain: "3–5 business days",
  Oman: "3–5 business days",
  India: "5–8 business days",
  Pakistan: "5–8 business days",
  Afghanistan: "6–10 business days",
  Australia: "6–9 business days",
  Canada: "6–9 business days",
  Singapore: "4–7 business days",
};

const ETA_KEY_BY_TEXT: Record<string, string> = {
  "5–8 business days": "product.route.eta5to8",
  "4–7 business days": "product.route.eta4to7",
  "3–5 business days": "product.route.eta3to5",
  "6–10 business days": "product.route.eta6to10",
  "6–9 business days": "product.route.eta6to9",
  "5–9 business days": "product.route.eta5to9",
};

export function etaFor(country?: string) {
  return (country && ETA_BY_COUNTRY[country]) || "5–9 business days";
}

export function translateEta(t: TranslateFn, days: string) {
  const key = ETA_KEY_BY_TEXT[days];
  return key ? t(key, days) : days;
}

export function formatEtaWindow(days: string, locale: string = "en") {
  const nums = days.match(/(\d+)\D+(\d+)/);
  if (!nums) return "";
  const now = new Date();
  const min = new Date(now);
  min.setDate(now.getDate() + Number(nums[1]));
  const max = new Date(now);
  max.setDate(now.getDate() + Number(nums[2]));
  const fmt = (d: Date) =>
    d.toLocaleDateString(locale === "ar" ? "ar-AE" : "en-US", { month: "short", day: "numeric" });
  return `${fmt(min)} – ${fmt(max)}`;
}

// ── Ratings & reviews ───────────────────────────────────────────────────────

/** Approximate star distribution (percent per 5★…1★) implied by an average rating. */
export function ratingDistribution(rating: number): { stars: number; pct: number }[] {
  const w5 = rating >= 4.85 ? 0.86 : rating >= 4.7 ? 0.79 : 0.72;
  const w4 = rating >= 4.85 ? 0.1 : rating >= 4.7 ? 0.15 : 0.2;
  const w3 = 1 - w5 - w4 - 0.02;
  return [w5, w4, w3, 0.012, 0.008].map((w, i) => ({
    stars: 5 - i,
    pct: Math.max(1, Math.round(w * 100)),
  }));
}

export const productStat = (slug: string) => productStats.find((s) => s.slug === slug);

/** Local reviews written for this product (matched through `productStats`). */
export function reviewsForProduct(slug: string): Review[] {
  const name = productStat(slug)?.name;
  return name ? reviews.filter((r) => r.product === name) : [];
}

/** Reviews embedded in the Product JSON-LD (same matching as the original site). */
export function jsonLdReviews(p: Product): Review[] {
  const short = p.name.replace(/®|Green Wealth\s*/g, "").trim();
  return reviews
    .filter(
      (r) =>
        r.product === short || (p.slug === "neo-hair-lotion" && r.product === "Neo Hair Lotion"),
    )
    .slice(0, 5);
}

/** A local review with every visible field translated. */
export function translateReview(r: Review, t: TranslateFn) {
  const idx = reviews.indexOf(r);
  return {
    id: `${r.name}-${idx}`,
    rating: r.rating,
    title: t(`review.${idx}.title`, r.title),
    body: t(`review.${idx}.body`, r.body),
    author: t(`review.person.${r.name}`, r.name),
    country: r.country ? t(`review.country.${r.country}`, r.country) : null,
  };
}

export type TranslatedReview = ReturnType<typeof translateReview>;

// ── Hero ledger ─────────────────────────────────────────────────────────────

export type LedgerData = {
  mechanism: string;
  /** Overview paragraph shown under the mechanism (desktop only), when distinct. */
  overview: string | null;
  benefits: string[];
  bioPathways: { role: string; actor: string; note: string }[];
  facts: string[];
  composition: { name: string; percent: string }[];
};

export function ledgerData(p: Product, t: TranslateFn): LedgerData {
  const tp = productT(t, p.slug);
  const parsedFromIngredients = (p.ingredients ?? [])
    .map((s) => {
      const m = s.match(/^(.+?)\s+(\d+(?:\.\d+)?%)\s*$/);
      return m ? { name: m[1].trim(), percent: m[2] } : null;
    })
    .filter((x): x is { name: string; percent: string } => Boolean(x));
  const parsedFromDetailed = (p.ingredientsDetailed ?? [])
    .map((i, idx) => ({ i, idx }))
    .filter(({ i }) => i.percentage)
    .map(({ i, idx }) => ({
      name: t(`product.${p.slug}.active.${idx}.name`, i.name),
      percent: i.percentage!,
    }));
  const composition = (parsedFromDetailed.length ? parsedFromDetailed : parsedFromIngredients)
    .filter((i) => !/^(di\s+)?water|aqua/i.test(i.name))
    .slice(0, 5);

  const mechanismFallback =
    (p.overview.split(/\.\s+/).find((s) => s.length > 40) ?? p.overview).replace(/\.$/, "") + ".";

  const bioPathways = (p.ingredientsDetailed ?? []).slice(0, 4).map((i, idx) => ({
    role: t(`product.${p.slug}.active.${idx}.role`, i.role ?? ""),
    actor: t(`product.${p.slug}.active.${idx}.name`, i.name),
    note: i.pathwayTags?.[0]
      ? t(
          `product.${p.slug}.active.${idx}.pathwayTags.0`,
          t(`ingdata.${i.pathwayTags[0]}`, i.pathwayTags[0]),
        )
      : t(`product.${p.slug}.active.${idx}.tagline`, i.tagline ?? ""),
  }));

  const facts = [
    ...(p.freeFrom ?? []).map(
      (f, fi) =>
        `${t(`product.${p.slug}.freeFrom.${fi}`, f)}-${t("product.route.freeSuffix", "free")}`,
    ),
    p.size ? t(`product.${p.slug}.size`, p.size) : "",
    t("product.route.batchVerified", "Batch verified"),
  ].filter(Boolean);

  return {
    mechanism: tp("mechanism", mechanismFallback),
    overview: p.overview && p.overview !== mechanismFallback ? tp("overview", p.overview) : null,
    benefits: (p.benefits ?? []).slice(0, 4).map((b, i) => tp(`benefits.${i}`, b)),
    bioPathways,
    facts: facts.slice(0, 8),
    composition,
  };
}
