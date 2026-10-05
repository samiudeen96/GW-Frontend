import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, type Product, productImageAlt, productImageTitle } from "@/lib/products";
import { CombosSection } from "../components/shop/CombosSection";
import { productStats } from "@/lib/reviews";
import { useCart } from "@/lib/cart";
import { useRegion, getBasePrice, formatMoney } from "@/lib/pricing";
import { abs, hreflangLinks, canonicalFor, localeOf } from "@/lib/seo";
import { useT } from "@/lib/i18n";
import { ProductImage } from "@/components/site/ProductImage";

export const Route = createFileRoute("/shop")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const url = abs("/shop");
    const title = locale === "ar" ? "المتجر — جرين ولث للعناية النباتية بالشعر" : "Shop — Green Wealth Botanical Hair Care";
    const description = locale === "ar"
      ? "المجموعة الكاملة من جرين ولث وغوري: لوشن نيو للشعر، شامبو نيو للشعر، زيت إكليل الجبل والديرمارولر. ابنِ روتينك، قارن، واطلب مع ضمان أصالة موثق."
      : "The full Green Wealth & Ghori collection: Neo Hair Lotion, Neo Hair Shampoo, Rosemary Oil and Dermaroller — verified authentic, shipped worldwide.";
    const ogTitle = locale === "ar" ? "المتجر — جرين ولث" : "Shop — Green Wealth";
    const ogDescription = locale === "ar"
      ? "أربعة أساسيات نباتية. بروتوكول واحد. توصيل عالمي من موزع معتمد."
      : "Four botanical essentials. One protocol. Worldwide delivery from authorized distribution.";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: description,
        },
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: ogDescription },
        { property: "og:url", content: canonicalFor("/shop", locale) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/shop", locale) }, ...hreflangLinks("/shop")],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Green Wealth Collection",
            itemListElement: products.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: abs(`/product/${p.slug}`),
              name: p.name,
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
              { "@type": "ListItem", position: 2, name: "Shop", item: url },
            ],
          }),
        },
      ],
    };
  },
  component: ShopPage,
});

// ---------- Domain constants ----------
const RITUAL_ORDER = ["neo-hair-shampoo", "ghori-rosemary-oil", "neo-hair-lotion", "ghori-dermaroller"];
const STEP_LABELS: Record<string, string> = {
  "neo-hair-shampoo": "Cleanse",
  "ghori-rosemary-oil": "Prime",
  "neo-hair-lotion": "Treat",
  "ghori-dermaroller": "Stimulate",
};
const ROLE_LABELS: Record<string, string> = {
  "neo-hair-lotion": "Regrowth Serum",
  "neo-hair-shampoo": "Daily Cleanser",
  "ghori-rosemary-oil": "Nourishing Oil",
  "ghori-dermaroller": "Precision Tool",
};
const BEST_FOR: Record<string, string> = {
  "neo-hair-lotion": "Density · Regrowth · Hairline",
  "neo-hair-shampoo": "Scalp cleanse · Priming",
  "ghori-rosemary-oil": "Circulation · Shine · Softness",
  "ghori-dermaroller": "Absorption · Follicle stimulation",
};
// ---------- Match quiz ----------
type Answer = "goal" | "stage" | "time";
const QUIZ: Array<{ key: Answer; q: string; options: Array<{ label: string; score: Record<string, number> }> }> = [
  {
    key: "goal",
    q: "What matters most right now?",
    options: [
      { label: "Regrow visibly thinning areas", score: { "neo-hair-lotion": 3, "ghori-dermaroller": 2 } },
      { label: "Reduce daily shedding", score: { "neo-hair-lotion": 2, "neo-hair-shampoo": 2 } },
      { label: "Healthier scalp & shine", score: { "ghori-rosemary-oil": 3, "neo-hair-shampoo": 2 } },
      { label: "Improve product absorption", score: { "ghori-dermaroller": 3, "ghori-rosemary-oil": 1 } },
    ],
  },
  {
    key: "stage",
    q: "Where are you in your journey?",
    options: [
      { label: "Just starting — building a routine", score: { "neo-hair-shampoo": 2, "neo-hair-lotion": 2 } },
      { label: "Consistent for months, want more", score: { "ghori-dermaroller": 2, "ghori-rosemary-oil": 2 } },
      { label: "Post-shed / recovery mode", score: { "neo-hair-lotion": 3, "ghori-rosemary-oil": 1 } },
    ],
  },
  {
    key: "time",
    q: "How much time can you spend daily?",
    options: [
      { label: "Under 2 minutes", score: { "neo-hair-lotion": 2, "neo-hair-shampoo": 1 } },
      { label: "A short 5-min ritual", score: { "ghori-rosemary-oil": 2, "neo-hair-lotion": 1 } },
      { label: "Full protocol, twice weekly", score: { "ghori-dermaroller": 3, "ghori-rosemary-oil": 1 } },
    ],
  },
];

