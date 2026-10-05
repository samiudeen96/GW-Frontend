import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { TrustMicroBar } from "@/components/site/SocialProof";
import { subscribeNewsletter } from "@/lib/newsletter.functions";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";

const cols = [
  {
    key: "nav.shop",
    title: "Shop",
    links: [
      { to: "/shop", label: "All Products" },
      { to: "/product/neo-hair-lotion", label: "Neo Hair Lotion" },
      { to: "/product/neo-hair-shampoo", label: "Neo Hair Shampoo" },
      { to: "/product/ghori-rosemary-oil", label: "Rosemary Oil" },
      { to: "/product/ghori-dermaroller", label: "Dermaroller" },
    ],
  },
  {
    key: "nav.hairScience",
    title: "Hair Science",
    links: [
      { to: "/how-to-use", label: "How to Use" },
      { to: "/hair-science", label: "Hair Science" },
      { to: "/ingredients", label: "Ingredient Glossary" },
      { to: "/comparison/neo-vs-minoxidil", label: "Neo vs Minoxidil" },
      { to: "/reviews", label: "Testimonials" },
      { to: "/faq", label: "FAQ" },
    ],
  },
  {
    key: "nav.authenticity",
    title: "Authenticity",
    links: [
      { to: "/verify", label: "Verify Product" },
      { to: "/real-vs-fake", label: "Real vs Fake" },
      { to: "/about", label: "Authorized Distribution" },
    ],
  },
  {
    key: "footer.support",
    title: "Customer Care",
    links: [
      { to: "/contact", label: "Contact" },
      { to: "/track-order", label: "Track Order" },
      { to: "/shipping-returns", label: "Shipping" },
      { to: "/refund-policy", label: "Returns" },
      { to: "/wholesale", label: "Wholesale" },
    ],
  },
];

const socials = [
  {
    href: "https://www.instagram.com/the.ghori",
    label: "Instagram",
  },
  {
    href: "https://www.facebook.com/ghoritrading",
    label: "Facebook",
  },
  {
    href: "https://www.linkedin.com/showcase/ghoritrading/",
    label: "LinkedIn",
  },
  {
    href: "https://www.youtube.com/channel/UCe5vs5q6xlmsEAE4B7i4A0Q",
    label: "YouTube",
  },
  {
    href: "https://www.tiktok.com/@greenwealth",
    label: "TikTok",
  },
  {
    href: "https://api.whatsapp.com/send/?phone=97180044674",
    label: "WhatsApp",
  },
  {
    href: "https://www.snapchat.com/@ghori.official",
    label: "Snapchat",
  },
];

const payments: { label: string; render: React.ReactNode }[] = [
  { label: "VISA", render: <span className="text-[8px] font-bold tracking-wider">VISA</span> },
  {
    label: "Mastercard",
    render: <span className="text-[8px] font-bold tracking-wider">MC</span>,
  },
  { label: "AMEX", render: <span className="text-[8px] font-bold tracking-wider">AMEX</span> },
  { label: "Discover", render: <span className="text-[8px] font-bold tracking-wider">DISC</span> },
  { label: "Diners", render: <span className="text-[8px] font-bold tracking-wider">DINERS</span> },
  { label: "JCB", render: <span className="text-[8px] font-bold tracking-wider">JCB</span> },
  { label: "UnionPay", render: <span className="text-[8px] font-bold tracking-wider">UPAY</span> },
  { label: "Apple Pay", render: <span className="text-[8px] font-bold tracking-wider"> PAY</span> },
  { label: "Google Pay", render: <span className="text-[8px] font-bold tracking-wider">G PAY</span> },
];

function NewsletterForm() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      await subscribeNewsletter({ data: { email } });
      setStatus("success");
      setMessage(t("footer.subscribed", "Welcome to the circle. Watch your inbox for first access."));
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : t("common.error", "Something went wrong. Please try again."));
    }
  };

  if (status === "success") {
    return (
      <div className="border border-ivory/25 px-4 py-3.5 text-sm text-ivory/90 bg-ivory/5">
        {message}
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-stretch border-b border-ivory/30 focus-within:border-ivory transition-colors">
        <label htmlFor="footer-email" className="sr-only">{t("checkout.email", "Email address")}</label>
        <input
          id="footer-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          required
          disabled={status === "loading"}
          className="flex-1 min-w-0 bg-transparent py-3 text-base text-ivory placeholder:text-ivory/40 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="pl-6 text-[11px] font-medium tracking-[0.22em] uppercase text-ivory/80 hover:text-ivory transition-colors disabled:opacity-60"
        >
          {status === "loading" ? t("common.loading", "Joining") : `${t("footer.subscribe", "Join")} →`}
        </button>
      </form>
      {status === "error" && <p className="mt-2 text-xs text-ivory/70">{message}</p>}
    </div>
  );
}

