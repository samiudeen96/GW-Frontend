import { abs, breadcrumbLd, canonicalFor, hreflangLinks, localeOf } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Page";
import { CustomerQuote } from "@/components/site/SocialProof";
import { useT } from "@/lib/i18n";
import { tStatic } from "@/lib/i18n/static";
import { hsEn } from "@/lib/hair-science-content";
import { HairGuideSections } from "@/components/hair-science/HairGuideSections";
import { GUIDE_UI } from "@/lib/hair-science-guide";
import { useLocale } from "@/lib/i18n";

const phaseKeys = ["phase1", "phase2", "phase3", "phase4"] as const;
const outcomeCounts: Record<(typeof phaseKeys)[number], number> = {
  phase1: 6,
  phase2: 6,
  phase3: 6,
  phase4: 6,
};

const topicKeys = ["topic1", "topic2", "topic3", "topic4", "topic5", "topic6"] as const;
const evidenceKeys = ["j1", "j2", "j3", "j4", "j5", "j6"] as const;

export const Route = createFileRoute("/hair-science")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const t = tStatic(locale);
    const title = t("hairScience.head.title", "Hair Science — The Biology Behind the Neo Hair Protocol");
    const desc = t(
      "hairScience.head.description",
      "The trichological science behind Green Wealth: the 4-phase 120-day recovery timeline, dermal papilla biology, DHT pathways, and micro-circulation."
    );
    const ogTitle = t("hairScience.head.ogTitle", "Hair Science — Green Wealth");
    const ogDesc = t(
      "hairScience.head.ogDescription",
      "How the Neo Hair botanical complex works — phase by phase, molecule by molecule."
    );
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: ogDesc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalFor("/hair-science", locale) },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/hair-science", locale) }, ...hreflangLinks("/hair-science")],
      scripts: [
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Hair Science", path: "/hair-science" },
        ]),
      ],
    };
  },
  component: HairSciencePage,
});

