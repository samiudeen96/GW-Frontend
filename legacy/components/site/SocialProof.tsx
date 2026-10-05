// Reusable social-proof surfaces: trust bars, testimonial strips, mini quotes.
// Consumed on homepage, PDP, cart, checkout, verify, footer, hair-science, etc.

import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";
import { reviews, stats, productStats, type Review } from "@/lib/reviews";

function Stars({ n, size = "sm" }: { n: number; size?: "sm" | "md" | "lg" }) {
  const t = useT();
  const sz = size === "lg" ? "text-lg" : size === "md" ? "text-sm" : "text-[11px]";
  return (
    <span className={`inline-flex gap-0.5 tabular-nums ${sz}`} aria-label={t("product.stars.outOf5", `${n} out of 5`).replace("{n}", String(n))}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? "text-gold" : "text-ink/15"}>★</span>
      ))}
    </span>
  );
}

/** Full-width trust ribbon: rating · count · countries · verified. Use once per page. */
export function TrustBar({ variant = "paper" }: { variant?: "paper" | "forest" | "ivory" }) {
  const t = useT();
  const bg = variant === "forest" ? "bg-forest text-paper" : variant === "ivory" ? "bg-ivory" : "bg-paper";
  const border = variant === "forest" ? "border-paper/15" : "border-ink/10";
  const muted = variant === "forest" ? "text-paper/70" : "text-muted-foreground";
  return (
    <section className={`border-y ${border} ${bg}`}>
      <div className="container-editorial py-6 md:py-7 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-current/10">
        <div className="px-4 md:px-6 py-3 md:py-0 flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl md:text-3xl leading-none">{stats.rating}</span>
            <Stars n={5} size="md" />
          </div>
          <div className={`text-[10px] md:text-[11px] uppercase tracking-[0.18em] mt-1.5 ${muted}`}>
            {stats.count.toLocaleString()} {t("product.trustbar.verifiedRatings", "verified ratings")}
          </div>
        </div>
        <div className="px-4 md:px-6 py-3 md:py-0 flex flex-col justify-center">
          <div className="font-serif text-2xl md:text-3xl leading-none">{stats.customers}</div>
          <div className={`text-[10px] md:text-[11px] uppercase tracking-[0.18em] mt-1.5 ${muted}`}>{t("product.trustbar.customersWorldwide", "Customers worldwide")}</div>
        </div>
        <div className="px-4 md:px-6 py-3 md:py-0 flex flex-col justify-center">
          <div className="font-serif text-2xl md:text-3xl leading-none">{stats.countries}+</div>
          <div className={`text-[10px] md:text-[11px] uppercase tracking-[0.18em] mt-1.5 ${muted}`}>{t("product.trustbar.countriesShipped", "Countries shipped")}</div>
        </div>
        <div className="px-4 md:px-6 py-3 md:py-0 flex flex-col justify-center">
          <div className="font-serif text-2xl md:text-3xl leading-none">{stats.verified}%</div>
          <div className={`text-[10px] md:text-[11px] uppercase tracking-[0.18em] mt-1.5 ${muted}`}>{t("product.trustbar.scratchVerified", "Scratch-verified")}</div>
        </div>
      </div>
    </section>
  );
}

/** Compact one-line trust microbar for footer / cart / checkout headers. */
export function TrustMicroBar() {
  const t = useT();
  return (
    <Link
      to="/reviews"
      className="block bg-forest text-paper hover:bg-moss transition-colors"
    >
      <div className="container-editorial py-2.5 flex items-center justify-center gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-semibold">
        <Stars n={5} size="sm" />
        <span>{stats.rating} / 5</span>
        <span className="opacity-50">·</span>
        <span className="tabular-nums">{stats.count.toLocaleString()} {t("product.trustbar.verifiedRatings", "verified ratings")}</span>
        <span className="opacity-50 hidden sm:inline">·</span>
        <span className="hidden sm:inline">{stats.countries}+ {t("product.trustbar.countries", "countries")}</span>
      </div>
    </Link>
  );
}

/** Selects up to N reviews with images for a given product (default Neo Hair Lotion). */
export function getFeaturedReviews(product: Review["product"] = "Neo Hair Lotion", n = 3) {
  return reviews.filter((r) => r.product === product && r.image).slice(0, n);
}

/** Selects a broader set (any product with image) for carousels. */
function getCarouselReviews(n = 8) {
  return reviews.filter((r) => r.image).slice(0, n);
}

