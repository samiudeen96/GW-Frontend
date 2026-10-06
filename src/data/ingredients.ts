import type { IngredientDetail } from "@/data/products";
import { products } from "@/data/products";

export type IngredientEntry = IngredientDetail & {
  slug: string;
  productSlugs: string[];
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Deduplicate ingredients across all products; track which products use each.
const map = new Map<string, IngredientEntry>();
for (const p of products) {
  for (const ing of p.ingredientsDetailed ?? []) {
    const slug = slugify(ing.name);
    if (!slug) continue;
    const existing = map.get(slug);
    if (existing) {
      if (!existing.productSlugs.includes(p.slug)) existing.productSlugs.push(p.slug);
    } else {
      map.set(slug, { ...ing, slug, productSlugs: [p.slug] });
    }
  }
}

export const ingredients: IngredientEntry[] = Array.from(map.values()).sort((a, b) =>
  a.name.localeCompare(b.name),
);

export const ingredientBySlug = (slug: string) => ingredients.find((i) => i.slug === slug);
