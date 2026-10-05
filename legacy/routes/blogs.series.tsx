/**
 * Journal Series overview — all journal essays in one ordered curriculum.
 * Users: readers & search/AI crawlers. Key actions: start reading, jump to any entry.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { abs, breadcrumbLd, canonicalFor, hreflangLinks, localeOf } from "@/lib/seo";
import { useLocale, useT } from "@/lib/i18n";
import { SERIES_INTRO, SERIES_ORDER, SERIES_PARTS, SERIES_TITLE, pick } from "@/lib/blog-series";
import { postBySlug } from "@/lib/blog-posts";

export const Route = createFileRoute("/blogs/series")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const title = `${pick(SERIES_TITLE, locale)} — Green Wealth Journal`;
    const desc = pick(SERIES_INTRO, locale);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonicalFor("/blogs/series", locale) },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/blogs/series", locale) }, ...hreflangLinks("/blogs/series")],
      scripts: [
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/blogs" },
          { name: "Series", path: "/blogs/series" },
        ]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: SERIES_TITLE.en,
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            numberOfItems: SERIES_ORDER.length,
            itemListElement: SERIES_ORDER.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: abs(`/blogs/${p.slug}`),
              name: p.title,
            })),
          }),
        },
      ],
    };
  },
  component: SeriesPage,
});

const num = (n: number) => String(n).padStart(2, "0");

function SeriesPage() {
  const t = useT();
  const locale = useLocale();
  const first = SERIES_ORDER[0];
  let counter = 0;

  return (
    <div>
      <header className="bg-forest text-paper">
        <div className="container-editorial py-14 md:py-24">
          <div className="eyebrow text-paper/60 mb-5">
            <Link to="/blogs" className="hover:text-paper">{t("nav.journal", "Journal")}</Link> · {t("blog.series.eyebrow", "Series")}
          </div>
          <h1 className="font-serif text-[11vw] md:text-[6.5vw] leading-[0.95] max-w-5xl">{pick(SERIES_TITLE, locale)}</h1>
          <p className="mt-6 max-w-2xl text-paper/80 text-[15px] md:text-lg leading-relaxed">{pick(SERIES_INTRO, locale)}</p>
          <div className="mt-10 grid grid-cols-3 max-w-lg border-t border-paper/20">
            {[
              [num(SERIES_ORDER.length), t("blog.series.essays", "Essays")],
              [num(SERIES_PARTS.length), t("blog.series.parts", "Parts")],
              [String(SERIES_ORDER.reduce((a, p) => a + (parseInt(p.read) || 0), 0)), t("blog.series.minutes", "Minutes")],
            ].map(([v, l]) => (
              <div key={l} className="pt-4 pe-4">
                <div className="font-serif text-3xl md:text-4xl">{v}</div>
                <div className="eyebrow text-paper/60 mt-1">{l}</div>
              </div>
            ))}
          </div>
          {first && (
            <Link
              to="/blogs/$slug"
              params={{ slug: first.slug }}
              className="mt-10 inline-block bg-paper text-forest px-7 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ivory"
            >
              {t("blog.series.start", "Start with essay 01")} {locale === "ar" ? "←" : "→"}
            </Link>
          )}
        </div>
      </header>

      {SERIES_PARTS.map((part, pi) => (
        <section key={part.key} className={`border-b hairline ${pi % 2 ? "bg-ivory" : "bg-paper"}`}>
          <div className="container-editorial py-12 md:py-16 grid md:grid-cols-[280px_1fr] gap-8 md:gap-14">
            <div>
              <div className="font-serif text-6xl md:text-7xl text-forest/20 leading-none">{num(pi + 1)}</div>
              <h2 className="font-serif text-2xl md:text-3xl mt-3 text-ink">{pick(part.title, locale)}</h2>
              <p className="mt-3 text-sm text-ink/70 leading-relaxed">{pick(part.summary, locale)}</p>
            </div>
            <ol className="border-t hairline">
              {part.slugs.map((slug) => {
                const post = postBySlug(slug);
                if (!post) return null;
                counter += 1;
                return (
                  <li key={slug} className="border-b hairline">
                    <Link
                      to="/blogs/$slug"
                      params={{ slug }}
                      className="group grid grid-cols-[44px_72px_1fr] md:grid-cols-[56px_110px_1fr_auto] gap-4 items-center py-4"
                    >
                      <span className="font-serif text-2xl text-forest">{num(counter)}</span>
                      <span className="aspect-square md:aspect-[4/3] bg-ivory overflow-hidden">
                        <img src={post.cover} alt={t(`blog.${slug}.title`, post.title)} loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition" />
                      </span>
                      <span>
                        <span className="eyebrow block mb-1">{t(`blog.category.${post.category}`, post.category)} · {post.read.replace("min", t("blog.chrome.minutes", "min"))}</span>
                        <span className="font-serif text-lg md:text-xl leading-snug text-ink group-hover:text-forest block">{t(`blog.${slug}.title`, post.title)}</span>
                        <span className="hidden md:block text-sm text-ink/65 mt-1 line-clamp-2">{t(`blog.${slug}.excerpt`, post.excerpt)}</span>
                      </span>
                      <span className="hidden md:block eyebrow text-forest">{t("blog.chrome.read", "Read")} {locale === "ar" ? "←" : "→"}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      ))}
    </div>
  );
}
