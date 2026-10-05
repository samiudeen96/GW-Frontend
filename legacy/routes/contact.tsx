import { abs, breadcrumbLd, canonicalFor, localeOf } from "@/lib/seo";
import { sendContactMessage } from "@/lib/email.functions";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { useT } from "@/lib/i18n";



export const Route = createFileRoute("/contact")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const title = locale === "ar"
      ? "تواصل مع جرين ولث — الدعم لطلبات لوشن نيو للشعر"
      : "Contact Green Wealth — Support for Neo Hair Lotion Orders";
    const description = locale === "ar"
      ? "تواصل مع فريق خدمة عملاء جرين ولث بخصوص الطلبات والأصالة والجملة والشراكات. المقر الرئيسي في دبي. الرد خلال 24 ساعة."
      : "Reach Green Wealth customer care for orders, authenticity, wholesale and partnerships. Head office in Dubai. Response within 24 hours.";
    const ogTitle = locale === "ar" ? "تواصل مع جرين ولث" : "Contact Green Wealth";
    const ogDescription = locale === "ar"
      ? "تحدّث مع فريق دعم جرين ولث الرسمي. المقر الرئيسي في دبي، الإمارات العربية المتحدة. متاح عبر واتساب والبريد الإلكتروني والهاتف."
      : "Talk to the official Green Wealth support team. Head office in Dubai, UAE. WhatsApp, email and phone available.";
    const breadcrumbHome = locale === "ar" ? "الرئيسية" : "Home";
    const breadcrumbContact = locale === "ar" ? "تواصل معنا" : "Contact";
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
      { property: "og:url", content: canonicalFor("/contact", locale) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonicalFor("/contact", locale) }],
    scripts: [
      breadcrumbLd([
        { name: breadcrumbHome, path: "/" },
        { name: breadcrumbContact, path: "/contact" },
      ]),
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Green Wealth",
          mainEntity: {
            "@type": "Organization",
            name: "Green Wealth",
            telephone: "+971-800-44674",
            email: "sales@greenwealth.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "2003, One By Omniyat, Business Bay",
              addressLocality: "Dubai",
              addressCountry: "AE",
            },
            contactPoint: [
              {
                "@type": "ContactPoint",
                contactType: "customer service",
                telephone: "+971-800-44674",
                availableLanguage: ["English", "Arabic"],
              },
              {
                "@type": "ContactPoint",
                contactType: "sales",
                email: "sales@greenwealth.com",
                availableLanguage: ["English", "Arabic"],
              },
            ],
          },
        }),
      },
    ],
  };
  },
  component: ContactPage,
});

const WHATSAPP_URL = "https://wa.me/97180044674";

const SUBJECTS = [
  { key: "general", label: "General Inquiry" },
  { key: "orderStatus", label: "Order Status" },
  { key: "productInquiry", label: "Product Inquiry" },
  { key: "returns", label: "Returns & Exchange" },
  { key: "wholesale", label: "Distribution & Wholesale" },
  { key: "partnership", label: "Partnership Opportunity" },
  { key: "authenticity", label: "Authenticity Verification" },
  { key: "feedback", label: "Feedback" },
];

const CONTACT_CARDS = [
  {
    key: "office",
    label: "Head Office",
    lines: ["Ghori Trading LLC", "2003, One By Omniyat", "Business Bay, Dubai, UAE"],
  },
  { key: "phone", label: "Phone", lines: ["+971 800 44674", "Toll-free within UAE"] },
  { key: "email", label: "Email", lines: ["sales@greenwealth.com", "support@greenwealth.com"] },
  { key: "hours", label: "Working Hours", lines: ["Mon – Sat  9AM – 7PM GST", "Sunday closed"] },
];

const SUPPORT_STANDARDS = [
  { key: "global", title: "Global Coverage", desc: "Support in English & Arabic across 90+ countries." },
  { key: "fast", title: "Fast Response", desc: "Average reply time under 12 hours, 7 days a week." },
  { key: "order", title: "Order Assistance", desc: "Tracking, delivery, customs & re-ship support." },
  { key: "authenticity", title: "Authenticity Desk", desc: "Verify holograms, scratch codes & sellers in minutes." },
  { key: "wholesale", title: "Wholesale Team", desc: "Direct line to our distribution & partnerships desk." },
  { key: "whatsapp", title: "WhatsApp Concierge", desc: "Instant chat with a human agent, not a bot." },
];


