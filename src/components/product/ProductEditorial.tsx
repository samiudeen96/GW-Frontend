/**
 * ProductEditorial
 * Purpose: Shared below-the-fold editorial layout for every Green Wealth / Ghori PDP.
 * Users: Storefront shoppers researching a product before purchase.
 * Key actions: Read the story, scan actives, review the full label, follow the ritual, set expectations.
 * Integration points: Consumes the typed `Product` record from src/lib/products.ts. Presentation only.
 */
import { useState } from "react";
import type { Product } from "@/lib/products";
import { useT } from "@/lib/i18n";
import { ProductImage } from "@/components/site/ProductImage";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] uppercase tracking-[0.28em] text-gold font-mono">{children}</span>;
}

function Head({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="max-w-3xl mb-5 md:mb-8 pb-4 border-b border-forest/15">
      <h2 className="font-serif text-2xl md:text-[2rem] text-forest leading-[1.05]">{title}</h2>
      {sub && <p className="mt-3 text-[13.5px] text-forest/75 leading-[1.7] font-serif">{sub}</p>}
    </div>
  );
}

type Copy = {
  storyTitle: string;
  ritualTitle: string;
  frequency: string;
  bottleLife: string;
  bestAppliedTo: string;
  texture: string;
  signature: string;
  goodToKnow: string;
  madeFor: string[];
  lookbook: [string, string, string][]; // kicker, title, body
};

const FALLBACK_MADE_FOR = ["Straight", "Wavy", "Curly", "Coily", "Chemically treated", "Protective styles"];

