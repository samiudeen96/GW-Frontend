import { createFileRoute, Link } from "@tanstack/react-router";
import { breadcrumbLd, abs, canonicalFor, hreflangLinks, localeOf } from "@/lib/seo";
import { PageHeader } from "@/components/site/Page";
import { LegalSections, type LegalSection } from "@/components/site/LegalSections";
import { useT } from "@/lib/i18n";
import { tStatic } from "@/lib/i18n/static";
import { useLegalSections } from "@/lib/i18n/legal";

const legalHubLinks = [
  { href: "/terms", key: "terms", title: "Terms of Service", desc: "The rules and conditions for using our website and purchasing products." },
  { href: "/privacy", key: "privacy", title: "Privacy Policy", desc: "How we collect, use, store, and protect your personal information." },
  { href: "/refund-policy", key: "refund", title: "Refund Policy", desc: "Return windows, eligibility criteria, and how refunds are processed." },
  { href: "/shipping-returns", key: "shipping", title: "Shipping & Returns", desc: "Delivery timelines, shipping costs, and return instructions by region." },
  { href: "/cookie-policy", key: "cookie", title: "Cookie Policy", desc: "How we use cookies and similar technologies on greenwealth.com." },
  { href: "/accessibility", key: "accessibility", title: "Accessibility", desc: "Our commitment to making the site usable for everyone." },
];

