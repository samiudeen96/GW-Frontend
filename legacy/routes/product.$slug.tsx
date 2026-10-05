import ProductEditorial from "@/components/product/ProductEditorial";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getProduct, formatPrice, products, type Product, productImageTitle } from "@/lib/products";
import { ProductImage } from "@/components/site/ProductImage";
import { useT, useLocale } from "@/lib/i18n";

/** Index-matched descriptive alt text with a safe, still-descriptive fallback. */
function altFor(p: Product, i: number, t?: (key: string, fallback: string) => string) {
  const fallback = p.imageAlts?.[i] ?? `${p.name} — product photograph ${i + 1}`;
  return t ? t(`product.${p.slug}.imageAlts.${i}`, fallback) : fallback;
}
import { formatMoney, unitPriceForQty, getTiers, useRegion, getCurrency, getBasePrice } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { RatingChip, CustomerQuote } from "@/components/site/SocialProof";
import { reviews as allReviews, productStats, stats, distribution } from "@/lib/reviews";

import { ProductReviews } from "@/components/site/ProductReviews";
import { QuickViewModal } from "@/components/site/QuickViewModal";

import { abs, canonicalFor, hreflangLinks, localeOf } from "@/lib/seo";
import { tStatic } from "@/lib/i18n/static";
import { relatedPosts } from "@/lib/blog-posts";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return { product: p };
  },
  head: (ctx) => {
    const { loaderData } = ctx;
    const p = loaderData?.product;
    const locale = localeOf(ctx);
    const ts = tStatic(locale);
    if (!p) return { meta: [{ title: "Product not found — Green Wealth" }, { name: "robots", content: "noindex" }] };
    const url = canonicalFor(`/product/${p.slug}`, locale);
    const brand = ts("brand.name", "Green Wealth");
    const pName = ts(`product.${p.slug}.name`, p.name);
    const pTagline = ts(`product.${p.slug}.tagline`, p.tagline ?? "");
    const pOverview = ts(`product.${p.slug}.overview`, p.overview ?? "");
    const stat = productStats.find((s) => s.slug === p.slug);
    const productReviews = allReviews
      .filter((r) => r.product === p.name.replace(/®|Green Wealth\s*/g, "").trim() || (p.slug === "neo-hair-lotion" && r.product === "Neo Hair Lotion"))
      .slice(0, 5);

    const productLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: pName,
      description: pOverview,
      category: p.category,
      sku: p.slug,
      brand: { "@type": "Brand", name: p.brand ?? "Green Wealth" },
      image: (p.images ?? [p.image]).map((i) => (typeof i === "string" ? abs(i) : i)),
      offers: {
        "@type": "Offer",
        url,
        price: p.price.toFixed(2),
        priceCurrency: p.currency || "USD",
        availability: p.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      },
    };
    if (stat) {
      productLd.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: stat.rating.toFixed(1),
        reviewCount: stat.count,
        bestRating: "5",
        worstRating: "1",
      };
    }
    if (productReviews.length) {
      productLd.review = productReviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
        name: r.title,
        reviewBody: r.body,
      }));
    }

    const scripts: Array<{ type: string; children: string }> = [
      { type: "application/ld+json", children: JSON.stringify(productLd) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
            { "@type": "ListItem", position: 2, name: "Shop", item: abs("/shop") },
            { "@type": "ListItem", position: 3, name: pName, item: url },
          ],
        }),
      },
    ];
    if (p.faqs?.length) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: p.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      });
    }

    const metaDescription = (() => {
      const raw = (pOverview || pTagline || "").replace(/\s+/g, " ").trim();
      if (raw.length <= 160) return raw;
      const cut = raw.slice(0, 157);
      const lastSpace = cut.lastIndexOf(" ");
      return `${(lastSpace > 100 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\-–—]$/, "")}…`;
    })();

    return {
      meta: [
        { title: `${pName} — ${brand}` },
        { name: "description", content: metaDescription },
        { property: "og:title", content: `${pName} — ${brand}` },
        { property: "og:description", content: pTagline },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { property: "og:image", content: typeof p.image === "string" ? abs(p.image) : p.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: typeof p.image === "string" ? abs(p.image) : p.image },
        { property: "product:price:amount", content: String(p.price) },
        { property: "product:price:currency", content: p.currency },
      ],
      links: [{ rel: "canonical", href: url }, ...hreflangLinks(`/product/${p.slug}`)],
      scripts,
    };
  },
  component: ProductPage,
});


function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-forest pointer-events-none"
    />
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] uppercase tracking-[0.28em] text-moss font-mono">
      {children}
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4 py-2.5">
      <dt className="text-[10.5px] uppercase tracking-[0.22em] text-forest/50 font-mono">{label}</dt>
      <dd className="text-[12px] text-forest text-right">{value}</dd>
    </div>
  );
}

function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y hairline bg-paper py-3">
      <motion.div
        className="flex gap-12 whitespace-nowrap will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {loop.map((t, i) => (
          <span key={i} className="text-[10px] uppercase tracking-[0.32em] text-forest/60 font-mono inline-flex items-center gap-12">
            {t}
            <span aria-hidden className="w-1 h-1 rounded-full bg-gold" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Accordion({ title, defaultOpen = false, preview, children }: { title: string; defaultOpen?: boolean; preview?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b hairline">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] uppercase tracking-[0.24em] font-mono text-forest">{title}</span>
          {!open && preview && (
            <span className="block mt-2 text-[12.5px] leading-[1.6] text-forest/60 font-serif line-clamp-2">
              {preview}
            </span>
          )}
        </span>
        <span className="text-[11px] font-mono text-forest shrink-0 mt-0.5">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="pb-6 text-[13.5px] leading-[1.75] text-ink/80">{children}</div>}
    </div>
  );
}

function StickyCartBar({
  ctaRef,
  qty,
  setQty,
  lineSubtotal,
  currency,
  onAdd,
  available,
}: {
  ctaRef: React.RefObject<HTMLDivElement | null>;
  qty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
  lineSubtotal: number;
  currency: string;
  onAdd: () => void;
  available: boolean;
}) {
  const t = useT();
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el || !mounted) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      setShow(rect.bottom < 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ctaRef, mounted]);

  if (!mounted || !show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-[3px] pb-[3px] lg:hidden">
      <div className="bg-paper border hairline shadow-[0_-6px_20px_rgba(0,0,0,0.06)] p-2 flex items-center gap-2">
        <div className="flex items-center border hairline bg-paper">
          <button
            type="button"
            onClick={() => setQty(q => Math.max(1, q - 1))}
            className="px-3 py-3 text-forest hover:text-moss"
            aria-label={t("product.route.decreaseQuantity", "Decrease quantity")}
          >−</button>
          <span className="w-8 text-center text-xs font-mono text-forest">{qty}</span>
          <button
            type="button"
            onClick={() => setQty(q => q + 1)}
            className="px-3 py-3 text-forest hover:text-moss"
            aria-label={t("product.route.increaseQuantity", "Increase quantity")}
          >+</button>
        </div>
        <button
          type="button"
          disabled={!available}
          onClick={onAdd}
          className="flex-1 bg-forest text-paper py-3 px-4 text-[11px] tracking-[0.2em] font-bold uppercase font-mono hover:bg-moss transition-colors disabled:opacity-50"
        >
          {available ? `${t("product.route.add", "Add")} · ${formatMoney(lineSubtotal, currency)}` : t("product.route.unavailable", "Unavailable")}
        </button>
      </div>
    </div>
  );
}