const COPY: Record<string, Copy> = {
  "neo-hair-lotion": {
    storyTitle: "A lightweight scalp lotion for consistent daily use.",
    ritualTitle: "Two minutes, morning and night.",
    frequency: "Twice daily — 6–8 sprays AM and PM",
    bottleLife: "One 120 ml bottle lasts approximately 30 days",
    bestAppliedTo: "A clean, dry scalp — part the hair and target the skin",
    texture: "Lightweight, fast-absorbing",
    signature: "Five herbal extracts",
    goodToKnow:
      "For external use only. Avoid contact with eyes. Perform a patch test if you have a sensitive scalp. Pairs with the Ghori® Derma Roller — roll first, then apply for enhanced absorption.",
    madeFor: FALLBACK_MADE_FOR,
    lookbook: [
      ["The purpose", "Designed to fit around the way you wear your hair.", "Suitable for all hair types and textures, including chemically treated hair and protective styles."],
      ["The formula", "Five botanicals, one base.", "A concentrated blend delivered in a lightweight carrier designed to reach the scalp, not sit on the lengths."],
      ["The ritual", "Spray, massage, leave in.", "No rinsing, no waiting. Apply and style as usual — morning and night."],
      ["Good to know", "The details that matter.", "Visible change varies by the cause of hair loss, scalp condition and consistency of use."],
    ],
  },
  "neo-hair-shampoo": {
    storyTitle: "The wash step, engineered for the scalp.",
    ritualTitle: "Two washes, three minutes.",
    frequency: "3–4 washes per week, or as needed",
    bottleLife: "One bottle lasts approximately 30–45 washes",
    bestAppliedTo: "Wet hair — work into the scalp, not the lengths",
    texture: "Low-foam, non-stripping",
    signature: "Scalp-first cleansing",
    goodToKnow:
      "For external use only. Avoid contact with eyes. Rinse thoroughly. Follow with the Neo Hair Lotion on a towel-dried scalp for the full routine.",
    madeFor: FALLBACK_MADE_FOR,
    lookbook: [
      ["The purpose", "A clean scalp, not a stripped one.", "Removes buildup and excess oil while leaving the scalp barrier intact."],
      ["The formula", "Gentle surfactants, botanical support.", "Cleansing agents chosen to respect the scalp, paired with conditioning botanicals."],
      ["The ritual", "Two washes, one focus.", "First wash lifts buildup, second wash treats. Massage the scalp for a full minute before rinsing."],
      ["Good to know", "The details that matter.", "Best used as the preparation step before the lotion — a clean scalp absorbs more."],
    ],
  },
  "ghori-rosemary-oil": {
    storyTitle: "A rosemary-led scalp oil without a heavy finish.",
    ritualTitle: "Five minutes, three nights a week.",
    frequency: "3–4× weekly, or nightly for intensive support",
    bottleLife: "One bottle lasts approximately 45–60 days",
    bestAppliedTo: "A clean, dry scalp — roll first for deeper absorption",
    texture: "Featherlight, non-greasy",
    signature: "Rosemary · Mint · Biotin",
    goodToKnow:
      "For external use only. Avoid contact with eyes. Perform a patch test if you have a sensitive scalp. Pairs with the Ghori® Derma Roller — roll first, then apply the oil for enhanced absorption.",
    madeFor: FALLBACK_MADE_FOR,
    lookbook: [
      ["The purpose", "Designed to fit around the way you wear your hair.", "All hair types and textures — including chemically treated hair, braids and weaves. Featherlight, never greasy."],
      ["The formula", "Led by rosemary leaf oil.", "Rosemary, peppermint and biotin suspended in a base of over fifteen nourishing plant oils — silicone-free throughout."],
      ["The ritual", "A few drops, section by section.", "A few drops to the scalp, section by section, then two to three minutes of massage. Use a small amount and add more only where needed."],
      ["Good to know", "The details that matter.", "For external use only. Patch test if your scalp is sensitive. Pairs with the derma roller — roll first, then apply."],
    ],
  },
  "ghori-dermaroller": {
    storyTitle: "The tool that opens the way.",
    ritualTitle: "Sixty seconds, once or twice a week.",
    frequency: "1–2× weekly — never on broken or irritated skin",
    bottleLife: "Replace the head approximately every 3 months",
    bestAppliedTo: "A clean, dry scalp — always disinfect before and after",
    texture: "Titanium micro-needles",
    signature: "Absorption amplifier",
    goodToKnow:
      "Disinfect before and after every use. Never share the roller. Do not use on irritated, sunburned or broken skin. Stop if discomfort persists.",
    madeFor: ["Thinning crowns", "Receding temples", "Post-wash routines", "Lotion pairing", "All hair types"],
    lookbook: [
      ["The purpose", "Built to make the rest work harder.", "A preparation step that helps the scalp receive what you apply next."],
      ["The tool", "Titanium, not steel.", "Titanium alloy needles set in an ergonomic handle for controlled, even pressure."],
      ["The ritual", "Four directions, sixty seconds.", "Roll gently horizontally, vertically and both diagonals — then apply your treatment."],
      ["Good to know", "The details that matter.", "Hygiene is everything. Disinfect before and after, and let the scalp rest between sessions."],
    ],
  },
};

const DEFAULT_COPY: Copy = {
  storyTitle: "Product information and directions.",
  ritualTitle: "A simple, repeatable routine.",
  frequency: "As directed on the label",
  bottleLife: "Varies with frequency of use",
  bestAppliedTo: "A clean, dry scalp",
  texture: "Lightweight",
  signature: "Botanical",
  goodToKnow: "For external use only. Avoid contact with eyes. Perform a patch test if you have a sensitive scalp.",
  madeFor: FALLBACK_MADE_FOR,
  lookbook: [
    ["The purpose", "Read before first use.", "Follow the label directions and safety information."],
    ["The formula", "Disclosed in full.", "Every ingredient is named on the label and explained in plain language."],
    ["The ritual", "A few drops, section by section.", "Follow the routine below for the best chance at visible change."],
    ["Good to know", "The details that matter.", "Results vary by scalp condition and consistency of use."],
  ],
};

