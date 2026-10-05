/**
 * Purpose: Desktop-only cinematic banner hero for the homepage.
 * Users: Desktop visitors landing on "/".
 * Key actions: auto-rotate three campaign banners, jump between slides, click through to product/shop.
 * Integration points: public/images/hero-desktop-*.webp (build-time optimized), i18n useT for labels.
 */
import { useEffect, useState } from "react";
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
    altKey: "home.banner.1.alt",
    alt: "Neo Hair Lotion 120 ml scalp spray with botanical extracts in laboratory glassware — five active botanicals that help block DHT",
    to: "/product/$slug",
    params: { slug: "neo-hair-lotion" },
    ctaKey: "home.banner.1.cta",
    ctaDefault: "Shop Neo Hair Lotion",
    labelKey: "home.banner.1.label",
    labelDefault: "Neo Hair Lotion",
  },
  {
    id: 2,
    altKey: "home.banner.2.alt",
    alt: "Neo Hair Shampoo 250 ml bottle held in a hand with botanical oil pouring over it — scalp care, root nourishment and hair regrowth",
    to: "/product/$slug",
    params: { slug: "neo-hair-shampoo" },
    ctaKey: "home.banner.2.cta",
    ctaDefault: "Shop Neo Hair Shampoo",
    labelKey: "home.banner.2.label",
    labelDefault: "Neo Hair Shampoo",
  },
  {
    id: 3,
    altKey: "home.banner.3.alt",
    alt: "Complete Green Wealth hair regrowth routine — Neo Hair Shampoo, Ghori derma roller and Neo Hair Lotion in a three-step ritual",
    to: "/shop",
    ctaKey: "home.banner.3.cta",
    ctaDefault: "Shop the complete routine",
    labelKey: "home.banner.3.label",
    labelDefault: "Complete routine",
  },
  {
    id: 4,
    altKey: "home.banner.4.alt",
    alt: "Before and after hair regrowth results grid from 500,000+ Green Wealth customers — 97% saw new hair growth in about three months",
    to: "/reviews",
    ctaKey: "home.banner.4.cta",
    ctaDefault: "See verified results",
    labelKey: "home.banner.4.label",
    labelDefault: "Real results",
  },
];

const SLIDE_DURATION = 6500;

export function DesktopBannerHero() {
  const t = useT();
  const [active, setActive] = useState(0);
  // Only decode slides that have actually been shown — hidden slides otherwise
  // download in parallel with the LCP image and starve it of bandwidth.
  const [mounted, setMounted] = useState<number[]>([0]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setMounted((m) => (m.includes(active) ? m : [...m, active]));
  }, [active]);

  const current = SLIDES[active];

  return (
    <section
      className="relative hidden lg:block bg-forest border-b border-brass/40"
      aria-label={t("home.banner.region", "Green Wealth campaign banners")}
    >
      {/* Full artwork: preserve the complete native ratio, even when it extends below the viewport */}
      <div className="relative w-full aspect-[2400/1340] overflow-hidden">

        {SLIDES.map((s, i) => {
          const isActive = i === active;
          const alt = t(s.altKey, s.alt);
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
                  src={`/images/hero-desktop-${s.id}-2400.webp`}
                  srcSet={`/images/hero-desktop-${s.id}-1600.webp 1600w, /images/hero-desktop-${s.id}-2400.webp 2400w`}
                  sizes="100vw"
                  alt={alt}
                  title={t(s.labelKey, s.labelDefault)}
                  width={2400}
                  height={1340}
                  loading="lazy"
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "low"}
                  className="absolute inset-0 h-full w-full object-contain object-center"
                />
              )}
            </div>
          );
        })}
      </div>


      {/* CTA + slide selector below the artwork — no overlay, no cropping */}
      <div className="flex items-center justify-between gap-8 border-t border-brass/30 px-8 py-5 xl:px-12">
        {current.params ? (
          <Link
            to={current.to}
            params={current.params}
            className="bg-brass text-forest px-10 py-4 font-bold uppercase text-[11px] tracking-[0.22em] border border-brass hover:bg-transparent hover:text-brass transition-colors"
          >
            {t(current.ctaKey, current.ctaDefault)}
          </Link>
        ) : (
          <Link
            to={current.to}
            className="bg-brass text-forest px-10 py-4 font-bold uppercase text-[11px] tracking-[0.22em] border border-brass hover:bg-transparent hover:text-brass transition-colors"
          >
            {t(current.ctaKey, current.ctaDefault)}
          </Link>
        )}

        <div className="flex items-center gap-6">
          {SLIDES.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(i)}
                aria-current={isActive}
                className="group flex items-center gap-3"
              >
                <span
                  className="relative block h-px w-14 overflow-hidden bg-brass/30"
                  aria-hidden="true"
                >
                  {isActive && (
                    <span
                      key={`fill-${active}`}
                      className="absolute inset-y-0 left-0 w-full bg-brass"
                      style={{
                        animation: `progress-fill ${SLIDE_DURATION}ms linear`,
                        willChange: "transform",
                      }}
                    />
                  )}
                </span>
                <span
                  className={`text-[9px] uppercase tracking-[0.24em] transition-colors ${
                    isActive
                      ? "text-brass"
                      : "text-brass/50 group-hover:text-brass/80"
                  }`}
                >
                  {t(s.labelKey, s.labelDefault)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );

}
