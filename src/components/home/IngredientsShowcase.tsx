import React, { useState, useEffect, useRef } from "react";
import { ProductImage } from "@/components/site/ProductImage";
import ginsengImg from "@/assets/ingredients/ginseng.jpg";
import sawPalmettoImg from "@/assets/ingredients/saw-palmetto.jpg";
import horsetailImg from "@/assets/ingredients/horsetail.jpg";
import cantaloupeImg from "@/assets/ingredients/cantaloupe.jpg";
import falseDaisyImg from "@/assets/ingredients/false-daisy.jpg";

interface Ingredient {
  id: string;
  name: string;
  image: string;
  alt: string;
  shortCaption: string;
  fullDetails: string;
  benefits: string[];
  footnote?: string;
}

const INGREDIENTS: Ingredient[] = [
  {
    id: "ginseng",
    name: "Ginseng",
    image: ginsengImg,
    alt: "Fresh Panax ginseng root — botanical active that boosts scalp micro-circulation in Neo Hair Lotion",
    shortCaption:
      "Stimulates scalp micro-circulation and activates VEGF for stronger follicle nourishment.",
    fullDetails:
      "A revered adaptogenic root used for centuries in traditional medicine. Ginsenosides increase blood flow to the scalp, deliver oxygen and nutrients to dormant follicles, and upregulate VEGF — the growth factor that signals follicles to enter the active growth (anagen) phase.",
    benefits: ["Boosts scalp micro-circulation", "Activates VEGF growth signaling", "Reawakens dormant follicles"],
    footnote: "1",
  },
  {
    id: "saw-palmetto",
    name: "Saw Palmetto",
    image: sawPalmettoImg,
    alt: "Saw palmetto (Serenoa repens) berries — DHT-blocking botanical active in Neo Hair Lotion",
    shortCaption:
      "Inhibits 5-alpha-reductase Type II to help block DHT, the hormone behind pattern hair loss.",
    fullDetails:
      "Extracted from the berries of the Serenoa repens palm. Its fatty acids and phytosterols naturally inhibit the 5-alpha-reductase enzyme, lowering scalp DHT levels.",
    benefits: ["Blocks DHT at the follicle", "Slows hormonal hair thinning", "Supports follicle vitality"],
    footnote: "2",
  },
  {
    id: "horsetail",
    name: "Horsetail",
    image: horsetailImg,
    alt: "Horsetail (Equisetum arvense) plant — silica-rich botanical that strengthens the hair shaft",
    shortCaption:
      "Rich in silica to support collagen synthesis and reinforce strand structural integrity.",
    fullDetails:
      "One of the richest natural sources of bioavailable silica. Silica is essential for collagen and keratin synthesis — the proteins that build the hair shaft.",
    benefits: ["Boosts keratin & collagen", "Strengthens the hair shaft", "Reduces breakage and split ends"],
    footnote: "3",
  },
  {
    id: "cantaloupe",
    name: "Cantaloupe",
    image: cantaloupeImg,
    alt: "Sliced cantaloupe melon — source of SOD antioxidants and vitamin A that protect hair follicles",
    shortCaption:
      "Delivers Vitamin A and SOD antioxidants to protect follicles and promote healthy growth.",
    fullDetails:
      "A natural source of Superoxide Dismutase (SOD). Combined with vitamin A, beta-carotene and selenium, it neutralizes oxidative stress — the silent driver of premature follicle aging.",
    benefits: ["Neutralizes oxidative stress", "Protects follicle DNA", "Promotes balanced sebum production"],
    footnote: "4",
  },
  {
    id: "false-daisy",
    name: "False Daisy",
    image: falseDaisyImg,
    alt: "False daisy (Eclipta alba / Bhringraj) plant — Ayurvedic botanical that strengthens hair roots",
    shortCaption:
      "Strengthens roots and supports natural pigmentation for thicker, darker, resilient hair.",
    fullDetails:
      "Known in Ayurveda as Bhringraj — the king of herbs for hair. Eclipta alba activates dermal papilla cells and extends the anagen growth phase.",
    benefits: ["Extends the growth phase", "Supports natural pigmentation", "Soothes scalp inflammation"],
    footnote: "5",
  },
];

const accentGreen = "#66bb6a";
const ROTATE_MS = 5000;

