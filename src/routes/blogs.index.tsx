import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { posts } from "@/lib/blog-posts";
import { abs, breadcrumbLd, canonicalFor, hreflangLinks, localeOf } from "@/lib/seo";
import { useT, useLocale } from "@/lib/i18n";
import { tStatic } from "@/lib/i18n/static";
import { Reveal } from "@/components/site/Reveal";

const [featured, ...rest] = posts;

const postTitle = (t: (k: string, f: string) => string, slug: string, fallback: string) =>
  t(`blog.${slug}.title`, fallback);
const postExcerpt = (t: (k: string, f: string) => string, slug: string, fallback: string) =>
  t(`blog.${slug}.excerpt`, fallback);
const postCategory = (t: (k: string, f: string) => string, category: string) =>
  t(`blog.category.${category}`, category);

const formatDate = (iso: string, locale: string) =>
  new Date(iso).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const Route = createFileRoute("/blogs/")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const t = tStatic(locale);
    const url = canonicalFor("/blogs", locale);
    return {
      meta: [
        { title: t("blog.head.index.title", "Journal — Green Wealth") },
        {
          name: "description",
          content: t(
            "blog.head.index.description",
            "Field notes on Neo Hair Lotion, Neo Hair Shampoo and the Ghori Dermaroller — protocols, ingredient science and timelines from the Green Wealth studio.",
          ),
        },
        { property: "og:title", content: t("blog.head.index.title", "Journal — Green Wealth") },
        {
          property: "og:description",
          content: t(
            "blog.head.index.ogDescription",
            "Protocols, ingredient science and honest timelines for the Green Wealth hair system.",
          ),
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }, ...hreflangLinks("/blogs")],
      scripts: [
        breadcrumbLd([
          { name: t("blog.head.index.breadcrumbHome", "Home"), path: "/" },
          { name: t("blog.head.index.breadcrumbJournal", "Journal"), path: "/blogs" },
        ]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Green Wealth Journal",
            url,
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: postTitle(t, p.slug, p.title),
              url: abs(`/blogs/${p.slug}`),
              datePublished: p.date,
              author: { "@type": "Organization", name: p.author },
            })),
          }),
        },
      ],
    };
  },
  component: BlogsIndex,
});


const CATEGORIES = ["All", "Ingredient", "Protocol", "Science", "Guide", "Ritual"] as const;