function ShopPage() {
  const { currency } = useRegion();
  const { add } = useCart();
  const t = useT();

  // ---------- Sorted for display order (fixed ritual order) ----------
  const collection = useMemo(
    () => RITUAL_ORDER.map((s) => products.find((p) => p.slug === s)!).filter(Boolean),
    [],
  );
  const statBySlug = useMemo(
    () => Object.fromEntries(productStats.map((s) => [s.slug, s])),
    [],
  );

  // ---------- Match quiz ----------
  const [answers, setAnswers] = useState<Partial<Record<Answer, number>>>({});
  const [step, setStep] = useState(0);
  const scores = useMemo(() => {
    const s: Record<string, number> = {};
    QUIZ.forEach((q) => {
      const idx = answers[q.key];
      if (idx !== undefined) {
        const opt = q.options[idx];
        Object.entries(opt.score).forEach(([slug, n]) => {
          s[slug] = (s[slug] ?? 0) + n;
        });
      }
    });
    return s;
  }, [answers]);
  const complete = Object.keys(answers).length === QUIZ.length;
  const winnerSlug = complete
    ? Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0]
    : null;
  const winner = collection.find((p) => p.slug === winnerSlug);

  return (
    <>
      {/* ═════════════════ Editorial Hero ═════════════════ */}
      <header className="container-editorial text-center pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="eyebrow mb-8">
          {t("shop.hero.eyebrowPrefix", "The Green Wealth collection")}
        </div>
        <h1 className="display-xl max-w-5xl mx-auto text-forest">
          {t("shop.hero.title", "The Collection")}
        </h1>
        <p className="mt-8 md:mt-10 text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t("shop.hero.intro", "A four-step botanical system engineered for scalp health, hair density, and visible growth. Every unit is shipped from authorized distribution and protected by a verifiable scratch code.")}
        </p>
      </header>

      {/* ═════════════════ The Catalog — 4 editorial tiles ═════════════════ */}
      <section className="container-editorial mt-16 md:mt-24">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-forest">{t("shop.catalog.title", "The Catalog")}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-ink/10 border hairline">
          {collection.map((p, i) => (
            <CatalogTile
              key={p.slug}
              product={p}
              index={i}
              stat={statBySlug[p.slug]}
              currency={currency}
              onAdd={() => add(p.slug, 1)}
            />
          ))}
        </div>
      </section>

      <CombosSection currency={currency} onAddCombo={(lines) => lines.forEach((l) => add(l.slug, l.qty))} />

      {/* ═════════════════ Which is right for you — Quiz ═════════════════ */}
      <section className="container-editorial mt-10 md:mt-16">
        <div className="border hairline bg-paper">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1fr]">
            <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r hairline">
              <h2 className="font-serif text-2xl md:text-4xl leading-tight text-forest mt-2">
                {t("shop.quiz.title", "Which one first?")}
              </h2>
              <p className="text-forest/70 text-[13.5px] leading-relaxed mt-4">
                {t("shop.quiz.intro", "Three quick questions. We'll match you to the best starting essential in the collection.")}
              </p>

              {winner && (
                <div className="mt-6 border hairline bg-ivory">
                  <div className="p-4 md:p-5 flex gap-4 items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white border hairline overflow-hidden flex-shrink-0">
                      <img src={winner.image} alt={productImageAlt(winner, 0, t)} title={productImageTitle(winner, t)} className="w-full h-full object-contain p-1"
          loading="lazy"
          decoding="async"
        />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-moss">{t("shop.quiz.yourMatch", "Your match")}</div>
                      <div className="font-serif text-lg md:text-xl text-forest leading-tight mt-1">
                        {winner.name.replace(/®/g, "")}
                      </div>
                      <div className="text-[11.5px] font-mono text-forest/60 mt-1">
                        {formatMoney(getBasePrice(winner.slug, currency), currency)} · {t(`shop.role.${winner.slug}`, ROLE_LABELS[winner.slug])}
                      </div>
                    </div>
                  </div>
                  <div className="border-t hairline grid grid-cols-2">
                    <Link
                      to="/product/$slug"
                      params={{ slug: winner.slug }}
                      className="text-center py-2.5 text-[10px] uppercase tracking-[0.28em] font-mono text-forest hover:bg-forest hover:text-paper transition-colors border-r hairline"
                    >
                      {t("shop.quiz.open", "Open")}
                    </Link>
                    <button
                      onClick={() => add(winner.slug, 1)}
                      className="text-center py-2.5 text-[10px] uppercase tracking-[0.28em] font-mono text-forest hover:bg-forest hover:text-paper transition-colors"
                    >
                      {t("shop.addToBag", "Add to Bag")}
                    </button>
                  </div>
                  <button
                    onClick={() => { setAnswers({}); setStep(0); }}
                    className="w-full border-t hairline py-2 text-[9.5px] uppercase tracking-[0.28em] font-mono text-forest/50 hover:text-moss transition-colors"
                  >
                    {t("shop.quiz.retake", "Retake")}
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 md:p-10 flex flex-col">
              {!complete ? (
                <>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] font-mono text-forest/50">
                    <span>{t("shop.quiz.questionOf", "Question")} {step + 1} {t("shop.quiz.of", "of")} {QUIZ.length}</span>
                    <div className="flex gap-1">
                      {QUIZ.map((_, i) => (
                        <span
                          key={i}
                          className={`w-6 h-[3px] ${i <= step ? "bg-moss" : "bg-ink/10"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-forest mt-4 leading-snug">
                    {t(`shop.quiz.q.${QUIZ[step].key}`, QUIZ[step].q)}
                  </h3>
                  <div className="grid grid-cols-1 gap-px bg-ink/10 border hairline mt-5">
                    {QUIZ[step].options.map((opt, i) => (
                      <button
                        key={opt.label}
                        onClick={() => {
                          setAnswers((a) => ({ ...a, [QUIZ[step].key]: i }));
                          if (step < QUIZ.length - 1) setStep(step + 1);
                        }}
                        className="bg-paper text-left px-4 py-4 text-[13px] text-forest hover:bg-forest hover:text-paper transition-colors flex items-center justify-between gap-3"
                      >
                        <span>{t(`shop.quiz.opt.${QUIZ[step].key}.${i}`, opt.label)}</span>
                        <span className="text-[10px] font-mono opacity-60">→</span>
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="mt-4 text-[10px] uppercase tracking-[0.28em] font-mono text-forest/50 hover:text-moss self-start"
                    >
                      {t("shop.quiz.back", "← Back")}
                    </button>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col justify-center text-center py-6">
                  <div className="eyebrow text-moss">{t("shop.quiz.complete", "Complete")}</div>
                  <div className="font-serif text-2xl text-forest mt-2">{t("shop.quiz.ready", "Your recommendation is ready.")}</div>
                  <p className="text-[13px] text-forest/70 mt-3 max-w-sm mx-auto">
                    {t("shop.quiz.readyIntro", "See your match on the left. Full ritual delivers the fullest results across 90–120 days.")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════ Compare the Collection ═════════════════ */}
      <section className="container-editorial mt-10 md:mt-16">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-forest">{t("shop.compare.title", "Compare the Collection")}</h2>
          </div>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden grid grid-cols-1 gap-px bg-ink/10 border hairline">
          {collection.map((p, i) => {
            const s = statBySlug[p.slug];
            return (
              <div key={p.slug} className="bg-paper p-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white border hairline overflow-hidden flex-shrink-0">
                    <img src={p.image} alt={productImageAlt(p, 0, t)} title={productImageTitle(p, t)} className="w-full h-full object-contain p-1" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] uppercase tracking-[0.28em] font-mono text-moss">
                      {t(`shop.stepLabel.${p.slug}`, STEP_LABELS[p.slug])}
                    </div>

                    <div className="text-sm font-medium text-forest leading-tight mt-0.5">{t(`product.${p.slug}.name`, p.name).replace(/®/g, "")}</div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="text-sm font-semibold text-forest">{formatMoney(getBasePrice(p.slug, currency), currency)}</div>
                    {s && <div className="text-[10px] font-mono text-forest/60 mt-0.5">★ {s.rating.toFixed(1)}</div>}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[11.5px]">
                  <div className="text-forest/50 font-mono uppercase tracking-[0.16em] text-[9.5px]">{t("shop.table.size", "Size")}</div>
                  <div className="text-forest text-right">{t(`product.${p.slug}.size`, p.size)}</div>
                  <div className="text-forest/50 font-mono uppercase tracking-[0.16em] text-[9.5px]">{t("shop.table.category", "Category")}</div>
                  <div className="text-forest text-right">{t(`product.category.${p.category}`, p.category)}</div>
                  <div className="text-forest/50 font-mono uppercase tracking-[0.16em] text-[9.5px]">{t("shop.table.bestFor", "Best for")}</div>
                  <div className="text-forest text-right">{t(`shop.bestFor.${p.slug}`, BEST_FOR[p.slug])}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto border hairline">
          <table className="w-full text-sm text-forest">
            <thead>
              <tr className="bg-ivory text-left">
                {[
                  { key: "Product", label: t("shop.table.product", "Product") },
                  { key: "Step", label: t("shop.stage", "Stage") },
                  { key: "Category", label: t("shop.table.category", "Category") },
                  { key: "Size", label: t("shop.table.size", "Size") },
                  { key: "Best for", label: t("shop.table.bestFor", "Best for") },
                  { key: "Rating", label: t("shop.table.rating", "Rating") },
                  { key: "Price", label: t("shop.table.price", "Price") },
                ].map((h) => (
                  <th key={h.key} className={`p-4 text-[10px] uppercase tracking-[0.24em] font-mono text-forest/60 font-normal ${h.key === "Price" ? "text-right" : ""}`}>
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {collection.map((p, i) => {
                const s = statBySlug[p.slug];
                return (
                  <tr key={p.slug} className="border-t hairline hover:bg-ivory/50 transition-colors">
                    <td className="p-4">
                      <Link to="/product/$slug" params={{ slug: p.slug }} className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-white border hairline overflow-hidden flex-shrink-0">
                          <img src={p.image} alt={productImageAlt(p, 0, t)} title={productImageTitle(p, t)} className="w-full h-full object-contain p-1" loading="lazy" />
                        </div>
                        <span className="font-medium group-hover:text-moss transition-colors">{t(`product.${p.slug}.name`, p.name)}</span>
                      </Link>
                    </td>
                    <td className="p-4 text-[12.5px] font-mono text-moss">{t(`shop.stepLabel.${p.slug}`, STEP_LABELS[p.slug])}</td>
                    <td className="p-4 text-[12.5px] text-forest/70">{t(`product.category.${p.category}`, p.category)}</td>
                    <td className="p-4 text-[12.5px] text-forest/70">{t(`product.${p.slug}.size`, p.size)}</td>
                    <td className="p-4 text-[12.5px] text-forest/70">{t(`shop.bestFor.${p.slug}`, BEST_FOR[p.slug])}</td>
                    <td className="p-4 text-[12.5px] font-mono text-forest/70">
                      {s ? `★ ${s.rating.toFixed(1)} (${(s.count / 1000).toFixed(0)}k)` : "—"}
                    </td>
                    <td className="p-4 text-right font-semibold whitespace-nowrap">
                      {formatMoney(getBasePrice(p.slug, currency), currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═════════════════ FAQ ═════════════════ */}
      <section className="container-editorial mt-10 md:mt-16 mb-12 md:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.4fr_1fr] gap-6 md:gap-10">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-forest leading-tight">{t("shop.faq.title", "Before you order")}</h2>
            <p className="text-[13px] text-forest/70 mt-3">{t("shop.faq.intro", "The most common questions from first-time customers.")}</p>
          </div>
          <div className="border hairline divide-y">
            {[
              { id: "authentic", q: "How do I know my unit is authentic?", a: "Every carton carries a scratch panel with a unique code. Verify it on our Authenticity page before first use — codes are single-use and locked to the first successful check." },
              { id: "results", q: "How long until I see results?", a: "Most customers report reduced shedding within 4–6 weeks and visible density changes between 90 and 120 days of daily use." },
              { id: "shipping", q: "Do you ship to my country?", a: "We ship worldwide from authorized distribution to 90+ countries with tracked, insured delivery. Duties are calculated at checkout." },
              { id: "combine", q: "Can I combine products?", a: "Yes — the four-step ritual is designed to layer. Use the derma roller before Neo Hair Lotion to improve delivery to the follicle." },
            ].map((f) => (
              <details key={f.id} className="group bg-paper">
                <summary className="cursor-pointer list-none p-4 md:p-5 flex items-center justify-between text-forest">
                  <span className="text-[13.5px] md:text-sm font-medium pr-4">{t(`shop.faq.${f.id}.q`, f.q)}</span>
                  <span className="text-moss text-lg font-mono transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-4 md:px-5 pb-4 md:pb-5 text-[13px] leading-relaxed text-forest/75">{t(`shop.faq.${f.id}.a`, f.a)}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─────────── sub-components ───────────

function CatalogTile({
  product,
  index,
  stat,
  currency,
  onAdd,
}: {
  product: Product;
  index: number;
  stat?: { rating: number; count: number };
  currency: string;
  onAdd: () => void;
}) {
  const t = useT();
  const price = getBasePrice(product.slug, currency);
  return (
      <div className="bg-paper group relative flex flex-col">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block"
      >
        <div className="relative aspect-square bg-white overflow-hidden">
          <ProductImage
            src={product.image}
            alt={t(`product.${product.slug}.imageAlts.0`, product.imageAlts?.[0] ?? `${product.name} — ${product.size} product photograph`)}
            sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 100vw"
            className="w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute top-0 left-0 text-[9px] uppercase tracking-[0.28em] font-mono text-paper bg-forest/90 px-2.5 py-1.5">
            {t(`shop.stepLabel.${product.slug}`, STEP_LABELS[product.slug])}
          </div>

        </div>
      </Link>

      <div className="p-4 md:p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[9.5px] uppercase tracking-[0.32em] font-mono text-moss">
              {t(`shop.role.${product.slug}`, ROLE_LABELS[product.slug])}
            </div>
            <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
              <h3 className="font-serif text-[17px] md:text-lg text-forest leading-snug mt-1 group-hover:text-moss transition-colors">
                {t(`product.${product.slug}.name`, product.name).replace(/®/g, "")}
              </h3>
            </Link>
            <div className="text-[11px] font-mono text-forest/55 mt-1">
              {t(`product.${product.slug}.size`, product.size)} · {t(`product.category.${product.category}`, product.category)}
            </div>
          </div>
          <div className="text-right whitespace-nowrap">
            <div className="text-base md:text-lg font-semibold text-forest">
              {formatMoney(price, currency)}
            </div>
            {stat && (
              <div className="text-[10.5px] font-mono text-forest/60 mt-1">
                ★ {stat.rating.toFixed(1)} · {(stat.count / 1000).toFixed(0)}k
              </div>
            )}
          </div>
        </div>

        {/* Key notes */}
        <div className="mt-3.5 mb-5 flex flex-wrap gap-1.5">
          {(product.perfectFor ?? product.benefits ?? []).slice(0, 2).map((b, bi) => (
            <span
              key={b}
              className="text-[10px] uppercase tracking-[0.16em] font-mono text-forest/70 border hairline px-2 py-1 bg-ivory"
            >
              {shorten(
                product.perfectFor
                  ? t(`product.${product.slug}.indications.${bi}`, b)
                  : t(`product.${product.slug}.benefits.${bi}`, b),
              )}
            </span>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-px bg-ink/10 border hairline">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="bg-paper py-2.5 text-center text-[10px] uppercase tracking-[0.28em] font-mono text-forest hover:bg-forest hover:text-paper transition-colors"
          >
            {t("shop.details", "Details →")}
          </Link>
          <button
            onClick={onAdd}
            className="bg-forest text-paper py-2.5 text-center text-[10px] uppercase tracking-[0.28em] font-mono hover:bg-moss transition-colors"
          >
            {t("shop.addToBag", "Add to Bag")}
          </button>
        </div>
      </div>
    </div>
  );
}

function shorten(s: string) {
  const first = s.split(/[·\-—:,\(]/)[0].trim();
  return first.length > 34 ? first.slice(0, 32) + "…" : first;
}

