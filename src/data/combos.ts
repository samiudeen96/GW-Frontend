/**
 * Module: Product Combos
 *
 * Purpose: curated multi-product sets shown on /shop. Pure data + pricing
 * helpers so presentation components stay logic-free.
 * Users: storefront shoppers.
 * Integration points: pricing tiers (src/lib/pricing.tsx), cart (src/lib/cart.tsx).
 */

import { getBasePrice, unitPriceForQty } from "@/lib/pricing";
import { getProduct, type Product } from "@/data/products";

export type ComboLine = { slug: string; qty: number };

export type Combo = {
  code: string;
  name: string;
  /** Short marketing copy used in tiles. */
  purpose: string;
  /** SEO/meta description for the dedicated combo page. */
  description: string;
  step: string;
  lines: ComboLine[];
  featured?: boolean;
};

export const COMBOS: Combo[] = [
  {
    code: "CORE-DUO",
    name: "Neo Hair Lotion & Neo Hair Shampoo Combo",
    step: "Cleanse + Treat",
    purpose:
      "Neo Hair Shampoo to prepare the scalp, Neo Hair Lotion to treat it. The shortest complete routine.",
    description:
      "Buy the Neo Hair Lotion & Neo Hair Shampoo combo for a complete cleanse-and-treat routine. Authentic, scratch-code verified products with worldwide delivery.",
    lines: [
      { slug: "neo-hair-shampoo", qty: 1 },
      { slug: "neo-hair-lotion", qty: 1 },
    ],
  },
  {
    code: "REGROWTH-PROTOCOL",
    name: "Hair Regrowth Kit — Shampoo, Rosemary Oil & Neo Hair Lotion",
    step: "Cleanse + Prime + Treat",
    purpose:
      "Adds Ghori® Rosemary Mint & Biotin Oil between cleansing and treatment for circulation and softness.",
    description:
      "The Hair Regrowth Kit combines Neo Hair Shampoo, Ghori Rosemary Mint & Biotin Oil and Neo Hair Lotion for a full cleanse-prime-treat protocol.",
    featured: true,
    lines: [
      { slug: "neo-hair-shampoo", qty: 1 },
      { slug: "ghori-rosemary-oil", qty: 1 },
      { slug: "neo-hair-lotion", qty: 1 },
    ],
  },
  {
    code: "FULL-RITUAL",
    name: "Complete Hair Care Set — Shampoo, Oil, Lotion & Dermaroller",
    step: "All four steps",
    purpose:
      "Every essential in the collection — cleanse, prime, treat and stimulate, in one order.",
    description:
      "The Complete Hair Care Set includes Neo Hair Shampoo, Ghori Rosemary Oil, Neo Hair Lotion and the Dermaroller for the full cleanse-prime-treat-stimulate ritual.",
    lines: [
      { slug: "neo-hair-shampoo", qty: 1 },
      { slug: "ghori-rosemary-oil", qty: 1 },
      { slug: "neo-hair-lotion", qty: 1 },
      { slug: "ghori-dermaroller", qty: 1 },
    ],
  },
  {
    code: "90-DAY-LOTION",
    name: "Neo Hair Lotion 3-Bottle Pack — 90-Day Supply",
    step: "Treat · 3 bottles",
    purpose:
      "Three bottles of Neo Hair Lotion at the multi-unit rate — one full observation cycle without reordering.",
    description:
      "Stock up with the Neo Hair Lotion 3-bottle pack. One 90-day supply at the multi-unit rate, shipped with authenticity verification.",
    lines: [{ slug: "neo-hair-lotion", qty: 3 }],
  },
  {
    code: "STIMULATION-KIT",
    name: "Neo Hair Lotion & Dermaroller Kit",
    step: "Treat + Stimulate",
    purpose:
      "Neo Hair Lotion with the Ghori® Dermaroller for improved delivery into the scalp surface.",
    description:
      "The Neo Hair Lotion & Dermaroller kit pairs the treatment with scalp stimulation for improved absorption. Verified authentic with scratch codes.",
    lines: [
      { slug: "neo-hair-lotion", qty: 1 },
      { slug: "ghori-dermaroller", qty: 1 },
    ],
  },
  {
    code: "SCALP-REVIVAL",
    name: "Rosemary Mint & Biotin Oil with Dermaroller — Scalp Care Set",
    step: "Prime + Stimulate",
    purpose:
      "Rosemary Mint & Biotin Oil plus the Dermaroller — a lighter set for scalp condition and shine.",
    description:
      "The Scalp Revival set pairs Ghori Rosemary Mint & Biotin Oil with the Dermaroller to prime and stimulate the scalp for healthier condition and shine.",
    lines: [
      { slug: "ghori-rosemary-oil", qty: 1 },
      { slug: "ghori-dermaroller", qty: 1 },
    ],
  },
];

export type ComboPricing = {
  total: number;
  reference: number;
  savings: number;
  units: number;
};

export function comboPricing(combo: Combo, currency: string): ComboPricing {
  let total = 0;
  let reference = 0;
  let units = 0;
  for (const line of combo.lines) {
    total += unitPriceForQty(line.slug, line.qty, currency) * line.qty;
    reference += getBasePrice(line.slug, currency) * line.qty;
    units += line.qty;
  }
  return { total, reference, savings: Math.max(0, reference - total), units };
}

export function comboProducts(combo: Combo): Array<{ product: Product; qty: number }> {
  return combo.lines
    .map((l) => ({ product: getProduct(l.slug)!, qty: l.qty }))
    .filter((x) => Boolean(x.product));
}

/** Find a combo by its URL-friendly code. */
export function getCombo(code: string): Combo | undefined {
  return COMBOS.find((c) => c.code.toLowerCase() === code.toLowerCase());
}