const legalNoticeSections: LegalSection[] = [
  {
    title: "Company Identity & Imprint",
    html: `<p>This website, <strong>greenwealth.com</strong>, is owned and operated by <strong>Ghori Trading LLC</strong>, a limited liability company registered in the Emirate of Dubai, United Arab Emirates. <strong>Ghori Trading LLC</strong> is a subsidiary of <strong>GHORI Holding Limited</strong>.</p>
<ul>
<li><strong>Parent holding company</strong> — GHORI Holding Limited.</li>
<li><strong>Operating legal entity</strong> — Ghori Trading LLC (trading as Green Wealth).</li>
<li><strong>Registered address</strong> — 2003, One by Omniyat Tower, Business Bay, Dubai, United Arab Emirates.</li>
<li><strong>Nature of business</strong> — import, distribution, and direct-to-consumer retail of cosmetic and personal care products.</li>
<li><strong>Group entity</strong> — Abq Alahlam Almutamayiz, an authorised subsidiary for distribution in the Kingdom of Saudi Arabia and SAR-denominated orders.</li>
<li><strong>General contact</strong> — <a href="mailto:support@greenwealth.com">support@greenwealth.com</a> · <a href="mailto:legal@greenwealth.com">legal@greenwealth.com</a></li>
</ul>
<p>References to "we", "us", "our", and "the Company" throughout this notice and all linked policies mean Ghori Trading LLC, GHORI Holding Limited, and their respective subsidiaries and affiliated distribution entities where relevant.</p>`,
  },
  {
    title: "Scope & Acceptance of These Notices",
    html: `<p>This Legal Notice applies to every visitor, browser, customer, wholesale partner, and API consumer of greenwealth.com, including all subdomains, transactional emails, and customer portals we operate.</p>
<p>By accessing or using the site you confirm that you:</p>
<ul>
<li>Are of legal age to form a binding contract in your jurisdiction, or are using the site under the supervision of a parent or guardian.</li>
<li>Accept this Legal Notice together with our <a href="/terms">Terms of Service</a>, <a href="/privacy">Privacy Policy</a>, <a href="/refund-policy">Refund Policy</a>, <a href="/shipping-returns">Shipping &amp; Returns Policy</a>, and <a href="/cookie-policy">Cookie Policy</a>.</li>
<li>Will not use the site for any unlawful purpose or in a way that infringes the rights of others.</li>
</ul>
<p>Where a conflict arises between this Legal Notice and a specific policy, the specific policy governs for the subject matter it covers.</p>`,
  },
  {
    title: "Ownership & Brand Rights",
    html: `<p><strong>GHORI Holding Limited</strong> and its subsidiaries, including <strong>Ghori Trading LLC</strong>, are the owners of the Green Wealth<sup>&reg;</sup> brand family, the global distributors of the Neo Hair Lotion<sup>&reg;</sup> product line, and the operators of greenwealth.com. All brand names, logos, product names, packaging designs, formulations, photographs, videos, text, software, and trade dress on this site are the property of GHORI Holding Limited, Ghori Trading LLC, or their licensors and are protected by trademark, copyright, and other intellectual property laws.</p>
<p>No licence, right, or interest in any of our intellectual property is granted to you by your use of this site. Any rights not expressly granted here are reserved.</p>`,
  },
  {
    title: "Registered Trademarks",
    html: `<p>The following marks are registered trademarks or protected trade names of <strong>GHORI Holding Limited</strong> and its subsidiaries, including <strong>Ghori Trading LLC</strong>, in the United Arab Emirates and other jurisdictions:</p>
<ul>
<li><strong>GHORI<sup>&reg;</sup></strong> — master corporate and holding-company brand mark.</li>
<li><strong>Green Wealth<sup>&reg;</sup></strong> — flagship brand for premium hair care, scalp treatment, and botanical wellness products.</li>
<li><strong>Neo Hair Lotion<sup>&reg;</sup></strong> — registered product name for the original hair growth spray formulation.</li>
<li><strong>Neo Hair Shampoo<sup>&reg;</sup></strong> — registered product name for the complementary cleansing formulation.</li>
</ul>
<p>All associated word marks, logos, taglines, packaging configurations, and product identifiers are the exclusive property of GHORI Holding Limited and its subsidiaries. Unauthorized use of any registered mark, name, logo, or trade dress is strictly prohibited and may violate trademark, unfair-competition, or criminal laws. You may not use our marks in domain names, social handles, advertising keywords, marketplace listings, metadata, app identifiers, or comparative claims without our prior written consent.</p>
<p>Any third-party brand names that appear on this site are used solely for identification, description, or compatibility purposes and remain the property of their respective owners.</p>`,
  },
  {
    title: "Copyright & Protected Content",
    html: `<p>All content on this website is protected by copyright and related rights. This includes, but is not limited to:</p>
<ul>
<li>Product photography, packaging renders, and marketing videos.</li>
<li>Clinical protocol descriptions, how-to-use guides, and hair science articles.</li>
<li>Website design, user interface, source code, and database structures.</li>
<li>Customer testimonials and reviews published with permission.</li>
</ul>
<p>You may view, download, and print pages for personal reference only. Any commercial reproduction, distribution, modification, or extraction requires prior written permission.</p>
<p>Automated scraping, bulk downloading, framing, mirroring, or text-and-data mining of this site for the purpose of building competing catalogues or training commercial models is not permitted without a written licence. Reasonable indexing by search engines and AI assistants that respect our published <a href="/robots.txt">robots directives</a> is welcome.</p>`,
  },
  {
    title: "Permitted & Prohibited Use",
    html: `<p>You agree not to:</p>
<ul>
<li>Attempt to gain unauthorised access to accounts, servers, databases, or admin interfaces.</li>
<li>Interfere with site availability, including denial-of-service attempts, credential stuffing, or automated checkout abuse.</li>
<li>Submit false, fraudulent, or stolen payment details, or place orders with the intent to charge back in bad faith.</li>
<li>Post reviews or testimonials that are fabricated, incentivised without disclosure, or impersonate another person.</li>
<li>Resell products purchased at retail as an authorised distributor without a signed wholesale agreement — see <a href="/wholesale">Wholesale</a>.</li>
</ul>
<p>We may suspend or terminate access, cancel orders, and refuse future service where we reasonably suspect a breach of these conditions.</p>`,
  },
  {
    title: "Accounts, Verification & Security",
    html: `<p>Accounts are secured through email one-time codes and, optionally, a password you set from your <a href="/account">account portal</a>. You are responsible for keeping your sign-in email and any password confidential and for all activity conducted through your account.</p>
<ul>
<li>One-time codes are single-use, time-limited, and must never be shared with anyone — including people claiming to be our staff.</li>
<li>We will never ask for your password, full card number, or one-time code by phone, WhatsApp, or email.</li>
<li>Notify us immediately at <a href="mailto:support@greenwealth.com">support@greenwealth.com</a> if you suspect unauthorised account access.</li>
</ul>`,
  },
  {
    title: "Anti-Counterfeiting & Enforcement",
    html: `<p>We actively monitor the market for counterfeit products and unauthorized sellers. Ghori Trading LLC reserves the right to take enforcement action, including:</p>
<ul>
<li>Civil claims for damages, disgorgement, and legal fees.</li>
<li>Criminal referrals to customs and law enforcement agencies.</li>
<li>Emergency and permanent injunctions against infringers.</li>
<li>Takedown requests to online marketplaces and social platforms.</li>
</ul>
<p>Every genuine unit carries a batch-linked scratch code. To confirm the authenticity of your product, use the <a href="/verify">scratch code verification tool</a>, and review the side-by-side guide at <a href="/real-vs-fake">Real vs Fake</a>. A code that fails verification, has already been redeemed, or arrives pre-scratched should be treated as suspect and reported to us before use.</p>`,
  },
  {
    title: "Authorised Channels & Third-Party Sellers",
    html: `<p>greenwealth.com and our named authorised distributors are the only channels for which we can guarantee product provenance, cold-chain-free storage conditions, batch traceability, and warranty support.</p>
<p>We accept no responsibility for products purchased from unauthorised resellers, grey-market importers, auction listings, or social media sellers. Such products may be expired, diluted, relabelled, or counterfeit, and are not eligible for our authenticity support or refund policy.</p>`,
  },
  {
    title: "Product Information & Disclaimers",
    html: `<p>We make every effort to ensure product descriptions, pricing, and availability are accurate. However, we do not guarantee that all information is error-free, complete, or current. Individual results may vary, and product claims are based on the formulation and testing conducted by or on behalf of Ghori Trading LLC.</p>
<p>Our products are cosmetic and wellness products. They are not intended to diagnose, treat, cure, or prevent any disease. Always read the label, perform a patch test before first use, and follow the directions in our <a href="/how-to-use">usage protocol</a>.</p>
<p>Consult a qualified physician before use if you are pregnant, breastfeeding, undergoing dermatological treatment, taking medication that affects the scalp or hair cycle, or experiencing sudden or patchy hair loss that has not been medically assessed.</p>`,
  },
  {
    title: "Pricing, Currency & Taxes",
    html: `<p>Prices are displayed in the currency selected for your region and may change without notice. Where your country is not assigned a local currency, pricing defaults to USD.</p>
<ul>
<li>Obvious pricing or typographical errors do not bind us; we may cancel and fully refund affected orders.</li>
<li>Import duties, customs charges, and local taxes may be payable on delivery and are the responsibility of the recipient unless stated otherwise at checkout.</li>
<li>Currency conversion, cross-border, and card-issuer fees are set by your bank and are outside our control.</li>
</ul>
<p>Full commercial terms are set out in our <a href="/terms">Terms of Service</a> and <a href="/shipping-returns">Shipping &amp; Returns Policy</a>.</p>`,
  },
  {
    title: "Testimonials, Reviews & User Content",
    html: `<p>Reviews and testimonials published on this site reflect the personal experience of individual customers and are not a guarantee of results. Aggregate ratings may combine verified purchases from our own store with reviews collected from authorised marketplace channels; the source is disclosed where applicable.</p>
<p>By submitting a review, photograph, or other content you grant us a non-exclusive, worldwide, royalty-free licence to publish, reproduce, and adapt it for marketing and product-information purposes, and you confirm that the content is your own and does not infringe third-party rights. We may decline, edit for length or clarity, or remove content that is unlawful, abusive, medically misleading, or promotional.</p>`,
  },
  {
    title: "Third-Party Links, Services & Processors",
    html: `<p>The site integrates and links to third-party services, including payment gateways, logistics carriers, analytics, email delivery, and customer messaging platforms. Their processing of your data is governed by their own terms and privacy notices.</p>
<p>Links to external sites are provided for convenience only. We do not endorse and are not responsible for the content, security, or practices of any third-party site. A current description of the categories of processors we rely on is maintained in our <a href="/privacy">Privacy Policy</a>.</p>`,
  },
  {
    title: "Data Protection Principles",
    html: `<p>We handle personal data in accordance with our <a href="/privacy">Privacy Policy</a> and the following principles:</p>
<ul>
<li><strong>Data minimization</strong> — we collect only what is necessary.</li>
<li><strong>Purpose limitation</strong> — data is used only for disclosed purposes.</li>
<li><strong>Storage limitation</strong> — data is retained only as long as needed or required by law.</li>
<li><strong>Security</strong> — encryption in transit and at rest, with strict access controls.</li>
<li><strong>Cross-border transfers</strong> — safeguarded using appropriate legal mechanisms.</li>
</ul>
<p>You can exercise access, correction, deletion, and objection rights by writing to <a href="mailto:legal@greenwealth.com">legal@greenwealth.com</a>. Cookie and tracking choices are described in our <a href="/cookie-policy">Cookie Policy</a>.</p>`,
  },
  {
    title: "Limitation of Liability & Indemnity",
    html: `<p>To the maximum extent permitted by applicable law, Ghori Trading LLC, its directors, employees, affiliates, and suppliers are not liable for indirect, incidental, special, consequential, or punitive losses, including loss of profit, data, goodwill, or anticipated results, arising from your use of the site or products purchased through it.</p>
<p>Where liability cannot be excluded, our total aggregate liability in connection with any order is limited to the amount you paid for that order. Nothing in this notice excludes liability for fraud, wilful misconduct, death, or personal injury where such exclusion is prohibited by law.</p>
<p>You agree to indemnify us against claims, damages, and costs arising from your breach of this Legal Notice or your unlawful use of the site.</p>`,
  },
  {
    title: "Force Majeure & Site Availability",
    html: `<p>The site is provided on an "as is" and "as available" basis. We do not warrant uninterrupted or error-free operation and may suspend, withdraw, or restrict all or part of the site for maintenance, security, or commercial reasons.</p>
<p>We are not liable for delays or failures in performance caused by events beyond our reasonable control, including carrier disruption, customs holds, payment network outages, natural events, labour action, civil unrest, cyber-attack, or changes in law or regulation.</p>`,
  },
  {
    title: "Complaints & Dispute Resolution",
    html: `<p>We aim to resolve concerns directly and quickly. Please raise complaints in the following order:</p>
<ul>
<li><strong>Step one</strong> — contact customer care at <a href="mailto:support@greenwealth.com">support@greenwealth.com</a> with your order reference and a description of the issue.</li>
<li><strong>Step two</strong> — if unresolved, request escalation to a supervisor; we acknowledge escalations within two business days.</li>
<li><strong>Step three</strong> — for legal or formal matters, write to <a href="mailto:legal@greenwealth.com">legal@greenwealth.com</a>; we aim to respond to substantive legal correspondence within five business days.</li>
</ul>
<p>The parties will attempt good-faith resolution before commencing proceedings. This does not affect any statutory consumer rights available to you in your country of residence.</p>`,
  },
  {
    title: "Governing Law & Jurisdiction",
    html: `<p>These legal notices and any disputes arising from the use of this website are governed by the laws of the United Arab Emirates. Any legal proceedings shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE, without prejudice to our right to enforce our rights in any jurisdiction where infringement occurs.</p>
<p>If any provision of this notice is held invalid or unenforceable, that provision will be limited or severed to the minimum extent necessary and the remaining provisions remain in full force.</p>`,
  },
  {
    title: "Changes to These Notices",
    html: `<p>We may update this Legal Notice and any linked policy at any time to reflect changes in our operations, products, or legal obligations. The version published on this page is the version in force. Material changes will be highlighted on this page, and continued use of the site after publication constitutes acceptance.</p>
<p>Terms applicable to a completed order are those in force at the time the order was placed.</p>`,
  },
  {
    title: "Report Infringement or Legal Concerns",
    html: `<p>If you believe your intellectual property rights have been infringed, or if you have any legal questions about our website or products, please contact us:</p>
<p><strong>Ghori Trading LLC</strong><br/>2003, One by Omniyat Tower, Business Bay, Dubai, UAE<br/>Email: <a href="mailto:legal@greenwealth.com">legal@greenwealth.com</a></p>
<p>To help us act quickly, include: the right you rely on and evidence of ownership; the exact URLs or listings concerned; a description of the alleged infringement; your contact details; and a statement that the information provided is accurate and submitted in good faith.</p>`,
  },
];

