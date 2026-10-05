import { ingredientPosts } from "./blog-ingredient-posts";
import lotionImg from "@/assets/products/neo-hair-lotion.webp";
import shampooImg from "@/assets/products/neo-hair-shampoo.webp";
import dermaImg from "@/assets/products/dermaroller/dr-1.webp";
import rosemaryImg from "@/assets/products/rosemary-biotin-oil.webp";
import lotion2 from "@/assets/products/gallery/lotion-2.webp";
import derma3 from "@/assets/products/dermaroller/dr-3.webp";

export type BlogSection = { heading?: string; body: string[] };
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  read: string;
  category: "Protocol" | "Science" | "Ingredient" | "Ritual" | "Guide";
  cover: string;
  author: string;
  tags: string[];
  sections: BlogSection[];
  /** Direct, quotable answer for answer engines and AI search. */
  answer?: string;
  takeaways?: string[];
  faqs?: { q: string; a: string }[];
};

const p = (...body: string[]): BlogSection => ({ body });
const s = (heading: string, ...body: string[]): BlogSection => ({ heading, body });

const basePosts: BlogPost[] = [
  {
    slug: "neo-hair-lotion-complete-guide",
    title: "Neo Hair Lotion: a complete guide to the 120-day protocol",
    excerpt:
      "A field manual for using Neo Hair Lotion correctly — dose, cadence, expected timeline and the mistakes that quietly cost people results.",
    date: "2026-06-14",
    read: "9 min",
    category: "Protocol",
    cover: lotionImg,
    author: "Green Wealth Editorial",
    tags: ["Neo Hair Lotion", "Protocol", "Hair Growth"],
    sections: [
      p(
        "Most people who try Neo Hair Lotion and give up at week six were never going to see results — not because the formula failed them, but because the protocol was never followed. Botanical scalp actives work on the biological clock of the follicle, not the clock of consumer impatience. This guide is written to fix that.",
      ),
      s(
        "What Neo Hair Lotion actually is",
        "Neo Hair Lotion is a leave-on scalp treatment built around a cold-processed blend of white ginseng, saw palmetto, false daisy (Bhringraj), horsetail and cantaloupe extract. It is not a shampoo, not a serum for the lengths, and not a cosmetic gloss. Every ingredient is chosen to influence one of three things: circulation at the follicle, the enzymatic conversion of testosterone to DHT at the scalp, or the keratin scaffolding of the shaft as it emerges.",
      ),
      s(
        "The 120-day rule",
        "A single human hair follicle runs on a cycle measured in months, not weeks. Anagen — the active growth phase — accounts for years of a healthy follicle's life, but when a follicle has been dormant or miniaturised, it needs roughly 90 to 120 days to visibly re-enter and hold that phase. This is why we describe the protocol in four thirty-day arcs rather than in weeks.",
        "Days 1–30 are the reset. Shedding often increases slightly as weak, telogen-phase hairs are pushed out to make room. This is a signal, not a setback.",
        "Days 31–60 are the quiet phase. Little is visible at the mirror. Under the surface, follicular units are re-vascularising.",
        "Days 61–90 are the emergence phase. Fine, unpigmented vellus hairs appear along the hairline and crown. They are easy to miss unless you photograph the same section under the same light.",
        "Days 91–120 are the consolidation phase. Vellus hairs thicken and pigment. This is the point at which most users first describe the change as obvious to other people.",
      ),
      s(
        "How to apply it correctly",
        "Shake vigorously. The oil-water phases separate on purpose; a lazy shake leaves the actives at the bottom of the bottle.",
        "Part dry or towel-dry hair in narrow rows. Spray directly onto the scalp — never onto the lengths — targeting the areas of concern first: hairline, temples, crown.",
        "Massage for sixty seconds with the pads of the fingers. The massage is not optional. Mechanical stimulation is part of the mechanism.",
        "Do not rinse. Do not follow with a heavy oil for at least four hours; occlusion suffocates the formula's volatile actives.",
      ),
      s(
        "Cadence",
        "Twice daily for the first sixty days, then once daily thereafter. Skipping is more damaging than under-dosing: the botanical actives do not accumulate in tissue, and a missed week resets the clock on the compounded circulatory effect.",
      ),
      s(
        "The mistakes that cost people results",
        "Spraying onto the hair instead of the scalp. The formula is scalp-targeted; hair shafts are dead keratin and cannot use it.",
        "Stopping at day 45 because of the initial shed. That shed is the protocol working.",
        "Layering silicone-heavy stylers on top within the same hour. Silicone films block absorption.",
        "Photographing progress under different lights. Standardise your reference photo: same window, same time of day, same parting.",
      ),
      s(
        "When to pair with the shampoo and dermaroller",
        "The lotion is the anchor. Neo Hair Shampoo replaces sulfate cleansers so the scalp environment is not stripped between doses. The Ghori Dermaroller, used once weekly at 0.5 mm, increases transdermal delivery of the lotion's actives by a measurable margin. Details on both are in their own guides.",
      ),
    ],
  },
  {
    slug: "neo-hair-shampoo-why-sulfate-free-matters",
    title: "Neo Hair Shampoo: why a sulfate-free cleanse changes what your scalp can do",
    excerpt:
      "Sulfates are efficient — and that is the problem. A close look at what Neo Hair Shampoo removes, what it leaves behind, and why the difference matters over a season.",
    date: "2026-05-28",
    read: "7 min",
    category: "Science",
    cover: shampooImg,
    author: "Green Wealth Editorial",
    tags: ["Neo Hair Shampoo", "Scalp Care", "Ingredient Science"],
    sections: [
      p(
        "A shampoo is not, strictly, a hair product. It is a scalp product with a hair-adjacent side effect. Neo Hair Shampoo is designed around that idea: cleanse the scalp environment without stripping the lipid bilayer that keeps the follicle stable.",
      ),
      s(
        "The sulfate problem",
        "Sodium lauryl sulfate and its close relatives are anionic surfactants powerful enough to emulsify motor grease. Applied to a scalp twice a week for years, they do exactly what the label implies: they solubilise sebum, but they also solubilise the ceramides and free fatty acids that make up the scalp's protective film. The follicle responds by over-producing sebum to compensate, which is then re-stripped on the next wash. The loop is efficient, uncomfortable, and slow to break.",
      ),
      s(
        "What Neo Hair Shampoo uses instead",
        "The cleansing base is built from mild amino-acid-derived and coconut-derived surfactants that lift particulate soil without demolishing the barrier. The active layer is botanical: rosemary and biotin to support circulation and keratin cross-linking, panthenol to hold water in the shaft, and a low-percentage tea tree fraction to keep the scalp environment inhospitable to the yeasts implicated in low-grade seborrheic irritation.",
      ),
      s(
        "Why this matters for anyone using Neo Hair Lotion",
        "The lotion works because it can reach living tissue. A stripped, inflamed scalp responds to any topical the way an over-washed hand responds to lotion — by rejecting it. Switching cleansers is not a cosmetic decision; it is the pre-condition that makes the rest of the protocol effective.",
      ),
      s(
        "How to wash for a growth protocol",
        "Two to three times per week is the ceiling for most scalps on the protocol; more frequent washing works against the lotion. Use warm — never hot — water. Emulsify a coin-sized dose in your palms first, then apply to the scalp only and let the lather run down the lengths on its own. Rinse for twice as long as feels necessary; residue is the second most common cause of scalp irritation after over-washing.",
      ),
      s(
        "What to expect in the first month",
        "Hair often feels less slick and more textured for the first two or three washes. This is the scalp recalibrating sebum production. By wash five or six, most users report a cleaner feeling that lasts a full day longer than their previous shampoo delivered.",
      ),
    ],
  },
  {
    slug: "dermaroller-scalp-protocol",
    title: "The dermaroller, done properly: a scalp protocol without the myths",
    excerpt:
      "A microneedling device is a serious tool. Used well, it multiplies the effect of a topical protocol. Used badly, it does the opposite. Here is the way to do it well.",
    date: "2026-05-10",
    read: "8 min",
    category: "Protocol",
    cover: dermaImg,
    author: "Green Wealth Editorial",
    tags: ["Dermaroller", "Microneedling", "Protocol"],
    sections: [
      p(
        "The Ghori Dermaroller is not a spa accessory. It is a microneedling device that, when used correctly, creates transient microchannels in the stratum corneum — improving the transdermal delivery of a topical active and triggering a controlled wound-healing cascade that recruits growth factors to the follicle.",
      ),
      s(
        "Needle length: choose once, then leave it",
        "For scalp use in a growth protocol, 0.5 mm is the working length. Shorter is cosmetic-grade and does not reach the vascular layer that matters. Longer belongs to a clinician's hand, not a home routine. If your device offers a single fixed length, 0.5 mm is the length to buy.",
      ),
      s(
        "Cadence",
        "Once per week. That is not a conservative recommendation; it is a physiological one. The skin's remodelling cycle requires roughly five to seven days to complete a full round of collagen deposition. Rolling more often interrupts the cycle and increases the risk of chronic low-grade inflammation, which is exactly the environment a growing follicle cannot tolerate.",
      ),
      s(
        "The routine",
        "On a wash night, cleanse with Neo Hair Shampoo and dry the scalp completely.",
        "Section the scalp into four quadrants. Roll each quadrant in four directions — vertical, horizontal and both diagonals — with light, even pressure, four to six passes per direction. The scalp should turn faintly pink, not red.",
        "Wait ten minutes. Apply Neo Hair Lotion to the same areas immediately after the waiting period. This is the window where transdermal absorption is meaningfully higher than baseline.",
        "Skip the lotion's morning application on the day after rolling. Give the barrier twenty-four hours to re-seal before returning to twice-daily dosing.",
      ),
      s(
        "Sanitation",
        "Rinse the head in warm water immediately after use, then submerge in a sanitising solution for at least ten minutes. Air-dry, cap, store in the case. Replace the head every eight to ten weeks — the needle tips micro-blunt long before they visibly wear.",
      ),
      s(
        "Who should not use it",
        "Active scalp psoriasis, seborrheic dermatitis in flare, folliculitis, open lesions, recent scalp surgery. If you are on isotretinoin or a systemic steroid, wait until you are six months clear before starting.",
      ),
    ],
  },
  {
    slug: "lotion-vs-shampoo-vs-dermaroller",
    title: "Lotion, shampoo, dermaroller: which one does what",
    excerpt:
      "Three tools, three jobs. A clean explanation of how the Green Wealth stack works together — and what happens if you use only one of them.",
    date: "2026-04-22",
    read: "6 min",
    category: "Guide",
    cover: lotion2,
    author: "Green Wealth Editorial",
    tags: ["Comparison", "System", "Routine"],
    sections: [
      s(
        "Three tools, one system",
        "Neo Hair Lotion is the active. Neo Hair Shampoo is the environment. The Ghori Dermaroller is the delivery multiplier. Removing any one of them does not stop the system working — it slows it.",
      ),
      s(
        "If you use only the lotion",
        "You will see results. They will arrive later, and they will plateau earlier, because a sulfate-cleansed scalp neutralises a fraction of every dose and because untreated stratum corneum is a real absorption barrier.",
      ),
      s(
        "If you use only the shampoo",
        "You will have a healthier scalp and a cleaner-feeling hair day. You will not see meaningful regrowth from a shampoo alone; no cleanser is dosed to influence follicular biology.",
      ),
      s(
        "If you use only the dermaroller",
        "You will trigger the wound-healing cascade weekly with no active to carry into the channels. The literature on standalone microneedling for pattern hair loss is mixed at best. Paired with a topical active, it becomes a serious intervention.",
      ),
      s(
        "The order of operations, weekly",
        "Cleanse two to three times a week with the shampoo. Roll once a week on a wash night, then apply the lotion. Apply the lotion twice a day on every non-rolling day for the first sixty days, then once a day thereafter. Photograph the same section, same light, same parting, every thirty days.",
      ),
    ],
  },
  {
    slug: "reading-a-hair-growth-timeline",
    title: "How to read a hair growth timeline without lying to yourself",
    excerpt:
      "Progress on any real hair protocol is slow, non-linear and easy to misread. A practical guide to measurement, photography and the honest 120-day review.",
    date: "2026-04-05",
    read: "5 min",
    category: "Ritual",
    cover: rosemaryImg,
    author: "Green Wealth Editorial",
    tags: ["Timeline", "Measurement", "Consistency"],
    sections: [
      p(
        "The single largest reason people abandon a working hair protocol is that they measure it wrong. Human perception is poorly built for tracking gradual change on the object it sees most often in the mirror.",
      ),
      s(
        "Set your reference on day zero",
        "Before the first application, take four photographs: hairline straight-on, hairline from above, crown from directly overhead, left temple in profile. Use natural window light at the same time of day. Save the file with the date.",
      ),
      s(
        "Do not photograph weekly",
        "Weekly photos guarantee disappointment. Repeat the four-photograph set every thirty days, in the same light, with the same parting. Compare only the newest set against day zero — never against the previous month.",
      ),
      s(
        "Track the right variables",
        "Shed count in the shower drain for the first thirty days. Vellus hair density along the hairline at day sixty. Pigmentation and calibre of new hair at day ninety. Overall coverage of the crown at day one-hundred-and-twenty.",
      ),
      s(
        "The honest review",
        "At day one-hundred-and-twenty, place the day-zero and day-one-twenty photographs side by side and ask a person who does not live with you which is which. Their answer is the review. Everything else is noise.",
      ),
    ],
  },
  {
    slug: "the-five-botanicals-behind-neo-hair-lotion",
    title: "The five botanicals behind Neo Hair Lotion",
    excerpt:
      "White ginseng, saw palmetto, false daisy, horsetail and cantaloupe extract — what each one does and why the formula chose them together.",
    date: "2026-03-18",
    read: "7 min",
    category: "Ingredient",
    cover: derma3,
    author: "Green Wealth Editorial",
    tags: ["Ingredients", "Botanicals", "Formulation"],
    sections: [
      s(
        "White ginseng (Panax ginseng)",
        "Cold-processed white ginseng contributes ginsenosides that appear, in scalp studies, to support dermal papilla cell proliferation and modest local vasodilation. In practical terms, more blood reaches the follicular unit for longer.",
      ),
      s(
        "Saw palmetto (Serenoa repens)",
        "Saw palmetto lipid extracts have a documented inhibitory effect on the 5-alpha-reductase enzyme responsible for converting testosterone to DHT — the androgen most implicated in follicular miniaturisation. A topical dose is not a systemic drug and should not be described as one, but the local effect at the scalp is measurable.",
      ),
      s(
        "False daisy (Eclipta alba, or Bhringraj)",
        "The most storied botanical in the formula. Its traditional use in Ayurvedic hair oils is supported by contemporary work showing extended anagen-phase duration in follicular models. In the formula it plays the role of the long-cycle stabiliser.",
      ),
      s(
        "Horsetail (Equisetum arvense)",
        "A silica-rich botanical whose contribution is structural rather than biochemical. Silica supports the cross-linking of keratin as the shaft emerges, which shows up as improved calibre and shine on hair grown while the protocol is running.",
      ),
      s(
        "Cantaloupe extract (Cucumis melo)",
        "The formula's antioxidant anchor. Cantaloupe extract is unusually rich in superoxide dismutase, an enzyme that neutralises the oxidative stress the scalp accumulates from UV and environmental pollutants. Reducing oxidative load extends the productive life of the follicle.",
      ),
      s(
        "Why these five, together",
        "Any one of them alone is a modest ingredient. Together they cover the four axes that determine follicular output — circulation, androgen environment, cycle duration and oxidative load. The formula is a system, and the botanicals are its parts.",
      ),
    ],
  },
];

export const posts: BlogPost[] = [...basePosts, ...ingredientPosts].sort((a, b) => b.date.localeCompare(a.date));

export const postBySlug = (slug: string) => posts.find((post) => post.slug === slug);

/** Return up to `limit` blog posts whose tags or slug reference the product. */
export const relatedPosts = (productSlug: string, productName: string, limit = 3): BlogPost[] => {
  const nameToken = productName.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = posts.map((p) => {
    const hay = (p.tags.join(" ") + " " + p.slug + " " + p.title).toLowerCase();
    let score = 0;
    if (hay.includes(productSlug.replace(/-/g, " "))) score += 3;
    for (const t of nameToken) if (t.length > 3 && hay.includes(t)) score += 1;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const picked = scored.filter((s) => s.score > 0).map((s) => s.p);
  return (picked.length ? picked : posts).slice(0, limit);
};
