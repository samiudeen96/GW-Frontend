/** Ingredient glossary helpers shared by /ingredients and /ingredients/:slug. */
import { ingredientExtras } from "@/data/ingredient-extras";
import type { TranslateFn } from "@/lib/i18n/core";

/** Drop the ® mark and the house brand prefix from a product name. */
export const stripBrand = (s: string) =>
  s
    .replace(/®/g, "")
    .replace(/^Green Wealth\s+/i, "")
    .replace(/^Ghori\s+/i, "");

/** Plant family without its parenthetical note (`Arecaceae (palm family)` -> `Arecaceae`). */
export const familyOf = (slug: string) => ingredientExtras[slug]?.family?.split("(")[0].trim();

/** Translate an ingredient data string through the `ingdata.` namespace. */
export const ingT = (t: TranslateFn) => (v?: string) => (v ? t(`ingdata.${v}`, v) : "");

/** Curated theme buckets, matched against `ingredientExtras[slug].tags`. */
export const THEMES = [
  { id: "all", label: "All Botanicals", match: () => true },
  {
    id: "growth",
    label: "Growth & Density",
    match: (t: string[]) =>
      t.some((x) => /growth|regrowth|dht|circulation|density|anagen/i.test(x)),
  },
  {
    id: "strength",
    label: "Strand Strength",
    match: (t: string[]) =>
      t.some((x) => /silica|strength|keratin|structure|structural|shine/i.test(x)),
  },
  {
    id: "scalp",
    label: "Scalp & Barrier",
    match: (t: string[]) =>
      t.some((x) => /scalp|barrier|soothing|calm|cool|anti-inflammatory|balance/i.test(x)),
  },
  {
    id: "antiox",
    label: "Antioxidant & Repair",
    match: (t: string[]) =>
      t.some((x) => /antioxidant|repair|renew|cell|adaptogen|protect/i.test(x)),
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