function BlogsIndex() {
  const t = useT();
  const locale = useLocale();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const dossiers = posts.filter((p) => p.tags.includes("Ingredient Dossier"));
  const available = CATEGORIES.filter((c) => c === "All" || posts.some((p) => p.category === c));
  const q = query.trim().toLowerCase();
  const filtered = rest.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      (!q ||
        (postTitle(t, p.slug, p.title) + " " + p.tags.join(" ") + " " + postExcerpt(t, p.slug, p.excerpt))
          .toLowerCase()
          .includes(q)),
  );

  return (
    <>
      {/* Masthead — oversized editorial plate */}
      <header className="border-b hairline bg-forest text-paper relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 12.5%)",
          }}
        />
        <div className="container-editorial pt-14 md:pt-24 pb-12 md:pb-16 relative">
          <div className="mb-10 md:mb-14 text-sm text-paper/70">{t("blog.chrome.journalLabel", "Green Wealth Journal")}</div>
          <h1 className="font-serif leading-[0.92] tracking-tight text-[12vw] md:text-[8.5vw]">
            {t("blog.chrome.heroTitle2", "The Green Wealth Journal: hair science, botanicals and honest timelines.")}
          </h1>
          <div className="mt-8 md:mt-14 grid md:grid-cols-12 gap-6 items-end border-t border-paper/20 pt-5 md:pt-6">
            <p className="md:col-span-5 text-sm md:text-base text-paper/75 leading-relaxed">
              {t(
                "blog.chrome.heroDesc2",
                "Evidence-led essays on the ingredients inside our formulas and the protocols that make them work. Every claim is qualified, every study is named.",
              )}
            </p>
          </div>
          <Link to="/blogs/series" className="mt-8 inline-block border border-paper/40 text-paper px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-paper hover:text-forest transition-colors">
            {t("blog.series.cta", "Read the full series")} →
          </Link>
        </div>
      </header>

      {/* Featured — Editor's file */}
      <section className="border-b hairline">
        <div className="container-editorial py-10 md:py-16">
          <Reveal>
            <Link to="/blogs/$slug" params={{ slug: featured.slug }} className="grid md:grid-cols-12 gap-6 md:gap-10 group">
              <div className="md:col-span-7 relative">
                <div className="aspect-[4/3] overflow-hidden bg-ivory">
                  <img
                    src={featured.cover}
                    alt={postTitle(t, featured.slug, featured.title)}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
                <div className="absolute top-0 start-0 bg-forest text-paper px-3 py-2 text-[11px] uppercase tracking-[0.18em]">
                  Fig. 01 — {t("blog.chrome.featured", "Featured")}
                </div>
              </div>
              <div className="md:col-span-5 flex flex-col justify-center">
                <div className="eyebrow mb-4">
                  {postCategory(t, featured.category)} · {featured.read.replace("min", t("blog.chrome.minutes", "min"))}{" "}
                  {t("blog.chrome.readSuffix", "read")}
                </div>
                <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] group-hover:text-forest transition-colors">
                  {postTitle(t, featured.slug, featured.title)}
                </h2>
                {featured.answer && (
                  <p className="mt-5 border-s-2 border-forest ps-4 text-[15px] leading-relaxed text-ink/80 line-clamp-5">
                    {t(`blog.${featured.slug}.answer`, featured.answer)}
                  </p>
                )}
                <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <span>{t(`blog.author.${featured.author}`, featured.author)}</span>
                  <span aria-hidden>·</span>
                  <span>{formatDate(featured.date, locale)}</span>
                </div>
                <div className="mt-8">
                  <span className="inline-block border-b border-forest pb-1 text-sm uppercase tracking-[0.18em] text-forest">
                    {t("blog.chrome.readTheEssay", "Read the essay")} &rarr;
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Ingredient dossier series — numbered plates */}
      {dossiers.length > 0 && (
        <section className="border-b hairline bg-ivory">
          <div className="container-editorial py-12 md:py-16">
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
                <div>
                  <div className="eyebrow mb-2">{t("blog.chrome.seriesEyebrow", "Series · Ingredient Dossiers")}</div>
                  <h2 className="font-serif text-2xl md:text-4xl leading-tight max-w-2xl">
                    {t("blog.chrome.seriesTitle", "Inside the formula: one botanical at a time.")}
                  </h2>
                </div>
                <Link to="/ingredients" className="eyebrow border-b border-forest pb-1 text-forest">
                  {t("blog.chrome.seriesAll", "Full ingredient glossary")}
                </Link>
              </div>
            </Reveal>
            <div className="-mx-5 px-5 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 md:mx-0 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible">
              {dossiers.map((d, i) => (
                <Reveal key={d.slug} delay={i * 60} className="snap-start shrink-0 w-[78%] sm:w-[46%] md:w-auto">
                  <Link
                    to="/blogs/$slug"
                    params={{ slug: d.slug }}
                    className="group border hairline bg-paper flex flex-col h-full"
                  >
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img
                        src={d.cover}
                        alt={postTitle(t, d.slug, d.title)}
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 md:p-5 flex-1">
                      <div className="eyebrow mb-2">{t("blog.chrome.dossierTag", "Ingredient Dossier")}</div>
                      <h3 className="font-serif text-lg md:text-xl leading-snug group-hover:text-forest transition-colors line-clamp-2">
                        {postTitle(t, d.slug, d.title)}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {postExcerpt(t, d.slug, d.excerpt)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Index — numbered ledger with hover plates */}
      <section>
        <div className="container-editorial py-10 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
            <h2 className="font-serif text-2xl md:text-3xl">{t("blog.chrome.fullIndex", "The full index")}</h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div role="tablist" aria-label={t("blog.chrome.filter", "Filter by category")} className="flex flex-wrap gap-2">
                {available.map((c) => (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={cat === c}
                    onClick={() => setCat(c)}
                    className={`text-[11px] uppercase tracking-[0.14em] px-3 py-2 border transition-colors ${
                      cat === c ? "bg-forest text-paper border-forest" : "hairline hover:border-forest"
                    }`}
                  >
                    {c === "All" ? t("blog.chrome.all", "All") : postCategory(t, c)}
                  </button>
                ))}
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("blog.chrome.search", "Search the journal")}
                aria-label={t("blog.chrome.search", "Search the journal")}
                className="border hairline bg-paper px-3 py-2 text-base md:text-sm w-full sm:w-56 focus:outline-none focus:border-forest"
              />
            </div>
          </div>
          {filtered.length === 0 ? (
            <p className="text-muted-foreground py-10">{t("blog.chrome.noResults", "No essays match your search.")}</p>
          ) : (
            <ol>
              {filtered.map((post, i) => (
                <li key={post.slug} className="border-t hairline last:border-b">
                  <Link
                    to="/blogs/$slug"
                    params={{ slug: post.slug }}
                    className="group grid grid-cols-12 gap-4 md:gap-6 items-center py-5 md:py-7"
                  >
                    <div className="col-span-8 md:col-span-7 min-w-0">
                      <div className="eyebrow mb-1.5">{postCategory(t, post.category)}</div>
                      <h3 className="font-serif text-lg md:text-3xl leading-snug group-hover:text-forest transition-colors">
                        {postTitle(t, post.slug, post.title)}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-1">
                        {postExcerpt(t, post.slug, post.excerpt)}
                      </p>
                    </div>
                    <div className="col-span-4 md:col-span-3 aspect-square md:aspect-[4/3] overflow-hidden bg-ivory">
                      <img
                        src={post.cover}
                        alt={postTitle(t, post.slug, post.title)}
                        className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-700"
                        loading={i < 2 ? "eager" : "lazy"}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-2 md:text-end text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {formatDate(post.date, locale)}
                      <span aria-hidden className="mx-2">·</span>
                      {post.read.replace("min", t("blog.chrome.minutes", "min"))} {t("blog.chrome.readSuffix", "read")}
                      <span aria-hidden className="hidden md:inline-block ms-3 text-forest opacity-0 group-hover:opacity-100 transition-opacity">
                        &rarr;
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Footer strip */}
      <section className="border-t hairline bg-forest text-paper">
        <div className="container-editorial py-12 md:py-16 grid md:grid-cols-2 gap-8 items-end">
          <div>
            <div className="eyebrow mb-4 text-paper/70">{t("blog.chrome.studioLetterEyebrow", "The Studio Letter")}</div>
            <h2 className="font-serif text-2xl md:text-3xl leading-tight max-w-md">
              {t(
                "blog.chrome.studioLetterTitle",
                "One essay a month. Written by the team that formulates the products.",
              )}
            </h2>
          </div>
          <p className="text-sm text-paper/70 leading-relaxed md:text-right">
            {t(
              "blog.chrome.studioLetterDesc",
              "No promotions, no discount codes, no forwarded press releases. Subscribe from the footer of any page.",
            )}
          </p>
        </div>
      </section>
    </>
  );
}
