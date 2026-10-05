import { abs, breadcrumbLd, canonicalFor, hreflangLinks, localeOf } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Page";
import { useT } from "@/lib/i18n";
import { tStatic } from "@/lib/i18n/static";

const steps = [
  {
    num: "01",
    title: "Cleanse",
    subtitle: "Scalp Preparation",
    desc: "Wash your hair with a gentle, sulfate-free shampoo (we recommend Neo Hair Shampoo). Towel-dry until damp. A clean scalp free of sebum and product buildup is essential for the lotion to penetrate the stratum corneum effectively.",
    tip: "Use lukewarm water. Hot water strips natural oils and irritates the scalp.",
  },
  {
    num: "02",
    title: "Stimulate",
    subtitle: "Pre-Application Massage",
    desc: "Using your fingertips (never nails), massage the thinning areas in circular motions for 2 minutes. This stimulates capillary blood flow to the dermal papilla, priming the follicles for maximum absorption of the active botanical compounds.",
    tip: "Focus on the hairline, temples, and crown where blood flow is often restricted.",
  },
  {
    num: "03",
    title: "Apply",
    subtitle: "Targeted Delivery",
    desc: "Part the hair to expose the scalp. Dispense 2–3 pumps of Neo Hair Lotion directly onto the affected areas. Apply to the scalp, not the hair strands. Work in systematic sections from front to crown for complete coverage of all thinning zones.",
    tip: "Hold the nozzle 2–3 cm from the scalp for precise application.",
  },
  {
    num: "04",
    title: "Absorb",
    subtitle: "Post-Application Massage",
    desc: "Gently massage the applied lotion into the scalp for 2–3 minutes using circular motions. This works the actives deeper into the follicular unit. Allow the lotion to air-dry naturally. Do not rinse. Do not blow-dry for at least 30 minutes.",
    tip: "Avoid touching the treated area after massage to prevent product transfer.",
  },
  {
    num: "05",
    title: "Timing",
    subtitle: "Twice Daily Protocol",
    desc: "Apply twice daily — morning and evening — maintaining consistent 12-hour intervals between applications. Consistency is the single most important factor determining treatment success. Skipping applications disrupts the sustained delivery of active compounds to the follicle.",
    tip: "Set daily reminders. Morning after shower, evening before bed works best.",
  },
  {
    num: "06",
    title: "Commit",
    subtitle: "Trust the Growth Cycle",
    desc: "Hair grows in cycles (anagen, catagen, telogen). The botanical complex needs time to shift dormant follicles from telogen back into anagen. Expect reduced shedding within 2–4 weeks, vellus hair within 8–12 weeks, and visible density improvement within 12–24 weeks.",
    tip: "Take monthly progress photos of the same areas under the same lighting.",
  },
];

const enhancers = [
  { key: "shampoo", title: "Neo Hair Shampoo", desc: "Use 3–4 times per week. pH 5.5 sulfate-free formula removes buildup without stripping, so the lotion reaches a clean scalp.", slug: "neo-hair-shampoo" },
  { key: "dermaroller", title: "Ghori Dermaroller", desc: "Use once per week before the lotion. Creates transient micro-channels that support absorption of the lotion's actives; allow five to seven days between sessions.", slug: "ghori-dermaroller" },
  { key: "rosemary", title: "Ghori Rosemary Oil", desc: "Apply 2–3 nights per week as an overnight scalp treatment. Botanical extracts and biotin for scalp comfort and strand vitality.", slug: "ghori-rosemary-oil" },
];

const donts = [
  "Do not apply to soaking hair — towel-dry first",
  "Do not blow-dry the scalp for 30 minutes after application",
  "Do not use heavy styling wax or pomade directly on the scalp",
  "Do not exceed the recommended dosage (2–3 pumps per session)",
  "Do not expect overnight results — commit to at least 12 weeks",
  "Do not combine with minoxidil without medical supervision",
];

const timeline = [
  { key: "1", k: "Week 1–2", v: "Scalp reset", d: "Reduced flaking. Cleaner feel. Mild tingling on application." },
  { key: "2", k: "Week 3–6", v: "Shedding stops", d: "Many users report noticeably less daily fallout as follicles re-anchor. Individual results vary." },
  { key: "3", k: "Week 8–12", v: "New vellus", d: "Baby hairs appear along hairline, temples, and crown." },
  { key: "4", k: "Week 12–24", v: "Terminal density", d: "Vellus matures into pigmented terminal hair. Others notice." },
];

