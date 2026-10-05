import { abs, breadcrumbLd, canonicalFor, hreflangLinks, localeOf } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { Reveal } from "@/components/site/Reveal";



export const Route = createFileRoute("/about")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const title = locale === "ar" ? "عن جرين ولث — موزّع نيو المعتمد" : "About Green Wealth — Authorized Neo Distributor";
    const description = locale === "ar"
      ? "تعرّف على جرين ولث وغوري تريدنغ، ونهجنا في التوزيع المعتمد والعناية النباتية بالشعر والتحقق من أصالة المنتج."
      : "Meet Green Wealth and Ghori Trading, and learn about our approach to authorized distribution, botanical hair care, and product verification.";
    const ogTitle = locale === "ar" ? "عن جرين ولث" : "About Green Wealth";
    const ogDescription = description;
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
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalFor("/about", locale) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonicalFor("/about", locale) }, ...hreflangLinks("/about")],
    scripts: [
      breadcrumbLd([
        { name: locale === "ar" ? "الرئيسية" : "Home", path: "/" },
        { name: locale === "ar" ? "عن الشركة" : "About", path: "/about" },
      ]),
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: locale === "ar" ? "عن جرين ولث" : "About Green Wealth",
          url: "https://www.greenwealth.com/about",
          mainEntity: {
            "@type": "Organization",
            name: "Green Wealth",
            legalName: "Ghori Trading LLC",
            foundingDate: "2020",
            foundingLocation: "Dubai, UAE",
            url: "https://www.greenwealth.com",
          },
        }),
      },
    ],
  };
  },
  component: AboutPage,
});

