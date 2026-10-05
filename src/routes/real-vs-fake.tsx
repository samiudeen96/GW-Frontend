/**
 * Purpose: Official Green Wealth anti-counterfeit field guide.
 * Users: buyers checking source, packaging, batch identity, and scratch code.
 * Key actions: buy direct, verify a code, compare evidence, report a suspect unit.
 * Integration points: i18n dictionary, verification route, shop, contact and legal pages.
 */
import { PageHeader } from "@/components/site/Page";
import { useT } from "@/lib/i18n";
import { arVerify } from "@/lib/i18n/ar/verify";
import { abs, breadcrumbLd, canonicalFor, hreflangLinks, localeOf } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";

type Check = {
  n: string;
  point: string;
  authentic: string;
  warning: string;
};

type GuideGroup = {
  key: string;
  title: string;
  items: Check[];
};

const GUIDE_GROUPS: GuideGroup[] = [
  {
    key: "source",
    title: "Purchase source & record",
    items: [
      { n: "01", point: "Official retail source", authentic: "Purchased on greenwealth.com, the only retail website Green Wealth currently identifies as its official direct purchase source.", warning: "A marketplace, social account, messaging seller, independent storefront, or website using our images without written authorization published by Green Wealth." },
      { n: "02", point: "Order record", authentic: "A Green Wealth order confirmation, order number, payment record, and shipment trail that can be matched by our support team.", warning: "A handwritten receipt, cropped payment screenshot, seller-created invoice, or no traceable order record." },
      { n: "03", point: "Price & offer", authentic: "The price and promotion match the offer shown on greenwealth.com for the destination and currency at the time of purchase.", warning: "An unexplained extreme discount, bulk deal, or urgency claim. Price is a warning signal, never proof by itself." },
      { n: "04", point: "Seller claim", authentic: "The seller identity is Green Wealth on greenwealth.com. Any future authorized seller will be named by us on this website.", warning: "Claims such as “factory stock,” “same supplier,” “original import,” or “authorized” that cannot be confirmed on greenwealth.com." },
    ],
  },
  {
    key: "security",
    title: "Security label & digital check",
    items: [
      { n: "05", point: "Label condition", authentic: "The holographic ORIGINAL security label is intact before opening, with a black scratch-off area that has not been disturbed.", warning: "The scratch area is exposed, patched, wrinkled, transferred, cut, or covered by a second label." },
      { n: "06", point: "Hidden code", authentic: "Gentle scratching reveals one clear 12-digit verification code beneath the black area. The printed number below is a public serial, not the verification code.", warning: "No hidden code, fewer or extra digits, letters in the hidden code, unreadable printing, or the seller sends a code separately." },
      { n: "07", point: "Official result", authentic: "The 12-digit code is entered directly on greenwealth.com/verify and returns a recognized result consistent with the unit.", warning: "A seller asks you to use another site, scan an unfamiliar link, or accept their screenshot as proof." },
      { n: "08", point: "Check history", authentic: "A first check is consistent with a newly opened unit. Keep the carton because later checks remain attached to the same code history.", warning: "A supposedly sealed unit reports prior checks you cannot explain. Stop and ask Green Wealth to investigate." },
    ],
  },
  {
    key: "pack",
    title: "Carton, bottle & batch",
    items: [
      { n: "09", point: "Carton print", authentic: "Typography, ingredient information, directions, volume, responsible-company details, and marks are sharp and internally consistent.", warning: "Spelling errors, blurred edges, missing information, overprinted text, uneven colour, or labels covering required details." },
      { n: "10", point: "Tamper evidence", authentic: "The carton and bottle arrive closed, clean, and without signs of re-gluing, re-wrapping, puncture, leakage, or prior opening.", warning: "Broken closure, glue residue, torn folds, loose cap, leakage, or a bottle that appears refilled." },
      { n: "11", point: "Batch match", authentic: "The batch or lot identity on the bottle and carton is legible and agrees where both are printed. Support can inspect it with your order record.", warning: "Missing, scraped, covered, altered, or conflicting batch details. A batch code alone does not prove authenticity." },
      { n: "12", point: "Bottle construction", authentic: "Amber glass, label, collar, and atomizer are cleanly assembled; the sprayer sits firmly and delivers an even mist without collar leakage.", warning: "Rough glass, bubbles, crooked or lifting label, mismatched plastics, loose collar, coarse spray, or leakage." },
    ],
  },
  {
    key: "contents",
    title: "Contents, use & response",
    items: [
      { n: "13", point: "Appearance", authentic: "The liquid appears uniform for the labelled formula and has no unexplained particles, separation, damaged seal, or contamination signs.", warning: "Unexpected sediment, cloudiness, separation, foreign particles, unusual fill level, or visible contamination." },
      { n: "14", point: "Aroma", authentic: "The botanical aroma is consistent with your documented Green Wealth unit, allowing for modest natural variation between botanical batches.", warning: "A sharp solvent, rancid, strongly perfumed, or markedly unfamiliar smell. Smell alone cannot authenticate a product." },
      { n: "15", point: "First-use tolerance", authentic: "The product is used only after source and code checks, according to the label, with a patch test when appropriate.", warning: "Burning, swelling, blistering, breathing difficulty, or another unexpected reaction. Stop use and seek appropriate medical help." },
      { n: "16", point: "Support review", authentic: "Green Wealth can review the order, code result, batch images, packaging, and purchase trail together.", warning: "A seller refuses a return, blocks questions, discourages verification, or asks you to discard the box." },
    ],
  },
];

