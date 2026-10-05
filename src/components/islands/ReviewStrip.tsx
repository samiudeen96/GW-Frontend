/** Snap-scroll review carousel: prev/next, dots and auto-advance (pauses on interaction). */
import { useCallback, useEffect, useRef, useState } from "react";

export type StripReview = {
  id: string;
  rating: number;
  image?: string;
  imageAlt: string;
  title: string;
  body: string;
  name: string;
  place: string;
};

type Props = {
  title: string;
  reviews: StripReview[];
  labels: { starsOutOf5: string; prev: string; next: string; goTo: string };
};

function Stars({ n, label }: { n: number; label: string }) {
  return (
    <span
      className="inline-flex gap-0.5 text-[11px] tabular-nums"
      aria-label={label.replace("{n}", String(n))}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? "text-gold" : "text-ink/15"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewStrip({ title, reviews, labels }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollTo = useCallback((i: number) => {
    const el = trackRef.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

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
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused || reviews.length < 2) return;
    const id = setInterval(() => scrollTo((active + 1) % reviews.length), 5000);
    return () => clearInterval(id);
  }, [active, paused, reviews.length, scrollTo]);

  const navBtn =
    "size-10 border border-ink/20 flex items-center justify-center hover:bg-forest hover:text-paper transition-colors";

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-6 md:mb-12">
        <h2 className="min-w-0 font-serif text-2xl leading-[1.05] text-balance text-ink sm:text-3xl md:text-5xl">
          {title}
        </h2>
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <button
            type="button"
            aria-label={labels.prev}
            onClick={() => scrollTo((active - 1 + reviews.length) % reviews.length)}
            className={navBtn}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label={labels.next}
            onClick={() => scrollTo((active + 1) % reviews.length)}
            className={navBtn}
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onPointerDown={() => setPaused(true)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="scrollbar-hide -mx-[3px] flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[3px] pb-2 md:mx-0 md:gap-6 md:px-0"
      >
        {reviews.map((r) => (
          <figure
            key={r.id}
            className="flex w-[85%] shrink-0 snap-center flex-col border border-ink/10 bg-white p-5 sm:w-[60%] md:w-[calc((100%-3rem)/3)] md:p-7"
          >
            {r.image && (
              <div className="mb-4 aspect-[4/3] overflow-hidden border border-ink/10 bg-ivory">
                <img
                  src={r.image}
                  alt={r.imageAlt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <Stars n={r.rating} label={labels.starsOutOf5} />
            <div className="mt-3 font-serif text-lg leading-snug text-ink">{r.title}</div>
            <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-ink/80">
              “{r.body}”
            </blockquote>
            <figcaption className="mt-5 flex items-center justify-between gap-2 border-t border-ink/10 pt-4 text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
              <span className="truncate font-semibold text-ink">{r.name}</span>
              <span className="shrink-0 text-end">{r.place}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {reviews.map((r, i) => (
          <button
            key={r.id}
            type="button"
            aria-label={labels.goTo.replace("{n}", String(i + 1))}
            onClick={() => scrollTo(i)}
            className={`h-1.5 transition-all ${i === active ? "w-6 bg-forest" : "w-1.5 bg-ink/25 hover:bg-ink/50"}`}
          />
        ))}
      </div>
    </>
  );
}