function AboutPage() {
  const t = useT();

  const milestones = [
    { year: "2020", title: t("content.about.m2020.title", "Global Incorporation"), desc: t("content.about.m2020.desc", "Ghori Trading LLC established its global distribution headquarters in Dubai, UAE — strategically positioned at the intersection of Asia, Europe, and Africa. Mission: transform Neo Hair Lotion from a respected Thai formulation into an internationally regulated, premium botanical cosmetic brand.") },
    { year: "2021", title: t("content.about.m2021.title", "The Dr. Paiboon Alliance"), desc: t("content.about.m2021.desc", "A landmark exclusive agreement signed with Dr. Paiboon Marapruekwan, the original formulator. Ghori Trading becomes the sole entity authorized to distribute the formula internationally. Worldwide trademark registrations secured across 60+ jurisdictions.") },
    { year: "2022", title: t("content.about.m2022.title", "Verification Infrastructure"), desc: t("content.about.m2022.desc", "Investment in proprietary product authentication technology. The 8858853021886 barcode standard designated for the premium export line. Every bottle traceable from the authorized GMP facility in Thailand to the end consumer.") },
    { year: "2023", title: t("content.about.m2023.title", "Regulatory Compliance"), desc: t("content.about.m2023.desc", "Full compliance achieved with GCC, EU, UK, and ASEAN cosmetic safety regulations. Launch of the Clean Market initiative — terminating agreements with any partner undermining brand integrity through unauthorized discounting or parallel imports.") },
    { year: "2024", title: t("content.about.m2024.title", "Anti-Counterfeiting Program"), desc: t("content.about.m2024.desc", "Introduction of the White Nozzle and 3D holographic seal as mandatory authentication standards. Active legal proceedings initiated against counterfeit manufacturers. Partnership with customs authorities in 15 countries.") },
    { year: "2025", title: t("content.about.m2025.title", "Neo Hair Shampoo Launch"), desc: t("content.about.m2025.desc", "Expansion of the portfolio with Neo Hair Shampoo — a sulfate-free, pH-balanced companion formula. Every dollar reinvested into sourcing pharmaceutical-grade botanical extracts.") },
    { year: "2026", title: t("content.about.m2026.title", "Online Verification"), desc: t("content.about.m2026.desc", "Launch of the Green Wealth product verification portal, giving customers a direct way to check the scratch code printed on their packaging.") },
  ];

  const values = [
    { title: t("content.about.value1.title", "Botanical Integrity"), desc: t("content.about.value1.desc", "We source only pharmaceutical-grade extracts — White Ginseng, Saw Palmetto, False Daisy, Horsetail, Cantaloupe — from certified organic farms. No synthetic fillers. No shortcuts. Every ingredient traceable to origin.") },
    { title: t("content.about.value2.title", "Scientific Rigor"), desc: t("content.about.value2.desc", "Formulations grounded in peer-reviewed trichology. We collaborate with dermatologists, cosmetic chemists, and hair biology researchers to refine protocols against clinical evidence.") },
    { title: t("content.about.value3.title", "Uncompromising Authenticity"), desc: t("content.about.value3.desc", "The most rigorous authentication system in botanical hair care — 3D holographic seals, unique verification codes, tamper-evident packaging, and real-time digital verification.") },
    { title: t("content.about.value4.title", "Global Accessibility"), desc: t("content.about.value4.desc", "From Dubai to São Paulo, London to Manila — a logistics network delivering authentic product to 90+ countries with temperature-controlled transit and localized support.") },
    { title: t("content.about.value5.title", "Customer Obsession"), desc: t("content.about.value5.desc", "Every decision starts with the person looking in the mirror. Our 120-day protocol is designed not just for hair — but for confidence, self-image, and psychological well-being.") },
    { title: t("content.about.value6.title", "Brand Protection"), desc: t("content.about.value6.desc", "We invest more in protecting customers from counterfeits than most brands spend on advertising. Global enforcement across customs, law enforcement, and marketplaces.") },
  ];

  const regions = [
    { region: t("content.about.region1.name", "Middle East & GCC"), countries: t("content.about.region1.countries", "UAE, Saudi Arabia, Kuwait, Qatar, Bahrain, Oman, Iraq, Jordan") },
    { region: t("content.about.region2.name", "Europe"), countries: t("content.about.region2.countries", "United Kingdom, Germany, France, Netherlands, Spain, Italy, Sweden, Poland") },
    { region: t("content.about.region3.name", "Asia Pacific"), countries: t("content.about.region3.countries", "Thailand, Philippines, Malaysia, Indonesia, Singapore, Vietnam, Japan, Korea") },
    { region: t("content.about.region4.name", "South Asia"), countries: t("content.about.region4.countries", "India, Pakistan, Bangladesh, Sri Lanka, Nepal") },
    { region: t("content.about.region5.name", "Africa"), countries: t("content.about.region5.countries", "Nigeria, South Africa, Egypt, Kenya, Ghana, Morocco, Tanzania") },
    { region: t("content.about.region6.name", "Americas"), countries: t("content.about.region6.countries", "United States, Canada, Brazil, Mexico, Colombia, Chile, Argentina") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-forest text-ivory">
        <div className="container-editorial py-20 md:py-32 text-center">
          <h1 className="display-lg text-ivory">{t("content.about.badge", "About Green Wealth")}</h1>
          <p className="mt-6 text-sm md:text-base text-ivory/60 leading-relaxed max-w-2xl mx-auto">
            {t("content.about.heroIntro", "Green Wealth brings together authorized distribution, botanical hair care, and direct product verification from our Dubai headquarters.")}
          </p>
        </div>
      </section>

      {/* Company / Mission split */}
      <section className="bg-forest text-ivory border-t border-ivory/10">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 md:p-16 lg:p-20 border-b lg:border-b-0 lg:border-r border-ivory/10 space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl">{t("content.about.theCompany", "The Company")}</h2>
            <p className="text-sm text-ivory/60 leading-relaxed">
              {t("content.about.company.p1", "Ghori Trading LLC manages the international distribution of Neo Hair Lotion and Neo Hair Shampoo from Dubai. Our work centres on reliable sourcing, careful handling, and clear product information.")}
            </p>
            <p className="text-sm text-ivory/60 leading-relaxed">
              {t("content.about.company.p2", "Every bottle bearing the Green Wealth name is manufactured under GMP conditions in Thailand, authenticated with multi-layer security technology, and distributed exclusively through our verified partner network.")}
            </p>
            <p className="text-sm text-ivory/60 leading-relaxed">
              {t("content.about.company.p3", "Customers can use the scratch code on eligible packaging to check a product directly through this website before first use.")}
            </p>
          </div>
          <div className="p-8 md:p-16 lg:p-20 bg-ivory text-forest space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl">{t("content.about.missionTitle", "Restoring Confidence, Naturally")}</h2>
            <p className="text-sm leading-relaxed text-forest/70">
              {t("content.about.mission.p1", "Hair loss is not merely cosmetic — it is a deeply personal experience affecting self-perception, social confidence, and psychological well-being. The industry has long been dominated by pharmaceutical interventions with side effects and surgical procedures with prohibitive costs.")}
            </p>
            <p className="text-sm leading-relaxed text-forest/70">
              {t("content.about.mission.p2", "We offer a botanical care routine with clear instructions and realistic timelines. It is cosmetic hair care, not a substitute for diagnosis or medical treatment.")}
            </p>
            <p className="text-sm leading-relaxed text-forest/60">
              {t("content.about.mission.p3", "Every decision — from ingredient sourcing to packaging to pricing — is guided by one question: does this serve the person standing in front of the mirror?")}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ivory">
        <div className="container-editorial py-20 md:py-28">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-5xl text-forest">{t("content.about.values.heading", "Our Core Values")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="p-8 md:p-10 border hairline bg-paper">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-forest mb-3">
                  {v.title}
                </h3>
                <p className="text-xs leading-relaxed text-ink/60">{v.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Timeline — phase ledger matching homepage */}
      <section className="bg-paper border-t border-forest/15">
        <div className="container-editorial py-16 sm:py-24 lg:py-28">
          <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-14 gap-6">
            <div>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-moss block mb-5">
                {t("content.about.timeline.badge", "Our Journey")}
              </span>
              <h2 className="font-serif uppercase font-bold tracking-tight leading-[0.9] text-[clamp(2.25rem,4.4vw,3.8rem)] text-forest">
                {t("content.about.timeline.titleLine1", "The Green Wealth")}<br />{t("content.about.timeline.titleLine2", "Story")}
              </h2>
            </div>
            <div className="md:text-right">
              <p className="max-w-xs text-xs sm:text-sm text-forest/55 leading-relaxed uppercase tracking-[0.1em]">
                {t("content.about.timeline.subtitle", "How our distribution, product range, and verification service developed.")}
              </p>
            </div>
          </Reveal>

          {/* Desktop — year rail + ledger grid */}
          <Reveal delay={100} className="hidden md:block border-t border-l border-forest/15">
            <div className="grid grid-cols-7">
              {milestones.map((m) => (
                <div key={m.year} className="border-b border-r border-forest/15 px-4 py-4 flex items-center gap-3">
                  <span className="w-2 h-2 bg-forest shrink-0" aria-hidden="true" />
                  <span className="h-px flex-1 bg-forest/25" aria-hidden="true" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-forest/60 whitespace-nowrap">{m.year}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {milestones.map((m) => (
                <article key={m.year} className="border-b border-r border-forest/15 p-4 lg:p-5 flex flex-col hover:bg-ivory transition-colors">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-moss mb-4">{m.year}</div>
                  <h3 className="font-serif text-sm lg:text-base font-bold uppercase tracking-tight leading-tight mb-4 text-forest">
                    {m.title}
                  </h3>
                  <p className="text-[11px] leading-relaxed text-forest/70">{m.desc}</p>
                </article>
              ))}
            </div>
          </Reveal>

          {/* Mobile — vertical rail ledger */}
          <Reveal delay={100} className="md:hidden">
            <ol className="relative border-l border-forest/20 ml-1 space-y-0">
              {milestones.map((m) => (
                <li key={m.year} className="relative pl-5 pb-7 last:pb-0">
                  <span className="absolute -left-[4.5px] top-1 w-2 h-2 bg-forest" aria-hidden="true" />
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-forest/50">{m.year}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold uppercase tracking-tight leading-tight text-forest">{m.title}</h3>
                  <p className="text-xs leading-relaxed text-forest/70 mt-2">{m.desc}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* Footnote strip */}
          <Reveal delay={150} className="mt-10 sm:mt-12 border border-forest/15 bg-ivory px-6 py-5 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-forest/65 leading-relaxed max-w-xl">
              {t("content.about.timeline.footnote", "Every milestone above is a matter of record — trademark filings, exclusive agreements, and regulatory registrations verifiable through the relevant authorities.")}
            </p>
            <Link
              to="/verify"
              className="inline-flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold px-8 py-3.5 bg-forest text-ivory hover:brightness-110 transition shrink-0"
            >
              {t("content.about.timeline.cta", "Verify a Product")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Global Presence */}
      <section className="bg-paper">
        <div className="container-editorial py-20 md:py-28">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-5xl text-forest mb-4">{t("content.about.presence.heading", "Global Presence")}</h2>
            <p className="text-sm text-ink/60 max-w-2xl mx-auto">
              {t("content.about.presence.intro", "From our Dubai headquarters, we manage a distribution network spanning six continents and over 90 countries.")}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3">
            {regions.map((r) => (
              <div key={r.region} className="p-3 md:p-8 border hairline">
                <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] text-forest mb-1 md:mb-2">
                  {r.region}
                </h3>
                <p className="text-[10px] md:text-[11px] text-ink/50 leading-relaxed">{r.countries}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ivory">
        <div className="container-editorial py-20 md:py-28 text-center">
          <h2 className="font-serif text-3xl md:text-5xl text-forest mb-6">{t("content.about.cta.heading", "Experience the Original")}</h2>
          <p className="text-sm text-ink/60 max-w-lg mx-auto mb-10 leading-relaxed">
            {t("content.about.cta.body", "Join over 2,000,000 customers worldwide who trust Green Wealth for their hair restoration journey. Every bottle is authentic. Every result is real.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold px-10 py-4 bg-forest text-ivory hover:brightness-110 transition"
            >
              {t("content.about.cta.shop", "Shop Now")}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold px-10 py-4 border border-forest text-forest hover:bg-forest hover:text-ivory transition"
            >
              {t("content.about.cta.partner", "Become a Partner")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
