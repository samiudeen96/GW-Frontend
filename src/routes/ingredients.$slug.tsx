import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Page";
import { ingredientBySlug, ingredients } from "@/lib/ingredients";
import { getProduct, productImageAlt, productImageTitle } from "@/lib/products";
import { ingredientExtras } from "@/lib/ingredient-extras";
import { abs, hreflangLinks, breadcrumbLd } from "@/lib/seo";
import { useT } from "@/lib/i18n";
import { tStatic } from "@/lib/i18n/static";
import { localeOf } from "@/lib/seo";

export const Route = createFileRoute("/ingredients/$slug")({
  loader: ({ params }) => {
    const entry = ingredientBySlug(params.slug);
    if (!entry) throw notFound();
    return { entry };
  },
  head: (ctx) => {
    const { loaderData } = ctx as { loaderData?: { entry: any } };
    const ts = tStatic(localeOf(ctx as any));
    if (!loaderData) {
      return { meta: [{ title: `${ts("ing.notFound.title", "Ingredient not found")} — Green Wealth` }, { name: "robots", content: "noindex" }] };
    }
    const { entry } = loaderData;
    const url = abs(`/ingredients/${entry.slug}`);
    const rawDesc = entry.summary ?? entry.description;
    const desc = ts(`ingdata.${rawDesc}`, rawDesc);
    const eName = ts(`ingdata.${entry.name}`, entry.name);
    return {
      meta: [
        { title: `${eName} — ${ts("ing.meta.titleSuffix", "Ingredient Guide | Green Wealth")}` },
        { name: "description", content: desc },
        { property: "og:title", content: `${eName} — ${ts("ing.meta.ogSuffix", "Ingredient Guide")}` },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        ...(entry.image ? [{ property: "og:image", content: abs(entry.image) }] : []),
      ],
      links: [{ rel: "canonical", href: url }, ...hreflangLinks(`/ingredients/${entry.slug}`)],
      scripts: [
        breadcrumbLd([
          { name: ts("ing.breadcrumb.home", "Home"), path: "/" },
          { name: ts("ing.breadcrumb.ingredients", "Ingredients"), path: "/ingredients" },
          { name: eName, path: `/ingredients/${entry.slug}` },
        ]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: eName,
            alternateName: entry.latin,
            description: desc,
            inDefinedTermSet: abs("/ingredients"),
            url,
          }),
        },
      ],
    };
  },
  component: IngredientPage,
  notFoundComponent: IngredientNotFound,
});

function IngredientNotFound() {
  const t = useT();
  return (
    <div className="container-editorial py-24 text-center">
      <h1 className="font-serif text-3xl text-forest">{t("ing.notFound.title", "Ingredient not found")}</h1>
      <Link to="/ingredients" className="mt-6 inline-block text-[11px] uppercase tracking-[0.24em] font-mono text-forest border-b border-forest/40">
        {t("ing.notFound.back", "Back to glossary")}
      </Link>
    </div>
  );
}

