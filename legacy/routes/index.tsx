import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, lazy, Suspense } from "react";
import { products, getProduct, productImageAlt, productImageTitle } from "@/lib/products";
import { formatMoney, getBasePrice, useRegion } from "@/lib/pricing";
import { TrustBar, ReviewStrip } from "@/components/site/SocialProof";
import { productStats } from "@/lib/reviews";
import { abs, canonicalFor, localeOf } from "@/lib/seo";
import { useServerFn } from "@tanstack/react-start";
import { verifySecretCode, type VerifyResult } from "@/lib/verify.functions";

// Radix Dialog + the verdict panels only load once a visitor actually verifies a code.
const VerifyDialog = lazy(() => import("@/components/verify/VerifyDialog"));


import { ProductImage } from "@/components/site/ProductImage";
import { useT } from "@/lib/i18n";
import { Reveal } from "@/components/site/Reveal";
import { DesktopBannerHero } from "@/components/home/DesktopBannerHero";
import { MobileBannerHero } from "@/components/home/MobileBannerHero";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Pathway deep-dive: Latin actives (intentional Latin, kept in both locales),
// the mechanism, and the observable sign — indexed to the science array order.
const PATHWAY_DETAIL = [
  {
    actives: "Ginseng Radix Alba · Cucumis Melo",
    mechanism:
      "Follicles are fed by a web of tiny capillaries. Supported micro-circulation carries more oxygen and nutrients to the root during the growth phase.",
    notice: "A gentle, comfortable feel after application and a calmer scalp.",
  },
  {
    actives: "Serenoa Repens (Saw Palmetto)",
    mechanism:
      "DHT is a hormone by-product that can shrink follicles over time. Saw palmetto is traditionally used to help maintain healthy DHT activity at the follicle level.",
    notice: "A gradual reduction in daily shedding over weeks of regular use.",
  },
  {
    actives: "Eclipta Prostrata · Equisetum Arvense",
    mechanism:
      "Irritation and build-up can push follicles out of their growth cycle. A calm, balanced scalp lets the natural cycle continue undisturbed.",
    notice: "Less itch and flaking, and a more comfortable application.",
  },
  {
    actives: "Equisetum Arvense (Natural Silica)",
    mechanism:
      "Hair is over 95% keratin. Silica is a trace mineral traditionally associated with keratin integrity and strand resilience.",
    notice: "Hair that feels less brittle and looks fuller at the ends.",
  },
];




export const Route = createFileRoute("/")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const productLd = products.map((p) => {
      const stat = productStats.find((s) => s.slug === p.slug);
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.name,
        description: p.tagline || p.overview,
        image: [typeof p.image === "string" ? abs(p.image) : p.image],
        sku: p.slug,
        brand: { "@type": "Brand", name: "Green Wealth" },
        category: p.category,
        offers: {
          "@type": "Offer",
          url: abs(`/product/${p.slug}`),
          priceCurrency: p.currency || "USD",
          price: p.price.toFixed(2),
          availability: p.available
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
        aggregateRating: stat
          ? {
              "@type": "AggregateRating",
              ratingValue: stat.rating.toFixed(1),
              reviewCount: stat.count,
              bestRating: "5",
              worstRating: "1",
            }
          : undefined,
      };
    });

    const title = locale === "ar"
      ? "لوشن نيو للشعر — بخاخ الشعر النباتي الأصلي"
      : "Neo Hair Lotion — Original Botanical Hair Spray";
    const description = locale === "ar"
      ? "اشترِ لوشن نيو للشعر الأصلي بمستخلص الجينسنغ والسو بالميتو. بخاخ نباتي لإنبات الشعر من جرين ولث. أصالة موثقة وتوصيل لجميع أنحاء العالم."
      : "Buy original Neo Hair Lotion with Ginseng & Saw Palmetto. Botanical hair regrowth spray by Green Wealth. Verified authentic, worldwide delivery.";
    const ogTitle = locale === "ar"
      ? "لوشن نيو للشعر — الأصلي من جرين ولث"
      : "Neo Hair Lotion — Original by Green Wealth";
    const ogDescription = locale === "ar"
      ? "لوشن نيو للشعر الأصلي من جرين ولث — بخاخ نباتي للشعر بمستخلص الجينسنغ والسو بالميتو. تم التحقق من الأصالة عبر الكود، والشحن لجميع أنحاء العالم."
      : "Original Neo Hair Lotion by Green Wealth — botanical hair spray with Ginseng & Saw Palmetto. Scratch-code verified, shipped worldwide.";

    return {
      meta: [
        { title },
        {
          name: "description",
          content: description,
        },
        { property: "og:title", content: ogTitle },
        {
          property: "og:description",
          content: ogDescription,
        },
        { property: "og:url", content: canonicalFor("/", locale) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: canonicalFor("/", locale) },
        {
          rel: "preload",
          as: "image",
          href: "/images/hero-mobile-1-1200.webp",
          imageSrcSet:
            "/images/hero-mobile-1-800.webp 800w, /images/hero-mobile-1-1200.webp 1200w",
          imageSizes: "100vw",
          fetchPriority: "high",
          media: "(max-width: 1023px)",
        },

        {
          rel: "preload",
          as: "image",
          href: "/images/hero-desktop-1-2400.webp",
          imageSrcSet:
            "/images/hero-desktop-1-1600.webp 1600w, /images/hero-desktop-1-2400.webp 2400w",
          imageSizes: "100vw",
          fetchPriority: "high",
          media: "(min-width: 1024px)",
        },
      ],
      scripts: productLd.map((ld) => ({
        type: "application/ld+json",
        children: JSON.stringify(ld),
      })),
    };
  },
  component: HomePage,
});


