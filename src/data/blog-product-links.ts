/**
 * Journal → product references. For each article: which Green Wealth products
 * it relates to, and how the topic applies inside that product (EN + AR).
 */
export type ProductSlug =
  "neo-hair-lotion" | "neo-hair-shampoo" | "ghori-rosemary-oil" | "ghori-dermaroller";

export interface ProductRef {
  slug: ProductSlug;
  en: string;
  ar: string;
}

export const PRODUCT_LABEL: Record<ProductSlug, { en: string; ar: string }> = {
  "neo-hair-lotion": { en: "Neo Hair Lotion", ar: "لوشن نيو للشعر" },
  "neo-hair-shampoo": { en: "Neo Hair Shampoo · 250 ml", ar: "شامبو نيو للشعر · 250 مل" },
  "ghori-rosemary-oil": { en: "Ghori Rosemary Oil · 60 ml", ar: "زيت غوري بالروزماري · 60 مل" },
  "ghori-dermaroller": { en: "Ghori Derma Roller", ar: "جهاز غوري ديرمارولر" },
};

const LOTION_BOTANICALS = {
  en: "Carries the core botanical complex — saw palmetto, white ginseng, horsetail, false daisy (bhringraj) and cantaloupe — in a leave-on base applied directly to the scalp.",
  ar: "يحمل المركّب النباتي الأساسي — البلميط المنشاري والجنسنغ الأبيض وذيل الحصان والبهرينجراج والشمام — في قاعدة تُترك على فروة الرأس مباشرة.",
};
const SHAMPOO_BOTANICALS = {
  en: "A sulfate-free cleanser that includes saw palmetto, white ginseng, rosemary and cantaloupe, so the scalp is cleansed without stripping before leave-on care.",
  ar: "منظّف خالٍ من الكبريتات يحتوي على البلميط المنشاري والجنسنغ الأبيض والروزماري والشمام، لتنظيف فروة الرأس دون تجريدها قبل العناية التي تُترك عليها.",
};
const ROLLER = {
  en: "Used once weekly before a leave-on product, micro-channels may help botanical actives reach the scalp more evenly.",
  ar: "يُستخدم مرة أسبوعيًا قبل المنتج الذي يُترك على الفروة، وقد تساعد القنوات الدقيقة على وصول المكونات النباتية إلى فروة الرأس بشكل أكثر تجانسًا.",
};

