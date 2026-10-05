import { abs, breadcrumbLd, canonicalFor, hreflangLinks, localeOf } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Page";
import { reviews, stats, distribution, productStats } from "@/lib/reviews";
import { useT } from "@/lib/i18n";
import { products } from "@/lib/products";
import { tStatic } from "@/lib/i18n/static";

const distTotal = distribution.reduce((a, b) => a + b.count, 0);
export { productStats };

function Stars({ n, size = "sm" }: { n: number; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "text-lg" : size === "md" ? "text-sm" : "text-[11px]";
  return (
    <div className={`inline-flex gap-0.5 tabular-nums ${sz}`} aria-label={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? "text-gold" : "text-ink/15"}>★</span>
      ))}
    </div>
  );
}

export const Route = createFileRoute("/reviews")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const ts = tStatic(locale);
    return {
    meta: [
      { title: ts("reviews.head.title", "Neo Hair Lotion Reviews — 430,692 Verified Ratings | Green Wealth") },
      { name: "description", content: ts("reviews.head.desc", "Read 1,407 verified customer reviews of Neo Hair Lotion, Shampoo, Rosemary Oil, and Dermaroller. 4.7/5 rating across 90+ countries. Real photos, real results.") },
      { property: "og:title", content: ts("reviews.head.ogtitle", "Real Results From Real People — 4.7/5 across 430,692 ratings") },
      { property: "og:description", content: ts("reviews.head.ogdesc", "Verified testimonials from Green Wealth customers worldwide.") },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalFor("/reviews", locale) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonicalFor("/reviews", locale) }, ...hreflangLinks("/reviews")],
    scripts: [
      breadcrumbLd([
        { name: ts("reviews.crumb.home", "Home"), path: "/" },
        { name: ts("reviews.crumb.self", "Reviews"), path: "/reviews" },
      ]),
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Green Wealth Neo Hair Lotion",
          brand: { "@type": "Brand", name: "Green Wealth" },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: stats.rating.toFixed(1),
            reviewCount: stats.count,
            bestRating: "5",
            worstRating: "1",
          },
        }),
      },
    ],
  };
  },
  component: ReviewsPage,
});

