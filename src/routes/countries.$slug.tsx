import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Page";
import { countryBySlug, countries } from "@/lib/countries";
import { products, productImageAlt, productImageTitle } from "@/lib/products";
import { formatMoney, getBasePrice } from "@/lib/pricing";
import { abs, canonicalFor, hreflangLinks, breadcrumbLd, localeOf } from "@/lib/seo";
import { lookupShipping, shippingCopy } from "@/lib/shipping";
import { useT } from "@/lib/i18n";
import { arMisc } from "@/lib/i18n/ar/misc";


export const Route = createFileRoute("/countries/$slug")({
  loader: ({ params }) => {
    const country = countryBySlug(params.slug);
    if (!country) throw notFound();
    return { country };
  },
  head: (ctx) => {
    const { loaderData, params } = ctx;
    const locale = localeOf(ctx);
    if (!loaderData) {
      const title = locale === "ar" ? "المنطقة غير موجودة — جرين ولث" : "Region not found — Green Wealth";
      return { meta: [{ title }, { name: "robots", content: "noindex" }] };
    }
    const c = loaderData.country;
    const name = locale === "ar" ? tCountry(locale, c.slug, "name", c.name) : c.name;
    const shippingNote = locale === "ar" ? tCountry(locale, c.slug, "shippingNote", c.shippingNote) : c.shippingNote;
    const url = canonicalFor(`/countries/${c.slug}`, locale);
    const title = locale === "ar"
      ? `جرين ولث في ${name} — لوشن نيو للشعر والعناية النباتية بالشعر`
      : `Green Wealth ${c.name} — Neo Hair Lotion & Botanical Care`;
    const desc = locale === "ar"
      ? `تسوّق لوشن نيو للشعر® الأصلي من جرين ولث في ${name}. ${shippingNote} الأسعار بعملة ${c.currency}.`
      : `Buy authentic Green Wealth Neo Hair Lotion® in ${c.name}. ${c.shippingNote} Prices in ${c.currency}.`;
    const breadcrumbHome = locale === "ar" ? "الرئيسية" : "Home";
    const breadcrumbRegions = locale === "ar" ? "المناطق" : "Regions";
    const faqs = c.faqs.map((f, i) => ({
      q: locale === "ar" ? tCountry(locale, c.slug, `faq.${i}.q`, f.q) : f.q,
      a: locale === "ar" ? tCountry(locale, c.slug, `faq.${i}.a`, f.a) : f.a,
    }));
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }, ...hreflangLinks(`/countries/${params.slug}`)],
      scripts: [
        breadcrumbLd([
          { name: breadcrumbHome, path: "/" },
          { name: breadcrumbRegions, path: "/" },
          { name, path: `/countries/${c.slug}` },
        ]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  component: CountryPage,
  notFoundComponent: NotFoundCountry,
});

function NotFoundCountry() {
  const t = useT();
  return (
    <div className="container-editorial py-24 text-center">
      <h1 className="font-serif text-3xl text-forest">{t("misc.countries.notFound.title", "Region not available")}</h1>
      <Link to="/shop" className="mt-6 inline-block text-[11px] uppercase tracking-[0.24em] font-mono text-forest border-b border-forest/40">
        {t("misc.countries.shopAll", "Shop all")}
      </Link>
    </div>
  );
}

// Simple lookup helper mirroring useT's key-based fallback, usable outside components (head()).
function tCountry(_locale: string, slug: string, field: string, fallback: string): string {
  return arMisc[`misc.countries.${slug}.${field}`] ?? fallback;
}

const SLUG_TO_CODE: Record<string, string> = {
  uae: "AE",
  "saudi-arabia": "SA",
  qatar: "QA",
  kuwait: "KW",
  "united-kingdom": "GB",
  india: "IN",
};

function CountryPage() {
  const t = useT();
  const { country: c } = Route.useLoaderData();
  const currency = c.currency;
  const ship = lookupShipping(SLUG_TO_CODE[c.slug]);

  const name = t(`misc.countries.${c.slug}.name`, c.name);
  const heroLine = t(`misc.countries.${c.slug}.heroLine`, c.heroLine);
  const shippingNote = t(`misc.countries.${c.slug}.shippingNote`, c.shippingNote);
  const cities = c.cities.map((city: string, i: number) => t(`misc.countries.${c.slug}.city.${i}`, city));
  const testimonials = c.testimonials.map((tm: { name: string; city: string; body: string }, i: number) => ({
    name: t(`misc.countries.${c.slug}.testimonial.${i}.name`, tm.name),
    city: t(`misc.countries.${c.slug}.testimonial.${i}.city`, tm.city),
    body: t(`misc.countries.${c.slug}.testimonial.${i}.body`, tm.body),
  }));
  const faqs = c.faqs.map((f: { q: string; a: string }, i: number) => ({
    q: t(`misc.countries.${c.slug}.faq.${i}.q`, f.q),
    a: t(`misc.countries.${c.slug}.faq.${i}.a`, f.a),
  }));

  return (
    <>
      <div className="border-b hairline bg-paper">
        <div className="container-editorial py-6">
          <nav className="text-[10px] uppercase tracking-[0.24em] font-mono text-forest/60">
            <Link to="/" className="hover:text-forest">{t("misc.countries.breadcrumbHome", "Home")}</Link>
            <span className="mx-2">/</span>
            <span className="text-forest">{name}</span>
          </nav>
        </div>
      </div>

      <PageHeader
        eyebrow={`${t("misc.countries.deliveringTo", "Delivering to")} ${name}`}
        title={`${t("misc.countries.heroPrefix", "Green Wealth in")} ${name}`}
        intro={heroLine}
      />

      <div className="container-editorial py-8 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/10 border hairline">
          {[
            { k: t("misc.countries.currencyLabel", "Currency"), v: c.currency },
            { k: t("misc.countries.deliveryLabel", "Delivery"), v: ship.days },
            { k: t("misc.countries.shippingLabel", "Shipping"), v: `${ship.symbol}${ship.fee}` },
            {
              k: t("misc.countries.freeOverLabel", "Free over"),
              v: ship.freeOver === null ? t("misc.countries.flatRate", "Flat rate") : `${ship.symbol}${ship.freeOver}`,
            },
          ].map((s) => (
            <div key={s.k} className="bg-paper p-4 md:p-6">
              <span className="text-[10px] uppercase tracking-[0.28em] font-mono text-moss">{s.k}</span>
              <p className="font-serif text-xl md:text-2xl text-forest mt-2">{s.v}</p>
            </div>
          ))}
        </div>


        <section className="mt-14">
          <h2 className="font-serif text-2xl md:text-3xl text-forest">{t("misc.countries.shopInPrefix", "Shop in")} {c.currency}</h2>
          <p className="text-[13px] text-forest/60 mt-2 font-mono uppercase tracking-[0.2em]">
            {shippingNote} · {shippingCopy(ship)}

          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/10 border hairline">
            {products.map((p) => (
              <Link key={p.slug} to="/product/$slug" params={{ slug: p.slug }} className="group block bg-paper p-5 hover:bg-ivory/60 transition-colors">
                <div className="aspect-square bg-ivory border hairline overflow-hidden">
                  <img src={p.image} alt={productImageAlt(p, 0, t)} title={productImageTitle(p, t)} loading="lazy" className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="mt-4">
                  <span className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-moss">{t(`product.category.${p.category}`, p.category)}</span>
                  <h3 className="font-serif text-lg text-forest mt-1 leading-tight">{t(`product.${p.slug}.name`, p.name)}</h3>
                  <p className="font-mono text-[12px] text-forest tabular-nums mt-2">
                    {formatMoney(getBasePrice(p.slug, currency), currency)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-serif text-2xl md:text-3xl text-forest">{t("misc.countries.citiesPrefix", "Cities we serve in")} {name}</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {cities.map((city: string) => (
              <span key={city} className="text-[11px] uppercase tracking-[0.22em] font-mono text-forest border hairline px-3 py-1.5 bg-paper">
                {city}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-serif text-2xl md:text-3xl text-forest">{t("misc.countries.customersPrefix", "Customers in")} {name}</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/10 border hairline">
            {testimonials.map((tm: { name: string; city: string; body: string }, i: number) => (
              <blockquote key={i} className="bg-paper p-6">
                <p className="font-serif text-forest text-lg leading-snug">“{tm.body}”</p>
                <footer className="mt-4 text-[10.5px] uppercase tracking-[0.24em] font-mono text-moss">
                  {tm.name} · {tm.city}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-serif text-2xl md:text-3xl text-forest">{t("misc.countries.faqTitle", "Frequently asked")}</h2>
          <div className="mt-6 border hairline divide-y divide-ink/10 bg-paper">
            {faqs.map((f: { q: string; a: string }, i: number) => (
              <div key={i} className="p-5 md:p-6">
                <h3 className="font-serif text-forest text-lg">{f.q}</h3>
                <p className="mt-2 text-forest/75 text-[14px] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {countries.length > 1 && (
          <section className="mt-14 pt-10 border-t hairline">
            <h2 className="font-serif text-xl text-forest">{t("misc.countries.otherRegions", "Other regions")}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {countries.filter((x) => x.slug !== c.slug).map((x) => (
                <Link key={x.slug} to="/countries/$slug" params={{ slug: x.slug }} className="text-[11px] uppercase tracking-[0.22em] font-mono text-forest border hairline px-3 py-1.5 bg-paper hover:bg-ivory/60">
                  {t(`misc.countries.${x.slug}.name`, x.name)}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
