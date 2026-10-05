/**
 * Purpose: Mobile/tablet campaign banner rotator for the homepage hero.
 * Users: Phone and tablet visitors landing on "/".
 * Key actions: auto-rotate four portrait campaign banners, jump between slides, click through to product/shop.
 * Integration points: public/images/hero-mobile-*.webp (build-time optimized), i18n useT for labels.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

type Slide = {
  id: number;
  alt: string;
  altKey: string;
  to: string;
  params?: { slug: string };
  ctaKey: string;
  ctaDefault: string;
  labelKey: string;
  labelDefault: string;
};

const SLIDES: Slide[] = [
  {
    id: 1,
    altKey: "home.mbanner.1.alt",
    alt: "Neo Hair Lotion 120 ml with five active botanicals in laboratory test tubes — blocks DHT to promote new hair growth",
    to: "/product/$slug",
    params: { slug: "neo-hair-lotion" },
    ctaKey: "home.mbanner.1.cta",
    ctaDefault: "Shop Neo Hair Lotion",
    labelKey: "home.mbanner.1.label",
    labelDefault: "Neo Hair Lotion",
  },
  {
    id: 2,
    altKey: "home.mbanner.2.alt",
    alt: "Neo Hair Shampoo 250 ml with botanical oil pouring over an open hand — scalp care, root nourishment and hair regrowth",
    to: "/product/$slug",
    params: { slug: "neo-hair-shampoo" },
    ctaKey: "home.mbanner.2.cta",
    ctaDefault: "Shop Neo Hair Shampoo",
    labelKey: "home.mbanner.2.label",
    labelDefault: "Neo Hair Shampoo",
  },
  {
    id: 3,
    altKey: "home.mbanner.3.alt",
    alt: "Complete Green Wealth hair regrowth routine — Neo Hair Shampoo, Ghori derma roller and Neo Hair Lotion in a three-step ritual",
    to: "/shop",
    ctaKey: "home.mbanner.3.cta",
    ctaDefault: "Shop the complete routine",
    labelKey: "home.mbanner.3.label",
    labelDefault: "Complete routine",
  },
  {
    id: 4,
    altKey: "home.mbanner.4.alt",
    alt: "Before and after hair regrowth results from 500,000+ Green Wealth customers — 97% saw new hair growth in about three months",
    to: "/reviews",
    ctaKey: "home.mbanner.4.cta",
    ctaDefault: "See verified results",
    labelKey: "home.mbanner.4.label",
    labelDefault: "Real results",
  },
];
const SLIDE_DURATION = 6500;

export function MobileBannerHero() {
  const t = useT();
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0);
  // Only decode slides that have actually been shown, so the first (LCP) banner
  // gets the full bandwidth instead of competing with three hidden banners.
  const [mounted, setMounted] = useState<number[]>([0]);
  const current = SLIDES[active];
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => window.clearInterval(id);
  }, [tick]);

  useEffect(() => {
    setMounted((m) => (m.includes(active) ? m : [...m, active]));
  }, [active]);

  const go = (dir: 1 | -1) => {
    setActive((i) => (i + dir + SLIDES.length) % SLIDES.length);
    setTick((n) => n + 1);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const p = e.touches[0];
    touch.current = { x: p.clientX, y: p.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const p = e.changedTouches[0];
    const dx = p.clientX - start.x;
    const dy = p.clientY - start.y;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  };

  return (
    <section
      className="relative lg:hidden bg-forest border-b border-brass/40"
      aria-label={t("home.banner.region", "Green Wealth campaign banners")}
    >
      <div
        className="relative w-full overflow-hidden aspect-[5/8] touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {SLIDES.map((s, i) => {
          const isActive = i === active;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
                isActive ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              {mounted.includes(i) && (
                <img
                  src={`/images/hero-mobile-${s.id}-1200.webp`}
                  srcSet={`/images/hero-mobile-${s.id}-800.webp 800w, /images/hero-mobile-${s.id}-1200.webp 1200w`}
                  sizes="100vw"
                  alt={t(s.altKey, s.alt)}
                  title={t(s.labelKey, s.labelDefault)}
                  width={1200}
                  height={1920}
                  loading="lazy"
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "low"}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              )}
            </div>
          );
        })}
      </div>


      {/* Slide selector — typographic rules, no icons; sits below the artwork so nothing overlaps it */}
      <div className="flex items-center justify-center gap-3 bg-paper px-4 py-4">
        {SLIDES.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActive(i);
                setTick((n) => n + 1);
              }}
              aria-current={isActive}
              aria-label={t(s.labelKey, s.labelDefault)}
              className="flex-1"
            >
              <span className="relative block h-px w-full overflow-hidden bg-forest/30" aria-hidden="true">
                {isActive && (
                  <span
                    key={`fill-${active}`}
                    className="absolute inset-y-0 left-0 w-full bg-forest"
                    style={{
                      animation: `progress-fill ${SLIDE_DURATION}ms linear`,
                      willChange: "transform",
                    }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>


      {/* CTA for the active slide — sits below the artwork so banner copy stays legible */}
      <div className="px-5 py-5">
        {current.params ? (
          <Link
            to={current.to}
            params={current.params}
            className="block w-full bg-brass text-forest text-center px-6 py-4 font-bold uppercase text-[10px] tracking-[0.22em]"
          >
            {t(current.ctaKey, current.ctaDefault)}
          </Link>
        ) : (
          <Link
            to={current.to}
            className="block w-full bg-brass text-forest text-center px-6 py-4 font-bold uppercase text-[10px] tracking-[0.22em]"
          >
            {t(current.ctaKey, current.ctaDefault)}
          </Link>
        )}
      </div>
    </section>
  );

}
