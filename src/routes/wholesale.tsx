import { abs, breadcrumbLd, canonicalFor, localeOf } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Page";
import { useState } from "react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/wholesale")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const title = locale === "ar" ? "الجملة والتوزيع — جرين ولث" : "Wholesale & Distribution — Green Wealth";
    const description = locale === "ar"
      ? "كن شريكًا لجرين ولث. أسعار الجملة، الحد الأدنى للطلب، العلامة الخاصة واستفسارات التوزيع في أكثر من 40 دولة."
      : "Partner with Green Wealth. Wholesale pricing, MOQs, private label and distribution enquiries across 40+ countries.";
    const breadcrumbHome = locale === "ar" ? "الرئيسية" : "Home";
    const breadcrumbWholesale = locale === "ar" ? "الجملة" : "Wholesale";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonicalFor("/wholesale", locale) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/wholesale", locale) }],
      scripts: [
        breadcrumbLd([
          { name: breadcrumbHome, path: "/" },
          { name: breadcrumbWholesale, path: "/wholesale" },
        ]),
      ],
    };
  },
  component: WholesalePage,
});

const process = [
  { n: "01", key: "step1", t: "Apply", d: "Submit the form with company details, channels and target markets." },
  { n: "02", key: "step2", t: "Review", d: "Our partnerships team reviews and responds within 48 hours." },
  { n: "03", key: "step3", t: "Discovery", d: "Video call to align on assortment, volumes and territory." },
  { n: "04", key: "step4", t: "Agreement", d: "Terms, price list and first purchase order confirmed." },
  { n: "05", key: "step5", t: "Launch", d: "Assets, training and shipment. Ongoing account support." },
];