const tocIds = legalNoticeSections.map((s) =>
  s.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, ""),
);

const EN = {
  eyebrow: "Legal Center",
  title: "Legal Notice",
  intro:
    "Intellectual property, trademark, copyright, anti-counterfeiting enforcement, data protection, and governing terms for greenwealth.com, operated by Ghori Trading LLC.",
  seoTitle: "Legal Notice — Green Wealth | Ghori Trading LLC",
  seoDescription:
    "Legal notice, intellectual property, trademark, copyright, anti-counterfeiting enforcement, and data protection for greenwealth.com.",
  ogTitle: "Legal Notice — Green Wealth",
  ogDescription:
    "Intellectual property, trademark, copyright, and data protection information for greenwealth.com.",
  hubHeading: "Related Legal Pages",
  tocHeading: "On this page",
  bodyIntro:
    "The statements below apply to all visitors and users of greenwealth.com. They do not replace the full Terms of Service, Privacy Policy, or other policies linked above.",
  helpHeading: "Need to reach our legal team?",
  helpDesc:
    "For infringement reports, authenticity concerns, or general legal inquiries, email us directly. We aim to respond to substantive legal correspondence within five business days.",
  helpCta: "EMAIL LEGAL",
  jsonldName: "Legal Notice — Green Wealth",
  jsonldDescription:
    "Legal notice, intellectual property, trademark, copyright, anti-counterfeiting, and data protection information for greenwealth.com.",
};

