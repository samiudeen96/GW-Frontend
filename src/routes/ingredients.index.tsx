import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/site/Page";
import { ingredients } from "@/lib/ingredients";
import { ingredientExtras } from "@/lib/ingredient-extras";
import { getProduct, products } from "@/lib/products";
import { abs, canonicalFor, hreflangLinks, breadcrumbLd, localeOf } from "@/lib/seo";
import { useT } from "@/lib/i18n";
import { tStatic } from "@/lib/i18n/static";

export const Route = createFileRoute("/ingredients/")({
  head: (ctx) => {
    const locale = localeOf(ctx as any);
    const url = canonicalFor("/ingredients", locale);
    const ts = tStatic(locale);
    return {
      meta: [
        { title: ts("ingx.meta.title", "Ingredient Glossary — Botanicals Behind Green Wealth") },
        {
          name: "description",
          content: ts(
            "ingx.meta.desc",
            "Every botanical, extract and active used across the Green Wealth range — history, mechanism and the role each plays in scalp health and hair growth.",
          ),
        },
        { property: "og:title", content: ts("ingx.meta.ogTitle", "Ingredient Glossary — Green Wealth") },
        { property: "og:description", content: ts("ingx.meta.ogDesc", "The botanicals behind Neo Hair Lotion, Neo Hair Shampoo, Rosemary Oil and Dermaroller.") },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }, ...hreflangLinks("/ingredients")],
      scripts: [
        breadcrumbLd([
          { name: ts("ing.breadcrumb.home", "Home"), path: "/" },
          { name: ts("ing.breadcrumb.ingredients", "Ingredients"), path: "/ingredients" },
        ]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: "Green Wealth Ingredient Glossary",
            hasDefinedTerm: ingredients.map((i) => ({
              "@type": "DefinedTerm",
              name: ts(`ingdata.${i.name}`, i.name),
              description: ts(`ingdata.${i.summary ?? i.description}`, i.summary ?? i.description),
              url: abs(`/ingredients/${i.slug}`),
            })),
          }),
        },
      ],
    };
  },
  component: IngredientsIndex,
});

// ─── helpers ────────────────────────────────────────────────
const stripBrand = (s: string) =>
  s.replace(/®/g, "").replace(/^Green Wealth\s+/i, "").replace(/^Ghori\s+/i, "");

const familyOf = (slug: string) => ingredientExtras[slug]?.family?.split("(")[0].trim();

// Curated theme buckets — mapped from extras.tags
const THEMES = [
  { id: "all", label: "All Botanicals", match: () => true },
  { id: "growth", label: "Growth & Density", match: (t: string[]) => t.some((x) => /growth|regrowth|dht|circulation|density|anagen/i.test(x)) },
  { id: "strength", label: "Strand Strength", match: (t: string[]) => t.some((x) => /silica|strength|keratin|structure|structural|shine/i.test(x)) },
  { id: "scalp", label: "Scalp & Barrier", match: (t: string[]) => t.some((x) => /scalp|barrier|soothing|calm|cool|anti-inflammatory|balance/i.test(x)) },
  { id: "antiox", label: "Antioxidant & Repair", match: (t: string[]) => t.some((x) => /antioxidant|repair|renew|cell|adaptogen|protect/i.test(x)) },
] as const;

