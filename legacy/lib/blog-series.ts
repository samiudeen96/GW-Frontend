/**
 * Journal Series — "The Hair Recovery Curriculum".
 * Purpose: a fixed reading order that links all journal articles together,
 * powering the /blogs/series overview and next/previous navigation in articles.
 */
import { posts, type BlogPost } from "./blog-posts";

type L = { en: string; ar: string };

export type SeriesPart = { key: string; title: L; summary: L; slugs: string[] };

export const SERIES_TITLE: L = { en: "The Hair Recovery Curriculum", ar: "منهج تعافي الشعر" };
export const SERIES_INTRO: L = {
  en: "Twelve essays in a deliberate order: understand the biology, meet the botanicals, then build a routine you can sustain. Read start to finish, or jump into any part.",
  ar: "اثنا عشر مقالًا بترتيب مدروس: افهم البيولوجيا، تعرّف على النباتات، ثم ابنِ روتينًا يمكنك الاستمرار عليه. اقرأ من البداية إلى النهاية أو ابدأ من أي جزء.",
};

export const SERIES_PARTS: SeriesPart[] = [
  {
    key: "foundations",
    title: { en: "Part I — Foundations", ar: "الجزء الأول — الأساسيات" },
    summary: {
      en: "How hair grows, why it thins, and what a realistic timeline looks like.",
      ar: "كيف ينمو الشعر، ولماذا يخفّ، وكيف يبدو الجدول الزمني الواقعي.",
    },
    slugs: ["reading-a-hair-growth-timeline", "neo-hair-lotion-complete-guide", "lotion-vs-shampoo-vs-dermaroller"],
  },
  {
    key: "botanicals",
    title: { en: "Part II — The Botanicals", ar: "الجزء الثاني — المكوّنات النباتية" },
    summary: {
      en: "Ingredient by ingredient: what the research says, and where it is still limited.",
      ar: "مكوّنًا تلو الآخر: ماذا تقول الأبحاث، وأين لا تزال محدودة.",
    },
    slugs: [
      "the-five-botanicals-behind-neo-hair-lotion",
      "rosemary-oil-for-hair-growth-evidence",
      "saw-palmetto-dht-hair-loss",
      "white-ginseng-scalp-circulation",
      "bhringraj-false-daisy-hair-tradition-science",
      "horsetail-silica-hair-strength",
    ],
  },
  {
    key: "ritual",
    title: { en: "Part III — The Ritual", ar: "الجزء الثالث — الروتين" },
    summary: {
      en: "Cleansing, micro-needling and nutrition — turning science into a daily habit.",
      ar: "التنظيف والوخز الدقيق والتغذية — تحويل العلم إلى عادة يومية.",
    },
    slugs: ["neo-hair-shampoo-why-sulfate-free-matters", "dermaroller-scalp-protocol", "biotin-for-hair-myths-and-facts"],
  },
];

const bySlug = new Map(posts.map((p) => [p.slug, p]));
const listed = SERIES_PARTS.flatMap((p) => p.slugs);
/** Ordered reading list; any post not assigned to a part is appended at the end. */
export const SERIES_ORDER: BlogPost[] = [
  ...listed.map((s) => bySlug.get(s)).filter((p): p is BlogPost => !!p),
  ...posts.filter((p) => !listed.includes(p.slug)),
];

export function seriesPosition(slug: string) {
  const i = SERIES_ORDER.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  const part = SERIES_PARTS.find((p) => p.slugs.includes(slug)) ?? null;
  return {
    index: i,
    total: SERIES_ORDER.length,
    part,
    prev: i > 0 ? SERIES_ORDER[i - 1] : null,
    next: i < SERIES_ORDER.length - 1 ? SERIES_ORDER[i + 1] : null,
  };
}

export const pick = (l: L, locale: string) => (locale === "ar" ? l.ar : l.en);