const DEPARTMENTS = [
  {
    key: "care",
    label: "Customer Care",
    email: "support@greenwealth.com",
    for: "Orders, tracking, returns, refunds, replacements.",
  },
  {
    key: "sales",
    label: "Sales & Wholesale",
    email: "sales@greenwealth.com",
    for: "Bulk orders, retailer accounts, distributor onboarding.",
  },
  {
    key: "partnerships",
    label: "Partnerships",
    email: "partners@greenwealth.com",
    for: "Country distributors, exclusive market rights, brand collaborations.",
  },
  {
    key: "authenticity",
    label: "Authenticity & Anti-Counterfeit",
    email: "verify@greenwealth.com",
    for: "Report a fake seller, verify a code, submit a marketplace listing.",
  },
  {
    key: "press",
    label: "Press & Media",
    email: "press@greenwealth.com",
    for: "Interview requests, editorial images, brand fact-sheets.",
  },
];

const FAQ = [
  {
    key: "q1",
    q: "How fast will I hear back?",
    a: "Our customer team responds within 24 hours, with an average of under 12 hours. WhatsApp is typically fastest during Dubai business hours.",
  },
  {
    key: "q2",
    q: "How do I confirm my Neo Hair Lotion is authentic?",
    a: "Every authorised bottle carries a 3D holographic seal, a white nozzle, and a unique verification code. Enter it on our /verify page or send it to verify@greenwealth.com.",
  },
  {
    key: "q3",
    q: "Do you ship worldwide?",
    a: "Yes. We ship to 90+ countries from our Dubai and Bangkok fulfilment hubs. Duties and taxes are calculated at checkout where applicable.",
  },
  {
    key: "q4",
    q: "I want to sell Neo Hair Lotion in my country — who do I talk to?",
    a: "Write to sales@greenwealth.com with your market, expected volume, and existing retail footprint. Our distribution desk replies within two business days.",
  },
];