function ReviewsPage() {
  const t = useT();
  return (
    <>
      <PageHeader
        eyebrow={t("reviews.eyebrow", "Reviews · Verified Results")}
        title={t("reviews.title", "Real results from real people.")}
        intro={t("reviews.intro", "{customers} customers across {countries}+ countries. Every review is verified — every result documented.").replace("{customers}", String(stats.customers)).replace("{countries}", String(stats.countries))}
      />

      {/* Hero rating panel */}
      <section className="border-y hairline bg-ivory">
        <div className="container-editorial py-10 md:py-14 grid md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-center">
          {/* Big rating */}
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r hairline pb-8 md:pb-0 md:pr-14">
            <div className="eyebrow mb-3">{t("reviews.overall-rating", "Overall Rating")}</div>
            <div className="font-serif text-7xl md:text-8xl text-forest leading-none">{stats.rating}</div>
            <div className="mt-3 mb-2"><Stars n={Math.round(stats.rating)} size="lg" /></div>
            <div className="text-xs text-muted-foreground tabular-nums">
              {t("reviews.based-on", "Based on")} {stats.count.toLocaleString()} {t("reviews.ratings", "ratings")}
            </div>
          </div>

          {/* Distribution */}
          <div>
            <div className="eyebrow mb-4">{t("reviews.distribution", "Rating Distribution")}</div>
            <div className="space-y-2">
              {distribution.map((d) => {
                const pct = distTotal > 0 ? (d.count / distTotal) * 100 : 0;
                return (
                  <div key={d.stars} className="flex items-center gap-3 text-xs">
                    <span className="w-6 tabular-nums text-ink/70">{d.stars}★</span>
                    <div className="flex-1 h-2 bg-ink/5 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-forest" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-16 text-right tabular-nums text-ink/60">{d.count.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-px bg-ink/10 border hairline">
              {[
                { k: t("reviews.customers", "Customers"), v: stats.customers },
                { k: t("reviews.countries", "Countries"), v: `${stats.countries}+` },
                { k: t("reviews.verified", "Verified"), v: `${stats.verified}%` },
              ].map((s) => (
                <div key={s.k} className="bg-paper py-4 text-center">
                  <div className="font-serif text-xl md:text-2xl text-forest">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{s.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Per-product ratings */}
      <section className="container-editorial py-14 md:py-20">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="eyebrow mb-2">{t("reviews.by-product", "Ratings By Product")}</div>
            <h2 className="font-serif text-3xl md:text-4xl text-ink">{t("reviews.system-rated", "The system, rated.")}</h2>
          </div>
          <div className="text-xs text-muted-foreground tabular-nums">
            {productStats.reduce((a, b) => a + b.count, 0).toLocaleString()} {t("reviews.ratings-total", "ratings total")}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/10 border hairline">
          {productStats.map((p) => (
            <Link
              key={p.slug}
              to="/product/$slug"
              params={{ slug: p.slug }}
              className="bg-paper p-5 md:p-6 hover:bg-ivory transition-colors group"
            >
              <div className="font-serif text-base md:text-lg text-ink mb-3 leading-tight min-h-[3rem]">{t(`product.${p.slug}.name`, p.name)}</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-serif text-3xl text-forest tabular-nums">{p.rating.toFixed(1)}</span>
                <Stars n={Math.round(p.rating)} />
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">{p.count.toLocaleString()} {t("reviews.ratings", "ratings")}</div>
              <div className="mt-4 text-[10px] uppercase tracking-[0.2em] text-forest opacity-0 group-hover:opacity-100 transition-opacity">
                {t("reviews.shop", "Shop →")}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Review grid — with photos */}
      <section className="border-t hairline bg-ivory">
        <div className="container-editorial py-14 md:py-20">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="eyebrow mb-2">{t("reviews.verified-stories", "Verified Stories")}</div>
              <h2 className="font-serif text-3xl md:text-4xl text-ink">{t("reviews.read-receipts", "Read the receipts.")}</h2>
            </div>
            <div className="text-xs text-muted-foreground">
              {t("reviews.showing", "Showing")} {reviews.length} {t("reviews.of", "of")} {stats.reviews.toLocaleString()}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 border hairline">
            {reviews.map((r, i) => (
              <article key={r.name + r.title} className="bg-paper flex flex-col">
                {r.image && (
                  <div className="aspect-[4/3] overflow-hidden bg-ivory border-b hairline">
                    <img
                      src={r.image}
                      alt={`${t("img.reviewAltPrefix", "Verified customer photo review by")} ${r.name} ${t("img.reviewAltSuffix", "for Green Wealth Neo Hair products")}`}
                      title={`${t("img.reviewTitle", "Verified review")} — ${r.name}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <Stars n={r.rating} size="md" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-forest border hairline px-2 py-1">
                      {t("reviews.verified", "Verified")}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-ink leading-tight mb-2">{t(`review.${i}.title`, r.title)}</h3>
                  <p className="text-sm text-ink/75 leading-relaxed mb-5 flex-1">“{t(`review.${i}.body`, r.body)}”</p>
                  <div className="border-t hairline pt-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-ink">{t(`review.person.${r.name}`, r.name)}</div>
                      {r.country && <div className="text-xs text-muted-foreground">{t(`review.country.${r.country}`, r.country)}</div>}
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.15em] text-forest">{(() => { const sp = products.find((x) => x.name.includes(r.product) || r.product.includes(x.name)); return sp ? t(`product.${sp.slug}.name`, sp.name) : r.product; })()}</div>
                      {r.helpful ? (
                        <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                          {r.helpful} {t("reviews.found-helpful", "found helpful")}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust + Conversion CTA */}
      <section className="container-editorial py-14 md:py-20 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <div className="eyebrow mb-3">{t("reviews.only-real", "Only Real Reviews")}</div>
          <h2 className="font-serif text-3xl md:text-4xl mb-4 text-ink leading-tight">
            {t("reviews.verified-purchase-heading", "Every review here comes from a verified purchase.")}
          </h2>
          <p className="text-ink/75 leading-relaxed mb-6">
            {t("reviews.verified-purchase-desc", "We publish reviews from customers who bought directly through greenwealth.com or our authorised distributors. No paid placements, no anonymous fabrications, no filtered ratings. When the protocol doesn't work for someone, that review is here too.")}
          </p>
          <ul className="space-y-3 text-sm text-ink/80">
            <li className="flex gap-3"><span className="text-forest">—</span> {t("reviews.trust.1", "100% verified purchases, no incentivised reviews.")}</li>
            <li className="flex gap-3"><span className="text-forest">—</span> {t("reviews.trust.2", "Every unit carries a verifiable scratch code.")}</li>
            <li className="flex gap-3"><span className="text-forest">—</span> {t("reviews.trust.3", "Direct-from-Green-Wealth shipping across 90+ countries.")}</li>
          </ul>
          <Link to="/verify" className="mt-6 inline-flex items-center gap-2 text-sm underline underline-offset-4 hover:text-forest">
            {t("reviews.verify-bottle", "Verify your own bottle →")}
          </Link>
        </div>
        <div className="border hairline p-6 md:p-8 bg-ivory">
          <div className="eyebrow mb-3">{t("reviews.start-story", "Start your story")}</div>
          <h3 className="font-serif text-2xl text-ink mb-3">{t("reviews.begin-protocol", "Begin the 120-day protocol.")}</h3>
          <p className="text-sm text-ink/75 mb-6 leading-relaxed">
            {t("reviews.order-directly", "Order directly from Green Wealth — every bottle carries a scratch-off authenticity code you can verify online before your first use.")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/product/$slug" params={{ slug: "neo-hair-lotion" }} className="bg-forest text-paper px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ink transition-colors">
              {t("reviews.shop-lotion", "Shop Neo Hair Lotion")}
            </Link>
            <Link to="/how-to-use" className="border hairline px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-paper transition-colors">
              {t("reviews.read-protocol", "Read the protocol")}
            </Link>
          </div>
          <div className="mt-6 pt-6 border-t hairline grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-serif text-xl text-forest">4.7★</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1">{t("reviews.rating", "Rating")}</div>
            </div>
            <div>
              <div className="font-serif text-xl text-forest">2M+</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1">{t("reviews.customers", "Customers")}</div>
            </div>
            <div>
              <div className="font-serif text-xl text-forest">90+</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1">{t("reviews.countries", "Countries")}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
