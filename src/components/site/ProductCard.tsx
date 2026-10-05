import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { useRegion, getBasePrice, formatMoney } from "@/lib/pricing";
import { productStats } from "@/lib/reviews";
import { ProductImage } from "@/components/site/ProductImage";
import { useT } from "@/lib/i18n";

export function ProductCard({ product }: { product: Product }) {
  const t = useT();
  const { currency } = useRegion();
  const price = getBasePrice(product.slug, currency);
  const stats = productStats.find((s) => s.slug === product.slug);
  const filledStars = stats ? Math.round(stats.rating) : 0;

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block bg-paper border border-ink/10"
    >
      <div className="aspect-square bg-white overflow-hidden">
        <ProductImage
          src={product.image}
          alt={t(`product.${product.slug}.imageAlts.0`, product.imageAlts?.[0] ?? `${product.name} — ${product.size} product photograph`)}
          sizes="(min-width: 1024px) 320px, 50vw"
          className="w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="pt-2 md:pt-3 pb-2 px-[3px]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="eyebrow text-[10px] text-muted-foreground mb-0.5">
              {t(`product.category.${product.category}`, product.category)}
            </div>
            <div className="text-sm font-medium leading-snug text-ink">
              {t(`product.${product.slug}.name`, product.name)}
            </div>
          </div>
          <div className="text-sm font-semibold text-ink whitespace-nowrap mt-3">
            {formatMoney(price, currency)}
          </div>
        </div>
        {stats && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < filledStars
                      ? "fill-gold text-gold"
                      : "fill-paper text-ink/20"
                  }`}
                />
              ))}
            </span>
            <span className="font-semibold text-ink">
              {stats.rating.toFixed(1)}
            </span>
            <span>·</span>
            <span>{stats.count.toLocaleString()} {t("shop.reviews", "reviews")}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
