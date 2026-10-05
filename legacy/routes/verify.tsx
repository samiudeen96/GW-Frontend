import { abs, breadcrumbLd, canonicalFor, hreflangLinks, localeOf } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Page";
import { TrustBar, CustomerQuote } from "@/components/site/SocialProof";
import stickerCropAsset from "@/assets/neo-authenticity-sticker-crop.jpg.asset.json";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { verifySecretCode, type VerifyResult } from "@/lib/verify.functions";
import { VerifyResultPanel, VerifyCheckingPanel } from "@/components/verify/VerifyResultPanel";
import { useT } from "@/lib/i18n";
import { arVerify } from "@/lib/i18n/ar/verify";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";




export const Route = createFileRoute("/verify")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const title = locale === "ar"
      ? "تحقّق من أصالة لوشن نيو للشعر الأصلي | فحص الأصالة من جرين ولث"
      : "Verify Original Neo Hair Lotion | Green Wealth Authenticity Check";
    const description = locale === "ar"
      ? "تحقّق من رمز الخدش الخاص بلوشن نيو للشعر عبر الإنترنت — الأصالة وتاريخ الصلاحية والتوزيع المعتمد لمنتجات جرين ولث."
      : "Verify your Neo Hair Lotion scratch code online — confirm authenticity, expiry and authorized distribution for every Green Wealth product."
    const ogTitle = locale === "ar"
      ? "تحقّق من أصالة لوشن نيو للشعر الأصلي | جرين ولث"
      : "Verify Original Neo Hair Lotion | Green Wealth";
    const ogDescription = locale === "ar"
      ? "أدخل رمز الخدش الخاص بمنتج لوشن نيو للشعر للتأكد من أن منتجك من جرين ولث أصلي وسارٍ ومن مصدر معتمد."
      : "Enter your Neo Hair Lotion scratch code to confirm your Green Wealth product is genuine, in date, and from an authorized source.";
    const stepsLocalized = getSteps(locale);
    return {
      meta: [
        { title },
        {
          name: "description",
          content: description,
        },
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: ogDescription },
        { property: "og:url", content: canonicalFor("/verify", locale) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/verify", locale) }, ...hreflangLinks("/verify")],
      scripts: [
        breadcrumbLd([
          { name: locale === "ar" ? "الرئيسية" : "Home", path: "/" },
          { name: locale === "ar" ? "التحقق" : "Verify", path: "/verify" },
        ]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: locale === "ar" ? "فحص أصالة لوشن نيو للشعر" : "Neo Hair Lotion Authenticity Check",
            description: locale === "ar"
              ? "تحقّق من رمز الخدش الخاص بمنتج لوشن نيو للشعر عبر الإنترنت. تأكّد من الأصالة وتاريخ الصلاحية والتوزيع المعتمد من جرين ولث."
              : "Verify your Neo Hair Lotion scratch code online. Check authenticity, expiry, and authorized distribution by Green Wealth.",
            url: "/verify",
            mainEntity: {
              "@type": "HowTo",
              name: locale === "ar"
                ? "كيفية التحقق من رمز الخدش الأصلي للوشن نيو للشعر"
                : "How to verify your original Neo Hair Lotion scratch code",
              step: stepsLocalized.map((s) => ({
                "@type": "HowToStep",
                name: s.title,
                text: s.body,
                url: `/verify#step-${s.number}`,
              })),
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: VERIFY_FAQ.map((f) => ({
              "@type": "Question",
              name: locale === "ar" ? (arVerify[f.qk] ?? f.q) : f.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: locale === "ar" ? (arVerify[f.ak] ?? f.a) : f.a,
              },
            })),
          }),
        },
      ],

    };
  },
  component: VerifyPage,
});