export const Route = createFileRoute("/how-to-use")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const ts = tStatic(locale);
    return {
      meta: [
        { title: ts("howto.head.title", "How to Use Neo Hair Lotion — Step-by-Step Application Guide") },
        { name: "description", content: ts("howto.head.desc", "A precise 6-step clinical protocol for maximum follicle activation with Neo Hair Lotion. Timing, dosage, complementary products, and the 120-day plan.") },
        { property: "og:title", content: ts("howto.head.ogtitle", "How to Use Neo Hair Lotion — The 6-Step Protocol") },
        { property: "og:description", content: ts("howto.head.ogdesc", "The exact application ritual designed for maximum absorption and follicle recovery.") },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalFor("/how-to-use", locale) },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/how-to-use", locale) }, ...hreflangLinks("/how-to-use")],
      scripts: [
        breadcrumbLd([
          { name: ts("howto.crumb.home", "Home"), path: "/" },
          { name: ts("howto.crumb.self", "How to Use"), path: "/how-to-use" },
        ]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: ts("howto.head.howtoname", "How to Use Neo Hair Lotion"),
            description: ts("howto.head.howtodesc", "6-step clinical protocol for maximum absorption and follicle activation."),
            totalTime: "PT10M",
            supply: [{ "@type": "HowToSupply", name: "Neo Hair Lotion" }],
            step: steps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: ts(`howto.step.${i + 1}.title`, s.title),
              text: ts(`howto.step.${i + 1}.desc`, s.desc),
            })),
          }),
        },
      ],
    };
  },
  component: HowToUsePage,
});

