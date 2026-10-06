/**
 * Shop page constants: ritual order, per-product labels and the match quiz.
 * Pure data with no server imports, so the quiz island can import it too.
 * English copy is the fallback for `shop.*` translation keys.
 */

export const RITUAL_ORDER = [
  "neo-hair-shampoo",
  "ghori-rosemary-oil",
  "neo-hair-lotion",
  "ghori-dermaroller",
];

export const STEP_LABELS: Record<string, string> = {
  "neo-hair-shampoo": "Cleanse",
  "ghori-rosemary-oil": "Prime",
  "neo-hair-lotion": "Treat",
  "ghori-dermaroller": "Stimulate",
};

export const ROLE_LABELS: Record<string, string> = {
  "neo-hair-lotion": "Regrowth Serum",
  "neo-hair-shampoo": "Daily Cleanser",
  "ghori-rosemary-oil": "Nourishing Oil",
  "ghori-dermaroller": "Precision Tool",
};

export const BEST_FOR: Record<string, string> = {
  "neo-hair-lotion": "Density · Regrowth · Hairline",
  "neo-hair-shampoo": "Scalp cleanse · Priming",
  "ghori-rosemary-oil": "Circulation · Shine · Softness",
  "ghori-dermaroller": "Absorption · Follicle stimulation",
};

export type QuizKey = "goal" | "stage" | "time";

export type QuizQuestion = {
  key: QuizKey;
  q: string;
  options: Array<{ label: string; score: Record<string, number> }>;
};

export const QUIZ: QuizQuestion[] = [
  {
    key: "goal",
    q: "What matters most right now?",
    options: [
      {
        label: "Regrow visibly thinning areas",
        score: { "neo-hair-lotion": 3, "ghori-dermaroller": 2 },
      },
      { label: "Reduce daily shedding", score: { "neo-hair-lotion": 2, "neo-hair-shampoo": 2 } },
      {
        label: "Healthier scalp & shine",
        score: { "ghori-rosemary-oil": 3, "neo-hair-shampoo": 2 },
      },
      {
        label: "Improve product absorption",
        score: { "ghori-dermaroller": 3, "ghori-rosemary-oil": 1 },
      },
    ],
  },
  {
    key: "stage",
    q: "Where are you in your journey?",
    options: [
      {
        label: "Just starting — building a routine",
        score: { "neo-hair-shampoo": 2, "neo-hair-lotion": 2 },
      },
      {
        label: "Consistent for months, want more",
        score: { "ghori-dermaroller": 2, "ghori-rosemary-oil": 2 },
      },
      {
        label: "Post-shed / recovery mode",
        score: { "neo-hair-lotion": 3, "ghori-rosemary-oil": 1 },
      },
    ],
  },
  {
    key: "time",
    q: "How much time can you spend daily?",
    options: [
      { label: "Under 2 minutes", score: { "neo-hair-lotion": 2, "neo-hair-shampoo": 1 } },
      { label: "A short 5-min ritual", score: { "ghori-rosemary-oil": 2, "neo-hair-lotion": 1 } },
      {
        label: "Full protocol, twice weekly",
        score: { "ghori-dermaroller": 3, "ghori-rosemary-oil": 1 },
      },
    ],
  },
];

/** Short chip label: text before the first separator, capped at ~34 chars. */
export function shorten(s: string): string {
  const first = s.split(/[·\-—:,(]/)[0].trim();
  return first.length > 34 ? first.slice(0, 32) + "…" : first;
}