function getSteps(locale: string) {
  const isAr = locale === "ar";
  return [
    {
      number: "01",
      title: isAr ? "حدّد موقع الملصق" : "Locate the sticker",
      body: isAr
        ? "ابحث عن ملصق الأمان الهولوغرافي «ORIGINAL» على جانب العلبة أو خلفها. يظهر عليه شريط خدش أسود مع رقم تسلسلي مطبوع أسفله."
        : "Find the holographic ORIGINAL security sticker on the side or back of the box. It shows a black scratch-off bar with a printed serial number underneath.",
    },
    {
      number: "02",
      title: isAr ? "اخدش المنطقة السوداء" : "Scratch the black area",
      body: isAr
        ? "استخدم قطعة نقدية أو ظفرك لخدش الشريط الأسود برفق. رمز التحقق المخفي المكوّن من 12 رقمًا مطبوع خلفه."
        : "Use a coin or your fingernail to gently scratch off the black bar. The hidden 12 digit verification code is printed behind it.",
    },
    {
      number: "03",
      title: isAr ? "أدخل الرمز المكوّن من 12 رقمًا" : "Enter the 12 digit code",
      body: isAr
        ? "اكتب الرمز المكوّن من 12 رقمًا تمامًا كما ظهر. لا تُدخل الرقم التسلسلي المطبوع أسفل منطقة الخدش — فهذا ليس رمز التحقق."
        : "Type the 12 digit code exactly as revealed. Do not enter the printed serial number below the scratch area — that is not the verification code.",
    },
    {
      number: "04",
      title: isAr ? "تأكيد الأصالة" : "Confirm authenticity",
      body: isAr
        ? "يتحقق نظامنا من رمز الخدش مقابل سجلات الإنتاج وتاريخ الصلاحية وتصريح التوزيع. تؤكد النتيجة الموثّقة أن التركيبة ضمن نافذة فعاليتها النشطة."
        : "Our system checks the scratch code against production records, expiry, and distribution authorization. A verified result confirms the formula is within its active potency window.",
    },
    {
      number: "05",
      title: isAr ? "أبلغ في حال الفشل" : "Report if it fails",
      body: isAr
        ? "إذا فشل التحقق أو لم يُتعرّف على الرمز، لا تستخدم هذا المنتج. تواصل فورًا مع فريق الدعم لدينا مع صور للعبوة."
        : "If verification fails or the code is not recognized, do not use the product. Contact our support team immediately with photos of the packaging.",
    },
  ];
}

/** FAQ entries (key + English default) shared by the rendered list and FAQPage JSON-LD. */
const VERIFY_FAQ = [
  {
    qk: "verify.faq.1.q",
    q: "Where is the verification code on Neo Hair Lotion?",
    ak: "verify.faq.1.a",
    a: "On the holographic security label, usually on the side or back of the carton. A black scratch-off bar hides the 12 digit code; the number printed beneath the bar is a public serial, not the verification code.",
  },
  {
    qk: "verify.faq.2.q",
    q: "Can I verify the same code more than once?",
    ak: "verify.faq.2.a",
    a: "Yes, but every check is logged. Repeated checks from unrelated devices or regions suggest the code has been copied onto counterfeit packaging, and we investigate those cases.",
  },
  {
    qk: "verify.faq.3.q",
    q: "My code is not recognized. Is my product fake?",
    ak: "verify.faq.3.a",
    a: "First re-enter the code carefully — a single mistyped digit fails the check. If it still fails, treat the unit as unverified: stop using it and contact support with photos of the packaging and your purchase details.",
  },
  {
    qk: "verify.faq.4.q",
    q: "Do I have to verify before using the lotion?",
    ak: "verify.faq.4.a",
    a: "We strongly recommend it. Verification takes seconds and confirms the actives are within their potency window before you commit to a full daily course.",
  },
  {
    qk: "verify.faq.5.q",
    q: "Does a verified code guarantee results?",
    ak: "verify.faq.5.a",
    a: "It guarantees the product is genuine, in date and authorized. Results still depend on consistent daily application across the full protocol and on the underlying cause of your hair loss.",
  },
  {
    qk: "verify.faq.6.q",
    q: "What if the scratch panel is already scratched when it arrives?",
    ak: "verify.faq.6.a",
    a: "Do not use the product. A pre-scratched or peeling panel indicates the carton was opened or the label was transferred. Contact support with photos before applying anything.",
  },
];

