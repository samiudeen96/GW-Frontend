import { Fragment } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Page";
import { abs, hreflangLinks, breadcrumbLd, localeOf } from "@/lib/seo";
import { useT } from "@/lib/i18n";
import { tStatic } from "@/lib/i18n/static";

const ROWS: { key: string; attr: string; neo: string; minox: string }[] = [
  {
    key: "row1",
    attr: "Formulation type",
    neo: "Botanical leave-in scalp spray",
    minox: "Pharmaceutical vasodilator",
  },
  {
    key: "row2",
    attr: "Active mechanism",
    neo: "Multi-botanical follicle nourishment (ginseng, saw palmetto, cantaloupe, Fallopia, horsetail)",
    minox: "Single-molecule increase of blood flow to the follicle",
  },
  {
    key: "row3",
    attr: "Origin",
    neo: "Traditional Thai herbal formulation",
    minox: "Originally developed as a blood-pressure medication",
  },
  {
    key: "row4",
    attr: "Prescription required",
    neo: "No — cosmetic leave-in product",
    minox: "Over-the-counter in most markets; some strengths need a prescription",
  },
  {
    key: "row5",
    attr: "Application",
    neo: "Spray onto a dry scalp, 5–7 sprays, no rinse",
    minox: "Dropper application twice daily; must be left to dry",
  },
  {
    key: "row6",
    attr: "Sensory texture",
    neo: "Herbal, light, fast-absorbing, no residue",
    minox: "Alcohol / propylene glycol carrier, can feel tacky",
  },
  {
    key: "row7",
    attr: "Commonly reported side effects",
    neo: "Rare; occasional mild scalp sensitivity",
    minox: "Shedding phase, scalp irritation, unwanted facial hair, dependence on continued use",
  },
  {
    key: "row8",
    attr: "If you stop using it",
    neo: "Results are maintained by continuing the botanical routine",
    minox: "Gains typically reverse within 3–6 months of stopping",
  },
  {
    key: "row9",
    attr: "Suitable during pregnancy",
    neo: "Consult a physician; botanical cosmetic formulation",
    minox: "Generally advised against without medical supervision",
  },
  {
    key: "row10",
    attr: "Used alongside",
    neo: "Neo Hair Shampoo® + Ghori® Rosemary Oil",
    minox: "Standalone regimen",
  },
  {
    key: "row11",
    attr: "Authenticity verification",
    neo: "Scratch code on every bottle",
    minox: "Varies by manufacturer",
  },
  {
    key: "row12",
    attr: "Timeline to visible change",
    neo: "Commonly reported: added density from around 90–120 days",
    minox: "Commonly reported: 3–6 months with strict adherence",
  },
];


export const Route = createFileRoute("/comparison/neo-vs-minoxidil")({
  head: (ctx) => {
    const t = tStatic(localeOf(ctx));
    const url = abs("/comparison/neo-vs-minoxidil");
    const title = t("comparison.head.title", "Neo Hair Lotion vs Minoxidil — Honest Comparison | Green Wealth");
    const desc = t(
      "comparison.head.description",
      "Side-by-side comparison of Green Wealth Neo Hair Lotion® and minoxidil: formulation, mechanism, application, side effects, and long-term use."
    );
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }, ...hreflangLinks("/comparison/neo-vs-minoxidil")],
      scripts: [
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Comparison", path: "/comparison/neo-vs-minoxidil" },
        ]),
      ],
    };
  },
  component: Comparison,
});

