/**
 * Builds the product summaries cart islands need in the browser (name, image,
 * tier prices in the active currency). Runs on the server; the result is passed
 * as a prop, so product data never ships inside the island bundle.
 */
import { productImageAlt } from "@/data/products";
import { getProducts } from "@/lib/api/catalog";
import type { CartCatalog, CartCatalogItem } from "@/lib/cart-types";
import { createT, type Locale, withLocalePrefix } from "@/lib/i18n";
import { islandImage } from "@/lib/images";
import { getTiers } from "@/lib/pricing";

export type { CartCatalog, CartCatalogItem };

export async function buildCartCatalog(locale: Locale, currency: string): Promise<CartCatalog> {
  const t = createT(locale);
  const products = await getProducts();
  const entries = await Promise.all(
    products.map(async (p): Promise<[string, CartCatalogItem]> => [
      p.slug,
      {
        slug: p.slug,
        name: t(`product.${p.slug}.name`, p.name),
        size: t(`product.${p.slug}.size`, p.size),
        href: withLocalePrefix(`/product/${p.slug}`, locale),
        image: await islandImage(p.image, { widths: [160, 320] }),
        imageAlt: productImageAlt(p, 0, t),
        tiers: getTiers(p.slug, currency),
      },
    ]),
  );
  return Object.fromEntries(entries);
}
