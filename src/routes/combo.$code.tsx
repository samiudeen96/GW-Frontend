import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { COMBOS, comboPricing, comboProducts, getCombo, type ComboLine } from "@/lib/combos";
import { useCart } from "@/lib/cart";
import { useRegion, formatMoney } from "@/lib/pricing";
import { ProductImage } from "@/components/site/ProductImage";
import { PageHeader } from "@/components/site/Page";
import { abs, hreflangLinks, canonicalFor, localeOf } from "@/lib/seo";
import { useT } from "@/lib/i18n";


// Locale-aware combo copy helpers (Arabic strings live in src/lib/i18n/ar/shop.ts).
import { AR_DICTIONARY } from "@/lib/i18n/ar";
function arComboName(code: string, fallback: string) {
  return AR_DICTIONARY[`shop.combo.${code}.name`] ?? fallback;
}
function arComboDescription(code: string, fallback: string) {
  return AR_DICTIONARY[`shop.combo.${code}.description`] ?? fallback;
}

export const Route = createFileRoute("/combo/$code")({
  loader: ({ params }) => {
    const combo = getCombo(params.code);
    if (!combo) throw notFound();
    return { combo };
  },
  head: (ctx) => {
    const combo = ctx.loaderData?.combo;
    const locale = localeOf(ctx);
    if (!combo) {
      return {
        meta: [
          { title: locale === "ar" ? "المجموعة غير موجودة — جرين ولث" : "Combo not found — Green Wealth" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const path = `/combo/${combo.code.toLowerCase()}`;
    const url = canonicalFor(path, locale);
    const lines = comboProducts(combo);
    const images = lines.map(({ product }) => abs(product.image));
    const comboName = locale === "ar" ? arComboName(combo.code, combo.name) : combo.name;
    const comboDescription = locale === "ar" ? arComboDescription(combo.code, combo.description) : combo.description;
    const shareTitle = locale === "ar" ? `${comboName} — جرين ولث` : `${combo.name} — Green Wealth`;
    const usd = comboPricing(combo, "USD");
    const price = usd.total.toFixed(2);

    return {
      meta: [
        { title: shareTitle },
        { name: "description", content: comboDescription },
        { property: "og:title", content: shareTitle },
        { property: "og:description", content: comboDescription },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        ...(images[0] ? [{ property: "og:image", content: images[0] }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: shareTitle },
        { name: "twitter:description", content: comboDescription },
        ...(images[0] ? [{ name: "twitter:image", content: images[0] }] : []),
      ],
      links: [{ rel: "canonical", href: url }, ...hreflangLinks(path)],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: combo.name,
            description: combo.description,
            sku: combo.code,
            brand: { "@type": "Brand", name: "Green Wealth" },
            image: images,
            offers: {
              "@type": "AggregateOffer",
              url,
              priceCurrency: "USD",
              lowPrice: price,
              highPrice: price,
              offerCount: lines.length,
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
              { "@type": "ListItem", position: 2, name: "Shop", item: abs("/shop") },
              { "@type": "ListItem", position: 3, name: combo.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: ComboPage,
});

function ComboPage() {
  const { combo } = Route.useLoaderData();
  const { currency } = useRegion();
  const { add } = useCart();
  const t = useT();
  const comboName = t(`shop.combo.${combo.code}.name`, combo.name);
  const comboPurpose = t(`shop.combo.${combo.code}.purpose`, combo.purpose);
  const comboDescription = t(`shop.combo.${combo.code}.description`, combo.description);
  const { total, reference, savings, units } = comboPricing(combo, currency);
  const lines = comboProducts(combo);

  return (
    <>
      <PageHeader
        eyebrow={`${t("shop.combo.curated", "Curated Combo")} · ${t(`shop.combo.${combo.code}.step`, combo.step)}`}
        title={comboName}
        intro={comboDescription}
      />

      <section className="container-editorial mt-10 md:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-px bg-ink/10 border hairline">
          <div className="bg-paper p-6 md:p-10">
            <div className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-moss mb-4">
              {t(`shop.combo.${combo.code}.step`, combo.step)}
            </div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-2xl md:text-3xl text-forest leading-tight">
                {comboName}
              </h2>
              {combo.featured && (
                <span className="text-[9px] uppercase tracking-[0.24em] font-mono text-forest border border-gold px-2 py-1 whitespace-nowrap flex-shrink-0">
                  {t("shop.combo.mostChosen", "Most chosen")}
                </span>
              )}
            </div>
            <p className="mt-5 text-[14px] leading-relaxed text-forest/75 max-w-2xl">
              {comboPurpose}
            </p>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-ink/10 border hairline">
              {lines.map(({ product, qty }) => (
                <Link
                  key={product.slug}
                  to="/product/$slug"
                  params={{ slug: product.slug }}
                  className="relative bg-white aspect-square group"
                >
                  <ProductImage
                    src={product.image}
                    alt={product.imageAlts?.[0] ?? `${product.name} — product photograph`}
                    sizes="(min-width: 1024px) 220px, 50vw"
                    className="w-full h-full object-contain p-3 transition-transform group-hover:scale-[1.02]"
                  />
                  {qty > 1 && (
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono text-forest bg-paper border hairline px-1.5">
                      ×{qty}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <ul className="mt-8 space-y-2 text-[13px] font-mono text-forest/70">
              {lines.map(({ product, qty }) => (
                <li key={product.slug} className="flex justify-between gap-3 border-b hairline pb-2">
                  <span>
                    {qty > 1 ? `${qty} × ` : ""}
                    {t(`product.${product.slug}.name`, product.name)}
                  </span>
                  <Link
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    className="text-moss underline underline-offset-2 whitespace-nowrap"
                  >
                    {t("shop.combo.viewProduct", "View product")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-ivory p-6 md:p-10 border-t lg:border-t-0 lg:border-l hairline">
            <div className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-moss">
              {units} {units === 1 ? t("shop.combo.unit", "unit") : t("shop.combo.units", "units")}
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-serif text-3xl md:text-4xl text-forest">
                {formatMoney(total, currency)}
              </span>
              {savings > 0 && (
                <span className="text-[15px] font-mono text-forest/45 line-through">
                  {formatMoney(reference, currency)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <div className="mt-2 text-[11px] uppercase tracking-[0.24em] font-mono text-moss">
                {t("shop.combo.saveTogether", "Save")} {formatMoney(savings, currency)} {t("shop.combo.whenBoughtTogether", "when bought together")}
              </div>
            )}

            <button
              type="button"
              onClick={() => combo.lines.forEach((l: ComboLine) => add(l.slug, l.qty))}
              className="mt-8 w-full bg-forest text-paper text-[11px] uppercase tracking-[0.28em] font-mono py-4 hover:bg-moss transition-colors"
            >
              {t("shop.combo.addComboToBag", "Add combo to bag")}
            </button>

            <div className="mt-6 space-y-2 text-[11px] font-mono text-forest/60">
              <div className="flex justify-between">
                <span>{t("shop.trust.authenticity", "Authenticity")}</span>
                <span className="text-forest">{t("shop.trust.scratchVerified", "Scratch-code verified")}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("shop.combo.shipping", "Shipping")}</span>
                <span className="text-forest">{t("shop.combo.worldwide", "Worldwide")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-editorial mt-10 md:mt-16 pb-20">
        <div className="border hairline bg-paper p-6 md:p-8">
          <h2 className="font-serif text-xl md:text-2xl text-forest">{t("shop.combo.moreCuratedSets", "More curated sets")}</h2>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 border hairline">
            {COMBOS.filter((c) => c.code !== combo.code).map((c) => (
              <Link
                key={c.code}
                to="/combo/$code"
                params={{ code: c.code.toLowerCase() }}
                className="bg-paper p-5 hover:bg-ivory/50 transition-colors block"
              >
                <div className="text-[9px] uppercase tracking-[0.28em] font-mono text-moss">
                  {t(`shop.combo.${c.code}.step`, c.step)}
                </div>
                <div className="font-serif text-[15px] text-forest mt-1 leading-snug">
                  {t(`shop.combo.${c.code}.name`, c.name)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