function IngredientsIndex() {
  const t = useT();
  const ing = (v?: string) => (v ? t(`ingdata.${v}`, v) : "");
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<(typeof THEMES)[number]["id"]>("all");
  const [productFilter, setProductFilter] = useState<string>("all");

  // ─── Featured rotator ─────────────────────────────────────
  const featuredSlugs = ["saw-palmetto", "white-ginseng", "rosemary-oil", "cantaloupe"].filter((s) =>
    ingredients.some((i) => i.slug === s),
  );
  const featuredList = featuredSlugs.length
    ? featuredSlugs.map((s) => ingredients.find((i) => i.slug === s)!)
    : ingredients.slice(0, 4);
  const [featIdx, setFeatIdx] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setFeatIdx((i) => (i + 1) % featuredList.length), 5000);
    return () => window.clearInterval(t);
  }, [featuredList.length]);
  const featured = featuredList[featIdx];
  const featExtra = ingredientExtras[featured.slug];

  // ─── Filtering ────────────────────────────────────────────
  const filtered = useMemo(() => {
    const themeDef = THEMES.find((t) => t.id === theme)!;
    const q = query.trim().toLowerCase();
    return ingredients.filter((i) => {
      const tags = ingredientExtras[i.slug]?.tags ?? [];
      if (!themeDef.match(tags)) return false;
      if (productFilter !== "all" && !i.productSlugs.includes(productFilter)) return false;
      if (!q) return true;
      const hay = `${i.name} ${i.latin ?? ""} ${i.summary ?? ""} ${i.description ?? ""} ${tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, theme, productFilter]);

  // ─── Alphabetical index ───────────────────────────────────
  const alphaGroups = useMemo(() => {
    const g = new Map<string, typeof ingredients>();
    for (const i of filtered) {
      const letter = i.name[0].toUpperCase();
      const arr = g.get(letter) ?? [];
      arr.push(i);
      g.set(letter, arr);
    }
    return Array.from(g.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const totalUsages = ingredients.reduce((s, i) => s + i.productSlugs.length, 0);
  const uniqueFamilies = new Set(ingredients.map((i) => familyOf(i.slug)).filter(Boolean)).size;

  return (
    <>
      <PageHeader
        eyebrow={t("ingx.eyebrow", "Glossary · {n} entries · {f} plant families")
          .replace("{n}", String(ingredients.length))
          .replace("{f}", String(uniqueFamilies))}
        title={t("ingx.title", "The Botanical Library")}
        intro={t("ingx.intro", "Every active, extract and mineral used across Green Wealth and Ghori — with history, mechanism, and the role each plays in scalp health and hair growth.")}
      />

      {/* ═════════════ Cinematic featured rotator ═════════════ */}
      <section className="container-editorial mt-2 md:mt-4">
        <div className="border hairline bg-paper overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
            {/* Image */}
            <div className="relative aspect-[4/5] md:aspect-[5/6] lg:aspect-auto bg-ivory overflow-hidden">
              {featuredList.map((f, i) => (
                <img
                  key={f.slug}
                  src={f.image}
                  alt={`${ing(f.name)} — ${t("img.ingredientAltStudied", "botanical hair-growth active studied by Green Wealth")}`}
                  title={ing(f.name)}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ${
                    i === featIdx ? "opacity-100" : "opacity-0"
                  }`}
          loading="lazy"
          decoding="async"
        />
              ))}
              {featured.latin && (
                <div className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.28em] font-mono text-forest/70 bg-paper/85 px-2 py-1 border hairline">
                  {featured.latin}
                </div>
              )}
            </div>

            {/* Copy */}
            <div className="p-6 md:p-10 flex flex-col justify-between gap-6">
              <div>
                <div className="text-[9.5px] uppercase tracking-[0.32em] font-mono text-moss">
                  {t("ingx.featured", "Featured Botanical")}
                </div>
                <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] text-forest mt-3">
                  {ing(featured.name)}
                </h2>
                {featured.role && (
                  <div className="text-[11px] uppercase tracking-[0.24em] font-mono text-forest/60 mt-3">
                    {ing(featured.role)}
                  </div>
                )}
                <p className="text-forest/75 text-[13.5px] md:text-sm leading-relaxed mt-4 max-w-md">
                  {ing(featured.summary ?? featured.description)}
                </p>

                {featExtra && (
                  <div className="mt-6 grid grid-cols-3 gap-px bg-ink/10 border hairline max-w-md">
                    <div className="bg-paper px-3 py-3">
                      <div className="text-[9px] uppercase tracking-[0.28em] font-mono text-forest/50">{t("ingx.family", "Family")}</div>
                      <div className="text-[12px] text-forest mt-0.5 leading-tight">{familyOf(featured.slug) ? ing(familyOf(featured.slug)) : "—"}</div>
                    </div>
                    <div className="bg-paper px-3 py-3">
                      <div className="text-[9px] uppercase tracking-[0.28em] font-mono text-forest/50">{t("ingx.partUsed", "Part used")}</div>
                      <div className="text-[12px] text-forest mt-0.5 leading-tight">{featExtra.partUsed ? ing(featExtra.partUsed.split("—")[0].trim()) : "—"}</div>
                    </div>
                    <div className="bg-paper px-3 py-3">
                      <div className="text-[9px] uppercase tracking-[0.28em] font-mono text-forest/50">{t("ingx.usedIn", "Used in")}</div>
                      <div className="text-[12px] text-forest mt-0.5 leading-tight">{featured.productSlugs.length} {t("ingx.products", "products")}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to="/ingredients/$slug"
                  params={{ slug: featured.slug }}
                  className="inline-block bg-forest text-paper px-5 py-2.5 text-[10px] uppercase tracking-[0.28em] font-mono hover:bg-moss transition-colors"
                >
                  {t("ingx.readDossier", "Read the dossier →")}
                </Link>
                {featuredList.map((f, i) => (
                  <button
                    key={f.slug}
                    onClick={() => setFeatIdx(i)}
                    aria-label={`${t("ingx.show", "Show")} ${ing(f.name)}`}
                    className={`w-8 h-1 transition-colors ${i === featIdx ? "bg-forest" : "bg-ink/15 hover:bg-moss"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════ Stats strip ═════════════ */}
      <div className="container-editorial mt-6 md:mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/10 border hairline text-center">
          {[
            { k: t("ingx.stat.actives", "Actives catalogued"), v: ingredients.length },
            { k: t("ingx.stat.families", "Plant families"), v: uniqueFamilies },
            { k: t("ingx.stat.slots", "Formula slots"), v: totalUsages },
            { k: t("ingx.stat.products", "Products"), v: products.length },
          ].map((c) => (
            <div key={c.k} className="bg-paper px-3 py-4">
              <div className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-moss">{c.k}</div>
              <div className="font-serif text-xl md:text-2xl text-forest mt-1">{c.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═════════════ Filters ═════════════ */}
      <section className="container-editorial mt-10 md:mt-14">
        <div className="border hairline bg-paper">
          {/* Search + product filter row */}
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-px bg-ink/10">
            <label className="bg-paper flex items-center gap-3 px-4 py-3">
              <span className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-forest/50 shrink-0">{t("ingx.search", "Search")}</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("ingx.searchPlaceholder", "e.g. ginseng, silica, scalp barrier…")}
                className="flex-1 min-w-0 bg-transparent outline-none text-[13px] text-forest placeholder:text-forest/35"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-[10px] font-mono text-forest/50 hover:text-forest"
                  aria-label={t("ingx.clearAria", "Clear search")}
                >
                  {t("ingx.clear", "clear ×")}
                </button>
              )}
            </label>
            <div className="bg-paper flex items-center gap-2 px-4 py-3 overflow-x-auto">
              <span className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-forest/50 shrink-0">{t("ingx.inProduct", "In product")}</span>
              <button
                onClick={() => setProductFilter("all")}
                className={`text-[10px] uppercase tracking-[0.24em] font-mono px-2 py-1 border hairline whitespace-nowrap ${
                  productFilter === "all" ? "bg-forest text-paper border-forest" : "text-forest/70 hover:bg-ivory"
                }`}
              >
                {t("ingx.all", "All")}
              </button>
              {products.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => setProductFilter(p.slug)}
                  className={`text-[10px] uppercase tracking-[0.24em] font-mono px-2 py-1 border hairline whitespace-nowrap ${
                    productFilter === p.slug ? "bg-forest text-paper border-forest" : "text-forest/70 hover:bg-ivory"
                  }`}
                >
                  {stripBrand(t(`product.${p.slug}.name`, p.name))}
                </button>
              ))}
            </div>
          </div>

          {/* Theme tabs */}
          <div className="border-t hairline grid grid-cols-2 sm:grid-cols-5 gap-px bg-ink/10">
            {THEMES.map((th) => {
              const on = theme === th.id;
              const count = th.id === "all"
                ? ingredients.length
                : ingredients.filter((i) => th.match(ingredientExtras[i.slug]?.tags ?? [])).length;
              return (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  className={`text-left px-3 py-3 transition-colors ${on ? "bg-forest text-paper" : "bg-paper text-forest hover:bg-ivory"}`}
                  aria-pressed={on}
                >
                  <div className={`text-[9px] uppercase tracking-[0.28em] font-mono ${on ? "text-gold" : "text-forest/50"}`}>
                    {String(count).padStart(2, "0")}
                  </div>
                  <div className="text-[11.5px] mt-1 leading-tight">{t(`ingx.theme.${th.id}`, th.label)}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] font-mono text-forest/55">
          <span>{t("ingx.showing", "Showing {a} of {b} entries").replace("{a}", String(filtered.length)).replace("{b}", String(ingredients.length))}</span>
          {(query || theme !== "all" || productFilter !== "all") && (
            <button
              onClick={() => { setQuery(""); setTheme("all"); setProductFilter("all"); }}
              className="hover:text-moss"
            >
              {t("ingx.reset", "reset filters →")}
            </button>
          )}
        </div>
      </section>

      {/* ═════════════ Grid ═════════════ */}
      <section className="container-editorial mt-6 md:mt-8">
        {filtered.length === 0 ? (
          <div className="border hairline bg-paper p-10 text-center">
            <div className="eyebrow text-moss">{t("ingx.noMatches", "No matches")}</div>
            <div className="font-serif text-2xl text-forest mt-2">{t("ingx.nothingFound", "Nothing found for those filters.")}</div>
            <button
              onClick={() => { setQuery(""); setTheme("all"); setProductFilter("all"); }}
              className="mt-4 inline-block border border-forest px-5 py-2.5 text-[10px] uppercase tracking-[0.28em] font-mono text-forest hover:bg-forest hover:text-paper transition-colors"
            >
              {t("ingx.resetFilters", "Reset filters")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 border hairline">
            {filtered.map((i, idx) => {
              const extras = ingredientExtras[i.slug];
              return (
                <Link
                  key={i.slug}
                  to="/ingredients/$slug"
                  params={{ slug: i.slug }}
                  className="group relative block bg-paper overflow-hidden"
                >
                  <div className="relative aspect-[4/3] bg-ivory overflow-hidden">
                    {i.image ? (
                      <img
                        src={i.image}
                        alt={`${ing(i.name)} — ${t("img.ingredientAltCare", "botanical active in Green Wealth hair care")}`}
                        title={ing(i.name)}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center">
                        <div className="font-serif text-6xl text-forest/15">{i.name[0]}</div>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 text-[9px] uppercase tracking-[0.28em] font-mono text-forest/70 bg-paper/85 px-2 py-0.5 border hairline">
                      {t("ingx.no", "No.")} {String(idx + 1).padStart(2, "0")}
                    </div>
                    {extras?.family && (
                      <div className="absolute bottom-2 left-2 text-[9px] uppercase tracking-[0.24em] font-mono text-paper bg-forest/90 px-2 py-0.5">
                        {ing(extras.family.split("(")[0].trim())}
                      </div>
                    )}
                  </div>

                  <div className="p-4 md:p-5">
                    <div className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-moss">
                      {i.role ? ing(i.role) : t("ingx.botanical", "Botanical")}
                    </div>
                    <h3 className="font-serif text-lg md:text-xl text-forest mt-1 leading-tight group-hover:text-moss transition-colors">
                      {ing(i.name)}
                    </h3>
                    {i.latin && (
                      <p className="text-[11px] text-forest/55 font-mono mt-0.5">{i.latin}</p>
                    )}
                    <p className="text-[12.5px] text-forest/70 mt-2 line-clamp-2 leading-relaxed">
                      {ing(i.summary ?? i.description)}
                    </p>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(extras?.tags ?? []).slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] uppercase tracking-[0.2em] font-mono text-forest/70 bg-ivory border hairline px-1.5 py-0.5">
                          {ing(tag)}
                        </span>
                      ))}
                    </div>

                    {/* Used in */}
                    <div className="mt-3 pt-3 border-t hairline flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1 min-w-0">
                        {i.productSlugs.map((ps) => {
                          const p = getProduct(ps);
                          if (!p) return null;
                          const short = stripBrand(t(`product.${p.slug}.name`, p.name)).split(" ").slice(0, 2).join(" ");
                          return (
                            <span key={ps} className="text-[9px] uppercase tracking-[0.2em] font-mono text-paper bg-forest px-1.5 py-0.5">
                              {short}
                            </span>
                          );
                        })}
                      </div>
                      <span className="text-[10px] font-mono text-forest/50 group-hover:text-moss transition-colors shrink-0">
                        {t("ingx.open", "Open →")}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ═════════════ Alphabetical index ═════════════ */}
      {filtered.length > 0 && (
        <section className="container-editorial mt-10 md:mt-16">
          <div className="border hairline bg-paper">
            <div className="p-5 md:p-6 border-b hairline flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl md:text-2xl text-forest leading-tight">{t("ingx.alpha", "Alphabetical index")}</h2>
              </div>
              <div className="hidden md:flex items-center gap-1">
                {alphaGroups.map(([letter]) => (
                  <a
                    key={letter}
                    href={`#alpha-${letter}`}
                    className="text-[11px] font-mono px-2 py-1 border hairline text-forest/70 hover:bg-forest hover:text-paper hover:border-forest transition-colors"
                  >
                    {letter}
                  </a>
                ))}
              </div>
            </div>
            <div className="divide-y">
              {alphaGroups.map(([letter, list]) => (
                <div key={letter} id={`alpha-${letter}`} className="grid grid-cols-[48px_1fr] md:grid-cols-[80px_1fr] scroll-mt-20">
                  <div className="bg-ivory border-r hairline p-3 md:p-4 font-serif text-2xl md:text-3xl text-forest">
                    {letter}
                  </div>
                  <ul className="divide-y">
                    {list.map((i) => (
                      <li key={i.slug}>
                        <Link
                          to="/ingredients/$slug"
                          params={{ slug: i.slug }}
                          className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 hover:bg-ivory/60 transition-colors group"
                        >
                          <div className="min-w-0">
                            <div className="text-[13.5px] text-forest group-hover:text-moss transition-colors leading-tight">
                              {ing(i.name)}
                            </div>
                            {i.latin && (
                              <div className="text-[10.5px] font-mono text-forest/50 mt-0.5">{i.latin}</div>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-forest/50 uppercase tracking-[0.22em] whitespace-nowrap">
                            {i.role ? ing(i.role) : t("ingx.botanical", "Botanical")} →
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═════════════ By product breakdown ═════════════ */}
      <section className="container-editorial mt-10 md:mt-16 mb-12 md:mb-20">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-forest">{t("ingx.byProduct", "Where each botanical appears")}</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/10 border hairline">
          {products.map((p) => {
            const used = ingredients.filter((i) => i.productSlugs.includes(p.slug));
            if (used.length === 0) return null;
            return (
              <div key={p.slug} className="bg-paper p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-ivory border hairline overflow-hidden flex-shrink-0">
                    <img src={p.image} alt={t(`product.${p.slug}.name`, p.name)} loading="lazy" className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-moss">
                      {used.length} {t("ingx.actives", "actives")}
                    </div>
                    <Link
                      to="/product/$slug"
                      params={{ slug: p.slug }}
                      className="font-serif text-lg md:text-xl text-forest leading-tight hover:text-moss transition-colors block mt-1"
                    >
                      {t(`product.${p.slug}.name`, p.name).replace(/®/g, "")}
                    </Link>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {used.map((i) => (
                    <Link
                      key={i.slug}
                      to="/ingredients/$slug"
                      params={{ slug: i.slug }}
                      className="text-[10px] uppercase tracking-[0.2em] font-mono text-forest/75 border hairline px-2 py-1 bg-ivory hover:bg-forest hover:text-paper hover:border-forest transition-colors"
                    >
                      {ing(i.name)}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