export default function ProductEditorial({ p }: { p: Product }) {
  const t = useT();
  const [showInci, setShowInci] = useState(false);
  const c = COPY[p.slug] ?? DEFAULT_COPY;
  const gallery = p.images && p.images.length > 0 ? p.images : [p.image];
  const inci = p.inciDetails ?? [];
  const allergens = inci.filter((i) => i.allergen);
  const actives = p.ingredientsDetailed ?? [];

  /** Product-scoped translation helper: product.<slug>.<field> */
  const tp = (field: string, fallback: string) => t(`product.${p.slug}.${field}`, fallback);
  const tpi = (field: string, i: number, fallback: string) => t(`product.${p.slug}.${field}.${i}`, fallback);

  const pillars = (actives.length >= 3 ? actives.slice(0, 3) : []).map((a, i) => ({
    title: tpi(`active.${i}.tagline`, i, a.tagline ?? a.name),
    body: tpi(`active.${i}.summary`, i, a.summary ?? a.description),
    tag: tpi(`active.${i}.role`, i, a.role ?? a.name),
  }));

  const love = (p.science && p.science.length > 0 ? p.science : p.benefits) ?? [];
  const loveField = p.science && p.science.length > 0 ? "science" : "benefits";
  const inside: [string, string][] = actives.length
    ? actives.map((a, i) => [tpi(`active.${i}.name`, i, a.name), tpi(`active.${i}.description`, i, a.description)] as [string, string])
    : p.ingredients.map((i, idx) => [tpi("ingredients", idx, i), ""] as [string, string]);

  const lookbookClean = c.lookbook.map(([kicker, title, body], i) => ({
    kicker: t(`product.${p.slug}.lookbook.${i}.kicker`, kicker),
    title: t(`product.${p.slug}.lookbook.${i}.title`, title),
    body: t(`product.${p.slug}.lookbook.${i}.body`, body),
    img: gallery[(i + 1) % gallery.length] ?? gallery[0],
  }));

  return (
    <>
      {/* ── The story ── */}
      <section className="border-t hairline bg-paper">
        <div className="container-editorial py-7 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14">
            <div className="md:col-span-5">
              <h2 className="font-serif text-3xl md:text-[2.6rem] text-forest leading-[1.03]">
                {tp("storyTitle", c.storyTitle)}
              </h2>
              <dl className="mt-6 grid grid-cols-2 gap-px bg-forest/15 border border-forest/15">
                {[
                  [t("product.pdp.format", "Format"), tp("category", p.category)],
                  [t("product.pdp.texture", "Texture"), tp("texture", c.texture)],
                  [t("product.pdp.signature", "Signature"), tp("signature", c.signature)],
                  [t("product.pdp.size", "Size"), tp("size", p.size)],
                ].map(([k, v]) => (
                  <div key={k} className="bg-paper p-3">
                    <dt className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-forest/45">{k}</dt>
                    <dd className="text-[12.5px] text-forest mt-1 leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="md:col-span-7">
              <p className="font-serif text-[15px] md:text-[17px] text-forest/85 leading-[1.75]">
                {tp("longOverview", p.longOverview ?? p.overview)}
              </p>
              {pillars.length > 0 ? (
                <ul className="mt-6 grid grid-cols-1 gap-px bg-forest/15 border border-forest/15">
                  {pillars.map((card) => (
                    <li key={card.title} className="bg-paper p-5 md:p-6">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{card.tag}</span>
                      </div>
                      <h3 className="font-serif text-lg md:text-xl text-forest mt-2 leading-[1.15]">{card.title}</h3>
                      <p className="text-[13px] text-forest/75 leading-[1.65] mt-2">{card.body}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-px bg-forest/15 border border-forest/15">
                  {p.benefits.map((b, i) => (
                    <li key={b} className="bg-paper p-5">
                      <p className="font-serif text-[15px] text-forest leading-[1.4]">{tpi("benefits", i, b)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* ── Look book ── */}
      <section className="border-t hairline bg-paper">
        <div className="container-editorial py-7 md:py-14">
          <Head title={t("product.pdp.seeItInUse", "See it in use.")} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-forest/15 border border-forest/15">
            {lookbookClean.map((l, li) => (
              <article key={li} className="bg-paper">
                <div className="aspect-[4/3] bg-ivory overflow-hidden">
                  <ProductImage src={l.img} alt={`${t(`product.${p.slug}.name`, p.name)} — ${l.kicker}`} sizes="(min-width: 768px) 600px, 100vw" className="w-full h-full object-contain" />
                </div>
                <div className="p-5 md:p-7">
                  <Eyebrow>{l.kicker}</Eyebrow>
                  <h3 className="font-serif text-xl md:text-2xl text-forest mt-2 leading-[1.1]">{l.title}</h3>
                  <p className="text-[13px] md:text-[13.5px] text-forest/75 leading-[1.7] mt-3">{l.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Everything about — why you'll love it + inside the formula + INCI ── */}
      <section className="border-t hairline bg-ivory">
        <div className="container-editorial py-7 md:py-14">
          <Head
            title={`${t("product.pdp.everythingAbout", "Everything about")} ${t(`product.${p.slug}.name`, p.name)}.`}
            sub={t("product.pdp.everythingAboutSub", "Overview, formula, label declaration and ritual — disclosed in full.")}
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-forest/15 border border-forest/15">
            {love.length > 0 && (
              <div className="md:col-span-5 bg-paper p-5 md:p-7">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-forest/50">{t("product.pdp.whyYoullLoveIt", "Why you'll love it")}</h3>
                <ol className="mt-4">
                  {love.map((l, i) => (
                    <li key={l} className="grid grid-cols-[auto_1fr] gap-4 py-3 border-b border-forest/10 last:border-b-0">
                      <span className="text-gold" aria-hidden="true">—</span>
                      <span className="text-[13px] text-forest/80 leading-[1.6]">{tpi(loveField, i, l)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div className={`${love.length > 0 ? "md:col-span-7" : "md:col-span-12"} bg-paper p-5 md:p-7`}>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-forest/50">
                {actives.length ? t("product.pdp.insideTheFormula", "Inside the formula") : t("product.pdp.whatItsMadeOf", "What it's made of")}
              </h3>
              <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {inside.map(([name, body], idx) => (
                  <div key={name + idx} className="py-3 border-b border-forest/10">
                    <dt className="text-[12px] uppercase tracking-[0.08em] font-medium text-forest">{name}</dt>
                    {body && <dd className="text-[12.5px] text-forest/70 leading-[1.55] mt-1">{body}</dd>}
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Full INCI */}
          {inci.length > 0 && (
            <div className="mt-6 border border-forest/15 bg-paper">
              <button
                type="button"
                onClick={() => setShowInci((v) => !v)}
                aria-expanded={showInci}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-forest">
                  {t("product.pdp.fullIngredientsInci", "Full ingredients (INCI)")} · {inci.length} {t("product.pdp.listed", "listed")}
                </span>
                <span className="font-mono text-[15px] text-gold leading-none">{showInci ? "−" : "+"}</span>
              </button>
              {showInci && (
                <div className="px-5 pb-5 border-t border-forest/10 pt-4">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-forest/10 border border-forest/10">
                    {inci.map((row, ri) => (
                      <li key={row.inci} className="bg-paper p-3">
                        <p className="text-[11.5px] text-forest leading-snug">
                          {row.inci}
                          {row.allergen && <span className="text-gold font-mono text-[10px] ml-1">·{t("product.pdp.allergen", "allergen")}</span>}
                        </p>
                        <p className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-forest/50 mt-1">
                          {[row.common ? t(`product.${p.slug}.inci.${ri}.common`, row.common) : null, t(`product.${p.slug}.inci.${ri}.role`, row.role)].filter(Boolean).join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                  {allergens.length > 0 && (
                    <p className="mt-4 text-[11.5px] text-forest/70 leading-relaxed">
                      <span className="font-mono uppercase tracking-[0.2em] text-[10px] text-gold mr-2">
                        {t("product.pdp.allergensDeclared", "Allergens declared")}
                      </span>
                      {allergens.map((a, ai) => a.common ? t(`product.${p.slug}.inci.${inci.indexOf(a)}.common`, a.common) : a.inci).join(", ")}.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── The ritual ── */}
      <section className="border-t hairline">
        <div className="container-editorial py-7 md:py-14">
          <div className="bg-forest text-paper p-7 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-4">
                <span className="text-[10px] uppercase tracking-[0.28em] text-gold font-mono">{t("product.pdp.theRitual", "The ritual")}</span>
                <h2 className="font-serif text-3xl md:text-[2.6rem] mt-3 leading-[1.02] tracking-[-0.02em]">
                  {tp("ritualTitle", c.ritualTitle)}
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-px bg-paper/20 border border-paper/20">
                  {[
                    [t("product.pdp.frequency", "Frequency"), tp("frequency", c.frequency)],
                    [t("product.pdp.oneUnit", "One unit"), tp("bottleLife", c.bottleLife)],
                    [t("product.pdp.bestAppliedTo", "Best applied to"), tp("bestAppliedTo", c.bestAppliedTo)],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-forest p-3.5">
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-gold">{k}</div>
                      <div className="text-[12.5px] text-paper/85 leading-snug mt-1">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <ol className="md:col-span-8 space-y-5">
                {p.usage.map((step, i) => (
                  <li key={step} className="grid grid-cols-[auto_1fr] gap-5 pb-5 border-b border-paper/20 last:border-b-0">
                    <span className="font-serif text-4xl md:text-5xl text-gold leading-none tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-serif text-[15px] md:text-[18px] leading-[1.55] text-paper/95">{tpi("usage", i, step)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          {p.amplifiedProtocol && (
            <div className="mt-6 bg-ivory border border-forest/15 p-5 md:p-7 flex flex-col md:flex-row gap-4 md:gap-8 md:items-center">
              <span className="text-[10px] uppercase tracking-[0.28em] text-gold font-mono shrink-0">{t("product.pdp.amplifyTheRoutine", "Amplify the routine")}</span>
              <p className="text-[13.5px] text-forest/85 leading-[1.7] font-serif">{tp("amplifiedProtocol", p.amplifiedProtocol)}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── What to expect ── */}
      {p.timeline && p.timeline.length > 0 && (
        <section id="timeline" className="border-t hairline bg-paper scroll-mt-32">
          <div className="container-editorial py-7 md:py-14">
            <Head title={t("product.pdp.whatToExpect", "What to expect.")} />
            <div className="relative">
              <div className="absolute top-3 left-3 right-3 h-px bg-forest/20" />
              <ol className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-3 relative">
                {p.timeline.map((tl, i) => (
                  <li key={tl.period} className="flex flex-col">
                    <div className="size-6 bg-paper border-2 border-forest flex items-center justify-center relative z-10">
                      <span className="size-1.5 bg-gold" />
                    </div>
                    <div className="pt-3">
                      <div className="font-mono text-[10px] tabular-nums text-gold uppercase tracking-[0.24em]">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <p className="font-serif text-[16px] md:text-[18px] text-forest leading-[1.15] mt-1">{t(`product.${p.slug}.timeline.${i}.period`, tl.period)}</p>
                      <p className="text-[12px] leading-[1.55] text-forest/75 mt-2">{t(`product.${p.slug}.timeline.${i}.description`, tl.description)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-5 text-[10.5px] font-mono uppercase tracking-[0.18em] text-forest/50">
              {t("product.pdp.resultsVary", "Results vary with hair type, scalp condition and consistency of use.")}
            </p>
            {p.proTip && (
              <div className="mt-5 bg-ivory border-l-2 border-gold p-4 md:p-5 flex gap-4 items-start">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold shrink-0 pt-1">{t("product.pdp.proTip", "Pro tip")}</span>
                <p className="font-serif text-[13px] md:text-[14px] text-forest/85 leading-[1.6]">{tp("proTip", p.proTip)}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── A+ dossier: full-width brand banners ── */}
      {p.aplusImages && p.aplusImages.length > 0 && (
        <section className="border-t hairline bg-paper">
          <div className="container-editorial py-7 md:py-14">
            <Head
              title={`${t(`product.${p.slug}.name`, p.name)} ${t("product.pdp.inDetail", "in detail")}`}
              sub={t("product.pdp.dossierSub", "Formulation, ritual and results, documented plate by plate.")}
            />
            {p.aplusImagesMobile && p.aplusImagesMobile.length > 0 && (
              <div className="md:hidden grid grid-cols-1 gap-px bg-forest/15 border border-forest/15">
                {p.aplusImagesMobile.map((img, ii) => (
                  <figure key={img.src} className="bg-paper">
                    <ProductImage
                      src={img.src}
                      alt={t(`product.${p.slug}.aplusImagesMobile.${ii}.alt`, img.alt)}
                      sizes="100vw"
                      className="w-full h-auto block"
                    />
                  </figure>
                ))}
              </div>
            )}
            <div
              className={`${p.aplusImagesMobile && p.aplusImagesMobile.length > 0 ? "hidden md:grid" : "grid"} grid-cols-1 gap-px bg-forest/15 border border-forest/15`}
            >
              {p.aplusImages.map((img, ii) => (
                <figure key={img.src} className="bg-paper">
                  <ProductImage
                    src={img.src}
                    alt={t(`product.${p.slug}.aplusImages.${ii}.alt`, img.alt)}
                    sizes="(min-width: 1024px) 1200px, 100vw"
                    className="w-full h-auto block"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Made for + composition audit + good to know ── */}
      <section className="border-t hairline bg-ivory">
        <div className="container-editorial py-7 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-forest/15 border border-forest/15">
            <div className="md:col-span-4 bg-paper p-5 md:p-7">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-forest/50">{t("product.pdp.madeFor", "Made for")}</h3>
              <ul className="mt-4 flex flex-wrap gap-px bg-forest/10 border border-forest/10">
                {c.madeFor.map((m, mi) => (
                  <li key={m} className="bg-paper px-3 py-2 text-[10.5px] uppercase tracking-[0.18em] font-mono text-forest">
                    {tpi("madeFor", mi, m)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-4 bg-paper p-5 md:p-7">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-forest/50">{t("product.pdp.insideTheBottle", "Inside the bottle")}</h3>
              <ul className="mt-4">
                {(p.yesList ?? p.benefits).map((y, i) => (
                  <li key={y} className="flex items-start gap-3 py-2.5 border-b border-forest/10 last:border-b-0">
                    <span className="font-mono text-[10px] tabular-nums text-forest/40 mt-0.5 w-5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[12.5px] text-forest/85 leading-snug">{tpi(p.yesList ? "yesList" : "benefits", i, y)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-4 bg-paper p-5 md:p-7">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-forest/50">
                {p.freeFrom && p.freeFrom.length > 0 ? t("product.pdp.neverInTheBottle", "Never in the bottle") : t("product.pdp.specification", "Specification")}
              </h3>
              {p.freeFrom && p.freeFrom.length > 0 ? (
                <ul className="mt-4 grid grid-cols-2 gap-px bg-forest/10 border border-forest/10">
                  {p.freeFrom.map((f, fi) => (
                    <li
                      key={f}
                      className="bg-paper text-[10.5px] uppercase tracking-[0.18em] font-mono text-forest px-2.5 py-2.5 flex items-center gap-2"
                    >
                      <span className="text-gold">×</span>
                      <span className="truncate">{tpi("freeFrom", fi, f)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <dl className="mt-4">
                  {[
                    [t("product.pdp.category", "Category"), tp("category", p.category)],
                    [t("product.pdp.size", "Size"), tp("size", p.size)],
                    [t("product.pdp.origin", "Origin"), p.origin ? tp("origin", p.origin) : "—"],
                    [t("product.pdp.brand", "Brand"), p.brand ?? "Green Wealth"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-3 py-2.5 border-b border-forest/10 last:border-b-0">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-forest/50">{k}</dt>
                      <dd className="text-[12.5px] text-forest">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>

          <div className="mt-6 bg-paper border-l-2 border-gold p-5 flex flex-col md:flex-row gap-3 md:gap-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold shrink-0 pt-0.5">{t("product.pdp.goodToKnow", "Good to know")}</span>
            <p className="font-serif text-[13.5px] text-forest/85 leading-[1.7]">{tp("goodToKnow", c.goodToKnow)}</p>
          </div>
        </div>
      </section>
    </>
  );
}
