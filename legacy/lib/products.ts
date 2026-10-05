


import lotionG1 from "@/assets/products/gallery/lotion-c1.webp";
import lotionG2 from "@/assets/products/gallery/lotion-c2.webp";
import lotionG3 from "@/assets/products/gallery/lotion-c3.webp";
import lotionG4 from "@/assets/products/gallery/lotion-c4.webp";
import lotionG5 from "@/assets/products/gallery/lotion-c5.webp";
import lotionG6 from "@/assets/products/gallery/lotion-c6.webp";
import lotionG7 from "@/assets/products/gallery/lotion-c7.webp";
import lotionG8 from "@/assets/products/gallery/lotion-c8.webp";
import lotionG9 from "@/assets/products/gallery/lotion-c9.webp";
import lotionA1 from "@/assets/products/aplus/lotion-a1.webp";
import lotionA2 from "@/assets/products/aplus/lotion-a2.webp";
import lotionA3 from "@/assets/products/aplus/lotion-a3.webp";
import lotionA4 from "@/assets/products/aplus/lotion-a4.webp";
import lotionA5 from "@/assets/products/aplus/lotion-a5.webp";
import lotionA6 from "@/assets/products/aplus/lotion-a6.webp";
import lotionA7 from "@/assets/products/aplus/lotion-a7.webp";
import lotionA8 from "@/assets/products/aplus/lotion-a8.webp";
import lotionA9 from "@/assets/products/aplus/lotion-a9.webp";
import lotionA10 from "@/assets/products/aplus/lotion-a10.webp";
import lotionM1 from "@/assets/products/aplus-mobile/lotion-m1.webp";
import lotionM2 from "@/assets/products/aplus-mobile/lotion-m2.webp";
import lotionM3 from "@/assets/products/aplus-mobile/lotion-m3.webp";
import lotionM4 from "@/assets/products/aplus-mobile/lotion-m4.webp";
import lotionM5 from "@/assets/products/aplus-mobile/lotion-m5.webp";
import lotionM6 from "@/assets/products/aplus-mobile/lotion-m6.webp";
import lotionM7 from "@/assets/products/aplus-mobile/lotion-m7.webp";
import lotionM8 from "@/assets/products/aplus-mobile/lotion-m8.webp";
import lotionM9 from "@/assets/products/aplus-mobile/lotion-m9.webp";

import shampooG1 from "@/assets/products/gallery/shampoo1.webp";
import shampooG2 from "@/assets/products/gallery/shampoo2.webp";
import shampooG3 from "@/assets/products/gallery/shampoo3.webp";
import shampooG4 from "@/assets/products/gallery/shampoo4.webp";
import shampooG5 from "@/assets/products/gallery/shampoo5.webp";
import shampooG6 from "@/assets/products/gallery/shampoo6.webp";
import shampooG9 from "@/assets/products/gallery/shampoo9.webp";

import shampooA1 from "@/assets/products/aplus/shampoo-a1.webp";
import shampooA2 from "@/assets/products/aplus/shampoo-a2.webp";
import shampooA3 from "@/assets/products/aplus/shampoo-a3.webp";
import shampooA4 from "@/assets/products/aplus/shampoo-a4.webp";
import shampooA5 from "@/assets/products/aplus/shampoo-a5.webp";
import shampooA6 from "@/assets/products/aplus/shampoo-a6.webp";
import shampooA7 from "@/assets/products/aplus/shampoo-a7.webp";
import shampooA8 from "@/assets/products/aplus/shampoo-a8.webp";
import shampooA9 from "@/assets/products/aplus/shampoo-a9.webp";

import derma1 from "@/assets/products/dermaroller/dr-1.webp";
import derma2 from "@/assets/products/dermaroller/dr-2.webp";
import derma3 from "@/assets/products/dermaroller/dr-3.webp";
import derma4 from "@/assets/products/dermaroller/dr-4.webp";
import derma5 from "@/assets/products/dermaroller/dr-5.webp";
import derma6 from "@/assets/products/dermaroller/dr-6.webp";
import dermaA1 from "@/assets/products/dermaroller/dr-a1.webp";
import dermaA2 from "@/assets/products/dermaroller/dr-a2.webp";
import dermaA3 from "@/assets/products/dermaroller/dr-a3.webp";
import dermaA4 from "@/assets/products/dermaroller/dr-a4.webp";
import dermaA5 from "@/assets/products/dermaroller/dr-a5.webp";

import rosemary1 from "@/assets/products/gallery/rm-1.webp";
import rosemary2 from "@/assets/products/gallery/rm-2.webp";
import rosemary3 from "@/assets/products/gallery/rm-3.webp";
import rosemary4 from "@/assets/products/gallery/rm-4.webp";
import rosemary5 from "@/assets/products/gallery/rm-5.webp";

import ingGinseng from "@/assets/ingredients/ginseng.webp";
import ingSawPalmetto from "@/assets/ingredients/saw-palmetto.webp";
import ingHorsetail from "@/assets/ingredients/horsetail.webp";
import ingCantaloupe from "@/assets/ingredients/cantaloupe.webp";
import ingFalseDaisy from "@/assets/ingredients/false-daisy.webp";
import ingRosemary from "@/assets/ingredients/rosemary.jpg";
import ingPeppermint from "@/assets/ingredients/peppermint.jpg";
import ingBiotin from "@/assets/ingredients/biotin.jpg";
import ingVitaminE from "@/assets/ingredients/vitamin-e.jpg";
import ingAloe from "@/assets/ingredients/aloe-vera.jpg";
import ingCoconut from "@/assets/ingredients/coconut.jpg";
import ingPanthenol from "@/assets/ingredients/panthenol.jpg";
import ingSurfactant from "@/assets/ingredients/surfactant.jpg";
import ingWater from "@/assets/ingredients/purified-water.jpg";
import ingCastor from "@/assets/ingredients/castor-oil.jpg";
import ingPeaProtein from "@/assets/ingredients/pea-protein.jpg";
import ingChelator from "@/assets/ingredients/chelator.jpg";
import ingPreservative from "@/assets/ingredients/preservative.jpg";

export type IngredientHowItWorks = { category: string; description: string };
export type IngredientDetail = {
  name: string;
  description: string;
  image?: string;
  latin?: string;
  role?: string;
  tagline?: string;
  summary?: string;
  percentage?: string;
  inci?: string;
  keyNutrients?: string[];
  pathwayTags?: string[];
  whatItDoes?: string[];
  howItWorks?: IngredientHowItWorks[];
  origin?: string;
  process?: string;
  dailyDose?: string;
  evidence?: string;
};
export type TimelineEntry = { period: string; description: string; title?: string; days?: string; signs?: string[]; tip?: string };
export type FaqEntry = { q: string; a: string };
export type PriceTier = { minQty: number; price: number };
export type InciEntry = { inci: string; common?: string; role: string; note?: string; allergen?: boolean };


export type Product = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  currency: string;
  image: string;
  images: string[];
  /** Unique, descriptive alt text parallel to `images` (index-matched). */
  imageAlts?: string[];
  size: string;
  available: boolean;
  overview: string;
  benefits: string[];
  ingredients: string[];
  usage: string[];

  // Optional extended editorial content
  longOverview?: string;
  whyDifferent?: string;
  science?: string[];
  perfectFor?: string[];
  yesList?: string[];
  freeFrom?: string[];
  baseIngredients?: string[];
  ingredientsDetailed?: IngredientDetail[];
  timeline?: TimelineEntry[];
  amplifiedProtocol?: string;
  proTip?: string;
  pairsWith?: string[];
  faqs?: FaqEntry[];
  priceTiers?: PriceTier[];
  origin?: string;
  inciDetails?: InciEntry[];
  brand?: string;
  /** Full-width A+ editorial banners (1464×600) shown below the fold on the PDP. */
  aplusImages?: { src: string; alt: string }[];
  /** Portrait-friendly A+ banners (920×690) served to small viewports instead of the wide plates. */
  aplusImagesMobile?: { src: string; alt: string }[];
};


