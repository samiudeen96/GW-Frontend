/**
 * Per-product editorial copy for the PDP below-the-fold sections (English
 * fallbacks; translations live under `product.<slug>.<field>`).
 */
export type EditorialCopy = {
  storyTitle: string;
  ritualTitle: string;
  frequency: string;
  bottleLife: string;
  bestAppliedTo: string;
  texture: string;
  signature: string;
  goodToKnow: string;
  madeFor: string[];
  /** kicker, title, body */
  lookbook: [string, string, string][];
};

const FALLBACK_MADE_FOR = [
  "Straight",
  "Wavy",
  "Curly",
  "Coily",
  "Chemically treated",
  "Protective styles",
];

const COPY: Record<string, EditorialCopy> = {
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
      [
        "The purpose",
        "Designed to fit around the way you wear your hair.",
        "Suitable for all hair types and textures, including chemically treated hair and protective styles.",
      ],
      [
        "The formula",
        "Five botanicals, one base.",
        "A concentrated blend delivered in a lightweight carrier designed to reach the scalp, not sit on the lengths.",
      ],
      [
        "The ritual",
        "Spray, massage, leave in.",
        "No rinsing, no waiting. Apply and style as usual — morning and night.",
      ],
      [
        "Good to know",
        "The details that matter.",
        "Visible change varies by the cause of hair loss, scalp condition and consistency of use.",
      ],
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
      [
        "The purpose",
        "A clean scalp, not a stripped one.",
        "Removes buildup and excess oil while leaving the scalp barrier intact.",
      ],
      [
        "The formula",
        "Gentle surfactants, botanical support.",
        "Cleansing agents chosen to respect the scalp, paired with conditioning botanicals.",
      ],
      [
        "The ritual",
        "Two washes, one focus.",
        "First wash lifts buildup, second wash treats. Massage the scalp for a full minute before rinsing.",
      ],
      [
        "Good to know",
        "The details that matter.",
        "Best used as the preparation step before the lotion — a clean scalp absorbs more.",
      ],
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
      [
        "The purpose",
        "Designed to fit around the way you wear your hair.",
        "All hair types and textures — including chemically treated hair, braids and weaves. Featherlight, never greasy.",
      ],
      [
        "The formula",
        "Led by rosemary leaf oil.",
        "Rosemary, peppermint and biotin suspended in a base of over fifteen nourishing plant oils — silicone-free throughout.",
      ],
      [
        "The ritual",
        "A few drops, section by section.",
        "A few drops to the scalp, section by section, then two to three minutes of massage. Use a small amount and add more only where needed.",
      ],
      [
        "Good to know",
        "The details that matter.",
        "For external use only. Patch test if your scalp is sensitive. Pairs with the derma roller — roll first, then apply.",
      ],
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
    madeFor: [
      "Thinning crowns",
      "Receding temples",
      "Post-wash routines",
      "Lotion pairing",
      "All hair types",
    ],
    lookbook: [
      [
        "The purpose",
        "Built to make the rest work harder.",
        "A preparation step that helps the scalp receive what you apply next.",
      ],
      [
        "The tool",
        "Titanium, not steel.",
        "Titanium alloy needles set in an ergonomic handle for controlled, even pressure.",
      ],
      [
        "The ritual",
        "Four directions, sixty seconds.",
        "Roll gently horizontally, vertically and both diagonals — then apply your treatment.",
      ],
      [
        "Good to know",
        "The details that matter.",
        "Hygiene is everything. Disinfect before and after, and let the scalp rest between sessions.",
      ],
    ],
  },
};

const DEFAULT_COPY: EditorialCopy = {
  storyTitle: "Product information and directions.",
  ritualTitle: "A simple, repeatable routine.",
  frequency: "As directed on the label",
  bottleLife: "Varies with frequency of use",
  bestAppliedTo: "A clean, dry scalp",
  texture: "Lightweight",
  signature: "Botanical",
  goodToKnow:
    "For external use only. Avoid contact with eyes. Perform a patch test if you have a sensitive scalp.",
  madeFor: FALLBACK_MADE_FOR,
  lookbook: [
    [
      "The purpose",
      "Read before first use.",
      "Follow the label directions and safety information.",
    ],
    [
      "The formula",
      "Disclosed in full.",
      "Every ingredient is named on the label and explained in plain language.",
    ],
    [
      "The ritual",
      "A few drops, section by section.",
      "Follow the routine below for the best chance at visible change.",
    ],
    [
      "Good to know",
      "The details that matter.",
      "Results vary by scalp condition and consistency of use.",
    ],
  ],
};

export const editorialCopy = (slug: string): EditorialCopy => COPY[slug] ?? DEFAULT_COPY;