function verifyFaqs(t: (k: string, d: string) => string) {
  return VERIFY_FAQ.map((f) => ({ q: t(f.qk, f.q), a: t(f.ak, f.a) }));
}



function VerifyPage() {
  const t = useT();
  const steps = [
    { number: "01", title: t("verify.step1.title", "Locate the sticker"), body: t("verify.step1.body", "Find the holographic ORIGINAL security sticker on the side or back of the box. It shows a black scratch-off bar with a printed serial number underneath."), tip: t("verify.step1.tip", "The sticker sits on the side or back of the carton — never on the bottle itself.") },
    { number: "02", title: t("verify.step2.title", "Scratch the black area"), body: t("verify.step2.body", "Use a coin or your fingernail to gently scratch off the black bar. The hidden 12 digit verification code is printed behind it."), tip: t("verify.step2.tip", "Use the edge of a coin and press lightly — the code is printed directly beneath the coating.") },
    { number: "03", title: t("verify.step3.title", "Enter the 12 digit code"), body: t("verify.step3.body", "Type the 12 digit code exactly as revealed. Do not enter the printed serial number below the scratch area — that is not the verification code."), tip: t("verify.step3.tip", "The code uses digits only — no letters. The serial printed under the bar is public and does not verify anything.") },
    { number: "04", title: t("verify.step4.title", "Confirm authenticity"), body: t("verify.step4.body", "Our system checks the scratch code against production records, expiry, and distribution authorization. A verified result confirms the formula is within its active potency window."), tip: t("verify.step4.tip", "The first check is the definitive one — and every check is logged against the code.") },
    { number: "05", title: t("verify.step5.title", "Report if it fails"), body: t("verify.step5.body", "If verification fails or the code is not recognized, do not use the product. Contact our support team immediately with photos of the packaging."), tip: t("verify.step5.tip", "Keep the carton — support will ask for photos of the box, the sticker and the bottle base.") },
  ];

  const mistakes = [
    { k: "verify.mistakes.1", d: "Entering the printed serial number instead of the hidden 12 digit code." },
    { k: "verify.mistakes.2", d: "Confusing digit 0 with letter O, or 1 with I — the code uses digits only." },
    { k: "verify.mistakes.3", d: "Adding spaces, dashes or extra characters while typing." },
    { k: "verify.mistakes.4", d: "Reading the code through a partially scratched or smudged panel." },
    { k: "verify.mistakes.5", d: "Using a code from a different carton — every code belongs to exactly one unit." },
    { k: "verify.mistakes.6", d: "Checking before finishing the scratch — the coating hides parts of the digits." },
  ];

  const results = [
    { k: "verify.results.1.t", kd: "Verified genuine", v: "verify.results.1.b", vd: "Your unit is authentic, in date and authorized. Begin your protocol — apply daily and keep the carton until the course is complete." },
    { k: "verify.results.2.t", kd: "Genuine but expired", v: "verify.results.2.b", vd: "The code is real, but the batch is past its potency window. Do not begin a course with it; contact support with photos of the carton and your purchase proof." },
    { k: "verify.results.3.t", kd: "Code not recognized", v: "verify.results.3.b", vd: "The code is not in our production records. Re-check for a mistyped digit, then stop using the product and report the seller to us." },
    { k: "verify.results.4.t", kd: "Already verified elsewhere", v: "verify.results.4.b", vd: "This code has been checked before from another device or region. If you have just opened a sealed carton, send us the code and we will investigate the supply line." },
    { k: "verify.results.5.t", kd: "Service unavailable", v: "verify.results.5.b", vd: "A temporary connection issue, not a verdict on your product. Wait a moment and submit the same code again." },
  ];

  const confirms = [
    { k: "verify.confirms.a", kd: "Authentic origin", v: "verify.confirms.a.b", vd: "The code exists in the production ledger of an authorized Green Wealth filling batch." },
    { k: "verify.confirms.b", kd: "Batch and fill date", v: "verify.confirms.b.b", vd: "The unit is traced to the batch it was filled in, with its manufacturing date on record." },
    { k: "verify.confirms.c", kd: "Potency window", v: "verify.confirms.c.b", vd: "The formula is still inside its stated shelf life, so the actives remain at label strength." },
    { k: "verify.confirms.d", kd: "Authorized supply", v: "verify.confirms.d.b", vd: "The unit left an authorized distributor rather than a grey-market or refilled channel." },
  ];

  const navItems = [
    { id: "verify-guide", k: "verify.nav.guide", d: "The guided steps" },
    { id: "mistakes", k: "verify.nav.mistakes", d: "Common mistakes" },
    { id: "confirms", k: "verify.nav.confirms", d: "What the check confirms" },
    { id: "results", k: "verify.nav.results", d: "Reading your result" },
    { id: "faq", k: "verify.nav.faq", d: "Questions" },
  ];

  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [open, setOpen] = useState(false);
  const verify = useServerFn(verifySecretCode);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || checking) return;
    setChecking(true);
    setResult(null);
    setOpen(true);
    try {
      const res = await verify({ data: { code: code.trim() } });
      setResult(res);
    } catch {
      setResult({
        status: "error",
        message: t("verify.form.networkError", "We could not reach the verification service. Please try again in a moment."),
      });
    } finally {
      setChecking(false);
    }
  }


  return (
    <>
      <PageHeader
        eyebrow={t("verify.page.eyebrow", "Authenticity Check")}
        title={t("verify.page.title", "Verify your original Neo Hair Lotion online.")}
        intro={t("verify.page.intro", "Every genuine Neo Hair Lotion bottle, spray, and kit from Green Wealth carries a unique scratch verification code. Scratch the silver panel on the packaging to reveal it, then enter it below to confirm authenticity, expiry status, and authorized distribution before your first use.")}
      />

      {/* On-page guide navigation */}
      <nav aria-label={t("verify.nav.aria", "Page guide")} className="border-b hairline bg-ivory">
        <div className="container-editorial flex gap-x-8 gap-y-2 overflow-x-auto py-4 whitespace-nowrap">
          {navItems.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-forest transition-colors"
            >
              {t(n.k, n.d)}
            </a>
          ))}
        </div>
      </nav>

      <TrustBar variant="ivory" />

      {/* Visual guide — what the authenticity sticker looks like */}
      <section id="verify-guide" className="border-b hairline scroll-mt-24">
        <div className="container-editorial py-12 md:py-16">
          <div className="eyebrow mb-3">{t("verify.visualGuide.eyebrow", "Visual guide")}</div>
          <h2 className="font-serif text-2xl md:text-3xl leading-tight max-w-2xl">
            {t("verify.visualGuide.title", "What the genuine authenticity sticker looks like.")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {t("verify.visualGuide.body", "Every original Green Wealth® Neo Hair Lotion carton carries a holographic security label. Compare yours against the reference below before scratching and entering your code.")}
          </p>

          {/* Announcement — what to do */}
          <div className="mt-8 bg-forest text-ivory p-6 md:p-7">
            <div className="grid md:grid-cols-[auto_1fr] gap-4 md:gap-8 items-start">
              <div className="eyebrow !text-gold whitespace-nowrap">{t("verify.announce.eyebrow", "Before you begin")}</div>
              <p className="text-sm md:text-[15px] leading-relaxed text-ivory/90">
                {t("verify.announce.body", "Gently scratch off the black area marked below — your 12 digit code is hidden behind it. Enter that code in the field, not the number printed below the scratch bar.")}
              </p>

            </div>
          </div>

          <div className="mt-px grid md:grid-cols-2 gap-px bg-hairline">
            <div className="bg-paper p-4 md:p-6 space-y-6">
              <figure>
                <div className="relative border hairline">
                  <img
                    src={stickerCropAsset.url}
                    alt={t("verify.sticker.alt", "Genuine Green Wealth Neo Hair Lotion holographic authenticity sticker: black scratch-off panel hiding the 12 digit verification code, with the printed public serial number below")}
                    className="w-full h-auto block"
                    loading="lazy"
                    width={1260}
                    height={680}
                  />
                  {/* Pointer to the black scratch-off panel only */}
                  <div
                    className="absolute border-[3px] border-gold pointer-events-none shadow-[0_0_0_4px_rgba(255,255,255,0.85)]"
                    style={{ left: "5.5%", top: "11%", width: "84%", height: "24%" }}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute pointer-events-none flex items-center gap-2"
                    style={{ left: "5.5%", top: "11%", transform: "translateY(-100%)" }}
                    aria-hidden="true"
                  >
                    <span className="bg-gold text-forest px-3 py-2 text-[10px] md:text-xs uppercase tracking-[0.2em] whitespace-nowrap font-semibold shadow-lg">
                      {t("verify.sticker.pointer", "Scratch this black area ↓")}
                    </span>
                  </div>
                </div>
                <figcaption className="mt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {t("verify.sticker.caption", "The 12 digit verification code is hidden under the black scratch area — the number printed below it is not the code")}
                </figcaption>
              </figure>

              <div id="verify-form" className="border hairline p-5 md:p-6 bg-white scroll-mt-28">
                <form onSubmit={onSubmit}>
                  <label htmlFor="verify-code-input" className="eyebrow mb-4 block">{t("verify.form.label", "Scratch verification code")}</label>
                  <div className="flex border-b border-ink/60 focus-within:border-forest">
                    <input
                      id="verify-code-input"
                      name="verifyCode"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder={t("verify.form.placeholder", "e.g. enter 12 digit code")}
                      inputMode="numeric"
                      dir="ltr"
                      className="flex-1 bg-transparent py-3 outline-none tracking-[0.15em] uppercase text-base text-left"
                      autoComplete="off"
                      maxLength={40}
                    />
                    <button
                      type="submit"
                      disabled={checking}
                      className="px-4 py-3 text-xs uppercase tracking-[0.18em] text-forest disabled:opacity-50"
                    >
                      {checking ? t("verify.form.submitting", "Checking") : t("verify.form.submit", "Verify")}
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t("verify.form.helper", "Scratch the black area on the sticker to reveal your 12 digit code, then enter it exactly. Do not use products that fail verification.")}
                  </p>


                </form>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xl sm:max-w-2xl rounded-none border-0 bg-transparent p-0 shadow-none data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95">
                  {checking && !result && <VerifyCheckingPanel />}
                  {result && !checking && <VerifyResultPanel result={result} />}
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-paper p-6 md:p-8">
              <div className="eyebrow mb-3">{t("verify.howTo.eyebrow", "How to verify")}</div>
              <h2 className="font-serif text-2xl md:text-3xl leading-tight mb-8">
                {t("verify.howTo.title", "Scratch, enter, confirm. Four steps to certainty.")}
              </h2>
              <ol className="space-y-0">
                {steps.map((s) => (
                  <li
                    id={`step-${s.number}`}
                    key={s.number}
                    className="grid grid-cols-12 gap-4 py-6 border-b hairline first:border-t hairline"
                  >
                    <div className="col-span-2 md:col-span-1 text-xs text-muted-foreground tracking-[0.15em]">
                      {s.number}
                    </div>
                    <div className="col-span-10 md:col-span-11">
                      <h3 className="font-serif text-lg md:text-xl mb-2">{s.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                      <p className="mt-2 text-xs leading-relaxed">
                        <span className="uppercase tracking-[0.14em] font-semibold text-forest">{t("verify.tip.prefix", "Tip")}</span>
                        <span className="text-muted-foreground"> — {s.tip}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 bg-forest text-ivory p-6 md:p-8">
                <div className="eyebrow !text-gold mb-4">{t("verify.why.eyebrow", "Why authenticity matters")}</div>
                <h2 className="font-serif text-xl mb-4">{t("verify.why.title", "Counterfeits are common.")}</h2>
                <p className="text-sm text-ivory/80 leading-relaxed">
                  {t("verify.why.body", "Because Green Wealth is trusted worldwide, counterfeit and expired stock is widely circulated by unauthorized resellers. Verification protects your scalp, your investment, and the integrity of your ritual.")}
                </p>
                <ul className="mt-6 space-y-3 text-sm text-ivory/90">
                  <li>{t("verify.why.bullet1", "— Verify before first use.")}</li>
                  <li>{t("verify.why.bullet2", "— Purchase only from authorized channels.")}</li>
                  <li>{t("verify.why.bullet3", "— Report suspicious packaging.")}</li>
                </ul>

                <a
                  href="#verify-form"
                  className="mt-8 inline-block text-xs uppercase tracking-[0.18em] border-b border-ivory/50 pb-1"
                >
                  {t("verify.why.cta", "Verify your code")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMON MISTAKES — why checks fail */}
      <section id="mistakes" className="border-b hairline bg-ivory scroll-mt-24">
        <div className="container-editorial py-12 md:py-16">
          <div className="eyebrow mb-3">{t("verify.mistakes.eyebrow", "Before you worry")}</div>
          <h2 className="font-serif text-2xl md:text-3xl leading-tight max-w-2xl">
            {t("verify.mistakes.title", "Common reasons a check fails.")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {t("verify.mistakes.intro", "Most failed checks are typing errors, not counterfeit units. Review these six causes before treating your product as unverified.")}
          </p>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline border hairline">
            {mistakes.map((m) => (
              <div key={m.k} className="bg-paper p-5 md:p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">{t(m.k, m.d)}</p>
              </div>
            ))}
          </div>
          <a
            href="#verify-form"
            className="mt-8 inline-block text-xs uppercase tracking-[0.18em] border-b border-ink/50 pb-1"
          >
            {t("verify.mistakes.cta", "Try your code again")}
          </a>
        </div>
      </section>

      {/* WHAT THE CHECK CONFIRMS */}
      <section id="confirms" className="border-b hairline scroll-mt-24">
        <div className="container-editorial py-12 md:py-16">
          <div className="eyebrow mb-3">{t("verify.confirms.eyebrow", "Behind the check")}</div>
          <h2 className="font-serif text-2xl md:text-3xl leading-tight max-w-2xl">
            {t("verify.confirms.title", "What a verification actually confirms.")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {t("verify.confirms.intro", "The scratch code is issued once, at fill time, and stored against the production record for that unit. Checking it returns four separate confirmations.")}
          </p>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border hairline">
            {confirms.map((c) => (
              <div key={c.k} className="bg-paper p-5 md:p-6 relative">
                <h3 className="text-[12px] uppercase tracking-[0.14em] font-semibold mb-2">{t(c.k, c.kd)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(c.v, c.vd)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* READING YOUR RESULT */}
      <section id="results" className="border-b hairline bg-ivory scroll-mt-24">
        <div className="container-editorial py-12 md:py-16">
          <div className="eyebrow mb-3">{t("verify.results.eyebrow", "Outcome guide")}</div>
          <h2 className="font-serif text-2xl md:text-3xl leading-tight max-w-2xl">
            {t("verify.results.title", "Reading your result.")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {t("verify.results.intro", "Every check returns one of five verdicts. Here is what each one means and exactly what to do next.")}
          </p>
          <dl className="mt-8 border-t hairline">
            {results.map((r) => (
              <div key={r.k} className="grid md:grid-cols-[16rem_1fr] gap-2 md:gap-8 py-5 border-b hairline">
                <dt>
                  <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">
                    {t("verify.results.label", "Result")}
                  </span>
                  <span className="text-[12px] uppercase tracking-[0.14em] font-semibold">{t(r.k, r.kd)}</span>
                </dt>
                <dd className="text-sm text-muted-foreground leading-relaxed">{t(r.v, r.vd)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* COUNTERFEIT SIGNALS */}
      <section className="border-b hairline">
        <div className="container-editorial py-12 md:py-16 grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl leading-tight">
              {t("verify.signals.title", "Physical signs of a counterfeit unit.")}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t("verify.signals.intro", "Check the packaging alongside the code. Counterfeits reproduce the artwork long before they reproduce the finish.")}
            </p>
            <ul className="mt-8 border-t hairline">
              {[
                { k: "verify.signals.1", d: "The hologram does not shift colour when tilted under light." },
                { k: "verify.signals.2", d: "The scratch panel is missing, pre-scratched, or peels away as a sticker." },
                { k: "verify.signals.3", d: "Print is blurred at the edges, or the green tone differs from the reference above." },
                { k: "verify.signals.4", d: "The spray head rattles, leaks, or does not seat flush on the bottle neck." },
                { k: "verify.signals.5", d: "Liquid colour or scent differs sharply from a unit you have used before." },
                { k: "verify.signals.6", d: "Batch code on the bottle does not match the batch code on the carton." },
              ].map((s) => (
                <li key={s.k} className="py-4 border-b hairline text-sm text-muted-foreground leading-relaxed">
                  {t(s.k, s.d)}
                </li>
              ))}
            </ul>
            <a
              href="/real-vs-fake"
              className="mt-8 inline-block text-xs uppercase tracking-[0.18em] border-b border-ink/50 pb-1"
            >
              {t("verify.signals.cta", "Compare genuine vs counterfeit")}
            </a>
          </div>

          <div className="bg-forest text-ivory p-6 md:p-8 self-start">
            <div className="eyebrow !text-gold mb-4">{t("verify.support.eyebrow", "If your check fails")}</div>
            <h2 className="font-serif text-xl md:text-2xl mb-4">
              {t("verify.support.title", "Send it to us and stop using the product.")}
            </h2>
            <p className="text-sm text-ivory/80 leading-relaxed">
              {t("verify.support.body", "Our team reviews every failed check individually. Include the 12 digit code, clear photos of the carton, the sticker and the bottle base, and where the unit was purchased. Where a purchase is traced to an unauthorized seller, we replace genuine stock through an authorized channel wherever local regulations allow.")}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ivory/90">
              <li>{t("verify.support.b1", "— Keep the packaging; do not discard the carton.")}</li>
              <li>{t("verify.support.b2", "— Do not apply the product to your scalp.")}</li>
              <li>{t("verify.support.b3", "— Keep your order confirmation or receipt.")}</li>
            </ul>
            <a
              href="/contact"
              className="mt-8 inline-block text-xs uppercase tracking-[0.18em] border-b border-ivory/50 pb-1"
            >
              {t("verify.support.cta", "Contact support")}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b hairline bg-ivory scroll-mt-24">
        <div className="container-editorial py-12 md:py-16">
          <h2 className="font-serif text-2xl md:text-3xl leading-tight max-w-2xl">
            {t("verify.faq.title", "Verification questions.")}
          </h2>
          <dl className="mt-8 border-t hairline max-w-4xl">
            {verifyFaqs(t).map((f) => (
              <div key={f.q} className="py-5 border-b hairline">
                <dt className="font-serif text-lg mb-2">{f.q}</dt>
                <dd className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t hairline bg-ivory">
        <div className="container-editorial py-12 md:py-16 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <div className="eyebrow text-forest mb-3">{t("verify.social.eyebrow", "Why verification matters")}</div>
            <h2 className="font-serif text-2xl md:text-3xl leading-tight max-w-xl">
              {t("verify.social.title", "Counterfeits copy the label — never the results.")}
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-xl leading-relaxed">
              {t("verify.social.body", "Verifying your scratch code protects the outcomes real customers documented below. Every genuine bottle carries the actives that make these stories possible.")}
            </p>
          </div>
          <div className="md:max-w-sm w-full">
            <CustomerQuote />
          </div>
        </div>
      </section>
    </>
  );
}