function ContactPage() {
  const t = useT();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const send = useServerFn(sendContactMessage);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const result = await send({
        data: { firstName, lastName, email, subject, orderRef, message },
      });
      if (result.ok) setSent(true);
      else setError(result.error ?? t("misc.contact.form.errorGeneric", "We could not send your message. Please try again."));
    } catch {
      setError(t("misc.contact.form.errorGeneric", "We could not send your message. Please try again."));
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-forest text-ivory">
        <div className="container-editorial py-20 md:py-28 text-center">
          <span className="inline-block border border-ivory/20 bg-ivory/[0.03] text-ivory/70 text-[10px] uppercase tracking-[0.3em] font-semibold px-5 py-2 mb-8">
            {t("misc.contact.badge", "Customer Care")}
          </span>
          <h1 className="display-lg text-ivory">{t("misc.contact.hero.title", "Get in Touch")}</h1>
          <p className="mt-6 text-sm md:text-base text-ivory/60 leading-relaxed max-w-xl mx-auto">
            {t("misc.contact.hero.desc", "Our dedicated team assists with orders, product questions, authenticity, and partnerships. Average response time under 12 hours.")}
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-ivory">
        <div className="container-editorial -mt-10 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {CONTACT_CARDS.map((c) => (
              <div key={c.key} className="p-5 md:p-6 bg-paper border hairline">

                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-forest mb-2">
                  {t(`misc.contact.card.${c.key}.label`, c.label)}
                </p>
                {c.lines.map((l, i) => (
                  <p key={l} className="text-xs leading-relaxed text-ink/60">
                    {t(`misc.contact.card.${c.key}.line${i + 1}`, l)}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp banner */}
        <div className="container-editorial py-8">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 md:p-6 bg-forest text-ivory hover:brightness-110 transition"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em]">{t("misc.contact.whatsapp.title", "Chat on WhatsApp")}</p>
              <p className="text-[11px] text-ivory/50">{t("misc.contact.whatsapp.desc", "Instant support · +971 800 44674")}</p>
            </div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-ivory/60 hidden sm:inline">{t("misc.contact.whatsapp.open", "Open →")}</span>

          </a>
        </div>
      </section>

      {/* Support standards grid */}
      <section className="bg-paper">
        <div className="container-editorial py-16 md:py-24">
          <div className="text-center mb-12">
            <div className="eyebrow mb-4">{t("misc.contact.standards.eyebrow", "What to Expect")}</div>
            <h2 className="font-serif text-3xl md:text-5xl text-forest">{t("misc.contact.standards.title", "Our Support Standards")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {SUPPORT_STANDARDS.map((p) => (
              <div key={p.key} className="p-6 md:p-8 border hairline">
                
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-forest mb-2">
                  {t(`misc.contact.standard.${p.key}.title`, p.title)}
                </h3>
                <p className="text-xs text-ink/60 leading-relaxed">{t(`misc.contact.standard.${p.key}.desc`, p.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-ivory">
        <div className="container-editorial py-16 md:py-24">
          <div className="mb-10">
            <div className="eyebrow mb-4">{t("misc.contact.departments.eyebrow", "Direct Lines")}</div>
            <h2 className="font-serif text-3xl md:text-5xl text-forest">{t("misc.contact.departments.title", "Reach the Right Desk")}</h2>
            <p className="mt-4 text-sm text-ink/60 max-w-xl">
              {t("misc.contact.departments.desc", "Skip the routing — write directly to the team best suited to your request.")}
            </p>
          </div>
          <div className="border hairline">
            {DEPARTMENTS.map((d) => (
              <div
                key={d.key}
                className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-4 md:gap-8 items-center p-5 md:p-6 border-b hairline last:border-b-0"
              >
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-forest">
                  {t(`misc.contact.dept.${d.key}.label`, d.label)}
                </p>
                <p className="text-xs text-ink/60 leading-relaxed">{t(`misc.contact.dept.${d.key}.for`, d.for)}</p>
                <a
                  href={`mailto:${d.email}`}
                  data-ltr
                  className="text-xs font-mono text-forest underline underline-offset-4 hover:text-[color:var(--moss)]"
                >
                  {d.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="bg-paper">
        <div className="container-editorial py-16 md:py-24 grid md:grid-cols-5 gap-10 md:gap-14">
          {/* Left context */}
          <div className="md:col-span-2 space-y-6">
            <div className="eyebrow">{t("misc.contact.form.eyebrow", "Send a Message")}</div>
            <h2 className="font-serif text-3xl md:text-4xl text-forest leading-tight">
              {t("misc.contact.form.title", "We would love to hear from you.")}
            </h2>
            <p className="text-sm text-ink/70 leading-relaxed">
              {t("misc.contact.form.desc", "Whether it is a question about our products, help tracking an order, or a distribution opportunity — fill the form and our team will reply within 24 hours.")}
            </p>
            <ul className="space-y-3 pt-4 border-t hairline">
              <li className="text-xs text-ink/70">{t("misc.contact.form.bullet1", "— Product, order and authenticity support")}</li>
              <li className="text-xs text-ink/70">{t("misc.contact.form.bullet2", "— Replies during published support hours")}</li>
              <li className="text-xs text-ink/70">{t("misc.contact.form.bullet3", "— Every message reviewed by our support team")}</li>
            </ul>

          </div>

          {/* Right form */}
          <div className="md:col-span-3">
            {sent ? (
              <div className="p-10 bg-ivory border hairline text-center">
                <h3 className="font-serif text-2xl text-forest mb-3">{t("misc.contact.form.sentTitle", "Message sent")}</h3>
                <p className="text-sm text-ink/60 mb-6 max-w-sm mx-auto">
                  {t("misc.contact.form.sentDescPrefix", "Our customer care team has your message and a confirmation is on its way to")} {email}.
                  {" "}{t("misc.contact.form.sentDescSuffix", "A human agent replies within 12 hours.")}
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="inline-flex px-6 py-3 bg-forest text-ivory text-[10px] uppercase tracking-[0.2em] font-semibold"
                >
                  {t("misc.contact.form.sendAnother", "Send another")}
                </button>
              </div>

            ) : (
              <form onSubmit={submit} className="p-6 md:p-8 bg-ivory border hairline space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label={t("misc.contact.field.firstName", "First name")}>
                    <input
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  <Field label={t("misc.contact.field.lastName", "Last name")}>
                    <input
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>
                <Field label={t("misc.contact.field.email", "Email")}>
                  <input
                    required
                    type="email"
                    data-ltr
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label={t("misc.contact.field.subject", "Subject")}>
                  <select
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">{t("misc.contact.subject.placeholder", "Select a subject…")}</option>
                    {SUBJECTS.map((s) => (
                      <option key={s.key} value={s.label}>
                        {t(`misc.contact.subject.${s.key}`, s.label)}
                      </option>
                    ))}
                  </select>
                </Field>
                {subject === "Order Status" && (
                  <Field label={t("misc.contact.field.orderRef", "Order reference")}>
                    <input
                      value={orderRef}
                      onChange={(e) => setOrderRef(e.target.value)}
                      placeholder={t("misc.contact.field.orderRefPlaceholder", "e.g. GW-24815")}
                      data-ltr
                      className={inputCls}
                    />
                  </Field>
                )}
                <Field label={t("misc.contact.field.message", "Message")}>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={inputCls + " min-h-32 resize-y"}
                  />
                </Field>
                {error && (
                  <p className="border border-red-700/40 bg-red-50 px-4 py-3 text-xs text-red-800">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full px-6 py-4 bg-forest text-ivory text-[11px] uppercase tracking-[0.2em] font-semibold hover:brightness-110 transition disabled:opacity-60"
                >
                  {sending ? t("misc.contact.form.sending", "Sending…") : t("misc.contact.form.submit", "Send message")}
                </button>

              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map + Address */}
      <section className="bg-ivory">
        <div className="container-editorial py-16 md:py-24 grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="eyebrow">{t("misc.contact.visit.eyebrow", "Visit")}</div>
            <h2 className="font-serif text-3xl md:text-4xl text-forest">{t("misc.contact.visit.title", "Dubai Headquarters")}</h2>
            <p className="text-sm text-ink/70 leading-relaxed">
              {t("misc.contact.visit.desc", "Ghori Trading LLC operates from Business Bay, Dubai — the strategic bridge between our Bangkok manufacturing partner and our 90+ international markets.")}
            </p>
            <address className="not-italic text-sm text-ink/80 leading-relaxed border-l-2 border-forest pl-4">
              {t("misc.contact.visit.addrCompany", "Ghori Trading LLC")}<br />
              {t("misc.contact.visit.addrOffice", "Office 2003, One By Omniyat")}<br />
              {t("misc.contact.visit.addrBusinessBay", "Business Bay, Dubai")}<br />
              {t("misc.contact.visit.addrCountry", "United Arab Emirates")}
            </address>
            <a
              href="https://www.google.com/maps/search/Ghori+Trading+LLC,+Dubai,+UAE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-forest hover:underline"
            >
              {t("misc.contact.visit.mapLink", "Open in Google Maps →")}
            </a>
          </div>
          <div className="border hairline">
            <iframe
              title={t("misc.contact.mapTitle", "Ghori Trading LLC Location")}
              src="https://www.google.com/maps?q=Business+Bay+Dubai+UAE&output=embed"
              width="100%"
              height="360"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper">
        <div className="container-editorial py-16 md:py-24">
          <div className="mb-10 text-center">
            <div className="eyebrow mb-4">{t("misc.contact.faq.eyebrow", "Quick Answers")}</div>
            <h2 className="font-serif text-3xl md:text-5xl text-forest">
              {t("misc.contact.faq.title", "Before you write to us")}
            </h2>
          </div>
          <div className="max-w-3xl mx-auto border hairline">
            {FAQ.map((f) => (
              <div key={f.key} className="p-6 md:p-8 border-b hairline last:border-b-0">
                <h3 className="text-sm font-bold text-forest mb-2">{t(`misc.contact.faq.${f.key}`, f.q)}</h3>
                <p className="text-xs text-ink/60 leading-relaxed">{t(`misc.contact.faq.a${f.key.slice(1)}`, f.a)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const inputCls =
  "w-full h-11 px-3 bg-paper border hairline text-sm text-ink focus:outline-none focus:ring-1 focus:ring-forest";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[10px] uppercase tracking-[0.15em] font-bold text-forest">
        {label}
      </span>
      {children}
    </label>
  );
}
