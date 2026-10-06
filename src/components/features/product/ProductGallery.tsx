/**
 * PDP gallery: desktop cross-fade stage with thumb rail, mobile snap scroller
 * with dots and thumbs. Auto-advances every 4s (pauses on hover/interaction).
 * Images arrive pre-resolved from the server (`islandImage()`); `children` is
 * the server-rendered rating summary shown under the desktop stage.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { GALLERY_FIGURE_EVENT } from "./store";

export type GalleryImage = {
  src: string;
  srcSet?: string;
  width?: number;
  height?: number;
  alt: string;
};

type Props = {
  images: GalleryImage[];
  brand: string;
  name: string;
  labels: { authentic: string; botanicalTech: string; viewImage: string };
  children?: ReactNode;
};

function Img({
  image,
  sizes,
  priority = false,
  className,
  draggable,
}: {
  image: GalleryImage;
  sizes: string;
  priority?: boolean;
  className: string;
  draggable?: boolean;
}) {
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      title={image.alt || undefined}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "low"}
      draggable={draggable}
      className={className}
    />
  );
}

export default function ProductGallery({ images, brand, name, labels, children }: Props) {
  const [activeImg, setActiveImg] = useState(0);
  // Only mount desktop slides that have been viewed, so first paint downloads one frame.
  const [mountedImgs, setMountedImgs] = useState<number[]>([0]);
  const [isPaused, setIsPaused] = useState(false);
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null);
  // Distinguish programmatic scrolls (auto-slide, thumb taps) from user swipes.
  const programmaticUntil = useRef(0);
  const resumeTimer = useRef<number | null>(null);
  const total = images.length;

  useEffect(() => {
    setMountedImgs((prev) => (prev.includes(activeImg) ? prev : [...prev, activeImg]));
  }, [activeImg]);

  const pauseAutoSlide = useCallback((ms = 9000) => {
    setIsPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setIsPaused(false), ms);
  }, []);

  useEffect(
    () => () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const id = window.setInterval(() => setActiveImg((i) => (i + 1) % total), 4000);
    return () => window.clearInterval(id);
  }, [total, isPaused]);

  // "View hero figure" and similar triggers elsewhere on the page.
  useEffect(() => {
    const onFigure = (e: Event) => {
      const i = Number((e as CustomEvent<number>).detail ?? 0);
      if (Number.isFinite(i)) setActiveImg(Math.min(Math.max(0, i), total - 1));
    };
    window.addEventListener(GALLERY_FIGURE_EVENT, onFigure);
    return () => window.removeEventListener(GALLERY_FIGURE_EVENT, onFigure);
  }, [total]);

  const scrollMobileTo = (i: number) => {
    const el = mobileScrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const sign = getComputedStyle(el).direction === "rtl" ? -1 : 1;
    programmaticUntil.current = Date.now() + 900;
    el.scrollTo({ left: sign * i * el.clientWidth, behavior: "smooth" });
  };

  // Keep the mobile scroller in sync with auto-advance.
  useEffect(() => {
    const el = mobileScrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    if (Math.abs(Math.abs(el.scrollLeft) - activeImg * el.clientWidth) < 4) return;
    const sign = getComputedStyle(el).direction === "rtl" ? -1 : 1;
    programmaticUntil.current = Date.now() + 900;
    el.scrollTo({ left: sign * activeImg * el.clientWidth, behavior: "smooth" });
  }, [activeImg]);

  const handleMobileScroll = () => {
    if (Date.now() < programmaticUntil.current) return;
    const el = mobileScrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const idx = Math.min(
      total - 1,
      Math.max(0, Math.round(Math.abs(el.scrollLeft) / el.clientWidth)),
    );
    if (idx !== activeImg) setActiveImg(idx);
  };

  const scrollToImage = (i: number) => {
    pauseAutoSlide();
    setActiveImg(i);
    scrollMobileTo(i);
  };

  const viewLabel = (i: number) => `${labels.viewImage} ${i + 1}`;

  return (
    <>
      {/* Desktop gallery */}
      <div
        className="hidden h-full flex-col lg:flex"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-6 xl:px-8 xl:py-8"
          style={{ minHeight: "clamp(300px, calc(100dvh - 420px), 520px)" }}
        >
          <div className="pointer-events-none absolute inset-x-4 top-3 flex items-start justify-between">
            <div className="flex max-w-[75%] flex-col leading-none">
              <span className="font-mono font-serif text-[10px] tracking-[0.32em] text-forest/50 uppercase">
                {brand}
              </span>
              <span className="mt-1.5 font-serif text-[13px] leading-[1.25] font-medium tracking-[-0.01em] text-forest sm:text-[14px] xl:text-[15px]">
                {name}
              </span>
            </div>
            <span className="bg-forest px-2 py-0.5 font-mono text-[9px] tracking-[0.24em] text-paper uppercase">
              {labels.authentic}
            </span>
          </div>

          <div className="relative z-10 flex h-full w-full items-center justify-center">
            {images.map((img, i) =>
              mountedImgs.includes(i) ? (
                <div
                  key={`${img.src}-${i}`}
                  className={`absolute inset-0 m-auto flex items-center justify-center transition-opacity duration-700 ease-out ${i === activeImg ? "opacity-100" : "opacity-0"}`}
                >
                  <Img
                    image={img}
                    priority={i === 0}
                    sizes="(min-width: 1280px) 620px, (min-width: 1024px) 46vw, 100vw"
                    className="h-auto max-h-full w-auto max-w-full object-contain"
                  />
                </div>
              ) : null,
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-end justify-end">
            <span className="font-mono text-[10px] tracking-[0.28em] text-forest/30 uppercase">
              {labels.botanicalTech}
            </span>
          </div>
        </div>

        {total > 1 && (
          <div className="border-t hairline">
            <div className="flex -space-x-px">
              {images.slice(0, 6).map((img, i) => (
                <button
                  key={`${img.src}-${i}`}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  aria-label={viewLabel(i)}
                  className={`relative h-12 w-12 shrink-0 border hairline transition-opacity sm:h-14 sm:w-14 ${i === activeImg ? "z-10 border-forest opacity-100" : "opacity-60 hover:opacity-90"}`}
                >
                  <Img
                    image={img}
                    sizes="56px"
                    className="h-full w-full bg-white object-contain p-1"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {children}
      </div>

      {/* Mobile gallery */}
      <div className="w-full bg-white lg:hidden">
        <div className="relative w-full">
          <div
            ref={mobileScrollerRef}
            onScroll={handleMobileScroll}
            onTouchStart={() => pauseAutoSlide()}
            onPointerDown={() => pauseAutoSlide()}
            className="scrollbar-hide flex aspect-square w-full snap-x snap-mandatory overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {images.map((img, i) => (
              <div
                key={`${img.src}-${i}`}
                className="flex h-full w-full shrink-0 snap-start items-center justify-center"
              >
                <Img
                  image={img}
                  priority={i === 0}
                  sizes="100vw"
                  draggable={false}
                  className="h-full w-full object-contain p-6 select-none"
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between font-mono text-[9px] tracking-[0.24em] text-forest/70 uppercase">
            <span>{brand}</span>
            <span className="bg-forest px-2 py-1 text-paper">{labels.authentic}</span>
          </div>
          <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((img, i) => (
              <span
                key={`${img.src}-${i}`}
                className={`h-1 transition-all ${i === activeImg ? "w-6 bg-forest" : "w-1.5 bg-forest/30"}`}
              />
            ))}
          </div>
        </div>
        {total > 1 && (
          <div className="flex w-full -space-x-px border-t hairline">
            {images.map((img, i) => (
              <button
                key={`${img.src}-${i}`}
                type="button"
                onClick={() => scrollToImage(i)}
                aria-label={viewLabel(i)}
                aria-current={i === activeImg ? "true" : undefined}
                className={`aspect-square min-w-0 flex-1 bg-white transition-colors ${i === activeImg ? "z-10 ring-1 ring-forest ring-inset" : ""}`}
              >
                <Img image={img} sizes="80px" className="h-full w-full object-contain p-0.5" />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