/** Card-carousel testimonial strip. Snap scroll on mobile, prev/next + dots on desktop. */
export function ReviewStrip({
  title,
  product,
  bg = "bg-paper",
}: {
  title?: string;
  product?: Review["product"];
  bg?: string;
}) {
  const t = useT();
  const resolvedTitle = title ?? t("product.reviewStrip.title", "Verified results, worldwide.");
  const picks = product ? getFeaturedReviews(product, 8) : getCarouselReviews(8);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.children[i] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  // Track which card is centered
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((c, i) => {
        const child = c as HTMLElement;
        const mid = child.offsetLeft - el.offsetLeft + child.offsetWidth / 2;
        const d = Math.abs(mid - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setActive(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const next = (active + 1) % picks.length;
      scrollTo(next);
    }, 5000);
    return () => clearInterval(id);
  }, [active, paused, picks.length]);

  return (
    <section className={`${bg} border-t border-ink/10`}>
      <div className="container-editorial py-14 md:py-24">
        <div className="flex items-end justify-between gap-6 mb-8 md:mb-12">
          <div className="min-w-0">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-ink leading-[1.05] text-balance">{resolvedTitle}</h2>
          </div>
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              type="button"
              aria-label={t("product.reviewStrip.prev", "Previous review")}
              onClick={() => scrollTo((active - 1 + picks.length) % picks.length)}
              className="size-10 border border-ink/20 flex items-center justify-center hover:bg-forest hover:text-paper transition-colors"
            >‹</button>
            <button
              type="button"
              aria-label={t("product.reviewStrip.next", "Next review")}
              onClick={() => scrollTo((active + 1) % picks.length)}
              className="size-10 border border-ink/20 flex items-center justify-center hover:bg-forest hover:text-paper transition-colors"
            >›</button>
          </div>
        </div>

        <div
          ref={trackRef}
          onPointerDown={() => setPaused(true)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-[3px] px-[3px] md:mx-0 md:px-0 pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {picks.map((r) => (
            <figure
              key={r.name + r.title}
              className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-[calc((100%-3rem)/3)] bg-white border border-ink/10 p-5 md:p-7 flex flex-col"
            >
              {r.image && (
                <div className="aspect-[4/3] bg-ivory overflow-hidden mb-4 border border-ink/10">
                  <img src={r.image} alt={t("product.reviewStrip.resultPhotoAlt", "Result photo shared by {name}").replace("{name}", r.name)} loading="lazy" className="w-full h-full object-cover" />
                </div>
              )}
              <Stars n={r.rating} size="sm" />
              <div className="font-serif text-lg text-ink mt-3 leading-snug">{t(`review.${reviews.indexOf(r)}.title`, r.title)}</div>
              <blockquote className="text-sm text-ink/80 mt-2 leading-relaxed flex-1">“{t(`review.${reviews.indexOf(r)}.body`, r.body)}”</blockquote>
              <figcaption className="mt-5 pt-4 border-t border-ink/10 flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                <span className="font-semibold text-ink truncate">{t(`review.person.${r.name}`, r.name)}</span>
                <span className="shrink-0 text-right">{r.country ? t(`review.country.${r.country}`, r.country) : t("product.reviewStrip.verified", "Verified")}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {picks.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={t("product.reviewStrip.goTo", "Go to review {n}").replace("{n}", String(i + 1))}
              onClick={() => scrollTo(i)}
              className={`h-1.5 transition-all ${i === active ? "w-6 bg-forest" : "w-1.5 bg-ink/25 hover:bg-ink/50"}`}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link to="/reviews" className="text-[11px] uppercase tracking-[0.2em] font-semibold border-b border-forest text-forest pb-1 hover:opacity-70">
            {t("product.reviewStrip.readAll", "Read all {n} reviews").replace("{n}", stats.count.toLocaleString())}
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Single pull-quote for tight surfaces (checkout sidebar, hair-science, verify). */
export function CustomerQuote({ product = "Neo Hair Lotion", compact = false }: { product?: Review["product"]; compact?: boolean }) {
  const t = useT();
  const r = getFeaturedReviews(product, 1)[0] ?? reviews[0];
  return (
    <figure className={`border border-ink/10 bg-ivory ${compact ? "p-4" : "p-5 md:p-6"}`}>
      <div className="flex items-center gap-2">
        <Stars n={r.rating} size="sm" />
        <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-forest">{t("product.quote.verifiedBuyer", "Verified buyer")}</span>
      </div>
      <blockquote className={`${compact ? "text-[13px]" : "text-sm"} text-ink/85 mt-2 leading-relaxed`}>
        “{t(`review.${reviews.indexOf(r)}.body`, r.body)}”
      </blockquote>
      <figcaption className="mt-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        <span className="font-semibold text-ink">{t(`review.person.${r.name}`, r.name)}</span>
        {r.country && <> · {t(`review.country.${r.country}`, r.country)}</>}
      </figcaption>
    </figure>
  );
}

/** Inline rating chip — for PDP titles, sticky bars, cards. */
export function RatingChip({ slug, className = "" }: { slug: string; className?: string }) {
  const s = productStats.find((p) => p.slug === slug);
  if (!s) return null;
  return (
    <Link to="/reviews" className={`inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-forest ${className}`}>
      <Stars n={Math.round(s.rating)} size="sm" />
      <span className="font-semibold text-ink tabular-nums">{s.rating.toFixed(1)}</span>
      <span className="tabular-nums">({s.count.toLocaleString()})</span>
    </Link>
  );
}

/** Cart-page trust banner encouraging checkout completion. */
export function CartTrustBanner() {
  const t = useT();
  return (
    <div className="border border-ink/10 bg-forest text-paper p-4 md:p-5 flex items-center gap-4">
      <div className="flex-1">
        <div className="text-[11px] uppercase tracking-[0.18em] text-paper/70 mb-1">{t("product.cartBanner.join", "Join {n} verified customers").replace("{n}", String(stats.customers))}</div>
        <div className="text-sm md:text-base font-serif">
          {t("product.cartBanner.ratedPrefix", "Rated")} <span className="text-gold">{stats.rating} / 5</span> {t("product.cartBanner.ratedSuffix", "across {count} ratings in {countries}+ countries.").replace("{count}", stats.count.toLocaleString()).replace("{countries}", String(stats.countries))}
        </div>
      </div>
      <Link to="/reviews" className="hidden md:inline-block text-[10px] uppercase tracking-[0.2em] font-semibold border border-paper/40 px-3 py-2 hover:bg-paper hover:text-forest transition-colors">
        {t("product.cartBanner.reviews", "Reviews")}
      </Link>
    </div>
  );
}