const EVIDENCE = [
  { n: "01", title: "Direct order record", body: "Strongest purchase evidence. Our support team can match the order number, customer details, payment, destination, and fulfilment trail." },
  { n: "02", title: "Official 12-digit code result", body: "Strong product evidence. Enter the hidden code yourself on our domain; never rely on a seller’s screenshot or third-party checker." },
  { n: "03", title: "Batch and pack consistency", body: "Supporting evidence. Batch identity, intact packaging, label details, and the bottle should agree with one another." },
  { n: "04", title: "Appearance, aroma and price", body: "Screening clues only. Counterfeiters can copy visible details, while genuine packaging and botanical aroma can change between approved runs." },
];

const INSPECTION = [
  ["01", "Confirm where it was bought", "If it was not ordered on greenwealth.com, Green Wealth did not authenticate it at the point of sale."],
  ["02", "Photograph before opening", "Capture all carton faces, security label, batch details, bottle base and seller invoice in clear light."],
  ["03", "Check for interference", "Look for re-gluing, a disturbed scratch area, mismatched codes, leakage, or signs the bottle was opened or refilled."],
  ["04", "Reveal the hidden code", "Scratch the black area gently. Use the hidden 12-digit number, not the public serial printed below it."],
  ["05", "Verify on our domain", "Type greenwealth.com/verify yourself. Do not follow a verification link supplied by an unknown seller."],
  ["06", "Act on the whole record", "If the source, code, package, or contents conflict, do not use it. Preserve the evidence and contact Green Wealth."],
] as const;

const FAQ = [
  { q: "Is greenwealth.com the only official place to buy online?", a: "Yes. Greenwealth.com is the only retail website Green Wealth currently identifies as its official direct purchase source. We do not currently authenticate marketplace listings, social-media sellers, messaging sellers, or independent websites at the point of sale. If this policy changes, we will publish the seller by name on greenwealth.com." },
  { q: "Does genuine-looking packaging prove a product is authentic?", a: "No. Packaging is a warning screen, not final proof. Visible details can be copied and approved packaging can evolve. The strongest evidence is a direct Green Wealth order record combined with a recognized 12-digit code and consistent batch details." },
  { q: "Does a valid code guarantee the way the product was stored?", a: "No. A recognized code supports identity and traceability in our records; it cannot prove every storage condition after the unit left controlled fulfilment. Do not use a leaking, overheated, damaged, opened, contaminated, or otherwise suspicious unit." },
  { q: "What if a seller says they are an authorized distributor?", a: "Ask Green Wealth before buying. A seller’s own statement, certificate image, invoice, badge, or chat message is not authorization. Only authorization that Green Wealth publishes or confirms through its official support channels should be relied upon." },
  { q: "What should I send when reporting a suspected counterfeit?", a: "Send the seller link and identity, invoice or payment record, order date, country, photos of every carton side, the intact or revealed security label, bottle, base, batch details, and the result shown by our verifier. Do not discard or ship the product until support advises you." },
  { q: "Can a low price prove a product is fake?", a: "No. An unexplained extreme discount is a warning signal, not proof. Evaluate the source, order record, security label, official code result, batch consistency, packaging condition, and contents together." },
] as const;