function IngredientPage() {
  const t = useT();
  const ing = (v?: string) => (v ? t(`ingdata.${v}`, v) : "");
  const { entry } = Route.useLoaderData();
  const usedIn = entry.productSlugs.map(getProduct).filter(Boolean);
  const otherIngredients = ingredients.filter((i) => i.slug !== entry.slug).slice(0, 6);
  const extra = ingredientExtras[entry.slug];
  const tags = extra?.tags ?? [];

  return (
    <>
      <div className="border-b hairline bg-paper">
        <div className="container-editorial py-6">
          <nav className="text-[10px] uppercase tracking-[0.24em] font-mono text-forest/60">
            <Link to="/" className="hover:text-forest">{t("ing.breadcrumb.home", "Home")}</Link>
            <span className="mx-2">/</span>
            <Link to="/ingredients" className="hover:text-forest">{t("ing.breadcrumb.ingredients", "Ingredients")}</Link>
            <span className="mx-2">/</span>
            <span className="text-forest">{ing(entry.name)}</span>
          </nav>
        </div>
      </div>

      <PageHeader
        eyebrow={entry.role ? ing(entry.role) : t("ing.eyebrow.botanical", "Botanical")}
        title={ing(entry.name)}
        intro={ing(entry.summary ?? entry.description)}
      />

      {(tags.length > 0 || usedIn.length > 0) && (
        <div className="container-editorial pb-2">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              // eslint-disable-next-line react/jsx-key
              <span key={tag} className="text-[10px] uppercase tracking-[0.22em] font-mono text-forest bg-ivory border hairline px-2.5 py-1">
                {ing(tag)}
              </span>
            ))}
            {usedIn.map((p: any) => p && (
              <Link
                key={`tag-${p.slug}`}
                to="/product/$slug"
                params={{ slug: p.slug }}
                className="text-[10px] uppercase tracking-[0.22em] font-mono text-paper bg-forest border hairline border-forest px-2.5 py-1 hover:bg-moss transition-colors"
              >
                {t("ing.chip.usedIn", "Used in")} · {t(`product.${p.slug}.name`, p.name).replace(/®/g, "")}
              </Link>
            ))}
          </div>
        </div>
      )}


      <div className="container-editorial py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 items-start">
          {entry.image && (
            <div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
              <div className="aspect-square bg-ivory border hairline overflow-hidden">
                <img src={entry.image} alt={`${ing(entry.name)} — ${t("img.ingredientAltCare", "botanical active used in Green Wealth hair care")}`} title={ing(entry.name)} className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
              </div>
              <dl className="mt-6 border hairline divide-y divide-ink/10 bg-paper">
                {entry.latin && (
                  <div className="flex justify-between px-4 py-3">
                    <dt className="text-[10px] uppercase tracking-[0.22em] font-mono text-forest/50">{t("ing.label.latin", "Latin")}</dt>
                    <dd className="text-[12px] text-forest">{entry.latin}</dd>
                  </div>
                )}
                {entry.origin && (
                  <div className="flex justify-between px-4 py-3">
                    <dt className="text-[10px] uppercase tracking-[0.22em] font-mono text-forest/50">{t("ing.label.origin", "Origin")}</dt>
                    <dd className="text-[12px] text-forest">{ing(entry.origin)}</dd>
                  </div>
                )}
                {entry.process && (
                  <div className="flex justify-between px-4 py-3">
                    <dt className="text-[10px] uppercase tracking-[0.22em] font-mono text-forest/50">{t("ing.label.process", "Process")}</dt>
                    <dd className="text-[12px] text-forest text-right">{ing(entry.process)}</dd>
                  </div>
                )}
                {entry.dailyDose && (
                  <div className="flex justify-between px-4 py-3">
                    <dt className="text-[10px] uppercase tracking-[0.22em] font-mono text-forest/50">{t("ing.label.dose", "Dose")}</dt>
                    <dd className="text-[12px] text-forest">{ing(entry.dailyDose)}</dd>
                  </div>
                )}
                {extra?.family && (
                  <div className="flex justify-between px-4 py-3">
                    <dt className="text-[10px] uppercase tracking-[0.22em] font-mono text-forest/50">{t("ing.label.family", "Family")}</dt>
                    <dd className="text-[12px] text-forest text-right">{ing(extra.family)}</dd>
                  </div>
                )}
                {extra?.partUsed && (
                  <div className="flex justify-between px-4 py-3 gap-4">
                    <dt className="text-[10px] uppercase tracking-[0.22em] font-mono text-forest/50 flex-shrink-0">{t("ing.label.partUsed", "Part used")}</dt>
                    <dd className="text-[12px] text-forest text-right">{ing(extra.partUsed)}</dd>
                  </div>
                )}
              </dl>
              {extra?.activeCompounds && extra.activeCompounds.length > 0 && (
                <div className="mt-4 border hairline bg-paper p-4">
                  <span className="text-[10px] uppercase tracking-[0.28em] font-mono text-moss">{t("ing.label.activeCompounds", "Active compounds")}</span>
                  <ul className="mt-2 space-y-1">
                    {extra.activeCompounds.map((c) => (
                      <li key={c} className="text-[12.5px] text-forest/80 leading-snug">— {ing(c)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}


          <div className={entry.image ? "lg:col-span-3" : "lg:col-span-5"}>
            <section>
              <h2 className="font-serif text-2xl text-forest">{t("ing.section.about", "About")}</h2>
              <p className="mt-3 text-forest/80 leading-relaxed">{ing(entry.description)}</p>
            </section>

            {entry.whatItDoes && entry.whatItDoes.length > 0 && (
              <section className="mt-10">
                <h2 className="font-serif text-2xl text-forest">{t("ing.section.whatItDoes", "What it does")}</h2>
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/10 border hairline">
                  {entry.whatItDoes.map((w: string, i: number) => (
                    <li key={i} className="bg-paper p-4 text-[13px] text-forest/80 leading-relaxed">
                      {ing(w)}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {entry.howItWorks && entry.howItWorks.length > 0 && (
              <section className="mt-10">
                <h2 className="font-serif text-2xl text-forest">{t("ing.section.howItWorks", "How it works")}</h2>
                <div className="mt-4 border hairline divide-y divide-ink/10 bg-paper">
                  {entry.howItWorks.map((h: {category:string;description:string}, i: number) => (
                    <div key={i} className="p-5">
                      <span className="text-[10px] uppercase tracking-[0.28em] font-mono text-moss">{ing(h.category)}</span>
                      <p className="mt-2 text-[13.5px] text-forest/80 leading-relaxed">{ing(h.description)}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {entry.evidence && (
              <section className="mt-10 border hairline bg-ivory/50 p-6">
                <span className="text-[10px] uppercase tracking-[0.28em] font-mono text-moss">{t("ing.section.evidence", "Evidence")}</span>
                <p className="mt-3 text-[14px] text-forest/85 leading-relaxed">{ing(entry.evidence)}</p>
              </section>
            )}

            {extra?.history && (
              <section className="mt-10">
                <h2 className="font-serif text-2xl text-forest">{t("ing.section.history", "History & heritage")}</h2>
                <p className="mt-3 text-forest/80 leading-relaxed text-[14.5px]">{ing(extra.history)}</p>
              </section>
            )}

            {extra?.traditionalUses && extra.traditionalUses.length > 0 && (
              <section className="mt-10">
                <h2 className="font-serif text-2xl text-forest">{t("ing.section.traditionalUses", "Traditional uses through history")}</h2>
                <ol className="mt-4 border hairline divide-y divide-ink/10 bg-paper">
                  {extra.traditionalUses.map((u, i) => (
                    <li key={i} className="px-5 py-4 flex gap-4">
                      <span className="text-[10px] uppercase tracking-[0.24em] font-mono text-moss w-8 flex-shrink-0 pt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[13.5px] text-forest/80 leading-relaxed">{ing(u)}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {extra?.modernResearch && (
              <section className="mt-10 border hairline bg-ivory/40 p-6">
                <span className="text-[10px] uppercase tracking-[0.28em] font-mono text-moss">{t("ing.section.modernResearch", "Modern research")}</span>
                <p className="mt-3 text-[14px] text-forest/85 leading-relaxed">{ing(extra.modernResearch)}</p>
              </section>
            )}

            {extra?.mechanism && extra.mechanism.length > 0 && (
              <section className="mt-10">
                <h2 className="font-serif text-2xl text-forest">{t("ing.section.mechanism", "How it actually works")}</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/10 border hairline">
                  {extra.mechanism.map((m, i) => (
                    <div key={i} className="bg-paper p-5">
                      <span className="text-[10px] uppercase tracking-[0.28em] font-mono text-moss">{t("ing.step", "Step")} {String(i + 1).padStart(2, "0")}</span>
                      <h3 className="font-serif text-forest text-[16px] mt-2 leading-tight">{ing(m.title)}</h3>
                      <p className="mt-2 text-[13px] text-forest/75 leading-relaxed">{ing(m.body)}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {extra?.bestFor && extra.bestFor.length > 0 && (
              <section className="mt-10">
                <h2 className="font-serif text-2xl text-forest">{t("ing.section.bestFor", "Best for")}</h2>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {extra.bestFor.map((b) => (
                    <span key={b} className="text-[11.5px] font-mono text-forest bg-ivory border hairline px-3 py-1.5">
                      {ing(b)}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {(extra?.safety || (extra?.pairsWith && extra.pairsWith.length > 0)) && (
              <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/10 border hairline">
                {extra?.safety && (
                  <div className="bg-paper p-5">
                    <span className="text-[10px] uppercase tracking-[0.28em] font-mono text-moss">{t("ing.section.safety", "Safety")}</span>
                    <p className="mt-2 text-[13px] text-forest/80 leading-relaxed">{ing(extra.safety)}</p>
                  </div>
                )}
                {extra?.pairsWith && extra.pairsWith.length > 0 && (
                  <div className="bg-paper p-5">
                    <span className="text-[10px] uppercase tracking-[0.28em] font-mono text-moss">{t("ing.section.pairsWith", "Pairs well with")}</span>
                    <ul className="mt-2 space-y-1">
                      {extra.pairsWith.map((p) => (
                        <li key={p} className="text-[13px] text-forest/80">— {ing(p)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}


            {usedIn.length > 0 && (
              <section className="mt-10">
                <h2 className="font-serif text-2xl text-forest">{t("ing.section.foundIn", "Found in")}</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/10 border hairline">
                  {usedIn.map((p: any) => p && (
                    <Link
                      key={p.slug}
                      to="/product/$slug"
                      params={{ slug: p.slug }}
                      className="group flex gap-4 bg-paper p-4 hover:bg-ivory/60 transition-colors"
                    >
                      <div className="w-16 h-16 bg-ivory flex-shrink-0 border hairline overflow-hidden">
                        <img src={p.image} alt={productImageAlt(p, 0, t)} title={productImageTitle(p, t)} className="w-full h-full object-contain p-2" loading="lazy" />
                      </div>
                      <div>
                        <span className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-moss">{t(`product.category.${p.category}`, p.category)}</span>
                        <p className="font-serif text-forest mt-1 leading-tight">{t(`product.${p.slug}.name`, p.name)}</p>
                        <span className="text-[10px] uppercase tracking-[0.24em] font-mono text-gold mt-1 inline-block">{t("ing.link.shop", "Shop →")}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {otherIngredients.length > 0 && (
          <section className="mt-16 pt-10 border-t hairline">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-serif text-2xl text-forest">{t("ing.section.more", "More botanicals")}</h2>
              <Link to="/ingredients" className="text-[10.5px] uppercase tracking-[0.24em] font-mono text-forest border-b border-forest/40">
                {t("ing.link.fullGlossary", "Full glossary")}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-ink/10 border hairline">
              {otherIngredients.map((i) => (
                <Link
                  key={i.slug}
                  to="/ingredients/$slug"
                  params={{ slug: i.slug }}
                  className="group block bg-paper p-3 hover:bg-ivory/60 transition-colors text-center"
                >
                  {i.image && (
                    <div className="aspect-square bg-ivory overflow-hidden border hairline mb-2">
                      <img src={i.image} alt={`${ing(i.name)} — ${t("img.ingredientAltCare", "botanical active in Green Wealth hair care")}`} title={ing(i.name)} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="font-serif text-[13px] text-forest leading-tight group-hover:text-moss">{ing(i.name)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