export default function IngredientsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const elapsedRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const active = INGREDIENTS[activeIndex];

  useEffect(() => {
    if (isPaused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastFrameRef.current = null;
      return;
    }
    const tick = (now: number) => {
      if (lastFrameRef.current === null) lastFrameRef.current = now;
      const delta = now - lastFrameRef.current;
      lastFrameRef.current = now;
      elapsedRef.current = Math.min(elapsedRef.current + delta, ROTATE_MS);
      setProgress((elapsedRef.current / ROTATE_MS) * 100);
      if (elapsedRef.current >= ROTATE_MS) {
        elapsedRef.current = 0;
        lastFrameRef.current = now;
        setProgress(0);
        setActiveIndex((i) => (i + 1) % INGREDIENTS.length);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastFrameRef.current = null;
    };
  }, [isPaused]);

  const handleSelect = (idx: number) => {
    setActiveIndex(idx);
    elapsedRef.current = 0;
    if (typeof performance !== "undefined") lastFrameRef.current = performance.now();
    setProgress(0);
  };

  return (
    <section
      aria-label="Key botanical ingredients"
      className="w-full"
      style={{ backgroundColor: "#0d1f17" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="px-6 sm:px-10 lg:px-16 pt-10 lg:pt-16">
        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] mb-4 text-center lg:text-left" style={{ color: accentGreen }}>
          Inside Every Drop
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white uppercase mb-8 lg:mb-10 text-center lg:text-left" style={{ letterSpacing: "0.04em", lineHeight: 1 }}>
          Five Botanicals. <span style={{ color: accentGreen }}>One Formula.</span>
        </h2>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-0 lg:items-stretch px-6 sm:px-10 lg:px-16 pb-10 lg:pb-16">
        <div className="order-1 lg:order-none lg:col-start-1 lg:row-start-1 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-2.5 mb-6 lg:mb-8 lg:pr-10" role="tablist" aria-label="Select ingredient">
          {INGREDIENTS.map((ing, idx) => {
            const isActive = idx === activeIndex;
            const fillPct = isActive ? progress : 0;
            return (
              <button
                key={ing.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelect(idx)}
                className={`group relative w-full sm:w-auto overflow-hidden text-left transition-all duration-300 border ${isActive ? "border-white/30 bg-white/5" : "border-white/10 bg-white/[0.02] hover:bg-white/5"}`}
              >
                <span aria-hidden className="absolute inset-y-0 left-0 pointer-events-none" style={{ width: `${fillPct}%`, backgroundColor: accentGreen, opacity: 0.22 }} />
                <span className="relative flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1">
                  <span className={`hidden sm:inline-flex items-center justify-center h-6 w-6 rounded-full overflow-hidden shrink-0 ${isActive ? "ring-2 ring-white" : "ring-1 ring-white/20"}`} aria-hidden>
                    <ProductImage src={ing.image} alt="" title={ing.name} sizes="120px" className="w-full h-full object-cover" />
                  </span>
                  <span className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] sm:tracking-[0.14em] whitespace-nowrap ${isActive ? "text-white" : "text-white/70"}`}>
                    {ing.name}
                  </span>
                </span>
                <span aria-hidden className="absolute bottom-0 left-0 h-[2px] pointer-events-none" style={{ width: `${fillPct}%`, backgroundColor: accentGreen }} />
              </button>
            );
          })}
        </div>

        <div className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 relative min-h-[320px] sm:min-h-[420px] lg:min-h-[560px] overflow-hidden bg-black mb-6 lg:mb-0">
          {INGREDIENTS.map((ing, idx) => (
            <ProductImage
              key={ing.id}
              src={ing.image}
              alt={ing.alt}
              title={`${ing.name} — botanical active in Neo Hair Lotion`}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${idx === activeIndex ? "opacity-100" : "opacity-0"}`}
            />

          ))}
        </div>

        <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:pr-10 border-t border-white/10 pt-6 lg:pt-8" key={active.id}>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: accentGreen }}>
            {active.name}
            {active.footnote && <sup className="ml-1 text-white/50">{active.footnote}</sup>}
          </p>
          <p className="text-base sm:text-lg lg:text-xl text-white leading-snug font-light max-w-xl mb-4">{active.shortCaption}</p>
          <p className="text-sm sm:text-[15px] text-white/70 leading-relaxed max-w-xl mb-5">{active.fullDetails}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 max-w-xl">
            {active.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.12em] text-white/85">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentGreen }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