function HowToUsePage() {
  const t = useT();
  const metrics = [
    { k: t("howto.metric.frequency.k", "Frequency"), v: t("howto.metric.frequency.v", "Twice daily") },
    { k: t("howto.metric.dose.k", "Dose"), v: t("howto.metric.dose.v", "2–3 pumps") },
    { k: t("howto.metric.session.k", "Session"), v: t("howto.metric.session.v", "~5 minutes") },
    { k: t("howto.metric.full.k", "Full protocol"), v: t("howto.metric.full.v", "120 days") },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t("howto.eyebrow", "Application guide")}
        title={t("howto.title", "How to use Neo Hair Lotion.")}
        intro={t("howto.intro", "A practical six-step routine for applying Neo Hair Lotion consistently and comfortably.")}
      />

      {/* Timeline strip */}
      <section className="border-b hairline bg-ivory">
        <div className="container-editorial py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-sm">
          {metrics.map((m) => (
            <div key={m.k}>
              <div className="eyebrow mb-1">{m.k}</div>
              <div className="font-serif text-xl md:text-2xl text-forest">{m.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="container-editorial py-14 md:py-20">
        <div className="grid gap-0 border hairline">
          {steps.map((s, i) => (
            <article
              key={s.num}
              className={`grid md:grid-cols-[120px_1fr_260px] gap-6 md:gap-10 p-6 md:p-10 ${
                i > 0 ? "border-t hairline" : ""
              } ${i % 2 === 1 ? "bg-ivory" : "bg-paper"}`}
            >
              <div>
                <div className="font-serif text-5xl md:text-6xl text-forest leading-none">{s.num}</div>
                <div className="eyebrow mt-3">{t(`howto.step.${i + 1}.subtitle`, s.subtitle)}</div>
              </div>
              <div>
                <h2 className="font-serif text-2xl md:text-3xl text-ink mb-3">{t(`howto.step.${i + 1}.title`, s.title)}</h2>
                <p className="text-[15px] leading-relaxed text-ink/80 max-w-2xl">{t(`howto.step.${i + 1}.desc`, s.desc)}</p>
              </div>
              <aside className="border-l hairline pl-5 self-start">
                <div className="eyebrow mb-2">{t("howto.practitioner-tip", "Practitioner tip")}</div>
                <p className="text-sm text-ink/70 leading-relaxed">{t(`howto.step.${i + 1}.tip`, s.tip)}</p>
              </aside>
            </article>
          ))}
        </div>
      </section>

      {/* Enhancers */}
      <section className="border-y hairline bg-ivory">
        <div className="container-editorial py-14 md:py-20">
          <div className="flex items-end justify-between mb-8 md:mb-10 flex-wrap gap-4">
            <div>
              <div className="eyebrow mb-2">{t("howto.enhancers.eyebrow", "Complementary Protocol")}</div>
              <h2 className="font-serif text-3xl md:text-4xl text-ink">{t("howto.enhancers.title", "Amplify the ritual.")}</h2>
            </div>
            <Link to="/shop" className="text-sm underline underline-offset-4 hover:text-forest">
              {t("howto.enhancers.shop", "Shop the full system →")}
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-ink/10 border hairline">
            {enhancers.map((e) => (
              <Link
                key={e.title}
                to="/product/$slug"
                params={{ slug: e.slug }}
                className="bg-paper p-6 md:p-8 flex flex-col justify-between hover:bg-ivory transition-colors group"
              >
                <div>
                  <div className="eyebrow mb-3">{t("howto.enhancers.addon", "Add-on")}</div>
                  <h3 className="font-serif text-xl text-ink mb-3">{t(`howto.enh.${e.key}.title`, e.title)}</h3>
                  <p className="text-sm leading-relaxed text-ink/70">{t(`howto.enh.${e.key}.desc`, e.desc)}</p>
                </div>
                <div className="mt-6 text-xs uppercase tracking-[0.2em] text-forest">
                  {t("howto.enhancers.view", "View product")} <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Don'ts */}
      <section className="container-editorial py-14 md:py-20">
        <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12">
          <div>
            <div className="eyebrow mb-3">{t("howto.donts.eyebrow", "Common Mistakes")}</div>
            <h2 className="font-serif text-3xl md:text-4xl text-ink">{t("howto.donts.title", "What to avoid.")}</h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              {t("howto.donts.intro", "The habits that quietly derail even well-formulated protocols.")}
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-px border hairline bg-ink/10">
            {donts.map((d, i) => (
              <li key={d} className="bg-paper p-5 flex items-start gap-3 text-sm text-ink/80 leading-relaxed">
                <span className="mt-0.5 shrink-0 w-5 h-5 border border-ink/40 flex items-center justify-center text-[10px] font-bold">
                  x
                </span>

                <span>{t(`howto.dont.${i + 1}`, d)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-y hairline bg-forest text-paper">
        <div className="container-editorial py-14 md:py-20">
          <div className="eyebrow mb-3 text-paper/60">{t("howto.timeline.eyebrow", "120-Day Expectation Map")}</div>
          <h2 className="font-serif text-3xl md:text-4xl mb-10 max-w-2xl">
            {t("howto.timeline.title", "What to expect, week by week.")}
          </h2>
          <div className="grid md:grid-cols-4 gap-px bg-paper/10 border hairline border-paper/20">
            {timeline.map((p) => (
              <div key={p.k} className="bg-forest p-6 md:p-8">
                <div className="eyebrow text-paper/50 mb-3">{t(`howto.tl.${p.key}.k`, p.k)}</div>
                <div className="font-serif text-xl mb-2">{t(`howto.tl.${p.key}.v`, p.v)}</div>
                <p className="text-sm text-paper/70 leading-relaxed">{t(`howto.tl.${p.key}.d`, p.d)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-editorial py-16 md:py-24 text-center">
        <div className="eyebrow mb-3">{t("howto.cta.eyebrow", "Ready to begin")}</div>
        <h2 className="font-serif text-3xl md:text-5xl mb-5 text-ink max-w-2xl mx-auto leading-tight">
          {t("howto.cta.title", "Start the 120-day protocol.")}
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          {t("howto.cta.desc", "Consistency is the foundation of results. Commit to the ritual, trust the botanicals, and document your progress.")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/product/$slug"
            params={{ slug: "neo-hair-lotion" }}
            className="inline-flex items-center gap-2 bg-forest text-paper px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ink transition-colors"
          >
            {t("howto.cta.shop", "Shop Neo Hair Lotion")}
          </Link>
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 border hairline px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ivory transition-colors"
          >
            {t("howto.cta.faq", "Read the FAQ")}
          </Link>
        </div>
      </section>
    </>
  );
}