export const CURRENCY = "USD";

export const products: Product[] = [
  {
    slug: "neo-hair-lotion",
    name: "Green Wealth Neo Hair Lotion®",
    brand: "Green Wealth",
    tagline: "120 ml · Made in Thailand",
    category: "Hair Serum",
    price: 40,
    currency: "USD",
    image: lotionG1,
    images: [lotionG1, lotionG2, lotionG4, lotionG3, lotionG5, lotionG6, lotionG7, lotionG8, lotionG9],
    imageAlts: [
      "Green Wealth Neo Hair Lotion 120 ml spray bottle, front view on a pale studio background",
      "Neo Hair Lotion bottle surrounded by its five botanical actives — ginseng, saw palmetto, horsetail, cantaloupe and false daisy",
      "Neo Hair Lotion shown with the Ghori dermaroller and shampoo as the complete hair-growth routine",
      "Build your ritual: Neo Hair Shampoo, rosemary oil, Neo Hair Lotion and dermaroller laid out in order of use",
      "How to use Neo Hair Lotion: part the hair, spray 10–15 times on a dry scalp, massage in, twice daily",
      "Before and after comparison of a hairline after one consistent Neo Hair Lotion routine over 3–6 months",
      "The Neo Hair impact — scalp macro shots at month one, two and three with 5 botanical actives and 94% customer satisfaction",
      "The scientific botanical blend inside Neo Hair Lotion with each extract and its label concentration",
      "Who Neo Hair Lotion is for — thinning crowns, receding temples, postpartum shedding and all hair types",
    ],
    aplusImages: [
      { src: lotionA1, alt: "Neo Hair Lotion editorial banner — 120 ml botanical scalp treatment made in Thailand" },
      { src: lotionA2, alt: "Neo Hair Lotion banner explaining the five botanical extracts and their label concentrations" },
      { src: lotionA3, alt: "Neo Hair Lotion banner showing how the spray reaches the scalp rather than the lengths" },
      { src: lotionA4, alt: "Neo Hair Lotion banner on scalp health, reduced shedding and stronger strands" },
      { src: lotionA5, alt: "Neo Hair Lotion banner comparing the botanical formula with pharmaceutical alternatives" },
      { src: lotionA10, alt: "Neo Hair Lotion banner setting honest expectations across the first six months of use" },
      { src: lotionA6, alt: "Neo Hair Lotion banner outlining the three-step cleanse, treat and stimulate routine" },
      { src: lotionA7, alt: "Neo Hair Lotion routine banner — step one, cleanse the scalp with Neo Hair Shampoo" },
      { src: lotionA8, alt: "Neo Hair Lotion routine banner — step two, apply 10–15 sprays to a dry scalp" },
      { src: lotionA9, alt: "Neo Hair Lotion routine banner — step three, massage and repeat morning and night" },
    ],
    aplusImagesMobile: [
      { src: lotionM1, alt: "Botanical secret to better hair care — Neo Hair Lotion spraying a fine mist, blend of five botanical extracts" },
      { src: lotionM2, alt: "Neo Hair Lotion 120 ml bottle with hair root nutrients, shown against a deep green backdrop" },
      { src: lotionM3, alt: "Botanical hair lotion for hair density — nourishes the scalp, supports hair strength, natural hair care" },
      { src: lotionM4, alt: "Hair thinning is more than genetics — stress, nutrition, hormones, lifestyle, metabolism and ageing explained" },
      { src: lotionM5, alt: "Before and after six months of consistent Neo Hair Lotion use, with 94% of surveyed users noticing an improvement" },
      { src: lotionM6, alt: "Three-step routine — cleanse with Neo Hair Shampoo, massage with the derma roller, treat with Neo Hair Lotion" },
      { src: lotionM7, alt: "How to use, step one — massage gently for four to five minutes with the Ghori derma roller" },
      { src: lotionM8, alt: "How to use, step two — apply Neo Hair Lotion evenly to the scalp and massage it in with your fingers" },
      { src: lotionM9, alt: "How to use, step three — leave the lotion on for the day and repeat regularly" },
    ],
    size: "120 ml",
    available: true,
    origin: "Thailand",
    priceTiers: [
      { minQty: 5, price: 38 },
      { minQty: 10, price: 35 },
    ],
    overview:
      "A concentrated botanical scalp treatment made in Thailand. The official product label lists five herbal extracts in a lightweight, fast-absorbing base designed to deliver actives directly to the scalp.",
    longOverview:
      "For over a decade, Neo Hair Lotion has been a reference point in non-surgical hair care across Southeast Asia, the Middle East and beyond. The formula is built around five botanical extracts at the concentrations shown on the label, designed to support scalp health and the appearance of thicker, fuller hair.",
    whyDifferent:
      "Unlike pharmaceutical treatments such as minoxidil or finasteride, Neo Hair Lotion is a topical, plant-derived spray with a short, transparent ingredient list.",
    science: [
      "Circulation support: Ginseng radix alba and cucumis melo extracts are traditionally used to support scalp micro-circulation.",
      "Hormonal balance: Saw palmetto is traditionally used to help maintain healthy DHT activity at the follicle level.",
      "Scalp comfort: Eclipta prostrata and equisetum arvense extracts are traditionally used to soothe the scalp and support healthy follicle cycling.",
      "Structural support: Equisetum arvense provides naturally occurring silica, a mineral associated with keratin integrity.",
    ],
    benefits: [
      "Supports the appearance of thicker, fuller hair",
      "Helps maintain a balanced, comfortable scalp environment",
      "Nourishes roots with five botanical extracts",
      "Lightweight spray that absorbs quickly",
      "No minoxidil, no finasteride",
      "Made in Thailand under GMP-certified conditions",
    ],
    perfectFor: [
      "Men and women noticing increased shedding or thinner-looking hair",
      "Thinning at the crown, temples or hairline",
      "Postpartum or stress-related shedding routines",
      "Receding or patchy beard areas",
      "Anyone seeking a plant-based alternative to minoxidil",
      "Those recovering from medical hair loss (with physician guidance)",
    ],
    yesList: [
      "Herbal formula with 5 botanical extracts",
      "Transparent extract concentrations on the label",
      "Suitable for men and women of all ages",
      "Lightweight, non-greasy spray",
      "No minoxidil, no finasteride",
      "Made in Thailand under GMP-certified conditions",
    ],
    freeFrom: ["Minoxidil", "Finasteride"],
    baseIngredients: [
      "Purified Water",
      "Propylene Glycol (10%)",
    ],
    ingredients: [
      "Cucumis melo extract — 1%",
      "Saw palmetto extract — 2%",
      "Ginseng radix alba (Panax ginseng) extract — 2%",
      "Equisetum arvense extract — 3%",
      "Eclipta prostrata L. extract — 3%",
    ],
    ingredientsDetailed: [
      {
        name: "Cantaloupe (Cucumis Melo)",
        latin: "Cucumis melo",
        role: "Antioxidant · SOD support",
        image: ingCantaloupe,
        tagline: "The Antioxidant Melon",
        summary: "A natural source of superoxide dismutase (SOD), vitamin A and vitamin C. Concentration: 1% extract.",
        keyNutrients: ["Superoxide dismutase (SOD)", "Beta-carotene", "Vitamin C", "Folate", "Potassium"],
        pathwayTags: ["Antioxidant", "Scalp environment", "Age-defense"],
        whatItDoes: [
          "Helps neutralise free radicals around follicle cells",
          "Supports a healthy scalp environment",
          "Contributes to natural pigment maintenance",
          "Provides antioxidant defence against environmental stress",
        ],
        howItWorks: [
          { category: "Antioxidant", description: "SOD helps convert superoxide radicals into less reactive molecules, reducing oxidative stress around follicle cells." },
          { category: "Pigment", description: "Vitamin A supports melanocyte function, helping the follicle maintain its natural colour longer." },
          { category: "Renewal", description: "Beta-carotene and vitamin C support healthy keratinocyte turnover on the scalp surface." },
          { category: "Age-defense", description: "By neutralising free radicals, melon extract helps protect follicles from premature ageing." },
        ],
        origin: "Sun-ripened Cucumis melo cultivars",
        process: "Cold-pressed aqueous extraction",
        dailyDose: "Concentration: 1% extract",
        evidence: "Cucumis melo SOD has been studied for its antioxidant activity in skin and scalp models.",
        description: "Rich in vitamin A and a natural source of superoxide dismutase (SOD), an antioxidant enzyme that helps defend follicle cells from oxidative stress.",
      },
      {
        name: "Saw Palmetto",
        latin: "Serenoa repens",
        role: "Botanical DHT support",
        image: ingSawPalmetto,
        tagline: "The Hormonal Shield",
        summary: "A berry extract traditionally used to help maintain healthy DHT activity at the scalp. Concentration: 2% extract.",
        keyNutrients: ["Beta-sitosterol", "Lauric acid", "Oleic acid", "Myristic acid", "Phytosterols"],
        pathwayTags: ["Hormonal balance", "Shedding", "Density"],
        whatItDoes: [
          "Traditionally used to support healthy DHT balance",
          "Helps reduce the appearance of excess shedding",
          "Supports a healthy follicle environment",
          "Used in both men's and women's hair routines",
        ],
        howItWorks: [
          { category: "Hormonal", description: "Fatty acids and phytosterols are thought to interact with 5-alpha-reductase, the enzyme that converts testosterone to DHT." },
          { category: "DHT", description: "By supporting normal DHT activity at the scalp, saw palmetto helps protect follicles from miniaturisation signals." },
          { category: "Shedding", description: "A healthier hormonal environment means fewer follicles are pushed prematurely into the shedding phase." },
          { category: "Density", description: "With consistent use, more follicles stay in the growth phase, supporting the appearance of density." },
        ],
        origin: "Ripe berries from Serenoa palms",
        process: "CO₂ supercritical extraction — solvent-free",
        dailyDose: "Concentration: 2% extract",
        evidence: "Saw palmetto is one of the most studied botanicals for pattern hair-loss support.",
        description: "A palm-berry extract rich in fatty acids and beta-sitosterol, traditionally used to help maintain healthy DHT balance at the scalp.",
      },
      {
        name: "White Ginseng (Radix Alba)",
        latin: "Panax ginseng",
        role: "Micro-circulation",
        image: ingGinseng,
        tagline: "The Circulation Root",
        summary: "The sun-dried root of Panax ginseng, traditionally used to support scalp blood flow and follicle vitality. Concentration: 2% extract.",
        keyNutrients: ["Ginsenosides", "Polysaccharides", "Vitamin B1", "Panaxans"],
        pathwayTags: ["Circulation", "Follicle", "Energy"],
        whatItDoes: [
          "Traditionally used to support scalp micro-circulation",
          "Helps deliver nutrients to the follicle bulb",
          "Supports the appearance of thicker, healthier hair",
          "Contributes to overall follicle vitality",
        ],
        howItWorks: [
          { category: "Circulation", description: "Ginsenosides are traditionally used to support vascular function, helping blood reach the deep papilla." },
          { category: "Follicle", description: "Improved circulation means more oxygen and amino acids reach the follicle matrix." },
          { category: "Anagen", description: "A well-nourished follicle is more likely to remain in the active growth phase." },
          { category: "Energy", description: "Panaxans support cellular energy metabolism inside the follicle bulb." },
        ],
        origin: "Panax ginseng roots",
        process: "Sun-dried, then water-based botanical extraction",
        dailyDose: "Concentration: 2% extract",
        evidence: "Ginseng has been studied for its potential to support hair growth and scalp circulation.",
        description: "The sun-dried root of Panax ginseng, valued in traditional medicine for its ginsenoside content and used to support scalp micro-circulation.",
      },
      {
        name: "Horsetail Extract",
        latin: "Equisetum arvense",
        role: "Silica · Structure",
        image: ingHorsetail,
        tagline: "The Silica Scaffold",
        summary: "A natural source of silica, a mineral linked to keratin structure and strand strength. Concentration: 3% extract.",
        keyNutrients: ["Silica (silicic acid)", "Selenium", "Manganese", "Potassium", "Flavonoids"],
        pathwayTags: ["Structure", "Keratin", "Elasticity"],
        whatItDoes: [
          "Provides silica associated with keratin synthesis",
          "Supports strand strength and elasticity",
          "Helps improve the appearance of breakage resistance",
          "Supports scalp connective tissue",
        ],
        howItWorks: [
          { category: "Structure", description: "Silicic acid is thought to support disulfide bond formation, the scaffolding of keratin fibres." },
          { category: "Keratin", description: "Silica provides a mineral cofactor used by keratinocytes during fibre synthesis." },
          { category: "Collagen", description: "Horsetail flavonoids support collagen density in the dermal sheath around follicles." },
          { category: "Elasticity", description: "Improved cuticle flexibility helps hair bend without snapping under mechanical stress." },
        ],
        origin: "Aerial parts of Equisetum arvense",
        process: "Aqueous extraction, then micronised for bioavailability",
        dailyDose: "Concentration: 3% extract",
        evidence: "Horsetail is traditionally used for its silica content in hair and nail formulations.",
        description: "One of nature's most concentrated sources of bioavailable silica, a mineral associated with keratin strength and elasticity.",
      },
      {
        name: "False Daisy (Bhringraj)",
        latin: "Eclipta prostrata",
        role: "Scalp soothing · Ayurvedic",
        image: ingFalseDaisy,
        tagline: "The Ayurvedic King of Herbs",
        summary: "A traditional Ayurvedic hair herb used for scalp comfort and healthy growth cycles. Concentration: 3% extract.",
        keyNutrients: ["Wedelolactone", "Ecliptine", "Isoflavonoids", "Vitamin E", "Magnesium"],
        pathwayTags: ["Scalp comfort", "Growth cycle", "Pigment"],
        whatItDoes: [
          "Traditionally used to soothe the scalp",
          "Supports healthy hair growth cycles",
          "Helps maintain natural pigment",
          "Used in Ayurvedic hair care for centuries",
        ],
        howItWorks: [
          { category: "Scalp", description: "Wedelolactone and triterpenes are traditionally used to calm mild scalp irritation and flaking." },
          { category: "Growth cycle", description: "A soothed, balanced scalp creates a better environment for follicles to stay in the growth phase." },
          { category: "Pigment", description: "Antioxidant compounds help protect melanocytes from oxidative stress." },
          { category: "Tradition", description: "Bhringraj has been called the 'King of Hair' in Ayurveda for over 3,000 years." },
        ],
        origin: "Eclipta prostrata",
        process: "Hydro-glycolic extraction",
        dailyDose: "Concentration: 3% extract",
        evidence: "Bhringraj has a long history of use in traditional hair-care systems.",
        description: "A revered Ayurvedic herb used for scalp comfort and healthy growth cycles, rich in wedelolactone and antioxidant compounds.",
      },
    ],
    usage: [
      "Cleanse — wash with a gentle shampoo and towel-dry so the scalp is clean and receptive.",
      "Spray — using the precision spray nozzle, mist directly onto the scalp roots. Cover the whole head, including crown, temples and hairline.",
      "Massage — use fingertips (never nails) to massage in firm circular motions for 2–3 minutes.",
      "Leave — let the lotion sit for 15–20 minutes before styling.",
      "Frequency — apply morning and evening for best results.",
      "Amplify — once per week, use a Ghori Derma Roller (0.5 mm) before application to support absorption.",
    ],
    timeline: [
      {
        period: "Week 1–3",
        title: "Scalp Reset",
        days: "Day 01 — 21",
        description: "Reduced shedding, less scalp irritation, improved scalp feel.",
        signs: ["Daily shedding begins to slow", "Itch and irritation ease", "Scalp feels calm and balanced"],
        tip: "Photograph your hairline on day zero under fixed lighting — this becomes your reference point for every later comparison.",
      },
      {
        period: "Week 4–6",
        title: "First Signals",
        days: "Day 22 — 42",
        description: "Visible baby hairs (vellus hair) appearing at temples and hairline.",
        signs: ["Fine vellus hairs at the temples", "Short new hairs along the hairline", "Early fullness at the part line"],
        tip: "Do not judge results in the mirror — at this stage changes are measured in photos, not daily observation.",
      },
      {
        period: "Month 2–4",
        title: "Conversion",
        days: "Day 60 — 120",
        description: "New growth becomes thicker and more pigmented (terminal hair conversion).",
        signs: ["New hairs grow in thicker", "Increased pigment — darker regrowth", "Regrowth holds between washes"],
        tip: "Add the weekly 0.5 mm derma rolling session before application to deepen absorption of the botanicals.",
      },
      {
        period: "Month 4–6",
        title: "Density",
        days: "Day 120 — 180",
        description: "Noticeable density improvement, especially at the crown.",
        signs: ["Crown coverage visibly improves", "Part lines appear narrower", "Hairline fills forward"],
        tip: "Keep the full twice-daily protocol — density gains consolidate during this window and are easy to stall.",
      },
      {
        period: "Month 6–12",
        title: "Full Cycle",
        days: "Day 180 — 365",
        description: "Full growth cycle completion — maximum results with continued use.",
        signs: ["Complete hair growth cycle", "Maximum density reached", "Results hold with continued use"],
        tip: "Reduce to a maintenance cadence only after the full cycle is complete — and keep monthly photo tracking.",
      },
    ],
    amplifiedProtocol:
      "For accelerated results, use a Ghori Derma Roller (0.5 mm) once per week before application. Microneedling creates transient micro-channels that support absorption of active ingredients; allow the scalp five to seven days to recover between sessions.",
    proTip:
      "Take monthly photos from the same angle and lighting to track your progress objectively — daily observation can make cumulative changes hard to notice.",
    pairsWith: ["ghori-dermaroller", "neo-hair-shampoo", "ghori-rosemary-oil"],
    faqs: [
      { q: "Is Neo Hair Lotion suitable for all skin types?", a: "It is dermatologically tested and formulated to be gentle on all skin types, including sensitive skin. We recommend a patch test before first use." },
      { q: "How long does it take to see results?", a: "Many customers report reduced shedding within the first 3–4 weeks of consistent twice-daily use, with visible density changes typically between months 3 and 6. Individual results vary." },
      { q: "Can I use this with other hair-care products?", a: "Yes. Apply Neo Hair Lotion on a clean, dry or towel-dried scalp before heavier styling products." },
      { q: "Is this product cruelty-free?", a: "Yes — Green Wealth products are not tested on animals." },
      { q: "What makes Neo Hair Lotion different?", a: "It lists five botanical extracts at specific concentrations on the official label, with no minoxidil or finasteride." },
      { q: "What is your return policy?", a: "A 7-day hassle-free return policy applies to unopened products." },
    ],
  },
  {
    slug: "neo-hair-shampoo",
    name: "Neo Hair Shampoo",
    brand: "Green Wealth",
    tagline: "250 ml · Revitalising botanical scalp shampoo",
    category: "Cleansing",
    price: 40,
    currency: "USD",
    image: shampooG1,
    images: [shampooG1, shampooG2, shampooG3, shampooG4, shampooG5, shampooG6, shampooG9],
    imageAlts: [
      "Neo Hair Shampoo 250 ml bottle, front view showing the green Green Wealth label",
      "Neo Hair Shampoo 250 ml bottle photographed beside its printed carton",
      "Neo Hair Shampoo bottle styled with ginseng root and rosemary sprigs on a pale surface",
      "Back label of Neo Hair Shampoo showing the full ingredient list and 250 ml fill volume",
      "Neo Hair Shampoo pump detail with a pearl of shampoo dispensed onto a fingertip",
      "Neo Hair Shampoo bottle on a bathroom shelf as part of the daily Green Wealth routine",
      "Neo Hair Shampoo bottle lying on its side with lather swatch beside it",
    ],
    aplusImages: [
      { src: shampooA1, alt: "Neo Hair Shampoo 250 ml bottle with ginseng root and rosemary — routine scalp care" },
      { src: shampooA2, alt: "Neo Hair Shampoo bottle beside ginseng root and rosemary sprigs on a light backdrop" },
      { src: shampooA3, alt: "Sulfate-free, pH-balanced botanical shampoo formulated for a daily scalp-care ritual" },
      { src: shampooA4, alt: "Amber shampoo poured into a palm — care that begins at the roots" },
      { src: shampooA5, alt: "Macro before and after view of hair strands cleansed with Neo Hair Shampoo" },
      { src: shampooA6, alt: "Before and after scalp comparison alongside the botanical ingredient statement" },
      { src: shampooA7, alt: "How to use step 01 — apply a dollop to fingertips and massage into the scalp" },
      { src: shampooA8, alt: "How to use step 02 — wait two to three minutes, then rinse with water" },
      { src: shampooA9, alt: "How to use step 03 — pair with Neo Hair Lotion and the Derma Roller" },
    ],
    size: "250 ml",
    available: true,
    overview:
      "A botanical shampoo formulated to prepare the scalp for the Neo Hair routine — cleansing away build-up and supporting a balanced scalp environment.",
    benefits: [
      "Cleanses without stripping the scalp",
      "Prepares the scalp for Neo Hair Lotion",
      "Botanical fragrance",
      "Colour-safe formula",
    ],
    ingredients: [
      "Di Water 58.50%",
      "Sodium Cocoyl Hydrolyzed-Pea Protein 20.00%",
      "Sodium Cocoyl Alaninate 15.00%",
      "PEG-120 Methyl Glucose-Dioleate 2.50%",
      "Cucumis Melo Fruit Extract 1.40%",
      "Saw Palmetto Extract 0.80%",
      "Ginseng Extract 0.80%",
      "Rosmarinus Officinalis 0.80%",
      "Disodium EDTA 0.10%",
      "Sodium Benzoate 0.10%",
    ],
    usage: [
      "Apply to wet hair and massage into the scalp for 30–60 seconds.",
      "Rinse thoroughly with warm water. Repeat if needed.",
      "Follow with Neo Hair Lotion on a dry or towel-dried scalp.",
    ],
    ingredientsDetailed: [
      {
        name: "Purified Water",
        inci: "Aqua / Di Water",
        role: "Solvent Base",
        image: ingWater,
        tagline: "The carrier",
        percentage: "58.50%",
        summary:
          "Deionised, pharmaceutical-grade water forms the neutral base that carries every active into the scalp evenly.",
        description:
          "Removed of minerals and metal ions so the surfactants and botanicals stay stable and perform predictably.",
        pathwayTags: ["Base", "Deionised"],
        whatItDoes: ["Dissolves actives", "Keeps pH stable", "Neutral carrier"],
        origin: "Pharma-grade deionised water",
        process: "Reverse osmosis + UV sterilisation",
        dailyDose: "Every wash",
      },
      {
        name: "Sodium Cocoyl Hydrolyzed-Pea Protein",
        inci: "Sodium Cocoyl Hydrolyzed-Pea Protein",
        role: "Protein Surfactant",
        image: ingPeaProtein,
        tagline: "The strand rebuilder",
        percentage: "20.00%",
        summary:
          "A gentle, plant-derived surfactant made by binding coconut fatty acids to hydrolysed pea protein — cleanses while depositing amino acids onto the hair shaft.",
        description:
          "Ultra-mild sulfate-free cleanser. The pea-protein fraction is small enough to enter the cortex, filling porosity gaps and strengthening the fibre from within.",
        keyNutrients: ["Pea protein hydrolysate", "Coconut fatty acids", "Amino acids"],
        pathwayTags: ["Sulfate-free", "Strengthening", "Colour-safe"],
        whatItDoes: [
          "Cleans without stripping the scalp",
          "Deposits amino acids into the cortex",
          "Reduces breakage and split ends",
        ],
        origin: "Coconut + yellow pea (Pisum sativum)",
        process: "Enzymatic hydrolysis + acylation",
        dailyDose: "Every wash",
      },
      {
        name: "Sodium Cocoyl Alaninate",
        inci: "Sodium Cocoyl Alaninate",
        role: "Amino-Acid Surfactant",
        image: ingCoconut,
        tagline: "The gentle foam",
        percentage: "15.00%",
        summary:
          "A biodegradable surfactant built from coconut fatty acids and the amino acid alanine — creates a soft, creamy lather at skin-friendly pH.",
        description:
          "Considered one of the mildest surfactants in modern cosmetic chemistry. Cleans efficiently without disturbing the scalp barrier or fading colour.",
        keyNutrients: ["Alanine", "Coconut fatty acids"],
        pathwayTags: ["Barrier-safe", "Skin-pH", "Biodegradable"],
        whatItDoes: [
          "Generates soft, low-irritation foam",
          "Preserves the scalp lipid barrier",
          "Rinses cleanly with no residue",
        ],
        origin: "Coconut kernel + fermented alanine",
        process: "Amino-acid acylation",
        dailyDose: "Every wash",
      },
      {
        name: "PEG-120 Methyl Glucose Dioleate",
        inci: "PEG-120 Methyl Glucose Dioleate",
        role: "Conditioning Thickener",
        image: ingSurfactant,
        tagline: "The slip agent",
        percentage: "2.50%",
        summary:
          "A glucose-derived thickener that gives the shampoo its silky slip, distributes actives evenly across the scalp and leaves hair easy to comb.",
        description:
          "Non-ionic and mild — adds body to the formula, boosts foam stability and deposits a light conditioning film on the cuticle for tangle-free rinse-out.",
        pathwayTags: ["Slip", "Detangling", "Non-ionic"],
        whatItDoes: [
          "Thickens and stabilises the shampoo",
          "Improves wet combing",
          "Prevents tangling as you rinse",
        ],
        origin: "Corn glucose + plant oleic acid",
        process: "Cold-blended into base",
        dailyDose: "Every wash",
      },
      {
        name: "Cantaloupe (Cucumis Melo)",
        latin: "Cucumis melo",
        role: "Antioxidant Extract",
        image: ingCantaloupe,
        tagline: "The scalp antioxidant",
        percentage: "1.40%",
        summary:
          "Cold-processed melon extract rich in superoxide dismutase (SOD) — a powerful antioxidant that protects the follicle from oxidative stress.",
        description:
          "Cools and hydrates the scalp while neutralising free radicals produced by pollution, UV and heat styling.",
        keyNutrients: ["Superoxide dismutase (SOD)", "Beta-carotene", "Vitamin C"],
        pathwayTags: ["Antioxidant", "Soothing", "Barrier support"],
        whatItDoes: [
          "Neutralises free radicals around the follicle",
          "Cools and hydrates the scalp",
          "Reduces oxidative shedding",
        ],
        origin: "Cold-processed melon pulp",
        process: "Aqueous extraction, low-heat",
        dailyDose: "Every wash",
      },
      {
        name: "Saw Palmetto",
        latin: "Serenoa repens",
        role: "DHT Support",
        image: ingSawPalmetto,
        tagline: "The DHT buffer",
        percentage: "0.80%",
        summary:
          "Fatty-acid extract from saw palmetto berries — one of the few botanicals shown to help modulate 5-alpha-reductase activity at the follicle.",
        description:
          "Delivered at the same 0.80% concentration used in the Neo Hair Lotion, so every wash reinforces the DHT-support pathway.",
        keyNutrients: ["Beta-sitosterol", "Free fatty acids"],
        pathwayTags: ["DHT support", "Follicle protection"],
        whatItDoes: [
          "Buffers DHT activity at the follicle",
          "Supports thicker regrowth over time",
          "Reinforces the Neo Hair Lotion pathway",
        ],
        origin: "Ripe Serenoa repens berries",
        process: "CO₂-extracted fatty acid fraction",
        dailyDose: "Every wash",
      },
      {
        name: "White Ginseng (Radix Alba)",
        latin: "Panax ginseng",
        role: "Circulation & Vitality",
        image: ingGinseng,
        tagline: "The scalp adaptogen",
        percentage: "0.80%",
        summary:
          "Ginsenoside-rich extract from peeled, sun-dried white ginseng root — improves microcirculation and prepares the scalp to receive treatment.",
        description:
          "Awakens the scalp during every wash, supporting nutrient delivery to the follicle base and complementing the daily lotion step.",
        keyNutrients: ["Ginsenosides Rg1, Rb1", "Polysaccharides"],
        pathwayTags: ["Circulation", "Adaptogen", "Vitality"],
        whatItDoes: [
          "Stimulates scalp microcirculation",
          "Delivers nutrients to the follicle base",
          "Primes the scalp for Neo Hair Lotion",
        ],
        origin: "Panax ginseng root, sun-dried",
        process: "Traditional water-alcohol extraction",
        dailyDose: "Every wash",
      },
      {
        name: "Rosemary",
        latin: "Rosmarinus officinalis",
        role: "Circulation & Freshness",
        image: ingRosemary,
        tagline: "The follicle awakener",
        percentage: "0.80%",
        summary:
          "Rosemary leaf extract shown in trials to rival minoxidil 2% for supporting hair density — added at cosmetic level to freshen and awaken the scalp.",
        description:
          "Adds a clean herbal fragrance and boosts scalp circulation, supporting the daily lotion routine every time you wash.",
        keyNutrients: ["Carnosic acid", "Rosmarinic acid", "1,8-cineole"],
        pathwayTags: ["Circulation", "Anti-inflammatory", "Freshness"],
        whatItDoes: [
          "Increases blood flow to the follicle",
          "Calms scalp inflammation",
          "Freshens with a clean herbal aroma",
        ],
        origin: "Mediterranean rosemary leaves",
        process: "Steam-distilled + aqueous extract",
        dailyDose: "Every wash",
      },
      {
        name: "Disodium EDTA",
        inci: "Disodium EDTA",
        role: "Chelating Agent",
        image: ingChelator,
        tagline: "The water softener",
        percentage: "0.10%",
        summary:
          "A trace-level chelator that binds hard-water minerals so the surfactants foam properly and the botanicals stay stable.",
        description:
          "Prevents metal ions in tap water from dulling hair colour, reducing foam or degrading actives — used at the minimum effective level (0.10%).",
        pathwayTags: ["Stabiliser", "Water-softening"],
        whatItDoes: [
          "Binds calcium, magnesium and iron ions",
          "Keeps foam consistent in hard water",
          "Protects botanical actives from oxidation",
        ],
        origin: "Cosmetic-grade chelator",
        process: "Cold-blended into base",
        dailyDose: "Every wash",
      },
      {
        name: "Sodium Benzoate",
        inci: "Sodium Benzoate",
        role: "Preservative",
        image: ingPreservative,
        tagline: "The formula guardian",
        percentage: "0.10%",
        summary:
          "A food-grade preservative (also used in soft drinks) that keeps the water-rich formula free of microbes without irritating the scalp.",
        description:
          "Paraben-free, formaldehyde-free preservation used at the minimum level required to maintain a safe shelf life.",
        pathwayTags: ["Preservative", "Paraben-free"],
        whatItDoes: [
          "Prevents microbial growth",
          "Maintains formula integrity",
          "Safe for daily use",
        ],
        origin: "Naturally occurring benzoic acid salt",
        process: "Cold-blended into base",
        dailyDose: "Every wash",
      },
    ],
  },

  {
    slug: "ghori-rosemary-oil",
    name: "Ghori® Rosemary Mint & Biotin Oil",
    brand: "GHORI",
    tagline: "60 ml · Anti-hairfall scalp & hair oil",
    category: "Scalp Care",
    price: 14,
    currency: "USD",
    image: rosemary1,
    images: [rosemary1, rosemary2, rosemary3, rosemary4, rosemary5],
    imageAlts: [
      "Ghori® Rosemary Mint & Biotin Fortifying Oil 60 ml frosted glass dropper bottle on a white background",
      "Ghori® Rosemary Mint & Biotin Oil bottle lit from the side, casting a long shadow on a soft studio ledge",
      "Ghori® Rosemary Mint & Biotin Oil bottle surrounded by fresh rosemary sprigs, mint leaves and golden biotin capsules",
      "Red-haired model holding the Ghori® Rosemary Mint & Biotin Oil beside her long, glossy hair",
      "Dark-haired model looking over her shoulder while holding the Ghori® Rosemary Mint & Biotin Oil dropper bottle",
    ],
    size: "60 ml",
    available: true,
    overview:
      "A rosemary, mint and biotin scalp oil designed to support natural hair growth, scalp comfort and everyday volume as part of the Green Wealth routine.",
    benefits: [
      "Rosemary and mint for a fresh, cooling feel",
      "Enriched with biotin",
      "Complements the Neo Hair routine",
    ],
    ingredients: [
      "Glycine Soja Oil",
      "Ricinus Communis Seed Oil",
      "Aloe Barbadensis Leaf Extract",
      "Aqua",
      "Benzyl Nicotinate",
      "Biotin",
      "Carthamus Tinctorius Seed Oil",
      "Cocos Nucifera Oil",
      "Eucalyptus Globulus Leaf Oil",
      "Glycerin",
      "Lavandula Angustifolia Oil",
      "Melaleuca Alternifolia Leaf Oil",
      "Mentha Piperita Oil",
      "Menthol",
      "Ocimum Basilicum Leaf Extract",
      "Oryza Sativa Bran Oil",
      "Pogostemon Cablin Leaf Oil",
      "Prunus Amygdalus Dulcis Oil",
      "Retinyl Palmitate",
      "Rosmarinus Officinalis Leaf Oil",
      "Salvia Sclarea Oil",
      "Simmondsia Chinensis Seed Oil",
      "Tocopheryl Acetate",
      "Triticum Vulgare Germ Oil",
      "Vitis Vinifera Seed Oil",
      "Phenoxyethanol",
      "Limonene",
      "Linalool",
      "Citronellol",
    ],
    usage: [
      "Use the dropper to apply a few drops directly to the scalp, section by section.",
      "Massage gently with fingertips for 2–3 minutes to boost circulation.",
      "Comb through to the ends so every strand absorbs the formula.",
      "Leave in and style as usual — or apply at night for deeper nourishment.",
      "For split ends: apply to the tips, cover with a treatment cap for 10 minutes, then rinse.",
    ],
    ingredientsDetailed: [
      {
        name: "Rosemary Leaf Oil",
        latin: "Rosmarinus Officinalis",
        role: "Circulation",
        image: ingRosemary,
        tagline: "The circulation herb",
        summary:
          "One of the most studied botanicals for hair fullness. Warms the scalp micro-vasculature and delivers nutrients directly to the follicle.",
        description:
          "Stimulates scalp circulation to feed the follicle at the root — where visible fullness actually begins.",
        keyNutrients: ["1,8-Cineole", "Carnosic Acid", "α-Pinene"],
        pathwayTags: ["Circulation boost", "Follicle revival"],
        whatItDoes: [
          "Stimulates scalp micro-circulation",
          "Strengthens hair roots",
          "Reduces premature shedding",
          "Supports thicker, fuller-looking hair",
        ],
        howItWorks: [
          { category: "Circulation", description: "1,8-cineole warms scalp capillaries so more oxygen and nutrients reach the papilla." },
          { category: "Follicle", description: "Carnosic acid protects the follicle stem-cell niche from oxidative stress." },
          { category: "Anagen", description: "Supports a longer active growth phase, meaning fewer strands cycle into shedding." },
          { category: "Anchor", description: "Improves the root's grip inside the follicle, reducing everyday fall." },
        ],
        origin: "Distilled from Rosmarinus officinalis, Mediterranean-grown",
        process: "Steam distillation, cold-blended into carrier oils",
        dailyDose: "A few drops massaged into the scalp",
        evidence: "Rosemary oil has been clinically compared favourably to standard hair-growth treatments in published trials.",
      },
      {
        name: "Biotin",
        latin: "Vitamin B7",
        role: "Strand fortification",
        image: ingBiotin,
        tagline: "The keratin builder",
        summary:
          "A cofactor for keratin infrastructure. Biotin reinforces the strand from the inside — reducing breakage and improving resilience.",
        description: "Supports the keratin scaffolding that gives each strand its thickness, elasticity and resistance to breakage.",
        keyNutrients: ["Biotin (B7)"],
        pathwayTags: ["Strand fortification", "Anti-breakage"],
        whatItDoes: [
          "Supports keratin production",
          "Reduces breakage and split ends",
          "Promotes thicker-looking hair",
          "Improves strand elasticity",
        ],
        howItWorks: [
          { category: "Cortex", description: "Cofactor for the carboxylase enzymes that build keratin protein." },
          { category: "Fibre", description: "Reinforces the internal scaffolding responsible for tensile strength." },
          { category: "Surface", description: "Smooths the cuticle so light reflects evenly — visible gloss." },
          { category: "Renewal", description: "Supports the metabolic activity of the follicle's rapidly-dividing cells." },
        ],
        origin: "Cosmetic-grade Vitamin B7",
        process: "Blended into the oil phase for scalp absorption",
        dailyDose: "In-formula — one application delivers active dose",
      },
      {
        name: "Peppermint Oil",
        latin: "Mentha Piperita",
        role: "Cooling scalp revival",
        image: ingPeppermint,
        tagline: "The cooling activator",
        summary:
          "Delivers a distinct menthol cool that soothes itch, balances sebum and wakes dormant follicles at the surface.",
        description: "Cools and refreshes the scalp while its menthol activates follicles near the surface.",
        keyNutrients: ["Menthol", "Menthone"],
        pathwayTags: ["Cooling", "Follicle activation"],
        whatItDoes: [
          "Cools and refreshes the scalp",
          "Balances excess oil",
          "Awakens surface follicles",
          "Instantly relieves itch and tension",
        ],
        howItWorks: [
          { category: "Sensory", description: "Menthol triggers TRPM8 cold-receptors — the instantly recognisable cool." },
          { category: "Vascular", description: "Encourages a brief vasodilation response that boosts blood flow to the scalp." },
          { category: "Sebum", description: "Astringent action helps normalise oil production between washes." },
          { category: "Comfort", description: "Soothes itch and scalp tension linked to product build-up." },
        ],
        origin: "Peppermint leaves, steam-distilled",
        process: "Cold-blended into carrier oils",
        dailyDose: "In-formula",
      },
      {
        name: "Vitamin E",
        latin: "Tocopheryl Acetate",
        role: "Antioxidant protection",
        image: ingVitaminE,
        tagline: "The scalp antioxidant",
        summary:
          "Neutralises daily oxidative stress on the scalp — a known driver of dulling, thinning and premature greying.",
        description: "Shields the scalp and strands from the daily oxidative load that accelerates dullness and thinning.",
        keyNutrients: ["Tocopheryl Acetate"],
        pathwayTags: ["Antioxidant defence", "Shine"],
        whatItDoes: [
          "Neutralises daily free radicals",
          "Supports overall scalp health",
          "Adds natural luster and softness",
          "Extends shelf-life and integrity of the oil blend",
        ],
        howItWorks: [
          { category: "Antioxidant", description: "Scavenges reactive oxygen species that damage follicular DNA." },
          { category: "Barrier", description: "Reinforces the scalp lipid barrier against pollution and UV." },
          { category: "Shine", description: "Improves light-reflection on the cuticle — visible gloss." },
          { category: "Preservation", description: "Protects the delicate oil phase from oxidation over time." },
        ],
        origin: "Botanical Vitamin E complex",
        process: "Cold-blended into carrier oils",
        dailyDose: "In-formula",
      },
      {
        name: "Aloe Vera",
        latin: "Aloe Barbadensis Leaf Extract",
        role: "Scalp hydration",
        image: ingAloe,
        tagline: "The scalp humectant",
        summary:
          "Ultra-hydrating gel-extract that soothes irritation, calms redness and restores the scalp's moisture barrier without weight.",
        description: "Delivers deep, non-greasy hydration to the scalp while soothing inflammation that can slow growth.",
        keyNutrients: ["Polysaccharides", "Vitamins A, C, E", "Amino acids"],
        pathwayTags: ["Hydration", "Barrier repair"],
        whatItDoes: [
          "Deeply hydrates the scalp",
          "Calms itch and redness",
          "Reinforces the moisture barrier",
          "Delivers actives more efficiently",
        ],
        howItWorks: [
          { category: "Hydration", description: "Acemannan-rich polysaccharides bind water at the scalp surface and help reduce moisture loss." },
          { category: "Barrier", description: "Plant sterols and natural sugars support a calmer, more comfortable scalp barrier." },
          { category: "Conditioning", description: "Amino acids and polysaccharides add slip without the weight of a heavy occlusive oil." },
        ],
        origin: "Aloe barbadensis inner-leaf gel",
        process: "Cold-pressed, filtered extract",
        dailyDose: "In-formula",
        evidence: "Topical aloe is supported primarily for hydration and skin-soothing effects; evidence for direct hair regrowth remains limited.",
      },
      {
        name: "Castor Seed Oil",
        latin: "Ricinus Communis",
        role: "Strand conditioning",
        image: ingCastor,
        tagline: "The density oil",
        summary:
          "Rich in ricinoleic acid — traditionally used to condition strands, seal the cuticle and add visible density along the lengths.",
        description: "Coats and conditions each strand, sealing moisture and adding visible thickness and shine.",
        keyNutrients: ["Ricinoleic acid", "Omega-9"],
        pathwayTags: ["Conditioning", "Anti-frizz"],
        whatItDoes: [
          "Seals the cuticle for shine",
          "Conditions dry, brittle lengths",
          "Reduces frizz and flyaways",
          "Adds visible density",
        ],
        howItWorks: [
          { category: "Cuticle", description: "Ricinoleic-acid-rich oil coats uneven cuticle edges, improving smoothness and gloss." },
          { category: "Moisture", description: "Its occlusive film slows moisture loss from dry, porous lengths." },
          { category: "Friction", description: "Added lubrication reduces snagging and mechanical breakage during grooming." },
        ],
        origin: "Cold-pressed castor beans",
        process: "Blended into the carrier phase",
        dailyDose: "In-formula",
        evidence: "Castor oil is an established cosmetic conditioner, although human evidence for direct hair-growth stimulation is currently insufficient.",
      },
      {
        name: "Coconut Oil",
        latin: "Cocos Nucifera",
        role: "Protein retention",
        image: ingCoconut,
        tagline: "The protein guardian",
        summary:
          "One of the only oils shown to penetrate the hair shaft — reducing daily protein loss and protecting strands from breakage.",
        description: "Penetrates the cortex to reduce protein loss and protect strands from mechanical damage.",
        keyNutrients: ["Lauric acid", "MCTs"],
        pathwayTags: ["Protein defence", "Breakage guard"],
        whatItDoes: [
          "Reduces protein loss when washing",
          "Softens and detangles",
          "Protects against heat & friction",
          "Boosts overall shine",
        ],
        howItWorks: [
          { category: "Penetration", description: "Lauric acid has an affinity for keratin and can move beyond the cuticle into the hair fibre." },
          { category: "Protein", description: "Pre-wash and post-wash use can reduce protein loss from damaged and undamaged hair." },
          { category: "Protection", description: "The lipid film reduces water-driven swelling, friction and breakage along the lengths." },
        ],
        origin: "Cold-pressed coconut flesh",
        process: "Refined virgin coconut oil",
        dailyDose: "In-formula",
        evidence: "Controlled hair-fibre studies support coconut oil for reducing protein loss; this protects existing strands rather than proving new follicle growth.",
      },
    ],
    inciDetails: [
      { inci: "Glycine Soja Oil", common: "Soybean oil", role: "Emollient · Vit E carrier" },
      { inci: "Ricinus Communis Seed Oil", common: "Castor oil", role: "Conditioning · thickening" },
      { inci: "Aloe Barbadensis Leaf Extract", common: "Aloe vera", role: "Soothing · hydration" },
      { inci: "Aqua", common: "Water", role: "Solvent base" },
      { inci: "Benzyl Nicotinate", role: "Scalp warming · circulation" },
      { inci: "Biotin", common: "Vitamin B7", role: "Keratin cofactor" },
      { inci: "Carthamus Tinctorius Seed Oil", common: "Safflower oil", role: "Emollient · omega-6" },
      { inci: "Cocos Nucifera Oil", common: "Coconut oil", role: "Cortex protection" },
      { inci: "Eucalyptus Globulus Leaf Oil", common: "Eucalyptus", role: "Cooling · antimicrobial" },
      { inci: "Glycerin", role: "Humectant" },
      { inci: "Lavandula Angustifolia Oil", common: "Lavender", role: "Calming · aromatic", allergen: true },
      { inci: "Melaleuca Alternifolia Leaf Oil", common: "Tea tree", role: "Scalp cleansing · antimicrobial" },
      { inci: "Mentha Piperita Oil", common: "Peppermint", role: "Cooling · follicle activator" },
      { inci: "Menthol", role: "Cooling agent" },
      { inci: "Ocimum Basilicum Leaf Extract", common: "Basil", role: "Antioxidant" },
      { inci: "Oryza Sativa Bran Oil", common: "Rice bran", role: "Ferulic acid · shine" },
      { inci: "Pogostemon Cablin Leaf Oil", common: "Patchouli", role: "Aromatic base note" },
      { inci: "Prunus Amygdalus Dulcis Oil", common: "Sweet almond", role: "Softening emollient" },
      { inci: "Retinyl Palmitate", common: "Vitamin A", role: "Follicle turnover support" },
      { inci: "Rosmarinus Officinalis Leaf Oil", common: "Rosemary", role: "Circulation · growth" },
      { inci: "Salvia Sclarea Oil", common: "Clary sage", role: "Sebum balance", allergen: true },
      { inci: "Simmondsia Chinensis Seed Oil", common: "Jojoba", role: "Sebum-mimetic conditioning" },
      { inci: "Tocopheryl Acetate", common: "Vitamin E", role: "Antioxidant" },
      { inci: "Triticum Vulgare Germ Oil", common: "Wheat germ", role: "Vitamin E · shine" },
      { inci: "Vitis Vinifera Seed Oil", common: "Grape seed", role: "Lightweight emollient" },
      { inci: "Phenoxyethanol", role: "Broad-spectrum preservative" },
      { inci: "Limonene", role: "Naturally in essential oils", allergen: true },
      { inci: "Linalool", role: "Naturally in essential oils", allergen: true },
      { inci: "Citronellol", role: "Naturally in essential oils", allergen: true },
    ],

    perfectFor: [
      "Anyone experiencing thinning, shedding or slow growth",
      "Dry, itchy or oil-imbalanced scalps",
      "Chemically treated hair and protective styles",
      "Daily maintenance for shine and strength",
    ],
    yesList: [
      "Rosemary, peppermint, biotin & Vitamin E",
      "15+ nourishing plant oils",
      "Silicone-free · sulfate-free · paraben-free",
      "Cruelty-free · suitable for all hair types",
    ],
    freeFrom: ["Silicones", "Sulfates", "Parabens", "Mineral oil", "Synthetic fragrance"],
    faqs: [
      { q: "Will this oil make my hair greasy or heavy?", a: "No — the blend is featherlight and fast-absorbing. It is designed to sit on the scalp, not weigh down the lengths." },
      { q: "Can it actually help with hair growth?", a: "Rosemary is one of the most studied botanicals for supporting scalp circulation and hair fullness. Results are cumulative — most users see change from week 6 onward." },
      { q: "Is it safe for colour-treated hair?", a: "Yes. The formula is silicone-, sulfate- and paraben-free and safe for chemically processed or coloured hair." },
      { q: "How often should I use it?", a: "For visible results, 3–4 evenings per week is ideal. Leave overnight where possible, then shampoo out." },
      { q: "Is it suitable for all hair types?", a: "Yes — including straight, wavy, curly, coily and protective styles such as braids and weaves." },
    ],
  },
  {
    slug: "ghori-dermaroller",
    name: "Ghori® Derma Roller",
    brand: "GHORI",
    tagline: "Titanium scalp microneedling tool",
    category: "Tools",
    price: 15,
    currency: "USD",
    image: derma1,
    images: [derma1, derma2, derma3, derma4, derma5, derma6],
    imageAlts: [
      "Ghori® Derma Roller with 540 titanium needles, front studio view on a pale background",
      "Ghori® Derma Roller shown with its storage case and protective needle cap",
      "Macro view of the Ghori® Derma Roller titanium micro-needle drum",
      "Ghori® Derma Roller held at an angle showing the ergonomic non-slip handle",
      "Ghori® Derma Roller presented with its packaging as a complete scalp kit",
      "Ghori® Derma Roller in use on the scalp hairline, demonstrating rolling direction",
    ],
    aplusImages: [
      { src: dermaA1, alt: "Ghori® Derma Roller paired with Ghori® Rosemary Oil — the microneedling and nourish ritual" },
      { src: dermaA2, alt: "Ghori® Derma Roller banner explaining the 540 titanium needle head and its construction" },
      { src: dermaA3, alt: "Ghori® Derma Roller banner outlining the step-by-step scalp rolling ritual" },
      { src: dermaA4, alt: "Ghori® Derma Roller banner covering hygiene, needle care and good-to-know guidance" },
      { src: dermaA5, alt: "Ghori® Derma Roller banner on expected results when used consistently with Neo Hair Lotion" },
    ],
    size: "Titanium needles",
    available: true,
    overview:
      "A titanium scalp derma roller designed to be used alongside Neo Hair Lotion to help prepare the scalp surface as part of a consistent routine.",
    benefits: [
      "Premium titanium needles",
      "Ergonomic handle",
      "Designed to be used with Neo Hair Lotion",
    ],
    ingredients: ["Titanium alloy needles", "ABS handle"],
    usage: [
      "Disinfect before and after each use.",
      "Roll gently across the scalp in four directions for about 60 seconds.",
      "Follow immediately with Neo Hair Lotion.",
      "Use once per week.",
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(n: number, currency: string = CURRENCY): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(n);
}

/**
 * SEO-friendly alt text for any product image.
 * Prefers the curated, index-matched `imageAlts` entry; otherwise builds a
 * descriptive fallback from brand, name, size and category.
 */
export type AltTranslate = (key: string, fallback: string) => string;

export function productImageAlt(p: Product, i: number = 0, t?: AltTranslate): string {
  const curated = p.imageAlts?.[i];
  const brand = p.brand ?? "Green Wealth";
  const base = `${brand} ${p.name} ${p.size} — ${p.category.toLowerCase()}`;
  const fallback = curated ?? (i > 0 ? `${base}, product photograph ${i + 1}` : base);
  return t ? t(`product.${p.slug}.imageAlts.${i}`, fallback) : fallback;
}

/** Short, human-readable image title attribute (tooltip + extra crawl signal). */
export function productImageTitle(p: Product, t?: AltTranslate): string {
  const brand = p.brand ?? "Green Wealth";
  const fallback = `${brand} ${p.name} — ${p.size}`;
  return t ? t(`product.${p.slug}.imageTitle`, fallback) : fallback;
}
