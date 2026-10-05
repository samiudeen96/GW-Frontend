/**
 * Catalog reads used by pages (server side).
 *
 * TODO(api): each function reads local content from `@/data` today. When the
 * backend is ready, replace the body with a `request(API_URL, "/...")` call and
 * validate the response; callers already treat these as async.
 */
import { COMBOS, type Combo } from "@/data/combos";
import { countries, type CountryLanding } from "@/data/countries";
import { ingredients, type IngredientEntry } from "@/data/ingredients";
import { posts, type BlogPost } from "@/data/blog-posts";
import { products, type Product } from "@/data/products";
import { reviews, stats, distribution, productStats, type Review } from "@/data/reviews";

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getCombos(): Promise<Combo[]> {
  return COMBOS;
}

export async function getComboByCode(code: string): Promise<Combo | undefined> {
  return COMBOS.find((c) => c.code.toLowerCase() === code.toLowerCase());
}

export async function getReviews(): Promise<Review[]> {
  return reviews;
}

export async function getReviewStats() {
  return { stats, distribution, productStats };
}

export async function getPosts(): Promise<BlogPost[]> {
  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return posts.find((p) => p.slug === slug);
}

export async function getIngredients(): Promise<IngredientEntry[]> {
  return ingredients;
}

export async function getIngredientBySlug(slug: string): Promise<IngredientEntry | undefined> {
  return ingredients.find((i) => i.slug === slug);
}

export async function getCountryLandings(): Promise<CountryLanding[]> {
  return countries;
}

export async function getCountryLandingBySlug(slug: string): Promise<CountryLanding | undefined> {
  return countries.find((c) => c.slug === slug);
}