function localized(key: string, fallback: string, locale: string) {
  return locale === "ar" ? (arVerify[key] ?? fallback) : fallback;
}

export const Route = createFileRoute("/real-vs-fake")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const title = locale === "ar" ? "الأصلي مقابل المقلّد | دليل التحقق الرسمي من جرين ولث®" : "Real vs Fake Neo Hair Lotion | Official Green Wealth® Guide";
    const description = locale === "ar" ? "الدليل الرسمي المفصّل لفحص مصدر الشراء وملصق الأمان ورمز التحقق المكوّن من 12 رقمًا والدفعة والعبوة قبل استخدام لوشن نيو للشعر®." : "The official detailed guide to checking purchase source, security label, 12-digit verification code, batch and packaging before using Neo Hair Lotion®.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonicalFor("/real-vs-fake", locale) },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/real-vs-fake", locale) }, ...hreflangLinks("/real-vs-fake")],
      scripts: [
        breadcrumbLd([
          { name: locale === "ar" ? "الرئيسية" : "Home", path: "/" },
          { name: locale === "ar" ? "الأصلي مقابل المقلّد" : "Real vs Fake", path: "/real-vs-fake" },
        ]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            mainEntityOfPage: canonicalFor("/real-vs-fake", locale),
            publisher: { "@type": "Organization", name: "Green Wealth", url: abs("/") },
            about: ["Neo Hair Lotion authenticity", "counterfeit product identification", "product verification"],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((item, index) => ({
              "@type": "Question",
              name: localized(`realVsFake.faq.${index + 1}.q`, item.q, locale),
              acceptedAnswer: { "@type": "Answer", text: localized(`realVsFake.faq.${index + 1}.a`, item.a, locale) },
            })),
          }),
        },
      ],
    };
  },
  component: RealVsFakePage,
});

