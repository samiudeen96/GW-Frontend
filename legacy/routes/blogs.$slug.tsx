import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { postBySlug, posts, type BlogPost } from "@/lib/blog-posts";
import { blogProductRefs, PRODUCT_LABEL } from "@/lib/blog-product-links";
import { seriesPosition, SERIES_TITLE, pick } from "@/lib/blog-series";
import { abs, hreflangLinks, localeOf } from "@/lib/seo";
import { useT, useLocale } from "@/lib/i18n";
import { tStatic } from "@/lib/i18n/static";

const formatDate = (iso: string, locale = "en") =>
  new Date(iso).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-US", { year: "numeric", month: "long", day: "numeric" });

export const Route = createFileRoute("/blogs/$slug")({
  loader: ({ params }) => {
    const post = postBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: (ctx) => {
    const { loaderData } = ctx as { loaderData?: { post: BlogPost } };
    const ts = tStatic(localeOf(ctx as any));
    if (!loaderData) {
      return {
        meta: [
          { title: `${ts("blog.chrome.notFoundTitle", "Article unavailable")} — ${ts("blog.chrome.journal", "Green Wealth Journal")}` },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { post } = loaderData;
    const url = abs(`/blogs/${post.slug}`);
    const cover = typeof post.cover === "string" ? abs(post.cover) : post.cover;
    const title = ts(`blog.${post.slug}.title`, post.title);
    const excerpt = ts(`blog.${post.slug}.excerpt`, post.excerpt);
    return {
      meta: [
        { title: `${title} — ${ts("blog.chrome.journal", "Green Wealth Journal")}` },
        { name: "description", content: excerpt },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: excerpt },
        { property: "og:image", content: cover },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: cover },
        { name: "article:published_time", content: post.date },
        { name: "article:author", content: post.author },
      ],
      links: [{ rel: "canonical", href: url }, ...hreflangLinks(`/blogs/${post.slug}`)],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: title,
            description: excerpt,
            image: [cover],
            datePublished: post.date,
            dateModified: post.date,
            author: { "@type": "Organization", name: post.author },
            publisher: {
              "@type": "Organization",
              name: "Green Wealth",
              logo: {
                "@type": "ImageObject",
                url: abs("/favicon.ico"),
              },
            },
            mainEntityOfPage: url,
            articleSection: ts(`blog.category.${post.category}`, post.category),
            keywords: post.tags.join(", "),
            ...(post.answer ? { abstract: ts(`blog.${post.slug}.answer`, post.answer) } : {}),
            inLanguage: localeOf(ctx as any) === "ar" ? "ar" : "en",
          }),
        },
        ...(post.faqs?.length
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: post.faqs.map((f, fi) => ({
                    "@type": "Question",
                    name: ts(`blog.${post.slug}.faq${fi}.q`, f.q),
                    acceptedAnswer: { "@type": "Answer", text: ts(`blog.${post.slug}.faq${fi}.a`, f.a) },
                  })),
                }),
              },
            ]
          : []),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: ts("ing.breadcrumb.home", "Home"), item: abs("/") },
              { "@type": "ListItem", position: 2, name: ts("blog.chrome.journal", "Journal"), item: abs("/blogs") },
              { "@type": "ListItem", position: 3, name: title, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: NotFound,
  component: BlogArticle,
});


function NotFound() {
  const t = useT();
  return (
    <div className="container-editorial py-24 text-center">
      <div className="eyebrow mb-4">404 · {t("blog.chrome.journal", "Journal")}</div>
      <h1 className="font-serif text-3xl mb-4">{t("blog.chrome.notFoundTitle", "Article unavailable")}</h1>
      <Link to="/blogs" className="underline underline-offset-4">
        {t("blog.chrome.returnToJournal", "Return to the journal")}
      </Link>
    </div>
  );
}