export function Footer() {
  const t = useT();
  return (
    <footer className="mt-24">
      <TrustMicroBar />

      <div className="bg-forest text-ivory">
        {/* Newsletter band */}
        <div className="container-editorial border-b border-ivory/15">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 py-12 md:py-16 items-end">
            <div className="md:col-span-7">
              <div className="text-[11px] tracking-[0.22em] uppercase text-ivory/50 mb-4">{t("footer.newsletter", "The Circle")}</div>
              <h2 className="font-serif text-3xl md:text-5xl leading-[1.05] tracking-tight text-ivory">
                {t("footer.newsletterCopy", "Early access to restocks, hair-science notes & member offers.")}
              </h2>
            </div>
            <div className="md:col-span-5">
              <NewsletterForm />
              <p className="mt-3 text-[11px] text-ivory/40 leading-relaxed">
                {t("footer.noNoise", "No noise. Unsubscribe anytime.")}
              </p>
            </div>
          </div>
        </div>

        {/* Link grid */}
        <div className="container-editorial">
          <div className="grid grid-cols-2 md:grid-cols-12 md:gap-0 border-b border-ivory/15">
            <div className="col-span-2 md:col-span-4 py-10 md:py-14 md:pr-12 md:border-r border-ivory/15">
              <div className="font-serif text-2xl tracking-tight">
                Green<span className="text-ivory/55">Wealth</span>
              </div>
              <p className="mt-4 text-sm text-ivory/60 max-w-xs leading-relaxed">
                {t("footer.tagline", "A modern botanical hair-care house. Formulated with tradition, delivered worldwide through authorized distribution.")}
              </p>
              <div className="mt-6 text-[11px] tracking-[0.2em] uppercase text-ivory/40">
                {t("footer.company", "United Arab Emirates · Global shipping")}
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-ivory/25 pb-0.5 text-[11px] text-ivory/65 hover:text-ivory hover:border-ivory transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="col-span-2 md:col-span-8 grid grid-cols-2 md:grid-cols-4">
              {cols.map((c, i) => (
                <div
                  key={c.title}
                  className={`py-10 md:py-14 md:px-8 ${i > 0 ? "md:border-l border-ivory/15" : ""} ${i % 2 === 1 ? "pl-6 md:pl-8" : ""}`}
                >
                  <div className="text-[11px] tracking-[0.22em] uppercase text-ivory/45 mb-5">
                    {t(c.key, c.title)}
                  </div>
                  <ul className="space-y-3 text-sm">
                    {c.links.map((l) => (
                      <li key={l.to}>
                        <Link
                          to={l.to}
                          className="text-ivory/75 hover:text-ivory transition-colors inline-block"
                        >
                          {t(`link.${l.to}`, l.label)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payments + assurance */}
        <div className="container-editorial border-b border-ivory/15 py-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-1.5">
            {payments.map((p) => (
              <div
                key={p.label}
                aria-label={p.label}
                className="w-11 h-7 flex items-center justify-center border border-ivory/20 bg-ivory/5 text-ivory/70"
              >
                {p.render}
              </div>
            ))}
          </div>
          <div className="text-[11px] tracking-[0.2em] uppercase text-ivory/45">
            {t("footer.securePayments", "Secure payments · SSL encrypted")}
          </div>
        </div>

        {/* Legal */}
        <div className="container-editorial py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-ivory/45">
          <div>
            © {new Date().getFullYear()} Ghori Trading LLC · Green Wealth®.{" "}
            {t("footer.rights", "All rights reserved.")}
          </div>
          <div className="flex flex-wrap gap-5">
            <Link to="/privacy" className="hover:text-ivory transition-colors">{t("footer.privacy", "Privacy")}</Link>
            <Link to="/terms" className="hover:text-ivory transition-colors">{t("footer.terms", "Terms")}</Link>
            <Link to="/legal" className="hover:text-ivory transition-colors">{t("footer.legalNotice", "Legal")}</Link>
            <Link to="/cookie-policy" className="hover:text-ivory transition-colors">{t("footer.cookies", "Cookies")}</Link>
            <Link to="/accessibility" className="hover:text-ivory transition-colors">{t("footer.accessibility", "Accessibility")}</Link>
            <LanguageSwitcher className="!text-ivory/60 hover:!text-ivory" />
          </div>
        </div>
      </div>
    </footer>
  );
}