function RealVsFakePage() {
  const t = useT();

  return (
    <>
      <PageHeader
        eyebrow={t("realVsFake.page.eyebrow", "Official authenticity dossier")}
        title={t("realVsFake.page.title", "Real vs Fake.")}
        intro={t("realVsFake.page.intro2", "A source-first, evidence-led inspection guide for Neo Hair Lotion®. Packaging can be copied. Begin with who sold it, then verify the security code, batch identity, pack and contents before first use.")}
      />

      <section className="border-b hairline bg-forest text-paper">
        <div className="container-editorial grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="py-10 md:py-14 lg:pe-14 border-b lg:border-b-0 lg:border-e border-brass/30">
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-brass">{t("realVsFake.source.eyebrow", "Official source policy · September 2026")}</p>
            <h2 className="mt-5 max-w-3xl font-serif text-3xl md:text-5xl leading-[1.04]">{t("realVsFake.source.title", "Greenwealth.com is our only official direct retail website.")}</h2>
            <p className="mt-5 max-w-2xl text-sm md:text-base leading-relaxed text-paper/75">{t("realVsFake.source.body", "Green Wealth does not currently identify any marketplace listing, social-media seller, messaging seller, or independent ecommerce website as an official online retail source. A third party may hold genuine stock, but we cannot authenticate that seller or its storage and handling at the point of sale unless we publish or confirm the authorization ourselves.")}</p>
          </div>
          <div className="grid grid-cols-2">
            <div className="p-6 md:p-8 border-e border-brass/30">
              <div className="font-serif text-5xl text-brass" dir="ltr">01</div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-paper/55">{t("realVsFake.source.site", "Official retail website")}</p>
              <p className="mt-2 font-mono text-sm text-paper break-words" dir="ltr">greenwealth.com</p>
            </div>
            <div className="p-6 md:p-8">
              <div className="font-serif text-5xl text-brass" dir="ltr">00</div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-paper/55">{t("realVsFake.source.marketplaces", "Marketplaces we authenticate at sale")}</p>
              <p className="mt-2 text-sm text-paper">{t("realVsFake.source.none", "None currently published")}</p>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label={t("realVsFake.nav.aria", "Authenticity guide sections")} className="border-b hairline bg-paper sticky top-14 md:top-16 z-30 overflow-x-auto">
        <div className="container-editorial flex min-w-max">
          {[
            ["#inspection", "realVsFake.nav.inspect", "Inspect"],
            ["#evidence", "realVsFake.nav.evidence", "Evidence"],
            ["#comparison", "realVsFake.nav.compare", "16 checks"],
            ["#action", "realVsFake.nav.action", "What to do"],
            ["#faq", "realVsFake.nav.faq", "FAQ"],
          ].map(([href, key, label], index) => (
            <a key={href} href={href} className="px-4 md:px-6 py-4 border-e hairline text-[10px] font-mono uppercase tracking-[0.14em] text-ink hover:bg-ivory">
              <span className="text-brass me-2" dir="ltr">{String(index + 1).padStart(2, "0")}</span>{t(key, label)}
            </a>
          ))}
        </div>
      </nav>

      <section id="inspection" className="container-editorial py-12 md:py-20 scroll-mt-32">
        <div className="grid lg:grid-cols-[0.72fr_1.28fr] gap-10 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-36">
            <p className="eyebrow">{t("realVsFake.inspect.eyebrow", "Six-step inspection")}</p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl text-ink leading-tight">{t("realVsFake.inspect.title", "Source first. Code second. Appearance third.")}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink/70">{t("realVsFake.inspect.body", "This order matters. A polished box can be copied, while a direct order trail and an official verification result are harder to substitute. Complete all six steps before applying the product.")}</p>
            <div className="mt-8 border hairline bg-ivory p-5">
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-brass">{t("realVsFake.inspect.ruleLabel", "Decision rule")}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink">{t("realVsFake.inspect.rule", "One unexplained conflict is enough to pause. Do not wait for several warning signs before contacting us.")}</p>
            </div>
          </div>
          <ol className="border-t hairline">
            {INSPECTION.map(([n, title, body], index) => (
              <li key={n} className="grid grid-cols-[52px_1fr] md:grid-cols-[76px_0.55fr_1fr] gap-4 md:gap-8 py-6 md:py-8 border-b hairline">
                <span className="font-serif text-2xl text-brass" dir="ltr">{n}</span>
                <h3 className="text-base font-semibold text-ink">{t(`realVsFake.inspect.${index + 1}.title`, title)}</h3>
                <p className="col-start-2 md:col-start-auto text-sm leading-relaxed text-ink/70">{t(`realVsFake.inspect.${index + 1}.body`, body)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y hairline bg-ivory">
        <div className="container-editorial grid lg:grid-cols-2">
          <figure className="p-6 md:p-10 lg:pe-14 border-b lg:border-b-0 lg:border-e hairline">
            <img src="/images/authenticity-sticker-1260.webp" srcSet="/images/authenticity-sticker-800.webp 800w, /images/authenticity-sticker-1260.webp 1260w" sizes="(max-width: 1023px) 90vw, 44vw" width="1260" height="1260" loading="lazy" decoding="async" alt={t("realVsFake.sticker.alt", "Official Green Wealth Neo Hair Lotion holographic ORIGINAL security label with black scratch area hiding a 12-digit verification code")} className="w-full aspect-square object-contain bg-paper border hairline" />
            <figcaption className="mt-4 text-xs leading-relaxed text-ink/60">{t("realVsFake.sticker.caption", "Reference: the hidden 12-digit code sits beneath the black scratch area. The visible number printed below it is not the verification code.")}</figcaption>
          </figure>
          <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
            <p className="eyebrow">{t("realVsFake.sticker.eyebrow", "Security label anatomy")}</p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl text-ink leading-tight">{t("realVsFake.sticker.title", "Know which number to verify.")}</h2>
            <div className="mt-8 border-t hairline">
              {[
                ["A", "Holographic label", "Inspect it for disturbance, transfer, cutting, lifting or a second label placed over it."],
                ["B", "Black scratch area", "This removable layer must be intact when a newly supplied carton reaches you."],
                ["C", "Hidden 12-digit code", "Reveal this code and enter it yourself at greenwealth.com/verify."],
                ["D", "Printed public serial", "This remains visible below the scratch area and is not accepted as the hidden verification code."],
              ].map(([n, title, body], index) => (
                <div key={n} className="grid grid-cols-[36px_1fr] gap-4 py-5 border-b hairline">
                  <span className="font-mono text-sm text-brass" dir="ltr">{n}</span>
                  <div><h3 className="text-sm font-semibold text-ink">{t(`realVsFake.sticker.${index + 1}.title`, title)}</h3><p className="mt-2 text-sm leading-relaxed text-ink/65">{t(`realVsFake.sticker.${index + 1}.body`, body)}</p></div>
                </div>
              ))}
            </div>
            <Link to="/verify" className="mt-8 inline-flex w-fit bg-forest text-paper px-7 py-4 text-xs font-mono uppercase tracking-[0.14em] hover:bg-forest/90">{t("realVsFake.cta.verify", "Verify a Scratch Code")}</Link>
          </div>
        </div>
      </section>

      <section id="evidence" className="container-editorial py-12 md:py-20 scroll-mt-32">
        <div className="max-w-3xl">
          <p className="eyebrow">{t("realVsFake.evidence.eyebrow", "Evidence hierarchy")}</p>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl text-ink">{t("realVsFake.evidence.title", "Not every clue carries equal weight.")}</h2>
          <p className="mt-5 text-sm md:text-base leading-relaxed text-ink/70">{t("realVsFake.evidence.body", "Use several independent checks. No colour, smell, barcode, QR image, seller badge, batch code, or packaging detail can establish authenticity on its own.")}</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border hairline">
          {EVIDENCE.map((item, index) => (
            <article key={item.n} className="bg-paper p-6 md:p-7 min-h-[250px] flex flex-col">
              <span className="font-serif text-4xl text-brass" dir="ltr">{item.n}</span>
              <h3 className="mt-7 text-lg font-semibold text-ink">{t(`realVsFake.evidence.${index + 1}.title`, item.title)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{t(`realVsFake.evidence.${index + 1}.body`, item.body)}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="comparison" className="border-y hairline bg-ivory scroll-mt-32">
        <div className="container-editorial py-12 md:py-20">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end mb-12">
            <div><p className="eyebrow">{t("realVsFake.compare.eyebrow", "The 16-point field ledger")}</p><h2 className="mt-4 font-serif text-3xl md:text-5xl text-ink">{t("realVsFake.compare.title", "Compare the complete record.")}</h2></div>
            <p className="max-w-md text-sm leading-relaxed text-ink/65">{t("realVsFake.compare.body", "“Authentic” describes expected evidence. “Warning” means pause and investigate; it is not, by itself, a final counterfeit determination.")}</p>
          </div>
          {GUIDE_GROUPS.map((group, groupIndex) => (
            <div key={group.key} className="mb-12 last:mb-0">
              <div className="flex items-baseline justify-between border-b border-forest pb-3">
                <h3 className="font-serif text-xl md:text-2xl text-ink"><span className="text-brass me-3" dir="ltr">{String(groupIndex + 1).padStart(2, "0")}</span>{t(`realVsFake.group.${group.key}`, group.title)}</h3>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground">{t("realVsFake.table.fourChecks", "04 checks")}</span>
              </div>
              <div className="hidden md:block">
                <div className="grid grid-cols-[64px_0.72fr_1.14fr_1.14fr] text-[10px] font-mono uppercase tracking-[0.14em] border-b hairline">
                  <div className="p-3">{t("realVsFake.table.hashLabel", "#")}</div><div className="p-3">{t("realVsFake.table.checkLabel", "Check")}</div><div className="p-3 border-s hairline bg-authentic text-authentic-foreground">{t("realVsFake.table.authentic", "Expected evidence")}</div><div className="p-3 border-s hairline bg-counterfeit text-counterfeit-foreground">{t("realVsFake.table.counterfeit", "Warning")}</div>
                </div>
                {group.items.map((item) => (
                  <div key={item.n} className="grid grid-cols-[64px_0.72fr_1.14fr_1.14fr] border-b hairline">
                    <div className="p-4 font-serif text-forest" dir="ltr">{item.n}</div><div className="p-4 text-sm font-semibold text-ink">{t(`realVsFake.check.${item.n}.point`, item.point)}</div><div className="p-4 text-sm leading-relaxed border-s hairline bg-authentic text-authentic-foreground">{t(`realVsFake.check.${item.n}.authentic`, item.authentic)}</div><div className="p-4 text-sm leading-relaxed border-s hairline bg-counterfeit text-counterfeit-foreground">{t(`realVsFake.check.${item.n}.warning`, item.warning)}</div>
                  </div>
                ))}
              </div>
              <div className="md:hidden">
                {group.items.map((item) => (
                  <article key={item.n} className="border-b hairline py-6">
                    <div className="flex gap-4 items-baseline"><span className="font-serif text-xl text-brass" dir="ltr">{item.n}</span><h4 className="text-base font-semibold text-ink">{t(`realVsFake.check.${item.n}.point`, item.point)}</h4></div>
                    <div className="mt-4 grid gap-px bg-hairline border hairline"><div className="bg-authentic text-authentic-foreground p-4"><p className="text-[9px] font-mono uppercase tracking-[0.14em] opacity-70">{t("realVsFake.table.authentic", "Expected evidence")}</p><p className="mt-2 text-sm leading-relaxed">{t(`realVsFake.check.${item.n}.authentic`, item.authentic)}</p></div><div className="bg-counterfeit text-counterfeit-foreground p-4"><p className="text-[9px] font-mono uppercase tracking-[0.14em] opacity-70">{t("realVsFake.table.counterfeit", "Warning")}</p><p className="mt-2 text-sm leading-relaxed">{t(`realVsFake.check.${item.n}.warning`, item.warning)}</p></div></div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="action" className="container-editorial py-12 md:py-20 scroll-mt-32">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-16">
          <div>
            <p className="eyebrow">{t("realVsFake.action.eyebrow", "If anything conflicts")}</p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl text-ink">{t("realVsFake.action.title", "Stop. Preserve. Report.")}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink/70">{t("realVsFake.action.body", "Do not apply a unit with an unexplained source, failed code, disturbed seal, conflicting batch details, contamination signs, or unusual reaction. Keep the product, carton and purchase record together while we review it.")}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3"><Link to="/contact" className="inline-flex justify-center bg-forest text-paper px-7 py-4 text-xs font-mono uppercase tracking-[0.14em] hover:bg-forest/90">{t("realVsFake.action.contact", "Report to Green Wealth")}</Link><Link to="/shop" className="inline-flex justify-center border border-forest px-7 py-4 text-xs font-mono uppercase tracking-[0.14em] text-ink hover:bg-ivory">{t("realVsFake.action.shop", "Buy from the official site")}</Link></div>
          </div>
          <div className="border-t border-forest">
            {[
              ["01", "Seller evidence", "Seller URL, profile name, phone number, listing screenshots and every message claiming authorization."],
              ["02", "Transaction evidence", "Invoice, payment record, order date, delivery country, shipment label and the price paid."],
              ["03", "Product evidence", "Clear photos of all carton sides, label, scratch panel, code result, batch details, bottle and base."],
              ["04", "Condition evidence", "Describe seal condition, leakage, smell, appearance and any reaction. Keep the unit sealed if unused."],
            ].map(([n, title, body], index) => (
              <div key={n} className="grid grid-cols-[52px_1fr] md:grid-cols-[70px_0.55fr_1fr] gap-4 py-6 border-b hairline"><span className="font-serif text-2xl text-brass" dir="ltr">{n}</span><h3 className="text-sm font-semibold text-ink">{t(`realVsFake.report.${index + 1}.title`, title)}</h3><p className="col-start-2 md:col-start-auto text-sm leading-relaxed text-ink/65">{t(`realVsFake.report.${index + 1}.body`, body)}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-brass bg-forest text-paper">
        <div className="container-editorial py-12 md:py-16 grid lg:grid-cols-[1fr_auto] gap-8 items-end">
          <div className="max-w-3xl"><p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brass">{t("realVsFake.safe.eyebrow", "The safest purchase standard")}</p><h2 className="mt-4 font-serif text-3xl md:text-5xl leading-tight">{t("realVsFake.safe.title", "Buy on our website. Verify before first use. Keep your order record.")}</h2><p className="mt-5 text-sm leading-relaxed text-paper/70">{t("realVsFake.safe.body", "This gives Green Wealth the clearest chain from order to fulfilment to product-code review. We cannot provide the same point-of-sale assurance for goods bought through an unlisted third party.")}</p></div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3"><Link to="/shop" className="inline-flex justify-center bg-brass text-forest px-8 py-4 text-xs font-mono uppercase tracking-[0.14em] hover:bg-brass/90">{t("realVsFake.action.shop", "Buy from the official site")}</Link><Link to="/verify" className="inline-flex justify-center border border-brass text-brass px-8 py-4 text-xs font-mono uppercase tracking-[0.14em] hover:bg-paper/5">{t("realVsFake.cta.verify", "Verify a Scratch Code")}</Link></div>
        </div>
      </section>

      <section id="faq" className="container-editorial py-12 md:py-20 scroll-mt-32">
        <div className="grid lg:grid-cols-[0.55fr_1.45fr] gap-10 lg:gap-16">
          <div><p className="eyebrow">{t("realVsFake.faq.eyebrow", "Clear answers")}</p><h2 className="mt-4 font-serif text-3xl md:text-5xl text-ink">{t("realVsFake.faq.title", "Authenticity questions.")}</h2></div>
          <div className="border-t border-forest">
            {FAQ.map((item, index) => (
              <details key={item.q} className="group border-b hairline py-5"><summary className="cursor-pointer list-none flex justify-between gap-5 text-base font-semibold text-ink"><span>{t(`realVsFake.faq.${index + 1}.q`, item.q)}</span><span className="font-mono text-brass group-open:rotate-45 transition-transform" aria-hidden="true">+</span></summary><p className="pt-4 pe-10 text-sm leading-relaxed text-ink/70">{t(`realVsFake.faq.${index + 1}.a`, item.a)}</p></details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t hairline bg-ivory">
        <div className="container-editorial py-10 md:py-12 grid md:grid-cols-[1fr_1.4fr] gap-6 md:gap-12">
          <div><p className="eyebrow">{t("realVsFake.research.eyebrow", "Research basis")}</p><h2 className="mt-3 font-serif text-2xl text-ink">{t("realVsFake.research.title", "Why source and evidence matter.")}</h2></div>
          <div className="text-sm leading-relaxed text-ink/65 space-y-4">
            <p>{t("realVsFake.research.body", "Consumer-protection authorities consistently advise buying through accountable channels, treating unusually low prices and packaging differences as warning signs, retaining transaction evidence, and reporting suspected counterfeits. These principles inform this guide; Green Wealth’s product-specific code and authorization policy come from our own records.")}</p>
            <p className="text-xs"><a className="underline underline-offset-4 hover:text-forest" href="https://www.cbp.gov/trade/fakegoodsrealdangers" rel="noreferrer" target="_blank">{t("realVsFake.research.cbp", "U.S. Customs and Border Protection · The Truth Behind Counterfeits")}</a><span className="mx-2">·</span><a className="underline underline-offset-4 hover:text-forest" href="https://dos.ny.gov/fake-cosmetics-and-their-health-risks" rel="noreferrer" target="_blank">{t("realVsFake.research.ny", "New York Department of State · Fake Cosmetics and Health Risks")}</a><span className="mx-2">·</span><a className="underline underline-offset-4 hover:text-forest" href="https://www.oecd.org/en/about/news/press-releases/2025/05/global-trade-in-fake-goods-reached-USD-467-billion-posing-risks-to-consumer-safety-and-compromising-intellectual-property.html" rel="noreferrer" target="_blank">{t("realVsFake.research.oecd", "OECD/EUIPO · Mapping Global Trade in Fakes 2025")}</a></p>
            <p className="text-xs text-ink/55">{t("realVsFake.research.note", "Important: a recognized code supports identity in Green Wealth’s records. It does not guarantee individual results or prove every storage condition after dispatch. Packaging details may change; when in doubt, contact us before use.")}</p>
            <Link to="/terms" className="inline-flex text-xs font-mono uppercase tracking-[0.12em] text-forest border-b border-forest pb-1">{t("realVsFake.research.terms", "Read purchase and authenticity terms")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