function BlogArticle() {
  const t = useT();
  const locale = useLocale();
  const { post } = Route.useLoaderData() as { post: BlogPost };
  const others = posts.filter((p) => p.slug !== post.slug);
  const related = [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, 3);
  const pos = seriesPosition(post.slug);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <article>
      <div aria-hidden className="fixed top-0 inset-x-0 h-[3px] z-[60] bg-transparent">
        <div className="h-full bg-forest origin-left rtl:origin-right" style={{ transform: `scaleX(${progress})` }} />
      </div>
      {/* Header */}
      <header className="border-b hairline bg-paper">
        <div className="container-editorial pt-10 md:pt-16 pb-8 md:pb-12">
          <div className="flex items-center gap-3 eyebrow mb-6">
            <Link to="/blogs" className="hover:text-forest">
              {t("blog.chrome.journal", "Journal")}
            </Link>
            <span aria-hidden>/</span>
            <span>{t(`blog.category.${post.category}`, post.category)}</span>
          </div>
          <h1 className="display-lg max-w-4xl leading-[0.98]">{t(`blog.${post.slug}.title`, post.title)}</h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {t(`blog.${post.slug}.excerpt`, post.excerpt)}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <span>{t(`blog.author.${post.author}`, post.author)}</span>
            <span>{formatDate(post.date, locale)}</span>
            <span>{post.read.replace("min", t("blog.chrome.minutes", "min"))} {t("blog.chrome.readSuffix", "read")}</span>
          </div>
        </div>
      </header>

      {/* Cover */}
      <div className="border-b hairline">
        <div className="container-editorial py-6 md:py-10">
          <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-ivory">
            <img src={post.cover} alt={t(`blog.${post.slug}.title`, post.title)} className="w-full h-full object-contain"
          loading="lazy"
          decoding="async"
        />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-editorial py-12 md:py-20">
        <div className="grid md:grid-cols-12 gap-10">
          <aside className="md:col-span-3 hidden md:block">
            <div className="sticky top-28 space-y-6">
              <div>
                <div className="eyebrow mb-3">{t("blog.chrome.inThisEssay", "In this essay")}</div>
                <ul className="space-y-2 text-sm">
                  {post.sections
                    .map((s, si) => ({ s, si }))
                    .filter(({ s }) => s.heading)
                    .map(({ s, si }) => (
                      <li key={s.heading} className="text-muted-foreground leading-snug">
                        {t(`blog.${post.slug}.s${si}.heading`, s.heading!)}
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <div className="eyebrow mb-3">{t("blog.chrome.tagged", "Tagged")}</div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] uppercase tracking-[0.12em] border hairline px-2 py-1"
                    >
                      {t(`blog.tag.${tag}`, tag)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="md:col-span-9 max-w-3xl">
            {post.answer && (
              <section aria-labelledby="quick-answer" className="mb-10 border border-forest bg-ivory p-6 md:p-8">
                <h2 id="quick-answer" className="eyebrow text-forest mb-3">{t("blog.chrome.quickAnswer", "The short answer")}</h2>
                <p className="text-[16px] md:text-[17px] leading-[1.75] text-ink">{t(`blog.${post.slug}.answer`, post.answer)}</p>
              </section>
            )}
            {post.takeaways?.length ? (
              <section className="mb-12">
                <h2 className="eyebrow mb-4">{t("blog.chrome.keyTakeaways", "Key takeaways")}</h2>
                <ul className="grid sm:grid-cols-2 gap-px bg-border border hairline">
                  {post.takeaways.map((k, ki) => (
                    <li key={ki} className="bg-paper p-5 text-sm leading-relaxed">
                      <span className="font-serif text-forest me-2">+</span>
                      {t(`blog.${post.slug}.tk${ki}`, k)}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <div className="space-y-8 text-[16px] md:text-[17px] leading-[1.8] text-ink/85">
              {post.sections.map((section, i) => (
                <section key={i} className="space-y-4">
                  {section.heading && (
                    <h2 className="font-serif text-2xl md:text-3xl text-ink mt-4">
                      {t(`blog.${post.slug}.s${i}.heading`, section.heading)}
                    </h2>
                  )}
                  {section.body.map((paragraph, j) => (
                    <p key={j}>{t(`blog.${post.slug}.s${i}.p${j}`, paragraph)}</p>
                  ))}
                </section>
              ))}
            </div>

            {post.faqs?.length ? (
              <section className="mt-16">
                <h2 className="font-serif text-2xl md:text-3xl mb-6">{t("blog.chrome.faqTitle", "Frequently asked questions")}</h2>
                <div className="border-t hairline">
                  {post.faqs.map((f, fi) => (
                    <details key={fi} className="group border-b hairline py-5">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-serif text-lg leading-snug">
                        <span>{t(`blog.${post.slug}.faq${fi}.q`, f.q)}</span>
                        <span aria-hidden className="text-forest group-open:rotate-45 transition-transform">+</span>
                      </summary>
                      <p className="mt-3 text-[15px] leading-[1.75] text-ink/80">{t(`blog.${post.slug}.faq${fi}.a`, f.a)}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}
            <section aria-labelledby="in-our-products" className="mt-14 border border-forest">
              <div className="bg-forest px-6 py-4">
                <h2 id="in-our-products" className="eyebrow text-ivory">
                  {t("blog.chrome.inOurProducts", "Where this appears in Green Wealth products")}
                </h2>
              </div>
              <ul className="divide-y hairline">
                {blogProductRefs(post.slug).map((ref) => (
                  <li key={ref.slug} className="p-6 md:p-7 grid md:grid-cols-[1fr_auto] gap-4 md:items-center">
                    <div>
                      <div className="font-serif text-xl mb-2">{PRODUCT_LABEL[ref.slug][locale === "ar" ? "ar" : "en"]}</div>
                      <p className="text-[15px] leading-[1.7] text-ink/80">{locale === "ar" ? ref.ar : ref.en}</p>
                    </div>
                    <Link
                      to="/product/$slug"
                      params={{ slug: ref.slug }}
                      className="text-sm uppercase tracking-[0.18em] border-b border-forest pb-1 text-forest whitespace-nowrap justify-self-start"
                    >
                      {t("blog.chrome.viewProduct", "View product")} {locale === "ar" ? "←" : "→"}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
              {t("blog.chrome.disclaimer", "This article is for education only and is not medical advice. Consult a qualified clinician for diagnosis or treatment of hair loss.")}
            </p>

            <div className="mt-14 pt-8 border-t hairline flex flex-wrap items-center justify-between gap-4">
              <div className="eyebrow">{t("blog.chrome.endOfEssay", "End of essay")}</div>
              <Link
                to="/shop"
                className="text-sm uppercase tracking-[0.18em] border-b border-forest pb-1 text-forest"
              >
                {t("blog.chrome.shopTheSystem", "Shop the Green Wealth system")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {pos && (
        <nav aria-label={t("blog.series.eyebrow", "Series")} className="border-t hairline bg-paper">
          <div className="container-editorial py-8 md:py-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
              <div className="eyebrow">
                {pick(SERIES_TITLE, locale)} · {String(pos.index + 1).padStart(2, "0")} / {String(pos.total).padStart(2, "0")}
              </div>
              <Link to="/blogs/series" className="eyebrow text-forest border-b border-forest pb-0.5">
                {t("blog.series.overview", "Series overview")}
              </Link>
            </div>
            <div className="h-[3px] bg-ink/10 mb-6"><div className="h-full bg-forest" style={{ width: `${((pos.index + 1) / pos.total) * 100}%` }} /></div>
            <div className="grid md:grid-cols-2 gap-px bg-ink/10 border hairline">
              {pos.prev ? (
                <Link to="/blogs/$slug" params={{ slug: pos.prev.slug }} className="bg-paper p-5 md:p-6 hover:bg-ivory group">
                  <div className="eyebrow mb-2">{locale === "ar" ? "→" : "←"} {t("blog.series.prev", "Previous essay")}</div>
                  <div className="font-serif text-lg leading-snug group-hover:text-forest">{t(`blog.${pos.prev.slug}.title`, pos.prev.title)}</div>
                </Link>
              ) : <div className="bg-paper p-5 md:p-6 eyebrow text-ink/40">{t("blog.series.beginning", "Beginning of the series")}</div>}
              {pos.next ? (
                <Link to="/blogs/$slug" params={{ slug: pos.next.slug }} className="bg-forest text-paper p-5 md:p-6 hover:opacity-95 text-end">
                  <div className="eyebrow mb-2 text-paper/70">{t("blog.series.next", "Next essay")} {locale === "ar" ? "←" : "→"}</div>
                  <div className="font-serif text-lg leading-snug">{t(`blog.${pos.next.slug}.title`, pos.next.title)}</div>
                </Link>
              ) : (
                <Link to="/blogs/series" className="bg-forest text-paper p-5 md:p-6 text-end">
                  <div className="eyebrow mb-2 text-paper/70">{t("blog.series.complete", "Series complete")}</div>
                  <div className="font-serif text-lg">{t("blog.series.overview", "Series overview")}</div>
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Related */}
      <section className="border-t hairline bg-ivory">
        <div className="container-editorial py-12 md:py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-2xl md:text-3xl">{t("blog.chrome.continueReading", "Continue reading")}</h2>
            <Link to="/blogs" className="eyebrow hover:text-forest">
              {t("blog.chrome.allEssays", "All essays")}
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/blogs/$slug"
                params={{ slug: r.slug }}
                className="group block"
              >
                <div className="aspect-[4/3] overflow-hidden bg-paper mb-4">
                  <img
                    src={r.cover}
                    alt={t(`blog.${r.slug}.title`, r.title)}
                    className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="eyebrow mb-2">{t(`blog.category.${r.category}`, r.category)} · {r.read.replace("min", t("blog.chrome.minutes", "min"))}</div>
                <h3 className="font-serif text-lg leading-snug group-hover:text-forest">
                  {t(`blog.${r.slug}.title`, r.title)}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
