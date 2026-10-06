/**
 * Pricing helpers: tier lookup and money formatting. Pure functions, safe on the
 * server and in islands. Data lives in `@/data/pricing` until the API serves it.
 */
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  TIER_PRICES,
  type CurrencyMeta,
  type PriceTier,
} from "@/data/pricing";

export { CURRENCIES, DEFAULT_CURRENCY, type CurrencyMeta, type PriceTier };

export function isCurrency(code: string | undefined | null): code is string {
  return !!code && CURRENCIES.some((c) => c.code === code);
}

export function getCurrency(code: string): CurrencyMeta {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function getTiers(slug: string, currency: string): PriceTier[] {
  const bySlug = TIER_PRICES[slug];
  if (!bySlug) return [];
  return bySlug[currency] ?? bySlug[DEFAULT_CURRENCY] ?? [];
}

export function getBasePrice(slug: string, currency: string): number {
  return getTiers(slug, currency)[0]?.price ?? 0;
}

export function unitPriceForQty(slug: string, qty: number, currency: string): number {
  const tiers = getTiers(slug, currency);
  if (!tiers.length) return 0;
  let price = tiers[0].price;
  for (const t of tiers) {
    if (qty >= t.minQty) price = t.price;
  }
  return price;
}

export function lineTotal(slug: string, qty: number, currency: string): number {
  return unitPriceForQty(slug, qty, currency) * qty;
}

export function formatMoney(value: number, currency: string): string {
  const c = getCurrency(currency);
  const num = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: c.decimals,
    maximumFractionDigits: c.decimals,
  }).format(value);
  return c.position === "before" ? `${c.symbol}${num}` : `${num} ${c.symbol}`;
}