function HomePage() {
  const t = useT();
  const [verifyCode, setVerifyCode] = useState("");
  const { currency } = useRegion();
  const [checking, setChecking] = useState(false);
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const verify = useServerFn(verifySecretCode);

  async function onVerifySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!verifyCode.trim() || checking) return;
    setChecking(true);
    setVerifyResult(null);
    setVerifyOpen(true);
    try {
      const res = await verify({ data: { code: verifyCode.trim() } });
      setVerifyResult(res);
    } catch {
      setVerifyResult({
        status: "error",
        message: t("home.verify.error", "We could not reach the verification service. Please try again in a moment."),
      });
    } finally {
      setChecking(false);
    }
  }

  const hero = getProduct("neo-hair-lotion")!;
  const heroIngredients = (hero.ingredientsDetailed ?? []).slice(0, 5);
  
  const timeline = hero.timeline ?? [];
  const faqs = (hero.faqs ?? []).slice(0, 4);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTile, setActiveTile] = useState(0);
  const tileScrollRef = useRef<HTMLDivElement>(null);

  const handleTileScroll = () => {
    const el = tileScrollRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const gap = 12;
    const idx = Math.round(el.scrollLeft / (card.offsetWidth + gap));
    setActiveTile(Math.max(0, Math.min(idx, heroIngredients.length - 1)));
  };

  const scrollToTile = (i: number) => {
    const el = tileScrollRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const gap = 12;
    el.scrollTo({ left: i * (card.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <div className="w-full bg-paper text-forest">
      {/* DESKTOP HERO — campaign banner rotator */}
      <DesktopBannerHero />

      {/* MOBILE / TABLET HERO — campaign banner rotator */}
      <MobileBannerHero />


      {/* TRUST BAR — verified rating, customers, countries, scratch-verified */}
      <TrustBar variant="ivory" />

      {/* SPOTLIGHT — Neo Hair Lotion */}
      <section className="bg-paper border-t border-forest/15">
        <div className="container-editorial py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <Reveal className="lg:col-span-6 order-2 lg:order-1">
              <h2 className="font-serif uppercase font-bold tracking-tight leading-[0.9] text-[clamp(2.25rem,4.4vw,4rem)]">
                {t(`product.${hero.slug}.name`, hero.name)}
              </h2>
              <p className="mt-6 max-w-lg text-sm sm:text-base text-forest/70 leading-relaxed">
                {t(`product.${hero.slug}.overview`, hero.overview)}
              </p>
              <dl className="mt-9 grid grid-cols-3 gap-6 border-t border-forest/15 pt-6 max-w-lg">
                {[
                  { k: t("home.spotlight.metaCategory", "Category"), v: t(`product.category.${hero.category}`, hero.category) },
                  { k: t("home.spotlight.metaOrigin", "Origin"), v: t(`review.country.${hero.origin ?? ""}`, hero.origin ?? "—") },
                  { k: t("home.spotlight.metaPrice", "From"), v: formatMoney(getBasePrice(hero.slug, currency), currency) },
                ].map((m) => (
                  <div key={m.k}>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.24em] text-moss mb-1.5">{m.k}</dt>
                    <dd className="text-[11px] sm:text-xs uppercase tracking-[0.1em] text-forest/85">{m.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/product/$slug"
                  params={{ slug: hero.slug }}
                  className="bg-forest text-paper px-8 sm:px-10 py-4 sm:py-5 text-center font-bold uppercase text-[11px] tracking-[0.22em] hover:bg-moss transition-colors"
                >
                  {t("home.spotlight.shopCta", "Shop Neo Hair Lotion")}
                </Link>
                <Link
                  to="/hair-science"
                  className="border border-forest/40 px-8 sm:px-10 py-4 sm:py-5 text-center font-bold uppercase text-[11px] tracking-[0.22em] hover:bg-forest hover:text-paper transition-colors"
                >
                  {t("home.spotlight.scienceCta", "The Science")}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative bg-ivory border border-forest/15 p-6 sm:p-12">
                <ProductImage
                  src={hero.image}
                  alt={productImageAlt(hero, 0, t)}
                  title={productImageTitle(hero, t)}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="w-full aspect-square object-contain"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CODE VERIFICATION */}
      <section className="bg-ivory border-t border-forest/15">
        <div className="container-editorial py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left: concise authenticity summary */}
            <Reveal className="lg:col-span-7">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-moss block mb-5">
                {t("home.verify.eyebrow", "PRODUCT AUTHENTICITY")}
              </span>
              <h2 className="font-serif uppercase font-bold tracking-tight leading-[0.92] text-[clamp(2rem,3.8vw,3.4rem)]">
                {t("home.verify.h2", "Verify your product before first use.")}
              </h2>
              <p className="mt-5 text-sm sm:text-base text-forest/60 max-w-xl leading-relaxed">
                {t("home.verify.introShort", "Scratch the black panel on your box, reveal the 12 digit code, and enter it here.")}
              </p>

              {/* How it works */}
              <h3 className="mt-10 font-serif text-xl text-forest">
                {t("home.verify.howTitle", "HOW VERIFICATION WORKS")}
              </h3>
              <ol className="mt-4 border-t border-forest/15 max-w-xl">
                {[
                  { n: "01", t: "Find the scratch panel", b: "Locate the silver scratch panel on the side or back of your box." },
                  { n: "02", t: "Scratch gently", b: "Use a coin or your fingernail to reveal the full code beneath the panel." },
                  { n: "03", t: "Enter it exactly", b: "Type the code exactly as shown, including any dashes. No spaces." },
                ].map((s) => (
                  <li key={s.n} className="border-b border-forest/15 py-4 flex gap-4 sm:gap-6">
                    <span className="font-mono text-[10px] sm:text-xs text-gold pt-1 shrink-0">{s.n}</span>
                    <div>
                      <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-forest">
                        {t(`home.verify.step.${s.n}.title`, s.t)}
                      </p>
                      <p className="mt-1 text-xs sm:text-sm text-forest/60 leading-relaxed">
                        {t(`home.verify.step.${s.n}.body`, s.b)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* What your code confirms */}
              <h3 className="mt-10 font-serif text-xl text-forest">
                {t("home.verify.checkTitle", "What the check tells you")}
              </h3>
              <div className="mt-4 max-w-xl border-y border-forest/15">
                {[
                  { t: "Matched to production records", b: "Every code is matched live to the batch it was filled in — not a static list." },
                  { t: "One code per bottle", b: "Codes are issued once, and repeat verifications are logged and flagged to us." },
                  { t: "Authorized supply only", b: "A genuine result also confirms the bottle came through an authorized distributor." },
                ].map((a, i) => (
                  <div key={i} className="py-4 border-b border-forest/15 last:border-b-0">
                    <p className="text-sm font-semibold text-forest">
                      {t(`home.verify.assure.${i}.t`, a.t)}
                    </p>
                    <p className="mt-2 text-[11px] sm:text-xs text-forest/60 leading-relaxed">
                      {t(`home.verify.assure.${i}.b`, a.b)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/verify"
                  className="bg-forest text-paper px-7 py-4 text-center font-bold uppercase text-[11px] tracking-[0.22em] hover:bg-moss transition-colors"
                >
                  {t("home.verify.fullPageCta", "Full verification guide")}
                </Link>
                <Link
                  to="/real-vs-fake"
                  className="border border-forest/40 px-7 py-4 text-center font-bold uppercase text-[11px] tracking-[0.22em] hover:bg-forest hover:text-paper transition-colors"
                >
                  {t("home.verify.realVsFakeCta", "Genuine vs counterfeit")}
                </Link>
              </div>

            </Reveal>


            {/* Right: verification form */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <Reveal delay={120} className="bg-paper border border-forest/20 p-6 sm:p-8 lg:p-10">
                
                <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase mb-2 tracking-tight">{t("home.verify.formTitle", "Enter your scratch code")}</h3>
                <p className="text-xs sm:text-sm text-forest/60 mb-6 leading-relaxed">
                  {t("home.verify.formIntro", "Scratch the black panel on the authenticity sticker to reveal your 12 digit code.")}
                </p>

                {/* Scratch indication image */}
                <figure className="mb-6">
                  <div className="relative border border-forest/20">
                    <img
                      src="/images/authenticity-sticker-1260.webp"
                      srcSet="/images/authenticity-sticker-800.webp 800w, /images/authenticity-sticker-1260.webp 1260w"
                      sizes="(min-width: 1024px) 620px, 100vw"
                      alt={t("home.verify.stickerAlt", "Genuine Green Wealth Neo Hair Lotion holographic authenticity sticker: black scratch-off panel hiding the 12 digit verification code, with the printed public serial number below")}
                      className="w-full h-auto block"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      width={1260}
                      height={680}
                    />

                    <div
                      className="absolute border-2 border-gold pointer-events-none shadow-[0_0_0_4px_rgba(255,255,255,0.85)]"
                      style={{ left: "5.5%", top: "11%", width: "84%", height: "24%" }}
                      aria-hidden="true"
                    />
                    <div
                      className="absolute pointer-events-none flex items-center gap-2"
                      style={{ left: "5.5%", top: "11%", transform: "translateY(-100%)" }}
                      aria-hidden="true"
                    >
                      <span className="bg-gold text-forest px-3 py-2 text-[10px] md:text-xs uppercase tracking-[0.2em] whitespace-nowrap font-semibold shadow-lg">
                        {t("home.verify.scratchHere", "Scratch this black area ↓")}
                      </span>
                    </div>
                  </div>
                  <figcaption className="mt-3 text-[11px] uppercase tracking-[0.14em] text-forest/60">
                    {t("home.verify.stickerCaption", "The 12 digit verification code is hidden under the black scratch area — the number printed below it is not the code")}
                  </figcaption>
                </figure>

                <form onSubmit={onVerifySubmit}>
                  <label htmlFor="home-scratch-code" className="sr-only">
                    {t("home.verify.inputLabel", "Scratch verification code")}
                  </label>
                  <input
                    id="home-scratch-code"
                    name="scratchCode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder={t("home.verify.inputPlaceholder", "e.g. enter 12 digit code")}
                    maxLength={40}
                    className="w-full border border-forest/40 px-4 sm:px-5 py-3 sm:py-4 bg-ivory focus:outline-none focus:border-forest text-base font-bold uppercase tracking-widest placeholder:text-forest/40 mb-4"
                  />
                  <button
                    type="submit"
                    disabled={checking}
                    className="w-full bg-forest text-paper px-6 py-4 font-bold uppercase text-[11px] tracking-[0.22em] hover:bg-moss transition-colors disabled:opacity-50"
                  >
                    {checking ? t("home.verify.checking", "Checking") : t("home.verify.submit", "Verify Authenticity")}
                  </button>
                </form>
                <div className="mt-6 pt-6 border-t border-forest/10">
                  <p className="text-[10px] sm:text-xs text-forest/50 uppercase tracking-[0.14em] leading-relaxed">
                    {t("home.verify.footnote", "Only genuine Green Wealth products carry a verifiable scratch code. Counterfeit bottles will fail this check.")}
                  </p>
                </div>
              </Reveal>

              {(verifyOpen || checking) && (
                <Suspense fallback={null}>
                  <VerifyDialog
                    open={verifyOpen}
                    onOpenChange={setVerifyOpen}
                    checking={checking}
                    result={verifyResult}
                  />
                </Suspense>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="bg-paper border-t border-forest/15">
        <div className="container-editorial py-16 sm:py-24 lg:py-28">
          <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 sm:mb-14">
            <div>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-moss block mb-5">
                {t("home.grid.eyebrow", "HAIR CARE")}
              </span>
              <h2 className="font-serif uppercase font-bold tracking-tight leading-[0.9] text-[clamp(2.25rem,4.4vw,3.8rem)]">
                {t("home.grid.titleLine1", "The Restoration")}<br />{t("home.grid.titleLine2", "System")}
              </h2>
            </div>
            <div className="md:text-right">
              <div className="hidden md:flex md:justify-end gap-8 mb-4">
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold leading-none">{String(products.length).padStart(2, "0")}</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-forest/50 mt-1">{t("home.grid.statFormulas", "Formulas")}</div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold leading-none">19</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-forest/50 mt-1">{t("home.grid.statBotanicals", "Botanicals")}</div>
                </div>
              </div>
              <p className="max-w-xs text-xs sm:text-sm text-forest/55 leading-relaxed uppercase tracking-[0.1em]">
                {t("home.grid.subtitle", "Four precision botanicals for density, strength, and longevity from the root.")}
              </p>
            </div>
          </Reveal>

          {/* Desktop — four-column formula ledger */}
          <Reveal delay={100} className="hidden md:grid grid-cols-2 lg:grid-cols-4 border-t border-l border-forest/15">
            {products.map((p, i) => (
              <Link
                key={p.slug}
                to="/product/$slug"
                params={{ slug: p.slug }}
                className="border-b border-r border-forest/15 bg-paper hover:bg-ivory transition-colors p-6 lg:p-8 group flex flex-col"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-moss">
                    {t("home.grid.formulaLabel", "Formula")} {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-forest/45">{t(`product.${p.slug}.size`, p.size)}</span>
                </div>
                <div className="mb-6 overflow-hidden bg-ivory border border-forest/10">
                  <ProductImage
                    src={p.image}
                    alt={productImageAlt(p, 0, t)}
                    title={productImageTitle(p, t)}
                    sizes="(min-width: 1024px) 320px, 50vw"
                    className="w-full aspect-square object-contain group-hover:scale-[1.04] transition-transform duration-700"
                  />
                </div>
                <h3 className="font-serif text-lg lg:text-xl font-bold uppercase mb-2 tracking-tight leading-tight">
                  {t(`product.${p.slug}.name`, p.name)}
                </h3>
                <p className="text-xs text-forest/55 mb-6 leading-relaxed flex-1">
                  {t(`product.${p.slug}.tagline`, p.tagline)}
                </p>
                <div className="flex justify-between items-center border-t border-forest/15 pt-4">
                  <span className="text-base font-bold tracking-tight">
                    {formatMoney(getBasePrice(p.slug, currency), currency)}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-moss group-hover:text-forest transition-colors">
                    {t("home.grid.view", "View")} →
                  </span>
                </div>
              </Link>
            ))}
          </Reveal>

          {/* Mobile — stacked formula rows */}
          <Reveal delay={100} className="md:hidden border-t border-forest/15">
            {products.map((p, i) => (
              <Link
                key={p.slug}
                to="/product/$slug"
                params={{ slug: p.slug }}
                className="flex gap-4 border-b border-forest/15 py-5 group"
              >
                <div className="w-28 shrink-0 bg-ivory border border-forest/10 overflow-hidden self-start">
                  <ProductImage
                    src={p.image}
                    alt={productImageAlt(p, 0, t)}
                    title={productImageTitle(p, t)}
                    sizes="112px"
                    className="w-full aspect-square object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-moss">
                      {t("home.grid.formulaLabel", "Formula")} {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-forest/45">{t(`product.${p.slug}.size`, p.size)}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold uppercase tracking-tight leading-tight mb-1.5">
                    {t(`product.${p.slug}.name`, p.name)}
                  </h3>
                  <p className="text-[11px] text-forest/55 leading-relaxed mb-3 line-clamp-2">
                    {t(`product.${p.slug}.tagline`, p.tagline)}
                  </p>
                  <div className="mt-auto flex justify-between items-center border-t border-forest/10 pt-2.5">
                    <span className="text-sm font-bold tracking-tight">
                      {formatMoney(getBasePrice(p.slug, currency), currency)}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-moss">
                      {t("home.grid.view", "View")} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <Reveal as="section" className="grid grid-cols-1 md:grid-cols-2 bg-forest text-paper border-t border-brass/30">
        <div className="p-10 sm:p-16 lg:p-20 border-b md:border-b-0 md:border-r border-brass/25">
          <h2 className="font-serif uppercase font-bold tracking-tight leading-[0.9] text-[clamp(2.25rem,4.2vw,3.6rem)] mb-7">
            {t("home.problem.titleLine1", "Dormant")}<br /><span className="text-brass">{t("home.problem.titleLine2", "Follicles")}</span>
          </h2>
          <p className="text-paper/70 leading-relaxed max-w-md text-sm sm:text-base">
            {t("home.problem.body", "Hair loss isn't just genetic. It's a failure of signaling. When the scalp loses its ability to send growth proteins, follicles enter a prolonged resting phase.")}
          </p>
        </div>
        <div className="p-10 sm:p-16 lg:p-20 bg-moss">
          <h2 className="font-serif uppercase font-bold tracking-tight leading-[0.9] text-[clamp(2.25rem,4.2vw,3.6rem)] mb-7">
            {t("home.solution.titleLine1", "Anagen")}<br /><span className="text-brass">{t("home.solution.titleLine2", "Signaling")}</span>
          </h2>
          <p className="text-paper/75 leading-relaxed max-w-md text-sm sm:text-base">
            {t("home.solution.body", hero.whyDifferent ?? "")}
          </p>
        </div>
      </Reveal>

      {/* ACTIVE BOTANICALS — from ingredientsDetailed */}
      <section className="bg-paper border-t border-forest/15 overflow-hidden">
        <div className="container-editorial py-16 sm:py-24 lg:py-28">
          <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6">
            <div>
              <h2 className="font-serif uppercase font-bold tracking-tight leading-[0.9] text-[clamp(2.25rem,4.4vw,3.8rem)]">
                {t("home.ingredients.titleLine1", "Active")}<br />{t("home.ingredients.titleLine2", "Botanicals")}
              </h2>
            </div>
            <p className="max-w-sm text-xs sm:text-sm text-forest/55 leading-relaxed uppercase tracking-[0.1em]">
              {t("home.ingredients.subtitle", "Five botanical extracts. Keystone actives targeting the biology of thinning.")}
            </p>
          </Reveal>

          {/* Mobile swipe tiles */}
          <div className="md:hidden">
            <div
              ref={tileScrollRef}
              onScroll={handleTileScroll}
              className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-6 scrollbar-hide"
            >
              {heroIngredients.map((ing, i) => {
                const ingSlug = slugify(ing.name);
                return (
                  <Link
                    key={ing.name}
                    to="/ingredients/$slug"
                    params={{ slug: ingSlug }}
                    className="min-w-[80vw] snap-start bg-ivory border border-forest/15 p-5 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-moss">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-moss">{t("home.ingredients.read", "Read")} →</span>
                    </div>
                    {ing.image && (
                      <div className="w-full aspect-square bg-paper mb-4 flex items-center justify-center overflow-hidden">
                        <ProductImage
                          src={ing.image}
                          alt={`${t(`home.ingredients.${ingSlug}.name`, ing.name)} — ${t("img.ingredientAlt", "botanical active used in Green Wealth Neo Hair formulas")}`}
                          title={t(`home.ingredients.${ingSlug}.name`, ing.name)}
                          sizes="80vw"
                          className="w-full h-full object-contain p-3"
                        />
                      </div>
                    )}
                    <h3 className="font-serif text-sm font-bold uppercase mb-1 tracking-tight leading-tight">
                      {t(`home.ingredients.${ingSlug}.name`, ing.name)}
                    </h3>
                    {ing.latin && (
                      <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-forest/45 mb-3">{ing.latin}</p>
                    )}
                    <p className="text-xs leading-relaxed text-forest/65">
                      {t(`home.ingredients.${ingSlug}.description`, ing.description)}
                    </p>
                  </Link>
                );
              })}
            </div>
            <div className="flex justify-center gap-2 mt-2">
              {heroIngredients.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={t("home.ingredients.goTo", "Go to botanical") + ` ${i + 1}`}
                  onClick={() => scrollToTile(i)}
                  className={`h-px w-8 transition-colors ${i === activeTile ? "bg-forest" : "bg-forest/20"}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop grid */}
          <Reveal delay={100} className="hidden md:grid grid-cols-2 lg:grid-cols-5 border-t border-l border-forest/15">
            {heroIngredients.map((ing, i) => {
              const ingSlug = slugify(ing.name);
              return (
                <Link
                  key={ing.name}
                  to="/ingredients/$slug"
                  params={{ slug: ingSlug }}
                  className="border-b border-r border-forest/15 p-6 sm:p-7 group hover:bg-ivory transition-colors flex flex-col"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-moss">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-moss opacity-0 group-hover:opacity-100 transition-opacity">
                      {t("home.ingredients.read", "Read")} →
                    </span>
                  </div>
                  {ing.image && (
                    <div className="w-full aspect-square bg-ivory mb-5 flex items-center justify-center overflow-hidden">
                      <ProductImage src={ing.image} alt={`${t(`home.ingredients.${ingSlug}.name`, ing.name)} — ${t("img.ingredientAlt", "botanical active used in Green Wealth Neo Hair formulas")}`} title={t(`home.ingredients.${ingSlug}.name`, ing.name)} sizes="(min-width: 1024px) 300px, 45vw" className="w-full h-full object-contain p-3 group-hover:scale-[1.04] transition-transform duration-700" />
                    </div>
                  )}
                  <h3 className="font-serif text-sm sm:text-base font-bold uppercase mb-1 tracking-tight leading-tight">
                    {t(`home.ingredients.${ingSlug}.name`, ing.name)}
                  </h3>
                  {ing.latin && (
                    <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-forest/45 mb-3">{ing.latin}</p>
                  )}
                  <p className="text-xs sm:text-[13px] leading-relaxed text-forest/65">
                    {t(`home.ingredients.${ingSlug}.description`, ing.description)}
                  </p>
                </Link>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* SCIENCE PATHWAYS */}
      {hero.science && (
        <section className="bg-forest border-t border-brass/30">
          <div className="container-editorial py-16 sm:py-24 lg:py-28">
            <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-14 gap-6">
              <div>
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-brass block mb-5">
                  {t("home.pathways.eyebrow", "Mechanism of Action")}
                </span>
                <h2 className="font-serif uppercase font-bold tracking-tight leading-[0.9] text-paper text-[clamp(2.25rem,4.4vw,3.8rem)]">
                  {t("home.pathways.titleLine1", "Four")}<br /><span className="text-brass">{t("home.pathways.titleLine2", "Pathways")}</span>
                </h2>
              </div>
              <div className="md:text-right">
                <div className="flex md:justify-end gap-8 mb-4">
                  <div>
                    <div className="font-serif text-2xl sm:text-3xl font-bold leading-none text-paper">{String(hero.science.length).padStart(2, "0")}</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/50 mt-1">{t("home.pathways.statPathways", "Pathways")}</div>
                  </div>
                  <div>
                    <div className="font-serif text-2xl sm:text-3xl font-bold leading-none text-paper">05</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/50 mt-1">{t("home.pathways.statActives", "Botanical Actives")}</div>
                  </div>
                </div>
                <p className="text-paper/60 text-sm max-w-xs leading-relaxed md:ml-auto">
                  {t("home.pathways.subtitle", "Each botanical in the formula is selected for a distinct, documented role in scalp and follicle health.")}
                </p>
              </div>
            </Reveal>
            <Reveal delay={100} className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-brass/25">
              {hero.science.map((s, i) => {
                const full = t(`home.pathways.${i}`, s);
                const sep = full.indexOf(":");
                const title = sep > -1 ? full.slice(0, sep) : full;
                const body = sep > -1 ? full.slice(sep + 1).trim() : "";
                const d = PATHWAY_DETAIL[i];
                return (
                  <div key={i} className="group relative border-b border-r border-brass/25 p-8 sm:p-12 overflow-hidden transition-colors duration-300 hover:bg-paper/5">
                    <span aria-hidden className="absolute -top-4 end-4 font-serif text-[6rem] sm:text-[8rem] font-bold leading-none text-paper/5 select-none pointer-events-none transition-colors duration-300 group-hover:text-brass/15">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="relative">
                      <div className="font-mono text-[9px] uppercase tracking-[0.26em] text-brass mb-5">
                        {t("home.pathways.label", "Pathway")} {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-paper mb-3 tracking-tight">{title}</h3>
                      {d && (
                        <div className="mb-5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-paper/45 leading-relaxed">
                          {t("home.pathways.keyActives", "Key Actives")} — <span className="text-brass/80">{d.actives}</span>
                        </div>
                      )}
                      <p className="text-paper/70 text-sm sm:text-base leading-relaxed max-w-md mb-6">{body}</p>
                      {d && (
                        <div className="space-y-4 mb-6 border-t border-brass/15 pt-5">
                          <div>
                            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/40 mb-1.5">
                              {t("home.pathways.mechanism", "The Mechanism")}
                            </div>
                            <p className="text-paper/60 text-[13px] leading-relaxed max-w-md">
                              {t(`home.pathways.detail.${i}.mechanism`, d.mechanism)}
                            </p>
                          </div>
                          <div>
                            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/40 mb-1.5">
                              {t("home.pathways.notice", "You May Notice")}
                            </div>
                            <p className="text-paper/60 text-[13px] leading-relaxed max-w-md">
                              {t(`home.pathways.detail.${i}.notice`, d.notice)}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="h-px w-10 bg-brass/50 transition-all duration-300 group-hover:w-16 group-hover:bg-brass" />
                    </div>
                  </div>
                );
              })}
            </Reveal>
            <Reveal delay={150} className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-brass/25 px-6 py-5">
              <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.24em] text-paper/55">
                {t("home.pathways.footnote", "Traditional-use evidence · Full dossiers in the Journal")}
              </p>
              <Link to="/blogs/series" className="font-mono text-[10px] uppercase tracking-[0.24em] text-brass hover:text-paper transition-colors">
                {t("home.pathways.cta", "Read the Science")} →
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* TIMELINE — from hero.timeline */}
      <section className="bg-paper border-t border-forest/15">
        <div className="container-editorial py-16 sm:py-24 lg:py-28">
          <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-14 gap-6">
            <div>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-moss block mb-5">
                {t("home.timeline.eyebrow", "The 120-Day Protocol")}
              </span>
              <h2 className="font-serif uppercase font-bold tracking-tight leading-[0.9] text-[clamp(2.25rem,4.4vw,3.8rem)]">
                {t("home.timeline.titleLine1", "Expected")}<br />{t("home.timeline.titleLine2", "Timeline")}
              </h2>
            </div>
            <div className="md:text-right">
              <div className="hidden md:flex md:justify-end gap-8 mb-4">
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold leading-none">{String(timeline.length).padStart(2, "0")}</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-forest/50 mt-1">{t("home.timeline.statPhases", "Phases")}</div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold leading-none">365</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-forest/50 mt-1">{t("home.timeline.statDays", "Days Mapped")}</div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold leading-none">2×</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-forest/50 mt-1">{t("home.timeline.statDaily", "Daily")}</div>
                </div>
              </div>
              <p className="max-w-xs text-xs sm:text-sm text-forest/55 leading-relaxed uppercase tracking-[0.1em]">
                {t("home.timeline.subtitle", "Consistency compounds. The follicular cycle rewards patience.")}
              </p>
            </div>
          </Reveal>

          {/* Desktop — five-column phase ledger with rail */}
          <Reveal delay={100} className="hidden md:block border-t border-l border-forest/15">
            <div className="grid grid-cols-5">
              {timeline.map((tl, i) => (
                <div key={tl.period} className="border-b border-r border-forest/15 px-5 py-4 flex items-center gap-3">
                  <span className="w-2 h-2 bg-forest shrink-0" aria-hidden="true" />
                  <span className="h-px flex-1 bg-forest/25" aria-hidden="true" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-forest/60 whitespace-nowrap">
                    {t(`home.timeline.${i}.days`, tl.days ?? tl.period)}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5">
              {timeline.map((tl, i) => (
                <article key={tl.period} className="border-b border-r border-forest/15 p-5 lg:p-6 flex flex-col hover:bg-ivory transition-colors">
                  <div className="font-mono text-[9px] uppercase tracking-[0.26em] text-moss mb-4">
                    {t("home.timeline.phaseLabel", "Phase")} {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-serif text-base lg:text-lg font-bold uppercase tracking-tight leading-tight mb-1">
                    {t(`home.timeline.${i}.title`, tl.title ?? tl.period)}
                  </h3>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-forest/45 mb-4">
                    {t(`home.timeline.${i}.period`, tl.period)}
                  </div>
                  <p className="text-xs leading-relaxed text-forest/70 mb-5">{t(`home.timeline.${i}.description`, tl.description)}</p>
                  <div className="font-mono text-[8px] uppercase tracking-[0.22em] text-forest/45 mb-2">
                    {t("home.timeline.signsLabel", "Observable signs")}
                  </div>
                  <ul className="mb-5">
                    {(tl.signs ?? []).map((s, j) => (
                      <li key={j} className="text-[11px] leading-relaxed text-forest/65 flex gap-2">
                        <span className="text-moss shrink-0" aria-hidden="true">—</span>
                        <span>{t(`home.timeline.${i}.signs.${j}`, s)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto pt-4 border-t border-forest/10 text-[10px] leading-relaxed text-forest/50 font-mono uppercase tracking-[0.06em]">
                    {t(`home.timeline.${i}.tip`, tl.tip ?? "")}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>

          {/* Mobile — vertical rail ledger */}
          <Reveal delay={100} className="md:hidden">
            <div className="grid grid-cols-3 gap-x-3 gap-y-2 mb-6">
              <div>
                <div className="font-serif text-xl font-bold leading-none">{String(timeline.length).padStart(2, "0")}</div>
                <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-forest/50 mt-1">{t("home.timeline.statPhases", "Phases")}</div>
              </div>
              <div>
                <div className="font-serif text-xl font-bold leading-none">365</div>
                <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-forest/50 mt-1">{t("home.timeline.statDays", "Days Mapped")}</div>
              </div>
              <div>
                <div className="font-serif text-xl font-bold leading-none">2×</div>
                <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-forest/50 mt-1">{t("home.timeline.statDaily", "Daily")}</div>
              </div>
            </div>
            <ol className="relative border-l border-forest/20 ml-1 space-y-0">
              {timeline.map((tl, i) => (
                <li key={tl.period} className="relative pl-5 pb-7 last:pb-0">
                  <span className="absolute -left-[4.5px] top-1 w-2 h-2 bg-forest" aria-hidden="true" />
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-moss">
                      {t("home.timeline.phaseLabel", "Phase")} {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-forest/50">
                      {t(`home.timeline.${i}.days`, tl.days ?? tl.period)}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold uppercase tracking-tight leading-tight">
                    {t(`home.timeline.${i}.title`, tl.title ?? tl.period)}
                  </h3>
                  <p className="text-xs leading-relaxed text-forest/70 mt-2 mb-3">{t(`home.timeline.${i}.description`, tl.description)}</p>
                  <div className="font-mono text-[8px] uppercase tracking-[0.22em] text-forest/45 mb-1.5">
                    {t("home.timeline.signsLabel", "Observable signs")}
                  </div>
                  <ul className="mb-3">
                    {(tl.signs ?? []).map((s, j) => (
                      <li key={j} className="text-[11px] leading-relaxed text-forest/65 flex gap-2">
                        <span className="text-moss shrink-0" aria-hidden="true">—</span>
                        <span>{t(`home.timeline.${i}.signs.${j}`, s)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="pt-3 border-t border-forest/10 text-[9px] leading-relaxed text-forest/50 font-mono uppercase tracking-[0.06em]">
                    {t(`home.timeline.${i}.tip`, tl.tip ?? "")}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* Footnote strip */}
          <Reveal delay={150} className="mt-10 sm:mt-12 border border-forest/15 bg-ivory px-6 py-5 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-forest/65 leading-relaxed max-w-xl">
              {t("home.timeline.footnote", "Results vary by individual and by starting point. Twice-daily consistency is the single strongest predictor of outcome — missed applications compound as delays.")}
            </p>
            <Link to="/hair-science" className="font-mono text-[10px] uppercase tracking-[0.22em] text-forest border-b border-forest/40 pb-0.5 whitespace-nowrap hover:text-moss transition-colors">
              {t("home.timeline.footnoteCta", "Read the full protocol")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* PERFECT FOR / FREE FROM */}
      <Reveal as="section" className="grid grid-cols-1 md:grid-cols-2 bg-moss text-paper border-t border-brass/30">
        <div className="p-10 sm:p-16 lg:p-20 border-b md:border-b-0 md:border-r border-brass/25">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-brass block mb-7">
            {t("home.indications.eyebrow", "Indicated For")}
          </span>
          <ul className="border-t border-brass/25">
            {(hero.perfectFor ?? []).map((item, idx) => (
              <li key={item} className="font-serif text-base sm:text-lg font-bold uppercase tracking-tight border-b border-brass/25 py-4">
                {t(`home.indications.item.${idx}`, item)}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-10 sm:p-16 lg:p-20 bg-forest">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-brass block mb-7">
            {t("home.freeFrom.eyebrow", "Free From")}
          </span>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {(hero.freeFrom ?? []).map((f, idx) => (
              <span key={f} className="border border-brass/50 text-paper/85 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em]">
                {t(`home.freeFrom.item.${idx}`, f)}
              </span>
            ))}
          </div>
          <p className="text-paper/65 mt-8 text-sm leading-relaxed max-w-md">
            {t("home.freeFrom.body", "No pharmaceutical actives. No withdrawal shedding. Manufactured under GMP-certified conditions in Thailand.")}
          </p>
        </div>
      </Reveal>

      {/* FAQ — from hero.faqs */}
      <section className="bg-paper border-t border-forest/15">
        <div className="container-editorial py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <h2 className="font-serif uppercase font-bold tracking-tight leading-[0.9] text-[clamp(2.25rem,4.4vw,3.4rem)]">
                {t("home.faq.title", "Questions")}
              </h2>
              <Link
                to="/faq"
                className="mt-8 inline-block font-mono text-[9px] uppercase tracking-[0.26em] text-moss border-b border-forest/30 pb-1 hover:text-forest transition-colors"
              >
                {t("home.faq.all", "All questions")} →
              </Link>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-8">
              <div className="border-t border-forest/20">
                {faqs.map((f, i) => (
                  <div key={i} className="border-b border-forest/20">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left py-6 sm:py-7 flex justify-between items-center gap-6"
                    >
                      <span className="font-serif text-base sm:text-lg font-bold uppercase tracking-tight">
                        {t(`home.faq.${i}.q`, f.q)}
                      </span>
                      <span className="text-xl font-bold shrink-0 text-moss">
                        {openFaq === i ? "−" : "+"}
                      </span>
                    </button>
                    {openFaq === i && (
                      <p className="pb-6 sm:pb-8 text-sm sm:text-base text-forest/65 leading-relaxed max-w-3xl">
                        {t(`home.faq.${i}.a`, f.a)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* VERIFIED TESTIMONIALS STRIP */}
      <ReviewStrip
        title={t("home.reviews.title", "Real people. Real regrowth. Real photos.")}
        bg="bg-ivory"
      />

      {/* JOURNAL / NEWSLETTER */}
      <Reveal as="section" className="bg-forest border-t border-brass/30">
        <div className="container-editorial py-16 sm:py-24 lg:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-brass block mb-5">
              {t("home.newsletter.subtitle", "Biological insights & priority access.")}
            </span>
            <h2 className="font-serif uppercase font-bold tracking-tight leading-[0.9] text-paper text-[clamp(2.25rem,4.4vw,3.6rem)] mb-10">
              {t("home.newsletter.title", "The Lab Journal")}
            </h2>
            <form className="flex border border-brass/50" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="home-journal-email" className="sr-only">
                {t("home.newsletter.emailLabel", "Email address")}
              </label>
              <input
                id="home-journal-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t("home.newsletter.emailPlaceholder", "EMAIL@ADDRESS.COM")}
                className="flex-1 px-5 py-4 sm:py-5 bg-transparent outline-none font-bold uppercase text-xs tracking-[0.18em] placeholder:text-paper/35 text-paper"
              />
              <button className="bg-brass text-forest px-6 sm:px-10 py-4 sm:py-5 font-bold uppercase text-[11px] tracking-[0.22em] hover:bg-paper transition-colors">
                {t("home.newsletter.submit", "Submit")}
              </button>
            </form>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