function LegalHubPage() {
  const t = useT();
  const localized = useLegalSections("notice", legalNoticeSections);

  return (
    <>
      <PageHeader
        eyebrow={t("legal.notice.eyebrow", EN.eyebrow)}
        title={t("legal.notice.title", EN.title)}
        intro={t("legal.notice.intro", EN.intro)}
      />

      <section className="container-editorial py-8 md:py-14 border-b hairline bg-paper">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2 className="eyebrow">{t("legal.notice.hub.heading", EN.hubHeading)}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-ink/10 border hairline">
          {legalHubLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="group bg-paper p-4 md:p-5 block transition-colors hover:bg-ivory focus:outline-none focus:ring-2 focus:ring-forest focus:ring-inset"
            >
              <h3 className="text-sm font-bold mb-1.5 group-hover:text-forest transition-colors">
                {t(`legal.notice.hub.${link.key}.title`, link.title)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`legal.notice.hub.${link.key}.desc`, link.desc)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="container-editorial py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <nav className="lg:col-span-3">
            <div className="lg:sticky lg:top-28 border hairline bg-paper">
              <div className="px-4 py-4 border-b hairline bg-ivory">
                <h2 className="eyebrow">{t("legal.notice.toc.heading", EN.tocHeading)}</h2>
              </div>
              <ol className="divide-y hairline">
                {localized.map((item, i) => (
                  <li key={tocIds[i]}>
                    <a
                      href={`#${tocIds[i]}`}
                      className="block px-4 py-3 text-sm text-muted-foreground hover:text-forest hover:bg-ivory/50 transition-colors leading-snug"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="lg:col-span-9">
            <div className="border hairline bg-paper p-4 md:p-6 lg:p-8">
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-3xl">
                {t("legal.notice.body.intro", EN.bodyIntro)}
              </p>
              <div className="space-y-4">
                {localized.map((s, i) => (
                  <article
                    key={tocIds[i]}
                    id={tocIds[i]}
                    className="border hairline bg-paper scroll-mt-28 overflow-hidden"
                  >
                    <div className="p-4 md:p-5">
                      <h2 className="text-sm font-bold mb-3 tracking-tight">{s.title}</h2>
                      <div
                        className="text-sm text-ink/75 leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-forest [&_p]:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: s.html }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="container-editorial py-12 md:py-20 border-t hairline bg-ivory/30">
        <div className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left">
          <h2 className="display-md mb-4">{t("legal.notice.help.heading", EN.helpHeading)}</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {t("legal.notice.help.desc", EN.helpDesc)}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="mailto:legal@greenwealth.com"
              className="inline-flex items-center justify-center h-12 px-8 bg-forest text-paper text-sm font-medium tracking-wide hover:bg-forest-dark transition-colors"
            >
              {t("legal.notice.help.cta", EN.helpCta)}
            </a>
            <span className="text-xs text-muted-foreground">legal@greenwealth.com</span>
          </div>
        </div>
      </section>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t("legal.notice.jsonld.name", EN.jsonldName),
          description: t("legal.notice.jsonld.description", EN.jsonldDescription),
          url: "https://greenwealth.com/legal",
          mainEntity: {
            "@type": "Organization",
            name: "Ghori Trading LLC",
            url: "https://greenwealth.com",
            parentOrganization: {
              "@type": "Organization",
              name: "GHORI Holding Limited",
            },
            brand: {
              "@type": "Brand",
              name: "Green Wealth",
            },
          },
        })}
      </script>
    </>
  );
}

export const Route = createFileRoute("/legal")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const t = tStatic(locale);
    return {
      meta: [
        { title: t("legal.notice.seo.title", EN.seoTitle) },
        { name: "description", content: t("legal.notice.seo.description", EN.seoDescription) },
        { name: "robots", content: "noindex, follow" },
        { property: "og:title", content: t("legal.notice.seo.ogTitle", EN.ogTitle) },
        { property: "og:description", content: t("legal.notice.seo.ogDescription", EN.ogDescription) },
        { property: "og:type", content: "website" },
        { property: "og:url", content: abs("/legal") },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/legal", locale) }, ...hreflangLinks("/legal")],
      scripts: [breadcrumbLd([{ name: "Home", path: "/" }, { name: "Legal", path: "/legal" }])],
    };
  },
  component: LegalHubPage,
});