function Comparison() {
  const t = useT();
  const rows = ROWS.map((r) => ({
    key: r.key,
    attr: t(`comparison.${r.key}.attr`, r.attr),
    neo: t(`comparison.${r.key}.neo`, r.neo),
    minox: t(`comparison.${r.key}.minox`, r.minox),
  }));


  return (
    <>
      <PageHeader
        eyebrow={t("comparison.hero.eyebrow", "Comparison")}
        title={t("comparison.hero.title", "Neo Hair Lotion vs Minoxidil")}
        intro={t(
          "comparison.hero.intro",
          "A candid, side-by-side look at two very different approaches to thinning hair — one a botanical leave-in spray, the other a pharmaceutical vasodilator. This page is educational; consult a physician for medical advice."
        )}
      />

      <div className="container-editorial py-8 md:py-14">
        <div className="hidden md:grid grid-cols-3 gap-px bg-ink/10 border hairline">
          <div className="bg-forest text-paper p-4">
            <span className="text-[10px] uppercase tracking-[0.28em] font-mono opacity-70">{t("comparison.col.attribute", "Attribute")}</span>
          </div>
          <div className="bg-forest text-paper p-4">
            <span className="text-[10px] uppercase tracking-[0.28em] font-mono opacity-70">{t("comparison.col.greenwealth", "Green Wealth")}</span>
            <p className="font-serif text-xl mt-1">{t("comparison.col.neo", "Neo Hair Lotion®")}</p>
          </div>
          <div className="bg-forest text-paper p-4">
            <span className="text-[10px] uppercase tracking-[0.28em] font-mono opacity-70">{t("comparison.col.alternative", "Alternative")}</span>
            <p className="font-serif text-xl mt-1">{t("comparison.col.minoxidil", "Minoxidil")}</p>
          </div>
          {rows.map((r) => (
            <Fragment key={r.key}>
              <div className="bg-paper p-4 border-t hairline">
                <span className="text-[11px] uppercase tracking-[0.22em] font-mono text-moss">{r.attr}</span>
              </div>
              <div className="bg-paper p-4 border-t hairline">
                <p className="text-[13.5px] text-forest leading-relaxed">{r.neo}</p>
              </div>
              <div className="bg-paper p-4 border-t hairline">
                <p className="text-[13.5px] text-forest/75 leading-relaxed">{r.minox}</p>
              </div>
            </Fragment>
          ))}
        </div>

        <div className="md:hidden space-y-4">
          {rows.map((r) => (
            <div key={r.key} className="border hairline bg-paper">
              <div className="bg-forest text-paper px-4 py-2">
                <span className="text-[10px] uppercase tracking-[0.28em] font-mono">{r.attr}</span>
              </div>
              <div className="p-4 border-b hairline">
                <span className="text-[10px] uppercase tracking-[0.28em] font-mono text-moss">{t("comparison.col.neo", "Neo Hair Lotion®")}</span>
                <p className="mt-1 text-[13.5px] text-forest leading-relaxed">{r.neo}</p>
              </div>
              <div className="p-4">
                <span className="text-[10px] uppercase tracking-[0.28em] font-mono text-forest/50">{t("comparison.col.minoxidil", "Minoxidil")}</span>
                <p className="mt-1 text-[13.5px] text-forest/75 leading-relaxed">{r.minox}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/10 border hairline">
          <div className="bg-paper p-6">
            <h2 className="font-serif text-2xl text-forest">{t("comparison.why.title", "Why people choose Neo Hair Lotion")}</h2>
            <ul className="mt-4 space-y-2 text-[14px] text-forest/80 leading-relaxed">
              <li>{t("comparison.why.p1", "— No prescription, no dependence on continued pharmaceutical use.")}</li>
              <li>{t("comparison.why.p2", "— Multi-botanical stack targets nourishment, calm and scalp barrier.")}</li>
              <li>{t("comparison.why.p3", "— Fast-absorbing spray fits any morning or evening routine.")}</li>
              <li>{t("comparison.why.p4", "— Every bottle verified with a scratch code.")}</li>
            </ul>
            <Link to="/product/$slug" params={{ slug: "neo-hair-lotion" }} className="mt-6 inline-block text-[10.5px] uppercase tracking-[0.24em] font-mono text-paper bg-forest px-5 py-3 hover:bg-forest/90">
              {t("comparison.why.cta", "Shop Neo Hair Lotion →")}
            </Link>
          </div>
          <div className="bg-ivory/60 p-6">
            <h2 className="font-serif text-2xl text-forest">{t("comparison.when.title", "When minoxidil may make sense")}</h2>
            <ul className="mt-4 space-y-2 text-[14px] text-forest/80 leading-relaxed">
              <li>{t("comparison.when.p1", "— When a physician has diagnosed androgenetic alopecia and recommends it.")}</li>
              <li>{t("comparison.when.p2", "— When you're prepared for lifelong daily application.")}</li>
              <li>{t("comparison.when.p3", "— When tolerating known side effects is acceptable.")}</li>
            </ul>
            <p className="mt-6 text-[12px] text-forest/60 leading-relaxed">
              {t("comparison.when.note", "Green Wealth is a botanical brand and does not sell minoxidil. Speak with a qualified dermatologist about pharmaceutical options.")}
            </p>
          </div>
        </section>

        <p className="mt-10 text-[11px] uppercase tracking-[0.24em] font-mono text-forest/60">
          {t("comparison.footer.disclaimer", "Educational content. Not medical advice. Individual results vary.")}
        </p>
      </div>
    </>
  );
}