export const BLOG_PRODUCT_REFS: Record<string, ProductRef[]> = {
  "rosemary-oil-for-hair-growth-evidence": [
    {
      slug: "ghori-rosemary-oil",
      en: "Rosemary essential oil pre-diluted in a carrier with biotin, peppermint, vitamin E, aloe vera, castor and coconut oil — ready for scalp massage without DIY dilution.",
      ar: "زيت الروزماري العطري مخفّف مسبقًا في زيت حامل مع البيوتين والنعناع وفيتامين E والصبار وزيت الخروع وجوز الهند — جاهز لتدليك فروة الرأس دون تخفيف منزلي.",
    },
    {
      slug: "neo-hair-shampoo",
      en: "Includes rosemary in a sulfate-free wash, adding a gentle rosemary step to every cleanse.",
      ar: "يحتوي على الروزماري ضمن غسول خالٍ من الكبريتات، ليضيف خطوة روزماري لطيفة إلى كل غسلة.",
    },
  ],
  "saw-palmetto-dht-hair-loss": [
    {
      slug: "neo-hair-lotion",
      en: "Saw palmetto is a key leave-on botanical in the formula, staying on the scalp between washes.",
      ar: "البلميط المنشاري مكوّن نباتي رئيسي في التركيبة التي تُترك على الفروة، فيبقى على فروة الرأس بين الغسلات.",
    },
    {
      slug: "neo-hair-shampoo",
      en: "Also includes saw palmetto, so the cleansing step supports the same botanical routine.",
      ar: "يحتوي أيضًا على البلميط المنشاري، فتدعم خطوة التنظيف الروتين النباتي نفسه.",
    },
  ],
  "white-ginseng-scalp-circulation": [
    {
      slug: "neo-hair-lotion",
      en: "White ginseng (Radix Alba) is part of the leave-on botanical complex massaged into the scalp.",
      ar: "الجنسنغ الأبيض (Radix Alba) جزء من المركّب النباتي الذي يُدلَّك في فروة الرأس ويُترك عليها.",
    },
    {
      slug: "neo-hair-shampoo",
      en: "White ginseng is included in the wash for a consistent botanical routine.",
      ar: "الجنسنغ الأبيض مُضمَّن في الغسول لروتين نباتي متّسق.",
    },
  ],
  "bhringraj-false-daisy-hair-tradition-science": [
    {
      slug: "neo-hair-lotion",
      en: "False daisy (bhringraj), the classic Ayurvedic hair herb, is one of the lotion's leave-on botanicals.",
      ar: "البهرينجراج، عشبة الشعر الأيورفيدية الكلاسيكية، من المكونات النباتية في اللوشن الذي يُترك على الفروة.",
    },
  ],
  "horsetail-silica-hair-strength": [
    {
      slug: "neo-hair-lotion",
      en: "Horsetail extract, a natural source of silica, is included in the lotion's botanical complex.",
      ar: "مستخلص ذيل الحصان، مصدر طبيعي للسيليكا، مُضمَّن في المركّب النباتي للوشن.",
    },
  ],
  "biotin-for-hair-myths-and-facts": [
    {
      slug: "ghori-rosemary-oil",
      en: "Contains biotin alongside rosemary in a topical scalp oil — a topical complement, not a replacement for addressing a true deficiency.",
      ar: "يحتوي على البيوتين مع الروزماري في زيت موضعي لفروة الرأس — مكمّل موضعي وليس بديلًا عن علاج نقص حقيقي.",
    },
  ],
  "neo-hair-lotion-complete-guide": [
    { slug: "neo-hair-lotion", ...LOTION_BOTANICALS },
    { slug: "ghori-dermaroller", ...ROLLER },
  ],
  "neo-hair-shampoo-why-sulfate-free-matters": [
    { slug: "neo-hair-shampoo", ...SHAMPOO_BOTANICALS },
    {
      slug: "neo-hair-lotion",
      en: "Follows the shampoo as the leave-on step on a clean, un-stripped scalp.",
      ar: "يأتي بعد الشامبو كخطوة تُترك على فروة رأس نظيفة غير مجرّدة.",
    },
  ],
  "dermaroller-scalp-protocol": [
    { slug: "ghori-dermaroller", ...ROLLER },
    {
      slug: "neo-hair-lotion",
      en: "The recommended leave-on product to apply after rolling, on a clean scalp.",
      ar: "المنتج الموصى به للتطبيق بعد استخدام الرولر على فروة رأس نظيفة.",
    },
  ],
  "lotion-vs-shampoo-vs-dermaroller": [
    { slug: "neo-hair-shampoo", ...SHAMPOO_BOTANICALS },
    { slug: "neo-hair-lotion", ...LOTION_BOTANICALS },
    { slug: "ghori-dermaroller", ...ROLLER },
  ],
  "reading-a-hair-growth-timeline": [
    {
      slug: "neo-hair-lotion",
      en: "Designed for consistent daily use over a 120-day protocol — the timeline this article explains.",
      ar: "مصمَّم للاستخدام اليومي المنتظم ضمن بروتوكول 120 يومًا — وهو المسار الزمني الذي يشرحه هذا المقال.",
    },
    { slug: "neo-hair-shampoo", ...SHAMPOO_BOTANICALS },
  ],
  "the-five-botanicals-behind-neo-hair-lotion": [{ slug: "neo-hair-lotion", ...LOTION_BOTANICALS }],
};

export const blogProductRefs = (slug: string): ProductRef[] =>
  BLOG_PRODUCT_REFS[slug] ?? [
    { slug: "neo-hair-lotion", ...LOTION_BOTANICALS },
    { slug: "neo-hair-shampoo", ...SHAMPOO_BOTANICALS },
  ];