function HairSciencePage() {
  const tt = useT();
  const locale = useLocale();
  const g = (k: string) => (locale === "ar" ? GUIDE_UI[k].ar : GUIDE_UI[k].en);
  const t = (key: string, fallback?: string) => tt(key, fallback ?? hsEn(key));

  const phases = phaseKeys.map((key) => ({
    key,
    range: t(`hairScience.${key}.range`),
    title: t(`hairScience.${key}.title`),
    lede: t(`hairScience.${key}.lede`),
    outcomes: Array.from({ length: outcomeCounts[key] }, (_, i) =>
      t(`hairScience.${key}.o${i + 1}`)
    ),
  }));

  const scienceTopics = topicKeys.map((key) => ({
    key,
    title: t(`hairScience.${key}.title`),
    subtitle: t(`hairScience.${key}.subtitle`),
    body: t(`hairScience.${key}.body`),
  }));

  const citations = evidenceKeys.map((key, i) => ({
    key,
    j: t(`hairScience.evidence.${key}`),
    f: t(`hairScience.evidence.f${i + 1}`),
  }));

  return (
    <>
      <PageHeader
        eyebrow={t("hairScience.hero.eyebrow", "Hair Science")}
        title={t("hairScience.hero.title", "Understanding hair and scalp health")}
        intro={t(
          "hairScience.hero.intro",
          "Hair recovery is a biological sequence — not a promise. Here is the 120-day timeline our botanicals were designed around, and the trichological principles behind every phase."
        )}
      />

      {/* Anchor nav */}
      <nav className="border-b hairline bg-ivory sticky top-14 z-30 backdrop-blur">
        <div className="container-editorial py-3 flex gap-6 overflow-x-auto text-xs uppercase tracking-[0.2em] text-ink/70">
          <a href="#timeline" className="hover:text-forest whitespace-nowrap">{t("hairScience.nav.timeline", "120-Day Timeline")}</a>
          <a href="#problems" className="hover:text-forest whitespace-nowrap">{g("navProblems")}</a>
          <a href="#products" className="hover:text-forest whitespace-nowrap">{g("navProducts")}</a>
          <a href="#combined" className="hover:text-forest whitespace-nowrap">{g("navCombined")}</a>
          <a href="#biology" className="hover:text-forest whitespace-nowrap">{t("hairScience.nav.biology", "Biology Primer")}</a>
          <a href="#evidence" className="hover:text-forest whitespace-nowrap">{t("hairScience.nav.evidence", "Evidence")}</a>
        </div>
      </nav>

      {/* Timeline phases */}
      <section id="timeline" className="container-editorial py-14 md:py-20">
        <div className="eyebrow mb-3">{t("hairScience.timeline.eyebrow", "The 120-Day Protocol")}</div>
        <h2 className="font-serif text-3xl md:text-4xl mb-10 max-w-3xl text-ink">
          {t("hairScience.timeline.title", "Four phases, one biological arc.")}
        </h2>
        <div className="border hairline">
          {phases.map((p, i) => (
            <article
              key={p.key}
              className={`grid md:grid-cols-[220px_1fr] gap-8 md:gap-12 p-6 md:p-10 ${
                i > 0 ? "border-t hairline" : ""
              } ${i % 2 === 1 ? "bg-ivory" : "bg-paper"}`}
            >
              <div className="md:border-r hairline md:pr-8">
                <div className="eyebrow mb-2">{t("hairScience.timeline.phaseLabel", "Phase")} {i + 1}</div>
                <div className="font-serif text-2xl md:text-3xl text-forest leading-tight">{p.range}</div>
                <div className="mt-4 h-1 w-16 bg-forest" />
              </div>
              <div>
                <h3 className="font-serif text-2xl md:text-3xl mb-4 text-ink">{p.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink/80 mb-6 max-w-2xl">{p.lede}</p>
                <div className="eyebrow mb-3">{t("hairScience.timeline.outcomesLabel", "Observable Outcomes")}</div>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-ink/80">
                  {p.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 leading-relaxed">
                      <span className="mt-2 shrink-0 w-1 h-1 bg-forest" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <HairGuideSections />

      {/* Biology primer */}
      <section id="biology" className="border-y hairline bg-ivory">
        <div className="container-editorial py-14 md:py-20">
          <div className="eyebrow mb-3">{t("hairScience.biology.eyebrow", "Biology Primer")}</div>
          <h2 className="font-serif text-3xl md:text-4xl mb-10 max-w-3xl text-ink">
            {t("hairScience.biology.title", "Six principles that shape every formulation decision.")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 border hairline">
            {scienceTopics.map((tp) => (
              <article key={tp.key} className="bg-paper p-6 md:p-7">
                <div className="eyebrow mb-2">{tp.subtitle}</div>
                <h3 className="font-serif text-xl mb-3 text-ink">{tp.title}</h3>
                <p className="text-sm leading-relaxed text-ink/75">{tp.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence strip */}
      <section id="evidence" className="container-editorial py-14 md:py-20">
        <div className="eyebrow mb-3">{t("hairScience.evidence.eyebrow", "Cited Research")}</div>
        <h2 className="font-serif text-3xl md:text-4xl mb-10 max-w-2xl text-ink">
          {t("hairScience.evidence.title", "Peer-reviewed foundations.")}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {citations.map((r) => (
            <div key={r.key} className="border hairline p-5 md:p-6 bg-paper">
              <div className="eyebrow mb-2">{r.j}</div>
              <p className="text-sm leading-relaxed text-ink/80">{r.f}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-xs text-muted-foreground max-w-2xl leading-relaxed">
          {t(
            "hairScience.evidence.disclaimer",
            "Citations reference published trichological literature relevant to the botanical mechanisms in the Neo Hair formulation. Green Wealth is a cosmetic hair-care house, not a pharmaceutical manufacturer. Individual results vary."
          )}
        </p>
      </section>

      {/* Evidence + lived proof */}
      <section className="border-y hairline bg-ivory">
        <div className="container-editorial py-14 md:py-20 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className="eyebrow text-forest mb-3">{t("hairScience.proof.eyebrow", "Evidence in Practice")}</div>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight text-ink">
              {t("hairScience.proof.title", "The literature explains it. Our customers live it.")}
            </h2>
            <p className="text-sm text-muted-foreground mt-4 max-w-md leading-relaxed">
              {t("hairScience.proof.body", "Published research explains possible mechanisms; customer experiences show how routines can differ in everyday use.")}
            </p>
          </div>
          <CustomerQuote />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t hairline bg-forest text-paper">
        <div className="container-editorial py-14 md:py-20 grid md:grid-cols-[1fr_auto] items-end gap-8">
          <div>
            <div className="eyebrow text-paper/60 mb-3">{t("hairScience.cta.eyebrow", "Put the science to work")}</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight max-w-2xl">
              {t("hairScience.cta.title", "Follow the 6-step ritual designed around this biology.")}
            </h2>
          </div>
          <Link
            to="/how-to-use"
            className="inline-flex items-center gap-2 bg-paper text-forest px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ivory transition-colors self-start md:self-auto"
          >
            {t("hairScience.cta.link", "Read the protocol →")}
          </Link>
        </div>
      </section>
    </>
  );
}