function WholesalePage() {
  const t = useT();
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHeader
        eyebrow={t("misc.wholesale.header.eyebrow", "Wholesale partnerships")}
        title={t("misc.wholesale.header.title", "Distribute Green Wealth.")}
        intro={t("misc.wholesale.header.intro", "We partner with a curated network of retailers, clinics and distributors. Applications reviewed weekly by our partnerships desk.")}
      />

      {/* Process */}
      <section className="bg-ivory/40 border-y hairline">
        <div className="container-editorial py-12 md:py-20">
          <header className="max-w-2xl mb-8 md:mb-12">
            <h2 className="font-serif text-2xl md:text-4xl text-forest mt-2">{t("misc.wholesale.process.title", "Onboarding, in five steps.")}</h2>
          </header>
          <ol className="grid md:grid-cols-5 gap-px bg-forest/10 border hairline">
            {process.map((p) => (
              <li key={p.key} className="bg-paper p-5 md:p-6">
                <div className="font-serif text-3xl text-forest/30">{p.n}</div>
                <div className="eyebrow text-forest mt-3">{t(`misc.wholesale.process.${p.key}.title`, p.t)}</div>
                <p className="text-xs text-forest/70 mt-2 leading-relaxed">{t(`misc.wholesale.process.${p.key}.desc`, p.d)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Application form */}
      <section className="container-editorial py-12 md:py-20 grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
        <aside className="lg:sticky lg:top-24 self-start">
          <h2 className="font-serif text-2xl md:text-3xl text-forest mt-2">{t("misc.wholesale.apply.title", "Apply.")}</h2>
          <p className="text-sm text-forest/70 mt-3">{t("misc.wholesale.apply.desc", "Complete the application. A partnerships lead will respond within two business days from Bangkok office hours.")}</p>
          <dl className="mt-6 border-t hairline divide-y hairline text-sm">
            <div className="py-3 flex justify-between"><dt className="eyebrow text-forest/50">{t("misc.wholesale.apply.responseLabel", "Response")}</dt><dd className="text-forest">{t("misc.wholesale.apply.responseValue", "≤ 48 hours")}</dd></div>
            <div className="py-3 flex justify-between"><dt className="eyebrow text-forest/50">{t("misc.wholesale.apply.languagesLabel", "Languages")}</dt><dd className="text-forest" data-ltr>{t("misc.wholesale.apply.languagesValue", "EN · TH · AR")}</dd></div>
            <div className="py-3 flex justify-between"><dt className="eyebrow text-forest/50">{t("misc.wholesale.apply.contactLabel", "Contact")}</dt><dd className="text-forest" data-ltr>wholesale@greenwealth.com</dd></div>
          </dl>
        </aside>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="border hairline p-6 md:p-8 bg-paper"
        >
          <fieldset className="grid md:grid-cols-2 gap-5">
            <legend className="eyebrow text-forest/60 mb-4 col-span-full">{t("misc.wholesale.legend.company", "Company details")}</legend>
            {[
              { key: "fullName", label: "Full name", name: "name", type: "text" },
              { key: "company", label: "Company", name: "company", type: "text" },
              { key: "businessEmail", label: "Business email", name: "email", type: "email" },
              { key: "phone", label: "Phone", name: "phone", type: "tel" },
              { key: "country", label: "Country", name: "country", type: "text" },
              { key: "website", label: "Website", name: "website", type: "url" },
            ].map((f) => (
              <label key={f.name} className="block">
                <span className="eyebrow mb-2 block text-forest/60">{t(`misc.wholesale.field.${f.key}`, f.label)}</span>
                <input
                  name={f.name}
                  type={f.type}
                  required
                  data-ltr={f.type === "email" || f.type === "tel" || f.type === "url" ? true : undefined}
                  className="w-full bg-transparent border hairline p-3 outline-none focus:border-forest text-sm"
                />
              </label>
            ))}
          </fieldset>

          <fieldset className="grid md:grid-cols-2 gap-5 mt-8 pt-8 border-t hairline">
            <legend className="eyebrow text-forest/60 mb-4 col-span-full">{t("misc.wholesale.legend.profile", "Business profile")}</legend>
            <label className="block">
              <span className="eyebrow mb-2 block text-forest/60">{t("misc.wholesale.field.tier", "Partnership tier")}</span>
              <select name="tier" required className="w-full bg-transparent border hairline p-3 outline-none focus:border-forest text-sm">
                <option value="">{t("misc.wholesale.select.placeholder", "Select…")}</option>
                <option>{t("misc.wholesale.tier.t01", "T·01 — Retail Partner")}</option>
                <option>{t("misc.wholesale.tier.t02", "T·02 — Regional Distributor")}</option>
                <option>{t("misc.wholesale.tier.t03", "T·03 — Country Exclusive")}</option>
              </select>
            </label>
            <label className="block">
              <span className="eyebrow mb-2 block text-forest/60">{t("misc.wholesale.field.volume", "Estimated monthly volume")}</span>
              <select name="volume" required className="w-full bg-transparent border hairline p-3 outline-none focus:border-forest text-sm">
                <option value="">{t("misc.wholesale.select.placeholder", "Select…")}</option>
                <option>{t("misc.wholesale.volume.v1", "50 – 250 units")}</option>
                <option>{t("misc.wholesale.volume.v2", "250 – 1,000 units")}</option>
                <option>{t("misc.wholesale.volume.v3", "1,000 – 5,000 units")}</option>
                <option>{t("misc.wholesale.volume.v4", "5,000+ units")}</option>
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="eyebrow mb-2 block text-forest/60">{t("misc.wholesale.field.channels", "Sales channels")}</span>
              <input name="channels" required placeholder={t("misc.wholesale.field.channelsPlaceholder", "e.g. salons, pharmacies, e-commerce, department stores")} className="w-full bg-transparent border hairline p-3 outline-none focus:border-forest text-sm" />
            </label>
            <label className="block md:col-span-2">
              <span className="eyebrow mb-2 block text-forest/60">{t("misc.wholesale.field.message", "Products of interest & message")}</span>
              <textarea name="message" rows={5} className="w-full bg-transparent border hairline p-3 outline-none focus:border-forest text-sm" />
            </label>
          </fieldset>

          <label className="flex items-start gap-3 text-sm mt-6 text-forest/80">
            <input type="checkbox" required className="mt-1" />
            <span>{t("misc.wholesale.consent", "I agree to be contacted by Green Wealth about wholesale opportunities.")}</span>
          </label>

          <div className="mt-8 pt-6 border-t hairline flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-forest/60">{t("misc.wholesale.form.note", "Your details are used solely for partnership review.")}</p>
            <button disabled={sent} className="bg-forest text-ivory px-7 py-4 text-xs uppercase tracking-[0.18em] disabled:opacity-60">
              {sent ? t("misc.wholesale.form.submitted", "Application received") : t("misc.wholesale.form.submit", "Submit application")}
            </button>
          </div>
        </form>
      </section>

    </>
  );
}