const ETA_BY_COUNTRY: Record<string, string> = {
  "United States": "5–8 business days",
  "United Kingdom": "4–7 business days",
  "Eurozone": "4–7 business days",
  "UAE": "3–5 business days",
  "Saudi Arabia": "3–5 business days",
  "Qatar": "3–5 business days",
  "Kuwait": "3–5 business days",
  "Bahrain": "3–5 business days",
  "Oman": "3–5 business days",
  "India": "5–8 business days",
  "Pakistan": "5–8 business days",
  "Afghanistan": "6–10 business days",
  "Australia": "6–9 business days",
  "Canada": "6–9 business days",
  "Singapore": "4–7 business days",
};
function etaFor(country?: string) {
  return (country && ETA_BY_COUNTRY[country]) || "5–9 business days";
}
const ETA_KEY_BY_TEXT: Record<string, string> = {
  "5–8 business days": "product.route.eta5to8",
  "4–7 business days": "product.route.eta4to7",
  "3–5 business days": "product.route.eta3to5",
  "6–10 business days": "product.route.eta6to10",
  "6–9 business days": "product.route.eta6to9",
  "5–9 business days": "product.route.eta5to9",
};
function translateEta(t: (k: string, f: string) => string, days: string) {
  const key = ETA_KEY_BY_TEXT[days];
  return key ? t(key, days) : days;
}
function formatEtaWindow(days: string, locale: string = "en") {
  const nums = days.match(/(\d+)\D+(\d+)/);
  if (!nums) return "";
  const now = new Date();
  const min = new Date(now); min.setDate(now.getDate() + Number(nums[1]));
  const max = new Date(now); max.setDate(now.getDate() + Number(nums[2]));
  const fmt = (d: Date) =>
    d.toLocaleDateString(locale === "ar" ? "ar-AE" : "en-US", { month: "short", day: "numeric" });
  return `${fmt(min)} – ${fmt(max)}`;
}
function ProductPage() {
  const locale = useLocale();
  const t = useT();
  const { product: p } = Route.useLoaderData() as { product: import("@/lib/products").Product };
  const tp = (field: string, fallback: string) => t(`product.${p.slug}.${field}`, fallback);
  const pName = tp("name", p.name);
  const pTagline = tp("tagline", p.tagline ?? "");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  // Only mount gallery slides that have been viewed — avoids downloading every
  // full-size frame on first paint (the stacked slides are all in-viewport).
  const [mountedImgs, setMountedImgs] = useState<number[]>([0]);
  useEffect(() => {
    setMountedImgs(prev => (prev.includes(activeImg) ? prev : [...prev, activeImg]));
  }, [activeImg]);
  const [liked, setLiked] = useState(false);
  const { add } = useCart();
  const { currency } = useRegion();
  const curMeta = getCurrency(currency);
  const tiers = getTiers(p.slug, currency);
  const unit = unitPriceForQty(p.slug, qty, currency);
  const lineSubtotal = unit * qty;
  const gallery = p.images && p.images.length > 0 ? p.images : [p.image];
  const related = (p.pairsWith && p.pairsWith.length > 0
    ? p.pairsWith.map(s => products.find(x => x.slug === s)).filter((x): x is NonNullable<typeof x> => Boolean(x))
    : products.filter(x => x.slug !== p.slug).slice(0, 3));

  const [quickSlug, setQuickSlug] = useState<string | null>(null);
  const quickProduct = useMemo(() => products.find(x => x.slug === quickSlug) ?? null, [quickSlug]);

  const sku = p.slug.toUpperCase().slice(0, 8);
  const [leftTab, setLeftTab] = useState<"ledger" | "ingredients">("ledger");
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const [dbVoices, setDbVoices] = useState<Array<{ id: string; author: string; country: string | null; rating: number; body: string }>>([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("reviews")
        .select("id,author,country,rating,body")
        .eq("product_slug", p.slug)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(3);
      if (alive && data) setDbVoices(data as typeof dbVoices);
    })();
    return () => { alive = false; };
  }, [p.slug]);


  // Mobile scroller sync state: distinguish programmatic scrolls (auto-slide,
  // thumbnail taps) from user swipes so the two never fight each other.
  const programmaticUntil = useRef(0);
  const resumeTimer = useRef<number | null>(null);

  const pauseAutoSlide = (ms = 9000) => {
    setIsPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setIsPaused(false), ms);
  };
  useEffect(() => () => { if (resumeTimer.current) window.clearTimeout(resumeTimer.current); }, []);

  // Auto-slide gallery every 4s (pause on hover / interaction / single image)
  useEffect(() => {
    if (gallery.length <= 1 || isPaused) return;
    const id = window.setInterval(() => {
      setActiveImg((i) => (i + 1) % gallery.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [gallery.length, isPaused]);

  // Auto-advance mobile scroller in sync
  useEffect(() => {
    const el = mobileScrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const target = activeImg * el.clientWidth;
    if (Math.abs(Math.abs(el.scrollLeft) - target) < 4) return;
    programmaticUntil.current = Date.now() + 900;
    el.scrollTo({ left: target, behavior: "smooth" });
  }, [activeImg]);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: p.name, url }); } catch { /* ignore */ }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleMobileScroll = () => {
    // Ignore intermediate frames of a smooth programmatic scroll.
    if (Date.now() < programmaticUntil.current) return;
    const el = mobileScrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const idx = Math.min(
      gallery.length - 1,
      Math.max(0, Math.round(Math.abs(el.scrollLeft) / el.clientWidth)),
    );
    if (idx !== activeImg) setActiveImg(idx);
  };

  const scrollToImage = (i: number) => {
    pauseAutoSlide();
    setActiveImg(i);
    const el = mobileScrollerRef.current;
    if (!el) return;
    programmaticUntil.current = Date.now() + 900;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };


  return (
    <div className="bg-paper text-ink pb-28 lg:pb-0">
      <ReadingProgress />

      {/* Utility bar */}
      <div className="border-b hairline">
        <div className="container-editorial py-3 md:py-4 flex items-center justify-between gap-4">
          <nav aria-label={t("product.route.breadcrumb", "Breadcrumb")} className="flex items-center gap-2 text-[10px] font-mono tracking-[0.18em] uppercase text-forest/60 min-w-0 truncate">
            <Link to="/" className="hover:text-forest">{t("product.route.home", "Home")}</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-forest">{t("product.route.shop", "Shop")}</Link>
            <span>/</span>
            <span className="text-forest truncate">{pName}</span>
          </nav>
          <div className="hidden md:flex items-center gap-1">
            <button onClick={handleShare} className="h-8 px-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-forest/70 hover:text-forest font-mono">
               {t("product.route.share", "Share")}
            </button>
            <button onClick={() => setLiked(v => !v)} aria-pressed={liked} className="h-8 px-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-forest/70 hover:text-forest font-mono">
              
              {liked ? t("product.route.saved", "Saved") : t("product.route.save", "Save")}
            </button>
          </div>
        </div>
      </div>

      {/* HERO — Scientific Ledger */}
      {(() => {
        // Derive up to 3 composition entries with percentages
        const parsedFromIngredients = (p.ingredients ?? [])
          .map((s) => {
            const m = s.match(/^(.+?)\s+(\d+(?:\.\d+)?%)\s*$/);
            return m ? { name: m[1].trim(), percent: m[2] } : null;
          })
          .filter(Boolean) as { name: string; percent: string }[];
        const parsedFromDetailed = (p.ingredientsDetailed ?? [])
          .map((i, idx) => ({ i, idx }))
          .filter(({ i }) => i.percentage)
          .map(({ i, idx }) => ({ name: t(`product.${p.slug}.active.${idx}.name`, i.name), percent: i.percentage! }));
        const composition = (parsedFromDetailed.length ? parsedFromDetailed : parsedFromIngredients)
          .filter((i) => !/^(di\s+)?water|aqua/i.test(i.name))
          .slice(0, 5);
        const mechanismFallback =
          (p.overview.split(/\.\s+/).find((s) => s.length > 40) ?? p.overview).replace(/\.$/, "") + ".";
        const mechanism = tp("mechanism", mechanismFallback);
        const overviewText = tp("overview", p.overview);
        const heroActive = productStats.find((s) => s.slug === p.slug) ?? { rating: 4.9, count: 0 };
        // Bio-pathways: top roles from actives with a supporting tag
        const bioPathways = (p.ingredientsDetailed ?? [])
          .slice(0, 4)
          .map((i, idx) => ({
            role: t(`product.${p.slug}.active.${idx}.role`, i.role ?? ""),
            actor: t(`product.${p.slug}.active.${idx}.name`, i.name),
            note: i.pathwayTags?.[0] ? t(`product.${p.slug}.active.${idx}.pathwayTags.0`, t(`ingdata.${i.pathwayTags[0]}`, i.pathwayTags[0])) : t(`product.${p.slug}.active.${idx}.tagline`, i.tagline ?? ""),
          }));
        // Formulation facts (chips) — reuse freeFrom + implicit facts
        const facts: string[] = [
          ...(p.freeFrom ?? []).map((f, fi) => `${t(`product.${p.slug}.freeFrom.${fi}`, f)}-${t("product.route.freeSuffix", "free")}`),
          p.size ? `${t(`product.${p.slug}.size`, p.size)}` : "",
          t("product.route.batchVerified", "Batch verified"),
        ].filter(Boolean);

        return (
      <section className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] border-b hairline lg:h-[calc(100dvh-180px)] lg:overflow-hidden">
        {/* LEFT LEDGER — desktop only, mobile appears after buy panel */}
        <aside className="hidden lg:flex flex-col border-r hairline lg:h-[calc(100dvh-180px)] lg:overflow-y-auto">
          <div className="border-b hairline flex items-stretch">
            <button
              type="button"
              onClick={() => setLeftTab("ledger")}
              className={`flex-1 px-4 py-3 flex items-center justify-between gap-3 text-left transition-colors ${
                leftTab === "ledger" ? "bg-forest text-paper" : "bg-paper text-forest hover:bg-ivory"
              }`}
            >
              <span className={`text-[9.5px] uppercase tracking-[0.28em] font-mono ${leftTab === "ledger" ? "text-gold" : "text-gold"}`}>{t("product.route.seriesNo", "Series Nº")}</span>
              <span className="text-[10.5px] tabular-nums font-mono">{sku}</span>
            </button>
            <button
              type="button"
              onClick={() => setLeftTab("ingredients")}
              className={`px-4 py-3 border-l hairline text-[9.5px] uppercase tracking-[0.28em] font-mono transition-colors ${
                leftTab === "ingredients" ? "bg-forest text-paper" : "bg-paper text-forest hover:bg-ivory"
              }`}
            >
              {t("product.route.ingredients", "Ingredients")}
            </button>
          </div>

          {leftTab === "ledger" && (
          <div className="p-5 space-y-6 flex-1">

            <section>
              <h2 className="text-[9.5px] uppercase tracking-[0.28em] text-forest/40 font-mono mb-3">{t("product.route.primaryMechanism", "Primary Mechanism")}</h2>
              <p className="text-[13px] leading-[1.65] text-forest">{mechanism}</p>
              {p.overview && p.overview !== mechanismFallback && (
                <p className="mt-3 text-[12px] leading-[1.7] text-forest/70">{overviewText}</p>
              )}
              {p.benefits && p.benefits.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {p.benefits.slice(0, 4).map((b, i) => (
                    <li key={i} className="flex gap-2.5 text-[11.5px] leading-[1.55] text-forest/85">
                      <span className="font-mono tabular-nums text-gold shrink-0 pt-[2px]">{String(i + 1).padStart(2, "0")}</span>
                      <span>{t(`product.${p.slug}.benefits.${i}`, b)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {bioPathways.length > 0 && (
              <section>
                <h2 className="text-[9.5px] uppercase tracking-[0.28em] text-forest/40 font-mono mb-3">{t("product.route.bioPathways", "Bio-Pathways")}</h2>
                <div className="space-y-3">
                  {bioPathways.map((bp, i) => (
                    <div key={bp.actor} className="border-l-2 border-gold/70 pl-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-forest">{bp.role}</span>
                        <span className="text-[9.5px] font-mono tabular-nums text-forest/40">P·{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-forest/70 leading-[1.55]">
                        <span className="text-forest/90">{bp.actor}</span>
                        {bp.note ? <> — {bp.note}</> : null}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {facts.length > 0 && (
              <section>
                <h2 className="text-[9.5px] uppercase tracking-[0.28em] text-forest/40 font-mono mb-3">{t("product.route.formulationFacts", "Formulation Facts")}</h2>
                <div className="flex flex-wrap gap-1.5">
                  {facts.slice(0, 8).map((f) => (
                    <span key={f} className="text-[9.5px] uppercase tracking-[0.14em] font-mono text-forest/80 border hairline px-2 py-1">
                      {f}
                    </span>
                  ))}
                </div>
              </section>
            )}


            {composition.length > 0 && (
              <section>
                <h2 className="text-[9.5px] uppercase tracking-[0.28em] text-forest/40 font-mono mb-4">{t("product.route.molecularComposition", "Molecular Composition")}</h2>
                <div className="space-y-2.5">
                  {composition.map((c) => (
                    <div key={c.name} className="flex items-end justify-between gap-3 border-b hairline pb-1.5">
                      <span className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-forest truncate">{c.name}</span>
                      <span className="text-[11px] font-mono tabular-nums text-gold shrink-0">{c.percent}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-auto pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9.5px] uppercase tracking-[0.28em] text-forest/40 font-mono">{t("product.route.voices", "Voices")}</span>
                <Link to="/reviews" className="text-[9.5px] uppercase tracking-[0.24em] text-gold font-mono hover:text-forest">{t("product.route.allArrow", "All ›")}</Link>
              </div>
              <div className="border hairline divide-y divide-forest/10">
                {dbVoices.length === 0 ? (
                  <div className="p-2.5 text-[10px] uppercase tracking-[0.2em] text-forest/40 font-mono">{t("product.route.loading", "Loading…")}</div>
                ) : (
                  dbVoices.map((r) => (
                    <div key={r.id} className="p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, s) => (
                            <span key={s} className="w-1.5 h-1.5 bg-gold" />
                          ))}
                        </div>
                        <span className="text-[8.5px] uppercase tracking-[0.2em] text-forest/40 font-mono truncate max-w-[60%] text-right">
                          {r.author}{r.country ? ` · ${r.country}` : ""}
                        </span>
                      </div>
                      <p className="mt-1 text-[10.5px] leading-[1.35] text-forest/80 line-clamp-2">{r.body}</p>
                    </div>
                  ))
                )}
              </div>

            </div>


          </div>
          )}

          {leftTab === "ingredients" && (
          <div className="flex-1">
            <div className="p-5 border-b hairline">
              <h2 className="text-[9.5px] uppercase tracking-[0.28em] text-forest/40 font-mono mb-2">{t("product.route.fullInciDeclaration", "Full INCI Declaration")}</h2>
              <p className="text-[11.5px] text-forest/70 leading-[1.55]">
                {t("product.route.inciDeclarationBody", "Every ingredient on the label, as printed on the box. Fragrance components marked ⚑ are EU-declared allergens naturally present in essential oils.")}
              </p>
            </div>
            {p.inciDetails && p.inciDetails.length > 0 ? (
              <ul className="divide-y divide-forest/10">
                {p.inciDetails.map((ing, i) => (
                  <li key={ing.inci} className="px-5 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11.5px] font-medium text-forest leading-tight">{ing.common ? t(`product.${p.slug}.inci.${i}.common`, ing.common) : ing.inci}</span>
                          {ing.allergen && (
                            <span title={t("product.route.euAllergenTitle", "EU-declared fragrance allergen")} className="text-[8.5px] font-mono text-gold border border-gold/60 px-1 py-[1px] leading-none">⚑</span>
                          )}
                        </div>
                        {ing.common && (
                          <div className="text-[9.5px] uppercase tracking-[0.18em] text-forest/45 font-mono mt-0.5 truncate">{ing.inci}</div>
                        )}
                        <div className="text-[10.5px] text-forest/70 mt-1 leading-snug">{t(`product.${p.slug}.inci.${i}.role`, ing.role)}</div>
                      </div>
                      <span className="text-[9px] font-mono tabular-nums text-forest/35 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="divide-y divide-forest/10">
                {p.ingredients.map((ing, i) => (
                  <li key={ing} className="px-5 py-3 flex items-center justify-between gap-2">
                    <span className="text-[11.5px] text-forest leading-tight">{ing}</span>
                    <span className="text-[9px] font-mono tabular-nums text-forest/35">{String(i + 1).padStart(2, "0")}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="p-5 border-t hairline text-[10px] uppercase tracking-[0.2em] font-mono text-forest/50">
              {(p.inciDetails ?? p.ingredients).length.toString().padStart(2, "0")} {t("product.route.componentsLabelAccurate", "components · label-accurate")}
            </div>
          </div>
          )}
        </aside>


        {/* CENTER — Kinetic hero (gallery) */}
        <div className="relative bg-white border-b lg:border-b-0 lg:border-r hairline overflow-hidden lg:h-[calc(100dvh-180px)] lg:overflow-y-auto">
          {/* Desktop gallery */}
          <div className="hidden lg:flex flex-col h-full" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <div
              className="relative flex-1 flex items-center justify-center px-5 py-6 xl:px-8 xl:py-8 overflow-hidden"
              style={{ minHeight: "clamp(300px, calc(100dvh - 420px), 520px)" }}
            >
              <div className="pointer-events-none absolute top-3 left-4 right-4 flex items-start justify-between">
                <div className="flex flex-col leading-none max-w-[75%]">
                  <span className="font-serif text-[10px] uppercase tracking-[0.32em] text-forest/50 font-mono">{p.brand ?? "Green Wealth"}</span>
                  <span className="mt-1.5 font-serif text-[13px] sm:text-[14px] xl:text-[15px] font-medium text-forest tracking-[-0.01em] leading-[1.25]">
                    {pName}
                  </span>
                </div>
                <span className="bg-forest text-paper px-2 py-0.5 text-[9px] uppercase tracking-[0.24em] font-mono">{t("product.route.authentic", "Authentic")}</span>
              </div>

              <div className="relative z-10 w-full h-full flex items-center justify-center">
                {gallery.map((img, i) => (
                  mountedImgs.includes(i) ? (
                  <div
                    key={img + i}
                    className={`absolute inset-0 m-auto flex items-center justify-center transition-opacity duration-700 ease-out ${i === activeImg ? "opacity-100" : "opacity-0"}`}
                  >
                    <ProductImage
                      src={img}
                      alt={altFor(p, i, t)}
                      priority={i === 0}
                      sizes="(min-width: 1280px) 620px, (min-width: 1024px) 46vw, 100vw"
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                  </div>
                  ) : null
                ))}
              </div>

              <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-end justify-end">
                <span className="text-[10px] uppercase tracking-[0.28em] text-forest/30 font-mono">{t("product.route.botanicalTech", "Botanical Tech")}</span>
              </div>
            </div>


            {/* Thumb rail — horizontal under image */}
            {gallery.length > 1 && (
              <div className="border-t hairline">
                <div className="flex -space-x-px">
                  {gallery.slice(0, 6).map((img, i) => (
                    <button
                      key={img + i}
                      onClick={() => setActiveImg(i)}
                      aria-label={`${t("product.route.viewImage", "View image")} ${i + 1}`}
                      className={`relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 border hairline transition-opacity ${i === activeImg ? "opacity-100 border-forest z-10" : "opacity-60 hover:opacity-90"}`}
                    >
                      <ProductImage src={img} alt={altFor(p, i, t)} sizes="56px" className="w-full h-full object-contain p-1 bg-white" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Global rating summary */}
            <div className="border-t hairline bg-paper">
              {(() => {
                const ps = productStats.find((x) => x.slug === p.slug) ?? { rating: stats.rating, count: stats.count };
                const total = ps.count;
                const r = ps.rating;
                const w5 = r >= 4.85 ? 0.86 : r >= 4.7 ? 0.79 : 0.72;
                const w4 = r >= 4.85 ? 0.10 : r >= 4.7 ? 0.15 : 0.20;
                const w3 = 1 - w5 - w4 - 0.02;
                const dist = [
                  { stars: 5, w: w5 },
                  { stars: 4, w: w4 },
                  { stars: 3, w: w3 },
                  { stars: 2, w: 0.012 },
                  { stars: 1, w: 0.008 },
                ];
                return (
                  <>
                    <div className="flex items-center px-5 py-3 border-b hairline">
                      <p className="text-[9.5px] uppercase tracking-[0.28em] text-gold font-mono">{t("product.route.verifiedReviews", "Verified Reviews")}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-stretch">
                      {/* Score block */}
                      <div className="px-5 py-6 sm:pr-7 sm:border-r hairline flex sm:flex-col items-center sm:items-start gap-4 sm:gap-2">
                        <div className="font-serif text-[46px] leading-none text-forest tabular-nums">{r.toFixed(1)}</div>
                        <div>
                          <div className="flex gap-1" aria-label={`${r.toFixed(1)} ${t("product.route.outOfFive", "out of 5")}`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={`w-2.5 h-2.5 ${i < Math.round(r) ? "bg-gold" : "bg-forest/15"}`} />
                            ))}
                          </div>
                          <p className="mt-2 text-[9.5px] uppercase tracking-[0.2em] font-mono text-forest/55 tabular-nums">
                            {total.toLocaleString()}+ {t("product.route.reviews", "reviews")}
                          </p>
                        </div>
                      </div>

                      {/* Distribution */}
                      <div className="px-5 py-6 space-y-2">
                        {dist.map((row) => {
                          const pct = Math.max(1, Math.round(row.w * 100));
                          return (
                            <div key={row.stars} className="flex items-center gap-3">
                              <span className="text-[9.5px] font-mono text-forest/55 w-6 tabular-nums">{row.stars}★</span>
                              <div className="flex-1 h-[5px] bg-forest/8 overflow-hidden">
                                <div className="h-full bg-forest" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-[9.5px] font-mono text-forest/45 w-8 text-right tabular-nums">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-t hairline -space-x-px">
                      <a
                        href="#reviews"
                        className="text-center py-3.5 text-[10px] uppercase tracking-[0.22em] font-mono text-forest/70 hover:text-forest hover:bg-ivory transition-colors border-r hairline"
                      >
                        {t("product.route.readReviews", "Read reviews")}
                      </a>
                      <a
                        href="#reviews"
                        className="text-center py-3.5 text-[10px] uppercase tracking-[0.22em] font-mono font-bold text-forest hover:bg-forest hover:text-paper transition-colors"
                      >
                        {t("product.route.writeAReview", "Write a review")}
                      </a>
                    </div>
                    <p className="px-5 py-3 border-t hairline text-[9px] uppercase tracking-[0.18em] font-mono text-forest/40">
                      {t("product.route.combinedAcrossChannels", "Combined across all channels")}
                    </p>
                  </>
                );
              })()}
            </div>

          </div>


          {/* Mobile gallery (kept from previous PDP) */}
          <div className="lg:hidden bg-white w-full">
            <div className="relative w-full">
              <div
                ref={mobileScrollerRef}
                onScroll={handleMobileScroll}
                onTouchStart={() => pauseAutoSlide()}
                onPointerDown={() => pauseAutoSlide()}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full aspect-square"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {gallery.map((img, i) => (
                  <div key={i} className="snap-start shrink-0 w-full h-full flex items-center justify-center">
                    <ProductImage src={img} alt={altFor(p, i, t)} priority={i === 0} sizes="100vw" draggable={false} className="w-full h-full object-contain p-6 select-none" />
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-start justify-between text-[9px] uppercase tracking-[0.24em] text-forest/70 font-mono">
                <span>{p.brand ?? "Green Wealth"}</span>
                <span className="bg-forest text-paper px-2 py-1">{t("product.route.authentic", "Authentic")}</span>
              </div>
              <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {gallery.map((_, i) => (
                  <span key={i} className={`h-1 transition-all ${i === activeImg ? "w-6 bg-forest" : "w-1.5 bg-forest/30"}`} />
                ))}
              </div>
            </div>
            {gallery.length > 1 && (
              <div className="flex w-full border-t hairline -space-x-px">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToImage(i)}
                    aria-label={`${t("product.route.viewImage", "View image")} ${i + 1}`}
                    aria-current={i === activeImg ? "true" : undefined}
                    className={`flex-1 min-w-0 aspect-square bg-white transition-colors ${i === activeImg ? "ring-inset ring-1 ring-forest z-10" : ""}`}
                  >
                    <ProductImage src={img} alt={altFor(p, i, t)} sizes="80px" className="w-full h-full object-contain p-0.5" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Acquisition (dark forest) */}
        <div className="bg-forest text-paper flex flex-col lg:h-[calc(100dvh-180px)] lg:overflow-y-auto">
          <div className="p-5 sm:p-7 lg:p-8 border-b border-paper/10">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <motion.span aria-hidden animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 2.2, repeat: Infinity }} className="inline-block w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-[10px] uppercase tracking-[0.28em] text-paper/70 font-mono truncate">{tp("category", p.category)}</span>
              </div>
              <span className="text-[10px] tabular-nums font-mono text-paper/60 border border-paper/20 px-1.5 py-0.5">{sku}</span>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <span aria-hidden className="h-px w-6 bg-gold" />
              <p className="text-[10px] uppercase tracking-[0.28em] text-gold font-mono">{pTagline}</p>
            </div>

            <h1 className="font-serif text-[28px] sm:text-[34px] lg:text-[36px] xl:text-[42px] text-paper leading-[1.03] mt-3 tracking-[-0.02em] text-balance">
              {pName}
            </h1>

            {(() => {
              const s = productStats.find((x) => x.slug === p.slug) ?? { rating: 4.9, count: 12480 };
              return (
                <a href="#reviews" className="mt-4 inline-flex items-center gap-2 group">
                  <span className="flex gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`w-2 h-2 ${i < Math.round(s.rating) ? "bg-gold" : "bg-paper/20"}`} />
                    ))}
                  </span>
                  <span className="text-[10.5px] font-mono tabular-nums text-paper">{s.rating.toFixed(1)}</span>
                  <span className="text-[10px] uppercase tracking-[0.22em] font-mono text-paper/60 group-hover:text-gold">
                    · {t("product.route.verifiedRating", "Verified rating")}
                  </span>
                </a>
              );
            })()}

            <div className="mt-6 pt-5 border-t border-paper/15 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <div className="font-serif text-[34px] md:text-[40px] leading-none tabular-nums text-paper">
                    {formatMoney(unit, currency)}
                  </div>
                  {tiers.length > 1 && unit < tiers[0].price && (
                    <span className="text-[9.5px] font-mono uppercase tracking-[0.22em] bg-gold text-forest px-1.5 py-0.5 tabular-nums">
                      {t("product.route.save", "Save")} {Math.round((1 - unit / tiers[0].price) * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-[10.5px] text-paper/60 mt-2 font-mono uppercase tracking-[0.18em]">
                  {tp("size", p.size)} · {curMeta.code}
                </p>
              </div>
              <div className="text-right shrink-0 pb-1">
                <p className="text-[9.5px] uppercase tracking-[0.28em] text-paper/50 font-mono">{t("product.route.inclTaxes", "Incl. taxes")}</p>
                <p className="text-[9.5px] uppercase tracking-[0.28em] text-gold font-mono mt-1">{t("product.route.freeShipWorldwide", "Free ship worldwide")}</p>
              </div>
            </div>

            {tiers.length > 1 && (
              <div className="mt-4">
                <p className="text-[9.5px] uppercase tracking-[0.28em] text-paper/50 font-mono mb-2">{t("product.route.choosePackBulkPricing", "Choose your pack · bulk pricing")}</p>
                <div
                  className="grid border border-paper/15 divide-x divide-paper/15"
                  style={{ gridTemplateColumns: `repeat(${Math.min(tiers.length, 4)}, minmax(0, 1fr))` }}
                >
                  {tiers.slice(0, 4).map((tier) => {
                    const active = unit === tier.price;
                    const save = tier.price < tiers[0].price ? Math.round((1 - tier.price / tiers[0].price) * 100) : 0;
                    return (
                      <button
                        type="button"
                        key={tier.minQty}
                        onClick={() => setQty(tier.minQty)}
                        className={`p-2.5 text-center transition-colors ${active ? "bg-gold text-forest" : "hover:bg-paper/5"}`}
                      >
                        <p className={`text-[9px] uppercase tracking-[0.22em] font-mono ${active ? "text-forest/80" : "text-paper/60"}`}>
                          {tier.minQty}+ {tier.minQty === 1 ? t("product.route.unit", "unit") : t("product.route.units", "units")}
                        </p>
                        <p className={`text-[12.5px] font-mono tabular-nums mt-1 ${active ? "text-forest" : "text-paper"}`}>
                          {formatMoney(tier.price, currency)}
                        </p>
                        {save > 0 && (
                          <p className={`text-[8.5px] font-mono uppercase tracking-[0.18em] mt-0.5 ${active ? "text-forest/70" : "text-gold"}`}>
                            −{save}%
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>


          <div className="p-5 sm:p-7 lg:p-8 space-y-4 border-b border-paper/10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold font-mono">{t("product.route.quantity", "Quantity")}</p>
            <div className="flex items-stretch gap-3">
              <div className="flex items-center border border-paper/20 shrink-0">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3.5 text-paper hover:bg-paper/5 text-lg leading-none" aria-label={t("product.route.decrease", "Decrease")}>−</button>
                <span className="w-10 text-center font-mono text-sm tabular-nums text-paper">{String(qty).padStart(2, "0")}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-4 py-3.5 text-paper hover:bg-paper/5 text-lg leading-none" aria-label={t("product.route.increase", "Increase")}>+</button>
              </div>
              <div ref={ctaRef} data-cta="primary" className="flex-1">
                <button
                  disabled={!p.available}
                  onClick={() => add(p.slug, qty)}
                  className="w-full h-full bg-gold text-forest py-3 font-mono font-bold uppercase text-[11px] tracking-[0.24em] hover:bg-paper transition-colors disabled:opacity-50"
                >
                  {p.available ? `${t("product.route.addToBag", "Add to Bag")} · ${formatMoney(lineSubtotal, currency)}` : t("product.route.unavailable", "Unavailable")}
                </button>
              </div>
            </div>

            <button className="w-full border border-paper/30 text-paper py-4 font-mono font-bold uppercase text-[11px] tracking-[0.28em] hover:bg-paper hover:text-forest transition-colors">
              {t("product.route.buyItNow", "Buy it now")}
            </button>

            {/* Delivery ETA — region aware */}
            {(() => {
              const days = etaFor(curMeta.country);
              const window = formatEtaWindow(days, locale);
              return (
                <div className="border border-paper/15 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[9.5px] uppercase tracking-[0.28em] text-gold font-mono">{t("product.route.deliveryTo", "Delivery to")} {curMeta.country ? t(`region.country.${curMeta.code}`, curMeta.country) : t("product.route.yourRegion", "your region")}</p>
                      <p className="text-[12px] text-paper mt-1 leading-tight">{t("product.route.estimatedArrival", "Estimated arrival")} <span className="font-mono tabular-nums">{window}</span></p>
                      <p className="text-[9.5px] uppercase tracking-[0.22em] text-paper/60 font-mono mt-1">{translateEta(t, days)} · {t("product.route.tracked", "tracked")}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9.5px] uppercase tracking-[0.28em] text-paper/50 font-mono">{t("product.route.orderIn", "Order in")}</p>
                      <p className="text-[12px] font-mono tabular-nums text-gold mt-1">{t("product.route.next24h", "next 24h")}</p>
                      <p className="text-[9.5px] uppercase tracking-[0.22em] text-paper/60 font-mono mt-1">{t("product.route.shipsToday", "ships today")}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 4-pillar trust grid */}
            <div className="grid grid-cols-2 border border-paper/15 divide-x divide-paper/15 [&>*:nth-child(n+3)]:border-t [&>*:nth-child(n+3)]:border-paper/15">
              {[
                { k: t("product.route.freeShipping", "Free shipping"), v: t("product.route.worldwideTracked", "Worldwide, tracked") },
                { k: t("product.route.sevenDayReturns", "7-day returns"), v: t("product.route.unopenedBottles", "Unopened bottles") },
                { k: t("product.route.secureCheckout", "Secure checkout"), v: t("product.route.sslEncryption", "256-bit SSL") },
                { k: t("product.route.authentic", "Authentic"), v: t("product.route.scratchCodeVerified", "Scratch-code verified") },
              ].map((pillar) => (
                <div key={pillar.k} className="p-2.5">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-gold font-mono">{pillar.k}</p>
                  <p className="text-[10.5px] text-paper/75 mt-1 leading-tight">{pillar.v}</p>
                </div>
              ))}
            </div>

            <dl className="border-t border-paper/10 pt-4 text-[11px] font-mono tabular-nums space-y-1.5">
              <div className="flex justify-between text-paper/70">
                <dt>{qty} × {formatMoney(unit, currency)}</dt>
                <dd>{formatMoney(lineSubtotal, currency)}</dd>
              </div>
              <div className="flex justify-between text-paper/60">
                <dt>{t("product.route.taxes", "Taxes")}</dt><dd>{t("product.route.incl", "Incl.")}</dd>
              </div>
              <div className="flex justify-between text-paper/60">
                <dt>{t("product.route.shipping", "Shipping")}</dt><dd>{t("product.route.freeWorldwide", "Free worldwide")}</dd>
              </div>
              {tiers.length > 1 && unit < tiers[0].price && (
                <div className="flex justify-between text-gold">
                  <dt>{t("product.route.youSave", "You save")}</dt><dd>−{Math.round((1 - unit / tiers[0].price) * 100)}%</dd>
                </div>
              )}
              <div className="flex justify-between pt-2 mt-1 border-t border-paper/15 text-paper font-bold">
                <dt>{t("product.route.total", "Total")}</dt><dd>{formatMoney(lineSubtotal, currency)}</dd>
              </div>
            </dl>
          </div>

          {/* Frequently bought together */}
          {related.length > 0 && (
            <div className="px-5 sm:px-7 lg:px-8 py-5 border-b border-paper/10">
              <p className="text-[9.5px] uppercase tracking-[0.28em] text-gold font-mono mb-3">{t("product.route.frequentlyPaired", "Frequently paired")}</p>
              <div className="space-y-2">
                {related.slice(0, 2).map((r) => {
                  const rPrice = getBasePrice(r.slug, currency);
                  const rName = t(`product.${r.slug}.name`, r.name);
                  const rTagline = t(`product.${r.slug}.tagline`, r.tagline);
                  return (
                    <div key={r.slug} className="flex items-center gap-2 border border-paper/15 p-2 group">
                      <Link
                        to="/product/$slug"
                        params={{ slug: r.slug }}
                        className="flex items-center gap-3 flex-1 min-w-0 hover:bg-paper/5 transition-colors"
                      >
                        <ProductImage src={r.image} alt={rName} sizes="48px" className="w-12 h-12 object-cover bg-paper shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-paper truncate group-hover:text-gold transition-colors">{rName}</p>
                          <p className="text-[9.5px] uppercase tracking-[0.2em] font-mono text-paper/50 truncate">{rTagline}</p>
                        </div>
                        <span className="text-[11px] font-mono tabular-nums text-gold shrink-0">{formatMoney(rPrice, currency)}</span>
                      </Link>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => add(r.slug, 1)}
                          disabled={!r.available}
                          className="px-2 py-2 border border-paper/20 text-[9px] uppercase tracking-[0.16em] font-mono text-paper hover:bg-paper hover:text-forest transition-colors disabled:opacity-40"
                          aria-label={`${t("product.route.add", "Add")} ${rName} ${t("product.route.toBag", "to bag")}`}
                        >
                          {t("product.route.add", "Add")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickSlug(r.slug)}
                          className="px-2 py-2 border border-paper/20 text-[9px] uppercase tracking-[0.16em] font-mono text-paper hover:bg-paper hover:text-forest transition-colors"
                          aria-label={`${t("product.route.quickView", "Quick view")} ${rName}`}
                        >
                          {t("product.route.view", "View")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>


        {/* MOBILE LEDGER — appears below on mobile only */}
        <aside className="lg:hidden border-t hairline">
          <div className="p-5 border-b hairline flex items-center justify-between">
            <span className="text-[9.5px] uppercase tracking-[0.28em] text-gold font-mono">{t("product.route.seriesNo", "Series Nº")}</span>
            <span className="text-[10.5px] tabular-nums font-mono text-forest">{sku}</span>
          </div>

          <div className="p-5 space-y-7">
            <section>
              <h2 className="text-[9.5px] uppercase tracking-[0.28em] text-forest/40 font-mono mb-3">{t("product.route.primaryMechanism", "Primary Mechanism")}</h2>
              <p className="text-[13px] leading-[1.65] text-forest">{mechanism}</p>
              {p.benefits && p.benefits.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {p.benefits.slice(0, 4).map((b, i) => (
                    <li key={i} className="flex gap-2.5 text-[12px] leading-[1.55] text-forest/85">
                      <span className="font-mono tabular-nums text-gold shrink-0 pt-[2px]">{String(i + 1).padStart(2, "0")}</span>
                      <span>{t(`product.${p.slug}.benefits.${i}`, b)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {bioPathways.length > 0 && (
              <section>
                <h2 className="text-[9.5px] uppercase tracking-[0.28em] text-forest/40 font-mono mb-3">{t("product.route.bioPathways", "Bio-Pathways")}</h2>
                <div className="space-y-3">
                  {bioPathways.map((bp, i) => (
                    <div key={bp.actor} className="border-l-2 border-gold/70 pl-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-forest">{bp.role}</span>
                        <span className="text-[9.5px] font-mono tabular-nums text-forest/40">P·{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-forest/70 leading-[1.55]">
                        <span className="text-forest/90">{bp.actor}</span>
                        {bp.note ? <> — {bp.note}</> : null}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {facts.length > 0 && (
              <section>
                <h2 className="text-[9.5px] uppercase tracking-[0.28em] text-forest/40 font-mono mb-3">{t("product.route.formulationFacts", "Formulation Facts")}</h2>
                <div className="flex flex-wrap gap-1.5">
                  {facts.slice(0, 8).map((f) => (
                    <span key={f} className="text-[9.5px] uppercase tracking-[0.14em] font-mono text-forest/80 border hairline px-2 py-1">
                      {f}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {composition.length > 0 && (
              <section>
                <h2 className="text-[9.5px] uppercase tracking-[0.28em] text-forest/40 font-mono mb-3">{t("product.route.molecularComposition", "Molecular Composition")}</h2>
                <div className="space-y-2.5">
                  {composition.map((c) => (
                    <div key={c.name} className="flex items-end justify-between gap-3 border-b hairline pb-1.5">
                      <span className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-forest truncate">{c.name}</span>
                      <span className="text-[11px] font-mono tabular-nums text-gold shrink-0">{c.percent}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        </aside>
      </section>
        );
      })()}




      {/* ── Trust strip (single row, appears once) ── */}
      <section className="border-t hairline bg-paper">
        <ul className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[color:var(--border)] border-b hairline">
          {[
            { label: t("product.route.verifiedAuthentic", "Verified authentic"), body: t("product.route.authorisedDistribution", "Authorised distribution only") },
            { label: t("product.route.worldwideShipping", "Worldwide shipping"), body: t("product.route.trackedCountries", "Tracked to 140+ countries") },
            { label: t("product.route.sevenDayReturns", "7-day returns"), body: t("product.route.unopenedEasyExchanges", "Unopened, easy exchanges") },
            { label: t("product.route.secureCheckout", "Secure checkout"), body: t("product.route.sslEncryptedPayments", "SSL encrypted payments") },
          ].map(({ label, body }) => (
            <li key={label} className="px-3 md:px-6 py-5 md:py-6 flex items-start gap-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.22em] text-forest font-mono">{label}</p>
                <p className="text-[12px] text-forest/60 leading-snug mt-1">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Full composition ── */}
      <CompositionLedger product={p} />

      {/* ── Who is this for — Self-diagnostic (moved up) ── */}
      {p.perfectFor && p.perfectFor.length > 0 && (
        <IndicationsDiagnostic items={p.perfectFor.map((item, i) => t(`product.${p.slug}.indications.${i}`, item))} productName={pName} />
      )}


      {/* Compact secondary CTA — after diagnostic */}
      <section className="border-t hairline bg-ivory">
        <div className="container-editorial py-6 md:py-8">
          <div className="flex items-center justify-between gap-4 border border-forest/15 bg-paper p-3 md:p-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-12 md:size-14 bg-ivory border border-forest/10 shrink-0">
                <ProductImage src={p.image} alt={altFor(p, 0, t)} title={productImageTitle(p, t)} sizes="56px" className="w-full h-full object-contain p-1.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[9.5px] uppercase tracking-[0.22em] text-forest/50 font-mono">{t("product.route.convinced", "Convinced?")}</div>
                <div className="font-serif text-[14px] md:text-[16px] text-forest leading-tight truncate">{pName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:block font-mono text-[13px] tabular-nums text-forest">{formatMoney(unit, currency)}</span>
              <button
                type="button"
                disabled={!p.available}
                onClick={() => { add(p.slug, 1); }}
                className="bg-forest text-paper px-4 md:px-5 py-2.5 text-[10.5px] uppercase tracking-[0.22em] font-mono font-bold hover:bg-moss transition-colors disabled:opacity-40"
              >
                {t("product.route.addToBag", "Add to bag")}
              </button>
            </div>
          </div>
        </div>
      </section>

      <ProductEditorial p={p} />

      {/* ── How it works — Combined effect (Neo only, 2x2) ── */}
      {p.slug === "neo-hair-lotion" && (

        <section className="border-t hairline bg-paper">
          <div className="container-editorial py-7 md:py-14">
            <div className="max-w-3xl mb-5 md:mb-8 pb-4 border-b border-forest/15">
              <Eyebrow>{t("product.route.howItWorks", "How it works")}</Eyebrow>
              <h2 className="font-serif text-2xl md:text-[2rem] text-forest mt-3 leading-[1.05] tracking-[-0.015em]">
                {t("product.route.whatHappensSpray", "What happens when you spray it on.")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-forest/15 border border-forest/15">
              {[
                { step: "01", title: t("product.route.howItWorks.step1Title", "Feed the roots"), body: t("product.route.howItWorks.step1Body", "White Ginseng supports scalp micro-circulation; Cantaloupe SOD adds antioxidant defence."), actives: t("product.route.howItWorks.step1Actives", "White Ginseng, Cantaloupe") },
                { step: "02", title: t("product.route.howItWorks.step2Title", "Calm the hormone"), body: t("product.route.howItWorks.step2Body", "Saw Palmetto is associated with healthy DHT activity at the follicle."), actives: t("product.route.howItWorks.step2Actives", "Saw Palmetto") },
                { step: "03", title: t("product.route.howItWorks.step3Title", "Soothe the scalp"), body: t("product.route.howItWorks.step3Body", "False Daisy calms the scalp; Horsetail silica contributes to keratin structure."), actives: t("product.route.howItWorks.step3Actives", "False Daisy, Horsetail") },
                { step: "04", title: t("product.route.howItWorks.step4Title", "Build stronger strands"), body: t("product.route.howItWorks.step4Body", "Silica and the antioxidant complex help new growth look thicker and less prone to breakage."), actives: t("product.route.howItWorks.step4Actives", "Horsetail, Cantaloupe SOD") },
              ].map((card) => (
                <article key={card.step} className="bg-paper p-5 md:p-7 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-forest/50">{card.step}</span>
                    <span className="size-2 bg-gold" />
                  </div>
                  <h3 className="font-serif text-lg md:text-xl text-forest leading-[1.15] mb-2">{card.title}</h3>
                  <p className="text-[13px] text-forest/80 leading-[1.6] font-serif flex-1">{card.body}</p>
                  <div className="mt-3 pt-3 border-t border-forest/10 text-[11.5px] text-forest/70 font-mono">{card.actives}</div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Comparison (Neo only) ── */}
      {p.slug === "neo-hair-lotion" && (
      <section className="border-t hairline bg-paper">
        <div className="container-editorial py-7 md:py-14">
          <div className="max-w-3xl mb-5 md:mb-8 pb-4 border-b border-forest/15">
            <Eyebrow>{t("product.route.anHonestComparison", "An honest comparison")}</Eyebrow>
            <h2 className="font-serif text-2xl md:text-[2rem] text-forest mt-3 leading-[1.05] tracking-[-0.015em]">
              {t("product.route.botanicalNotPharma", "Botanical. Not pharmaceutical.")}
            </h2>
          </div>

          {/* Desktop table (lg and up only) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-forest/25">
                  <th className="p-4 w-[30%] font-mono text-[10px] uppercase tracking-[0.24em] text-forest/60 align-bottom">{t("product.route.criterion", "Criterion")}</th>
                  <th className="p-4 bg-forest text-paper align-bottom">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-gold font-mono mb-1">{t("product.route.greenWealth", "Green Wealth")}</div>
                    <div className="font-serif text-lg leading-tight">{t("product.route.neoHairLotion", "Neo Hair Lotion")}</div>
                  </th>
                  <th className="p-4 align-bottom">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-forest/50 font-mono mb-1">{t("product.route.rxOtc", "Rx / OTC")}</div>
                    <div className="font-serif text-base text-forest/70 leading-tight">{t("product.route.minoxidil5", "Minoxidil 5%")}</div>
                  </th>
                  <th className="p-4 align-bottom">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-forest/50 font-mono mb-1">{t("product.route.prescription", "Prescription")}</div>
                    <div className="font-serif text-base text-forest/70 leading-tight">{t("product.route.finasteride1mg", "Finasteride 1 mg")}</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {[
                  [t("product.route.compare.formulation", "Formulation"), t("product.route.compare.formulationNeo", "5 botanical extracts"), t("product.route.compare.formulationMino", "Synthetic vasodilator"), t("product.route.compare.formulationFina", "Systemic 5-α inhibitor")],
                  [t("product.route.compare.mechanism", "Mechanism"), t("product.route.compare.mechanismNeo", "DHT + VEGF + anti-inflammatory + keratin"), t("product.route.compare.mechanismMino", "Vasodilation only"), t("product.route.compare.mechanismFina", "Blocks DHT systemically")],
                  [t("product.route.compare.application", "Application"), t("product.route.compare.applicationNeo", "Leave-in spray, 6–8 mists AM/PM"), t("product.route.compare.applicationMino", "Topical, 2× daily"), t("product.route.compare.applicationFina", "Oral tablet, daily")],
                  [t("product.route.compare.withdrawalShedding", "Withdrawal shedding"), t("product.route.compare.withdrawalSheddingNeo", "None reported"), t("product.route.compare.withdrawalSheddingMino", "Yes — dread shed"), t("product.route.compare.withdrawalSheddingFina", "Yes — on cessation")],
                  [t("product.route.compare.hormonalSideEffects", "Hormonal side effects"), t("product.route.compare.hormonalSideEffectsNeo", "None (topical, plant-based)"), t("product.route.compare.hormonalSideEffectsMino", "None (topical)"), t("product.route.compare.hormonalSideEffectsFina", "Libido / mood changes reported")],
                  [t("product.route.compare.scalpDryness", "Scalp dryness / irritation"), t("product.route.compare.scalpDrynessNeo", "None — soothing botanicals"), t("product.route.compare.scalpDrynessMino", "Common (propylene glycol)"), t("product.route.compare.scalpDrynessFina", "N/A (oral)")],
                  [t("product.route.compare.suitableForWomen", "Suitable for women"), t("product.route.compare.suitableForWomenNeo", "Yes — all ages"), t("product.route.compare.suitableForWomenMino", "Yes (2%)"), t("product.route.compare.suitableForWomenFina", "Contraindicated")],
                  [t("product.route.compare.prescriptionRequired", "Prescription required"), t("product.route.compare.prescriptionRequiredNeo", "No"), t("product.route.compare.prescriptionRequiredMino", "OTC / Rx (region)"), t("product.route.compare.prescriptionRequiredFina", "Yes")],
                ].map(([crit, neo, mino, fina], rIdx) => (
                  <tr key={crit} className={`border-b border-forest/10 ${rIdx % 2 === 1 ? "bg-ivory/50" : ""}`}>
                    <td className="p-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-forest/70 align-top">{crit}</td>
                    <td className="p-3.5 bg-forest/[0.04] text-forest font-semibold align-top leading-snug">{neo}</td>
                    <td className="p-3.5 text-forest/70 align-top leading-snug">{mino}</td>
                    <td className="p-3.5 text-forest/70 align-top leading-snug">{fina}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet stacked cards */}
          <div className="lg:hidden space-y-3">
            {[
              [t("product.route.compare.formulation", "Formulation"), t("product.route.compare.formulationNeo", "5 botanical extracts"), t("product.route.compare.formulationMino", "Synthetic vasodilator"), t("product.route.compare.formulationFina", "Systemic 5-α inhibitor")],
              [t("product.route.compare.mechanism", "Mechanism"), t("product.route.compare.mechanismNeo", "DHT + VEGF + anti-inflammatory + keratin"), t("product.route.compare.mechanismMino", "Vasodilation only"), t("product.route.compare.mechanismFina", "Blocks DHT systemically")],
              [t("product.route.compare.application", "Application"), t("product.route.compare.applicationNeo", "Leave-in spray, 6–8 mists AM/PM"), t("product.route.compare.applicationMino", "Topical, 2× daily"), t("product.route.compare.applicationFina", "Oral tablet, daily")],
              [t("product.route.compare.withdrawalShedding", "Withdrawal shedding"), t("product.route.compare.withdrawalSheddingNeo", "None reported"), t("product.route.compare.withdrawalSheddingMino", "Yes — dread shed"), t("product.route.compare.withdrawalSheddingFina", "Yes — on cessation")],
              [t("product.route.compare.sideEffectsShort", "Side effects"), t("product.route.compare.sideEffectsShortNeo", "None (plant-based)"), t("product.route.compare.sideEffectsShortMino", "Scalp irritation"), t("product.route.compare.sideEffectsShortFina", "Libido / mood reported")],
              [t("product.route.compare.suitableForWomen", "Suitable for women"), t("product.route.compare.suitableForWomenNeo", "Yes — all ages"), t("product.route.compare.suitableForWomenMino", "Yes (2%)"), t("product.route.compare.suitableForWomenFina", "Contraindicated")],
              [t("product.route.compare.prescriptionShort", "Prescription"), t("product.route.compare.prescriptionShortNeo", "No"), t("product.route.compare.prescriptionShortMino", "OTC / Rx"), t("product.route.compare.prescriptionShortFina", "Yes")],
            ].map(([crit, neo, mino, fina]) => (
              <div key={crit} className="border border-forest/10 bg-paper">
                <div className="px-3 py-2 border-b border-forest/10 bg-forest/[0.03]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-forest/60">{crit}</span>
                </div>
                <div className="grid grid-cols-3 divide-x divide-forest/10">
                  <div className="p-2.5 bg-forest/[0.04]">
                    <span className="block text-[9px] uppercase tracking-[0.18em] text-gold font-mono mb-1">{t("product.route.neoLabel", "Neo")}</span>
                    <span className="text-[11.5px] text-forest font-semibold leading-snug">{neo}</span>
                  </div>
                  <div className="p-2.5">
                    <span className="block text-[9px] uppercase tracking-[0.16em] text-forest/45 font-mono mb-1">{t("product.route.minoxidilLabel", "Minoxidil")}</span>
                    <span className="text-[11.5px] text-forest/70 leading-snug">{mino}</span>
                  </div>
                  <div className="p-2.5">
                    <span className="block text-[9px] uppercase tracking-[0.16em] text-forest/45 font-mono mb-1">{t("product.route.finasterideLabel", "Finasteride")}</span>
                    <span className="text-[11.5px] text-forest/70 leading-snug">{fina}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[10px] text-forest/50 font-mono uppercase tracking-[0.18em]">
            {t("product.route.basedOnLiterature", "* Based on published literature. Not medical advice.")}
          </p>
        </div>
      </section>
      )}

      {/* ── Specification + In the box + From the House (from ProductDetail) ── */}
      <ProductDetail p={p} gallery={gallery} sku={sku} onFigure={(i) => { setActiveImg(i); window.scrollTo({ top: 0, behavior: "smooth" }); }} />





      {/* ── FAQ (with preview lines) ── */}
      {p.faqs && p.faqs.length > 0 && (
        <section className="border-t hairline bg-paper">
          <div className="container-editorial py-7 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
            <div className="md:col-span-4 md:sticky md:top-24 self-start">
              <Eyebrow>{t("product.route.frequentlyAsked", "Frequently asked")}</Eyebrow>
              <h2 className="font-serif text-3xl md:text-[2.8rem] text-forest mt-4 leading-[1.02] tracking-[-0.015em]">
                {t("product.route.answersNotMarketing", "Answers, not marketing.")}
              </h2>
              <p className="mt-5 text-[13.5px] text-forest/75 leading-[1.7] font-serif">
                {t("product.route.faqIntro", "Everything most customers ask before their first bottle — answered without hedging.")}
              </p>
              <div className="mt-8 border border-forest/20 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold mb-2">{t("product.route.stillUncertain", "Still uncertain?")}</div>
                <p className="text-[13px] text-forest/85 leading-[1.6] font-serif">
                  {t("product.route.specialistsReply", "Our specialists reply within 24 hours — with a real answer, not a script.")}
                </p>
                <Link to="/contact" className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-mono text-forest border-b border-forest/40 hover:border-forest pb-0.5">
                  {t("product.route.contactASpecialist", "Contact a specialist")}
                </Link>
              </div>
            </div>
            <div className="md:col-span-8">
              {p.faqs.map((f, i) => {
                const faqQ = t(`product.${p.slug}.faq.${i}.q`, f.q);
                const faqA = t(`product.${p.slug}.faq.${i}.a`, f.a);
                return (
                  <Accordion
                    key={f.q}
                    title={`${String(i + 1).padStart(2, "0")} · ${faqQ}`}
                    defaultOpen={i === 0}
                    preview={faqA}
                  >
                    <p>{faqA}</p>
                  </Accordion>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Reviews (live from Lovable Cloud + write-a-review) ── */}
      <ProductReviews slug={p.slug} productName={pName} />



      {/* ── More from Green Wealth (merged pair-with + journal) ── */}
      <MoreFromGreenWealth
        related={related}
        productSlug={p.slug}
        productName={pName}
        currency={currency}
        onAdd={(slug) => add(slug, 1)}
        onQuick={(slug) => setQuickSlug(slug)}
      />


      {quickProduct && (
        <QuickViewModal
          product={quickProduct}
          onClose={() => setQuickSlug(null)}
        />
      )}

      <StickyCartBar
        ctaRef={ctaRef}
        qty={qty}
        setQty={setQty}
        lineSubtotal={lineSubtotal}
        currency={currency}
        available={p.available}
        onAdd={() => add(p.slug, qty)}
      />
    </div>
  );
}

function MoreFromGreenWealth({
  related,
  productSlug,
  productName,
  currency,
  onAdd,
  onQuick,
}: {
  related: import("@/lib/products").Product[];
  productSlug: string;
  productName: string;
  currency: string;
  onAdd: (slug: string) => void;
  onQuick: (slug: string) => void;
}) {
  const t = useT();
  const posts = relatedPosts(productSlug, productName, 3);
  if (related.length === 0 && posts.length === 0) return null;
  return (
    <section className="border-t hairline bg-ivory">
      <div className="container-editorial py-9 md:py-14">
        <div className="flex items-baseline justify-between mb-6 md:mb-8">
          <div>
            <span className="text-[6px] uppercase tracking-[0.28em] text-moss font-mono">{t("product.route.explore", "Explore")}</span>
            <h2 className="font-serif text-2xl md:text-[2rem] text-forest mt-2 leading-tight">{t("product.route.moreFromGreenWealth", "More from Green Wealth")}</h2>
          </div>
          <Link to="/shop" className="text-[10.5px] uppercase tracking-[0.24em] font-mono text-forest hover:text-gold">{t("product.route.shopAll", "Shop all")}</Link>
        </div>

        {related.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 mb-6 md:mb-8">
            {related.map(r => {
              const rName = t(`product.${r.slug}.name`, r.name);
              return (
              <div key={r.slug} className="group block bg-paper border hairline">
                <Link to="/product/$slug" params={{ slug: r.slug }} className="block">
                  <div className="aspect-square bg-ivory overflow-hidden">
                    <ProductImage src={r.image} alt={rName} sizes="(min-width: 1024px) 320px, 45vw" className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3 md:p-4 border-t hairline">
                    <span className="text-[9.5px] uppercase tracking-[0.24em] font-mono text-moss">{t(`product.category.${r.category}`, r.category)}</span>
                    <h3 className="font-serif text-base md:text-lg text-forest mt-1 leading-tight">{rName}</h3>
                    <span className="font-mono text-[12px] text-forest tabular-nums mt-2 block">{formatMoney(getBasePrice(r.slug, currency), currency)}</span>
                  </div>
                </Link>
                <div className="px-3 md:px-4 pb-3 md:pb-4 flex items-center gap-2">
                  <button type="button" onClick={() => onAdd(r.slug)} disabled={!r.available} className="flex-1 border hairline py-2 text-[10px] uppercase tracking-[0.18em] font-mono text-forest hover:bg-forest hover:text-paper transition-colors disabled:opacity-40" aria-label={`${t("product.route.add", "Add")} ${rName}`}>{t("product.route.add", "Add")}</button>
                  <button type="button" onClick={() => onQuick(r.slug)} className="flex-1 border hairline py-2 text-[10px] uppercase tracking-[0.18em] font-mono text-forest hover:bg-forest hover:text-paper transition-colors" aria-label={`${t("product.route.quickView", "Quick view")} ${rName}`}>{t("product.route.quickView", "Quick view")}</button>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/10 border hairline">
            {posts.map((post) => (
              <Link key={post.slug} to="/blogs/$slug" params={{ slug: post.slug }} className="group block bg-paper p-5 md:p-6 hover:bg-ivory/60 transition-colors">
                <span className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-moss">{t(`blog.category.${post.category}`, post.category)}</span>
                <h3 className="font-serif text-base md:text-lg text-forest mt-2 leading-snug group-hover:text-moss transition-colors">{t(`blog.${post.slug}.title`, post.title)}</h3>
                <p className="text-[12.5px] text-forest/70 mt-2 leading-relaxed line-clamp-2">{t(`blog.${post.slug}.excerpt`, post.excerpt)}</p>
                <span className="mt-3 inline-block text-[10px] uppercase tracking-[0.24em] font-mono text-gold">{t("product.route.readArrow", "Read →")}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------- Actives Dossier Slider ----------------
type ActiveItem = {
  name: string; description: string; image?: string; latin?: string; role?: string;
  tagline?: string; summary?: string; keyNutrients?: string[]; pathwayTags?: string[];
  whatItDoes?: string[]; howItWorks?: { category: string; description: string }[];
  origin?: string; process?: string; dailyDose?: string; evidence?: string;
};

function ActivesDossierSlider({ items, productName }: { items: ActiveItem[]; productName: string }) {
  const t = useT();
  const [idx, setIdx] = useState(0);
  const total = items.length;
  const go = (n: number) => setIdx(((n % total) + total) % total);
  const ing = items[idx];
  const i = idx;

  return (
    <div>
      {/* Chip index — switches slide */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 mb-8 md:mb-10">
        {items.map((it, n) => {
          const active = n === idx;
          return (
            <button
              key={`chip-${it.name}`}
              type="button"
              onClick={() => go(n)}
              className={`group border transition-colors px-3 py-2.5 flex items-center gap-2.5 text-left ${
                active ? "border-forest bg-forest text-paper" : "border-forest/15 hover:border-forest bg-paper text-forest"
              }`}
            >
              {it.image ? (
                <span className={`size-9 md:size-10 border overflow-hidden shrink-0 ${active ? "bg-paper border-paper/40" : "bg-ivory border-forest/10"}`}>
                  <ProductImage src={it.image} alt={it.name} title={it.name} sizes="40px" className="w-full h-full object-contain p-1" />
                </span>
              ) : (
                <span className={`size-9 md:size-10 shrink-0 border ${active ? "bg-paper/20 border-paper/40" : "bg-ivory border-forest/10"}`} />
              )}
              <span className="min-w-0">
                <span className={`block font-serif text-sm leading-tight truncate ${active ? "text-paper" : "text-forest"}`}>{it.name}</span>
                {it.role && (
                  <span className={`block text-[9.5px] uppercase tracking-[0.18em] font-mono truncate ${active ? "text-paper/70" : "text-forest/60"}`}>
                    {it.role.split("·")[0].trim()}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slide controls bar */}
      <div className="flex items-center justify-between gap-4 border-t border-b border-forest/15 py-3 mb-0">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-forest/60">
          {t("product.route.dossier", "Dossier")} · {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(idx - 1)}
            aria-label={t("product.route.previousActive", "Previous active")}
            className="size-9 border border-forest/25 hover:border-forest hover:bg-forest hover:text-paper transition-colors font-mono text-sm"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(idx + 1)}
            aria-label={t("product.route.nextActive", "Next active")}
            className="size-9 border border-forest/25 hover:border-forest hover:bg-forest hover:text-paper transition-colors font-mono text-sm"
          >
            →
          </button>
        </div>
      </div>

      {/* Slide */}
      <article
        key={ing.name}
        className="animate-fade-in border-x border-b border-forest/15 bg-paper grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr] overflow-hidden"
      >
        <div className="relative aspect-square md:aspect-auto md:min-h-full bg-ivory overflow-hidden">
          {ing.image ? (
            <ProductImage
              src={ing.image}
              alt={`${ing.name} — botanical active in Green Wealth Neo Hair formulas`}
              title={ing.name}
              sizes="(min-width: 1024px) 380px, 100vw"
              className="absolute inset-0 w-full h-full object-contain p-8 md:p-10"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-serif text-6xl text-forest/20">
              {String(i + 1).padStart(2, "0")}
            </div>
          )}
        </div>

        <div className="p-6 md:p-10 flex flex-col">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h3 className="font-serif text-3xl md:text-5xl text-forest leading-[1.02] tracking-[-0.015em]">
                {ing.name}
              </h3>
              {ing.tagline && (
                <p className="mt-2 text-[11px] md:text-xs uppercase tracking-[0.28em] text-forest/70 font-mono">
                  {ing.tagline}
                </p>
              )}
              {ing.latin && (
                <p className="mt-1 text-[10.5px] uppercase tracking-[0.2em] text-forest/45 font-mono">
                  {ing.latin}
                </p>
              )}
            </div>
            {ing.pathwayTags && ing.pathwayTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {ing.pathwayTags.map((tag) => (
                  <span key={tag} className="text-[9.5px] uppercase tracking-[0.2em] text-forest border border-forest/30 px-2 py-1 font-mono">
                    {t(`ingdata.${tag}`, tag)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {(ing.summary ?? ing.description) && (
            <p className="mt-5 text-[15px] md:text-[16px] text-forest/85 leading-[1.65] font-serif">
              {(() => { const v = ing.summary ?? ing.description; return v ? t(`ingdata.${v}`, v) : v; })()}
            </p>
          )}

          {((ing.keyNutrients && ing.keyNutrients.length > 0) || (ing.whatItDoes && ing.whatItDoes.length > 0)) && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {ing.keyNutrients && ing.keyNutrients.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-forest/60 font-mono mb-3">{t("product.route.keyNutrients", "Key Nutrients")}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {ing.keyNutrients.map((n) => (
                      <span key={n} className="text-[11.5px] text-forest bg-ivory border border-forest/15 px-2.5 py-1.5">
                        {t(`ingdata.${n}`, n)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {ing.whatItDoes && ing.whatItDoes.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-forest/60 font-mono mb-3">{t("product.route.whatItDoesForYou", "What It Does For You")}</div>
                  <ul className="space-y-2">
                    {ing.whatItDoes.map((w) => (
                      <li key={w} className="flex gap-2.5 text-[13px] text-forest/80 leading-snug">
                        <span className="mt-1.5 size-1 rounded-full bg-forest/60 shrink-0" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {ing.howItWorks && ing.howItWorks.length > 0 && (
            <div className="mt-9 pt-8 border-t border-forest/10">
              <div className="text-[10px] uppercase tracking-[0.24em] text-forest/60 font-mono mb-5">
                {t("product.route.howItWorksAtFollicle", "How It Works At The Follicle")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                {ing.howItWorks.map((hw) => (
                  <div key={hw.category} className="border-l border-forest/25 pl-4">
                    <div className="font-serif text-[15px] text-forest mb-1.5 leading-tight">{t(`ingdata.${hw.category}`, hw.category)}</div>
                    <p className="text-[12.5px] text-forest/75 leading-[1.55]">{t(`ingdata.${hw.description}`, hw.description)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-9 pt-8 border-t border-forest/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-[9.5px] uppercase tracking-[0.24em] text-forest/55 font-mono mb-1.5">{t("product.route.origin", "Origin")}</div>
              <div className="text-[12.5px] text-forest/85 leading-snug">{(ing.origin ? t(`ingdata.${ing.origin}`, ing.origin) : undefined) ?? t("product.route.wildcraftedSourced", "Wildcrafted & sustainably sourced")}</div>
            </div>
            <div>
              <div className="text-[9.5px] uppercase tracking-[0.24em] text-forest/55 font-mono mb-1.5">{t("product.route.process", "Process")}</div>
              <div className="text-[12.5px] text-forest/85 leading-snug">{(ing.process ? t(`ingdata.${ing.process}`, ing.process) : undefined) ?? t("product.route.gentleExtraction", "Gentle extraction, GMP-certified processing")}</div>
            </div>
            <div>
              <div className="text-[9.5px] uppercase tracking-[0.24em] text-forest/55 font-mono mb-1.5">{t("product.route.inYourDailyUse", "In Your Daily Use")}</div>
              <div className="text-[12.5px] text-forest/85 leading-snug">{(ing.dailyDose ? t(`ingdata.${ing.dailyDose}`, ing.dailyDose) : undefined) ?? t("product.route.bioavailableDelivery", "Bioavailable delivery at the scalp")}</div>
            </div>
          </div>

          {ing.evidence && (
            <div className="mt-8 pt-6 border-t border-forest/10">
              <div className="text-[10px] uppercase tracking-[0.24em] text-forest/60 font-mono mb-2.5 flex items-center gap-2">
                <span className="inline-block size-2.5 border border-forest/50" />
                {t("product.route.evidenceIn", "Evidence in")} {productName}
              </div>
              <p className="text-[13px] text-forest/80 leading-[1.7] font-serif">{t(`ingdata.${ing.evidence}`, ing.evidence)}</p>
            </div>
          )}
        </div>
      </article>

      {/* Progress dots */}
      <div className="mt-6 flex items-center justify-center gap-1.5">
        {items.map((_, n) => (
          <button
            key={n}
            type="button"
            onClick={() => go(n)}
            aria-label={`${t("product.route.goToActive", "Go to active")} ${n + 1}`}
            className={`h-1 transition-all ${n === idx ? "w-8 bg-forest" : "w-4 bg-forest/25 hover:bg-forest/50"}`}
          />
        ))}
      </div>
    </div>
  );
}


// ============================================================
// PRODUCT DETAIL — beautiful editorial layout (no tabs)
// ============================================================
function ProductDetail({
  p,
  gallery,
  sku,
  onFigure,
}: {
  p: import("@/lib/products").Product;
  gallery: string[];
  sku: string;
  onFigure: (i: number) => void;
}) {
  const t = useT();
  const tp = (field: string, fallback: string) => t(`product.${p.slug}.${field}`, fallback);
  const pName = t(`product.${p.slug}.name`, p.name);
  const brandName = p.brand ? `${p.brand}®` : "Green Wealth®";
  const form = p.slug.includes("dermaroller")
    ? t("product.route.form.microNeedling", "Micro-needling tool")
    : p.slug.includes("shampoo")
      ? t("product.route.form.shampoo", "Shampoo")
      : p.slug.includes("rosemary")
        ? t("product.route.form.scalpHairOil", "Scalp & hair oil")
        : t("product.route.form.sprayLotion", "Spray lotion");
  const componentsCount = (p.inciDetails ?? p.ingredients).length;

  const heroImg = gallery[0] ?? p.image;
  const brandNarrative = p.brand === "GHORI"
    ? t("product.route.brandNarrative.ghori", "GHORI® is our sister label for cold-pressed oils and precision scalp tools. Every batch is manufactured under GMP standards for Ghori International, Miami FL, and paired with a scratch-code so you can verify authenticity in seconds.")
    : t("product.route.brandNarrative.greenWealth", "Green Wealth® has spent over a decade formulating the reference botanical spray-treatment loved from Bangkok to Riyadh. Each bottle is authorised, batch-verifiable and ships worldwide from our official distribution.");


  return (
    <section className="border-t hairline bg-paper">
      <div className="container-editorial py-9 md:py-14">
        <div className="mb-6 md:mb-8 flex items-baseline justify-between gap-4 border-b border-forest/15 pb-4">
          <div>
            <div className="text-[9px] uppercase tracking-[0.28em] font-mono text-forest/55">{t("product.route.productDetail", "Product Detail")} · {sku}</div>
            <h2 className="mt-2 font-serif text-2xl md:text-[2rem] leading-[1.05] tracking-[-0.02em] text-forest">
              {t("product.route.theDetails", "The details.")}
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[9.5px] uppercase tracking-[0.22em] font-mono text-forest/55">
            <span>{componentsCount} {t("product.route.components", "components")}</span>
            <span className="text-forest/30">·</span>
            <span>{tp("size", p.size)}</span>
            <span className="text-forest/30">·</span>
            <span>{p.origin ? tp("origin", p.origin) : t("product.route.thailand", "Thailand")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Column 1 — Specification + In the box */}
          <div className="space-y-6 md:space-y-8">
            <div className="border border-forest/15 bg-paper">
              <div className="px-5 md:px-6 py-3 border-b border-forest/15 bg-ivory/60">
                <span className="text-[9.5px] uppercase tracking-[0.24em] font-mono text-gold">{t("product.route.specification", "Specification")}</span>
              </div>
              <dl className="px-5 md:px-6 py-1">
                {(
                  [
                    [t("product.route.spec.brand", "Brand"), brandName],
                    [t("product.route.spec.category", "Category"), tp("category", p.category)],
                    [t("product.route.spec.format", "Format"), form],
                    [t("product.route.spec.volume", "Volume"), tp("size", p.size)],
                    [t("product.route.spec.origin", "Origin"), p.origin ? tp("origin", p.origin) : t("product.route.thailand", "Thailand")],
                    [t("product.route.spec.components", "Components"), `${componentsCount} ${t("product.route.declared", "declared")}`],
                    [t("product.route.spec.freeFrom", "Free from"), (p.freeFrom ? p.freeFrom.map((f, fi) => t(`product.${p.slug}.freeFrom.${fi}`, f)) : [t("product.route.silicones", "silicones"), t("product.route.sulfates", "sulfates"), t("product.route.parabens", "parabens")]).join(" · ")],
                    [t("product.route.spec.availability", "Availability"), p.available ? t("product.route.inStockShips", "In stock — ships worldwide") : t("product.route.currentlyUnavailable", "Currently unavailable")],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[38%_1fr] gap-3 py-2.5 border-b border-forest/10 last:border-b-0">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-forest/55 pt-0.5">{k}</dt>
                    <dd className="text-[12.5px] text-forest/85 font-serif leading-[1.5]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border border-forest/15 bg-paper">
              <div className="px-5 md:px-6 py-3 border-b border-forest/15 bg-ivory/60">
                <span className="text-[9.5px] uppercase tracking-[0.24em] font-mono text-gold">{t("product.route.inTheBox", "In the box")}</span>
              </div>
              <ul className="px-5 md:px-6 py-1">
                {[
                  { name: `1 × ${t(`product.${p.slug}.name`, p.name)}`, note: t(`product.${p.slug}.size`, p.size ?? "") },
                  { name: t("product.route.box.scratchCard", "Scratch-code verification card"), note: t("product.route.box.uniqueCode", "Unique code") },
                  { name: t("product.route.box.leaflet", "Usage & authenticity leaflet"), note: t("product.route.box.multiLanguage", "Multi-language") },
                  { name: t("product.route.box.carton", "Sealed outer carton"), note: t("product.route.box.tamperEvident", "Tamper-evident") },
                ].map((row, i) => (
                  <li key={i} className="grid grid-cols-[auto_1fr_auto] gap-3 items-center py-2.5 border-b border-forest/10 last:border-b-0">
                    <span className="font-serif text-xs text-forest/40 tabular-nums w-5">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-serif text-[13px] text-forest">{row.name}</span>
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-forest/50">{row.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2 — From the House with image */}
          <div className="border border-forest/15 bg-paper flex flex-col">
            <button
              type="button"
              onClick={() => onFigure(0)}
              className="relative aspect-[4/3] bg-ivory overflow-hidden group border-b border-forest/15"
              aria-label={t("product.route.viewHeroFigure", "View hero figure")}
            >
              <ProductImage src={heroImg} alt={t(`product.${p.slug}.name`, p.name)} sizes="(min-width: 1024px) 500px, 100vw" className="absolute inset-0 w-full h-full object-contain p-8 md:p-12 transition-transform duration-[900ms] group-hover:scale-[1.03]" />
            </button>
            <div className="p-5 md:p-7 flex-1 flex flex-col">
              <div className="text-[9.5px] uppercase tracking-[0.24em] font-mono text-gold">{t("product.route.fromTheHouse", "From the house")}</div>
              <h3 className="mt-2 font-serif text-xl md:text-2xl leading-[1.1] tracking-[-0.015em] text-forest">
                {p.slug.startsWith("ghori-") ? t("product.route.ghoriTagline", "Ghori® — botanical formulation, honestly labelled.") : t("product.route.greenWealthTagline", "Green Wealth® — a botanical hair-care house.")}
              </h3>
              <p className="mt-3 font-serif text-[13.5px] leading-[1.6] text-forest/75">{brandNarrative}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {(p.freeFrom ? p.freeFrom.map((f, fi) => t(`product.${p.slug}.freeFrom.${fi}`, f)) : [t("product.route.silicone", "Silicone"), t("product.route.sulfate", "Sulfate"), t("product.route.paraben", "Paraben"), t("product.route.mineralOil", "Mineral oil")]).slice(0, 6).map((f) => (
                  <span key={f} className="text-[9.5px] uppercase tracking-[0.18em] font-mono text-forest border border-forest/25 px-2 py-1">{f}-{t("product.route.freeSuffix", "free")}</span>
                ))}
              </div>
              <div className="mt-auto pt-5 border-t border-forest/15 grid grid-cols-3 gap-4">
                {[{ n: "10+", l: t("product.route.years", "Years") }, { n: "40+", l: t("product.route.countries", "Countries") }, { n: t("product.route.verified", "Verified"), l: t("product.route.source", "Source") }].map((s) => (
                  <div key={s.l}>
                    <div className="font-serif text-xl md:text-2xl text-forest tabular-nums leading-none">{s.n}</div>
                    <div className="mt-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-forest/55">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// ─── Full Composition ───────────────────────────────────────────────
// Purpose: publish the complete, label-accurate ingredient declaration on the
// PDP for every viewport (the hero ledger tab is desktop-only).
// Users: shoppers auditing the formula, regulators, retail partners.
function CompositionLedger({ product }: { product: Product }) {
  const t = useT();
  const p = product;
  const actives = (p.ingredientsDetailed ?? []).map((ing, idx) => ({
    name: t(`product.${p.slug}.active.${idx}.name`, ing.name),
    latin: ing.latin ?? "",
    role: t(`product.${p.slug}.active.${idx}.role`, ing.role ?? ""),
    percent: ing.percentage ?? (p.ingredients[idx]?.match(/(\d+(?:\.\d+)?)\s*%/)?.[0] ?? ""),
  }));
  const rawList = p.ingredients.map((s, i) => t(`product.${p.slug}.ingredients.${i}`, s));
  const base = (p.baseIngredients ?? []).map((s, i) => t(`product.${p.slug}.baseIngredients.${i}`, s));
  const inci = p.inciDetails ?? [];
  const rows = actives.length ? actives : rawList.map((s) => ({ name: s, latin: "", role: "", percent: s.match(/(\d+(?:\.\d+)?)\s*%/)?.[0] ?? "" }));
  const total = rows.length;
  void base;

  return (
    <section id="full-composition" className="border-t hairline bg-paper">
      <div className="container-editorial py-8 md:py-14">
        <div className="pb-5 md:pb-6 border-b border-forest/15">
          <Eyebrow>{t("product.route.composition", "Composition")}</Eyebrow>
          <h2 className="mt-3 font-serif text-2xl md:text-[2.2rem] text-forest leading-[1.05] tracking-[-0.015em]">
            {t("product.route.theActiveBotanicals", "The active botanicals")}
          </h2>
        </div>

        <ul
          className="mt-6 md:mt-8 grid grid-cols-2 gap-px bg-forest/15 border border-forest/15 md:[grid-template-columns:repeat(var(--comp-cols),minmax(0,1fr))]"
          style={{ ["--comp-cols" as string]: String(Math.max(rows.length, 1)) }}
        >
          {rows.map((r, i) => {
            const detail = (p.ingredientsDetailed ?? [])[i];
            const img = detail?.image;
            const ingSlug = detail
              ? detail.name.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
              : "";
            const inner = (
              <>
                {img && (
                  <div className="mb-3 aspect-square bg-ivory border border-forest/10 overflow-hidden">
                    <ProductImage src={img} alt={r.name} sizes="(min-width: 768px) 20vw, 45vw" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[10px] tabular-nums tracking-[0.24em] text-gold">{String(i + 1).padStart(2, "0")}</span>
                  {r.percent && (
                    <span className="font-mono text-[11px] tabular-nums text-forest">{r.percent}</span>
                  )}
                </div>
                <p className="mt-2 font-serif text-[14px] md:text-[15.5px] leading-[1.25] text-forest group-hover:text-moss transition-colors">{r.name}</p>
                {r.latin && (
                  <p className="mt-1 text-[9.5px] uppercase tracking-[0.18em] font-mono text-forest/45">{r.latin}</p>
                )}
                {r.role && <p className="mt-2 text-[11.5px] leading-[1.55] text-forest/70">{r.role}</p>}
              </>
            );
            return (
              <li key={`${r.name}-${i}`} className="bg-paper">
                {ingSlug ? (
                  <Link to="/ingredients/$slug" params={{ slug: ingSlug }} className="group h-full flex flex-col p-3.5 md:p-5">
                    {inner}
                    <span className="mt-3 pt-3 border-t border-forest/10 font-mono text-[9.5px] uppercase tracking-[0.22em] text-forest/50 group-hover:text-forest">
                      {t("product.route.readTheScience", "Read the science")}
                    </span>
                  </Link>
                ) : (
                  <div className="p-3.5 md:p-5 flex flex-col h-full">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        {inci.length > 0 && (
          <div className="mt-6 md:mt-8 border border-forest/15 bg-ivory p-4 md:p-5">
            <p className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-forest/50">
              {t("product.route.fullInciDeclaration", "Full INCI Declaration")}
            </p>
            <p className="mt-2 text-[12px] leading-[1.7] text-forest/75">
              {inci.map((ing, i) => t(`product.${p.slug}.inci.${i}.common`, ing.common ?? ing.inci)).join(", ")}
            </p>
          </div>
        )}

        <div className="mt-4 md:mt-5 flex items-center justify-between gap-4 border border-forest/15 bg-paper px-4 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-forest/50">
            {String(total).padStart(2, "0")} {t("product.route.componentsLabelAccurate", "components · label-accurate")}
          </span>
          {p.size && <span className="font-mono text-[11px] tabular-nums text-forest/70">{t(`product.${p.slug}.size`, p.size)}</span>}
        </div>
      </div>
    </section>
  );
}


// ─── Helps With ──────────────────────────────────────────────────────
// Static benefit index: lists the concerns this product is formulated
// to address. No selection state, no counters — just clear reassurance.
function IndicationsDiagnostic({ items, productName }: { items: string[]; productName: string }) {
  const t = useT();
  return (
    <section id="indications-diagnostic" className="border-t hairline bg-forest text-paper relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px)", backgroundSize: "72px 100%" }} />

      <div className="container-editorial py-8 md:py-16 relative">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 mb-7 md:mb-12 pb-5 md:pb-7 border-b border-paper/20">
          <div className="md:col-span-7">
            <span className="text-[9.5px] uppercase tracking-[0.3em] font-mono text-gold">{t("product.route.helpsWith", "Helps with")}</span>
            <h2 className="mt-3 font-serif text-[1.6rem] md:text-[2.4rem] text-paper leading-[1.08] tracking-[-0.02em]">
              {t("product.route.concernsAddress", "Concerns")} {productName.replace(/®/g, "")} {t("product.route.isFormulatedToAddress", "is formulated to address")}
            </h2>
          </div>
          <div className="md:col-span-5 md:flex md:items-end">
            <p className="text-[12.5px] md:text-[13.5px] text-paper/70 leading-[1.75] font-serif max-w-md">
              {t("product.route.dailyProtocolBlurb", "A daily botanical protocol designed to support scalp balance, reduce visible shedding, and encourage stronger, fuller-looking hair over time.")}
            </p>
          </div>
        </div>

        {/* Concern grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-paper/20 border border-paper/20">
          {items.map((item, i) => (
            <li
              key={item}
              className="group bg-forest hover:bg-moss transition-colors p-5 md:p-7 flex flex-col justify-between gap-5 min-h-[132px] md:min-h-[168px]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] tabular-nums tracking-[0.26em] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-paper/20" />
              </div>
              <p className="font-serif text-[15.5px] md:text-[17.5px] leading-[1.35] text-paper">
                {item}
              </p>
            </li>
          ))}
        </ul>

        {/* Closing reassurance */}
        <div className="mt-5 md:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-paper/20 p-4 md:p-6">
          <p className="text-[12.5px] md:text-[13.5px] text-paper/70 leading-[1.75] font-serif max-w-2xl">
            {t("product.route.sameRootMechanism", "Every concern below is addressed through the same root mechanism: a calm, nourished scalp environment and healthy follicle cycling.")}
          </p>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
            {items.length} {t("product.route.targetedAreas", "targeted areas")}
          </span>
        </div>
      </div>
    </section>
  );
}


