/** Island-safe cart catalog types and price helper (no server imports). */
import type { IslandImage } from "@/lib/images";
import type { PriceTier } from "@/data/pricing";

export type CartCatalogItem = {
  slug: string;
  name: string;
  size: string;
  href: string;
  image: IslandImage;
  imageAlt: string;
  tiers: PriceTier[];
};

export type CartCatalog = Record<string, CartCatalogItem>;

/** Unit price for a quantity, from pre-resolved tiers. */
export function tierUnitPrice(tiers: PriceTier[], qty: number): number {
  let price = tiers[0]?.price ?? 0;
  for (const t of tiers) if (qty >= t.minQty) price = t.price;
  return price;
}
