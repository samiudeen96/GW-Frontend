/**
 * Ingredient Dossier series — long-form, answer-first journal entries about the
 * botanicals and actives used across the Green Wealth range. Written for search
 * engines, answer engines and generative AI: every entry opens with a direct
 * answer, lists key takeaways and closes with question-form FAQs (FAQPage schema).
 */
import ingRosemary from "@/assets/ingredients/rosemary.jpg";
import ingSawPalmetto from "@/assets/ingredients/saw-palmetto.webp";
import ingGinseng from "@/assets/ingredients/ginseng.webp";
import ingFalseDaisy from "@/assets/ingredients/false-daisy.webp";
import ingHorsetail from "@/assets/ingredients/horsetail.webp";
import ingBiotin from "@/assets/ingredients/biotin.jpg";
import type { BlogPost } from "./blog-posts";

const s = (heading: string, ...body: string[]) => ({ heading, body });

export const ingredientPosts: BlogPost[] = [
  {
    slug: "rosemary-oil-for-hair-growth-evidence",
    title: "Rosemary oil for hair growth: what the evidence actually says",
    excerpt:
      "Rosemary oil is the most searched botanical for thinning hair. Here is what the research shows, how it is thought to work, how to use it on the scalp and what to realistically expect.",
    date: "2026-09-20",
    read: "11 min",
    category: "Ingredient",
    cover: ingRosemary,
    author: "Green Wealth Editorial",
    tags: ["Rosemary", "Ghori Rosemary Oil", "Hair Growth", "Ingredient Dossier"],
    answer:
      "Rosemary oil (Rosmarinus officinalis) may support hair growth by improving scalp microcirculation and providing antioxidant compounds such as carnosic acid. A frequently cited 2015 randomised trial found rosemary oil performed comparably to 2% minoxidil for androgenetic alopecia after six months, with less scalp itching. Evidence is promising but limited to small studies; results require consistent use for at least three to six months.",
    takeaways: [
      "The strongest human data is one 2015 six-month comparative trial — encouraging, not conclusive.",
      "Carnosic acid and 1,8-cineole are the compounds most associated with its scalp effects.",
      "Always dilute: rosemary essential oil belongs in a carrier oil, never neat on skin.",
      "Visible change is measured in months. Judge it at day 90, not day 14.",
    ],
    sections: [
      s(
        "What rosemary oil is",
        "Rosemary oil is the volatile essential oil steam-distilled from the leaves of Rosmarinus officinalis, a Mediterranean shrub of the mint family. Its aroma comes from 1,8-cineole, camphor and alpha-pinene; its antioxidant reputation comes largely from carnosic acid and rosmarinic acid found in the leaf.",
        "For scalp use it is almost always blended into a carrier. In Ghori Rosemary Oil it sits alongside biotin, peppermint oil, vitamin E, aloe vera, castor seed oil and coconut oil, so the essential oil is delivered at a skin-appropriate dilution.",
      ),
      s(
        "What the research shows",
        "The study most people refer to is a 2015 randomised comparative trial published in SKINmed, in which 100 adults with androgenetic alopecia used either rosemary oil or 2% minoxidil for six months. Both groups showed a significant increase in hair count at month six, with no significant difference between them — and the rosemary group reported less scalp itching.",
        "That is a meaningful result, but it is one trial of modest size. Animal and cell studies add supporting evidence that rosemary leaf extract may inhibit 5-alpha-reductase activity and improve local blood flow. Honest summary: rosemary is one of the better-supported botanicals for thinning hair, and the evidence base is still growing.",
      ),
      s(
        "How it is thought to work",
        "Microcirculation. Topical rosemary is associated with a mild vasodilating, warming effect that may improve nutrient delivery to the follicle.",
        "Antioxidant protection. Carnosic acid helps neutralise oxidative stress at the scalp, a factor linked to follicle ageing.",
        "Androgen environment. Laboratory work suggests rosemary extract can reduce the activity of the enzyme that converts testosterone to DHT, the hormone most linked to pattern hair loss.",
      ),
      s(
        "How to use rosemary oil on the scalp",
        "Apply a few drops of a ready-diluted rosemary blend directly to the scalp, section by section, focusing on the hairline, temples and crown.",
        "Massage for two to three minutes with the fingertips. Leave on for at least an hour, or overnight, then wash with a gentle, sulfate-free shampoo such as Neo Hair Shampoo.",
        "Use two to three times per week. Consistency over months matters more than the amount per application.",
      ),
      s(
        "Safety and who should be careful",
        "Never apply undiluted rosemary essential oil to skin. Patch-test a small area behind the ear 24 hours before first use. Avoid contact with the eyes. People who are pregnant, breastfeeding, have epilepsy, or have a sensitive or broken scalp should speak with a clinician first. Rosemary is not a substitute for medical diagnosis of sudden or patchy hair loss.",
      ),
    ],
    faqs: [
      {
        q: "Does rosemary oil really regrow hair?",
        a: "Rosemary oil may support regrowth in androgenetic alopecia. A 2015 six-month trial found results comparable to 2% minoxidil. It is not guaranteed to work for everyone, and evidence is based on a small number of studies.",
      },
      {
        q: "How long does rosemary oil take to work for hair?",
        a: "Most people need three to six months of consistent use before visible change, because hair follicles move through growth cycles over months.",
      },
      {
        q: "Can I leave rosemary oil in my hair overnight?",
        a: "Yes, a properly diluted rosemary blend can be left on overnight. Wash out the next morning with a gentle shampoo.",
      },
      {
        q: "Is rosemary oil better than minoxidil?",
        a: "One trial showed similar hair-count results after six months, with less itching for rosemary. Minoxidil has a much larger evidence base. Speak with a dermatologist to choose what suits you.",
      },
    ],
  },
  {
    slug: "saw-palmetto-dht-hair-loss",
    title: "Saw palmetto and DHT: a plain-language guide for thinning hair",
    excerpt:
      "Why saw palmetto appears in so many hair formulas, what DHT has to do with pattern hair loss, and what topical saw palmetto can and cannot do.",
    date: "2026-09-18",
    read: "10 min",
    category: "Ingredient",
    cover: ingSawPalmetto,
    author: "Green Wealth Editorial",
    tags: ["Saw Palmetto", "Neo Hair Lotion", "DHT", "Ingredient Dossier"],
    answer:
      "Saw palmetto (Serenoa repens) is a palm berry extract studied for its ability to inhibit 5-alpha-reductase, the enzyme that converts testosterone into dihydrotestosterone (DHT). Because DHT drives follicle miniaturisation in androgenetic alopecia, saw palmetto is used as a botanical DHT modulator. Small human studies report improvements in hair density with topical and oral forms, though the effect is milder than prescription treatments.",
    takeaways: [
      "DHT shrinks genetically sensitive follicles — saw palmetto targets the enzyme that makes it.",
      "Topical use concentrates the effect at the scalp rather than throughout the body.",
      "Evidence is encouraging but based on small studies; expect a gentle, gradual effect.",
      "It works best as part of a system that also addresses circulation and scalp health.",
    ],
    sections: [
      s(
        "What DHT does to hair",
        "Dihydrotestosterone is a potent androgen formed when the enzyme 5-alpha-reductase acts on testosterone. In people with a genetic sensitivity, DHT binds to receptors in scalp follicles and gradually shortens the growth phase. Over successive cycles the follicle miniaturises — producing thinner, shorter, lighter hairs until it may stop producing visible hair at all.",
      ),
      s(
        "What saw palmetto is",
        "Saw palmetto is a small palm native to the south-eastern United States. Its berries are rich in fatty acids (lauric, oleic, myristic) and phytosterols such as beta-sitosterol. These lipophilic compounds are the ones associated with its enzyme-modulating activity.",
        "In Neo Hair Lotion, saw palmetto is included at 2% alongside white ginseng, false daisy, horsetail and cantaloupe extract, so it contributes to the androgen-environment axis of the formula.",
      ),
      s(
        "What the research shows",
        "Laboratory studies show saw palmetto extract can inhibit both types of 5-alpha-reductase. A 2012 comparative study found that oral saw palmetto improved hair growth in a proportion of men with androgenetic alopecia, though less than finasteride. Reviews of topical botanical products containing saw palmetto report improvements in hair density and patient satisfaction, while noting study sizes are small.",
        "The fair conclusion is that saw palmetto is a reasonable, well-tolerated botanical option for people who want a gentler approach, with realistic expectations.",
      ),
      s(
        "Topical versus oral",
        "Topical application places the extract where follicles are, reducing whole-body exposure. Oral supplements are more widely studied for prostate health than for hair. For scalp-focused routines, a leave-on lotion massaged into the scalp once or twice daily is the most direct route.",
      ),
      s(
        "Safety",
        "Topical saw palmetto is generally well tolerated; mild irritation is uncommon. Because it influences androgen metabolism, it is not recommended during pregnancy or breastfeeding. Anyone taking hormonal medication should check with a clinician.",
      ),
    ],
    faqs: [
      {
        q: "Does saw palmetto block DHT?",
        a: "Saw palmetto inhibits the enzyme 5-alpha-reductase in laboratory studies, which reduces DHT formation. It is a partial, gentle effect rather than a complete block.",
      },
      {
        q: "Is topical saw palmetto effective for hair loss?",
        a: "Small studies of topical formulas containing saw palmetto report improved hair density. It is best viewed as a supportive botanical, not a prescription replacement.",
      },
      {
        q: "Can women use saw palmetto for hair?",
        a: "Adult women can use topical saw palmetto, but it should be avoided during pregnancy and breastfeeding because it influences hormone metabolism.",
      },
    ],
  },
  {
    slug: "white-ginseng-scalp-circulation",
    title: "White ginseng for hair: ginsenosides, circulation and the growth phase",
    excerpt:
      "An evidence-led look at Panax ginseng and the ginsenosides that make it one of the most studied botanicals for keeping follicles in their growth phase.",
    date: "2026-09-15",
    read: "9 min",
    category: "Ingredient",
    cover: ingGinseng,
    author: "Green Wealth Editorial",
    tags: ["White Ginseng", "Neo Hair Lotion", "Ginsenosides", "Ingredient Dossier"],
    answer:
      "White ginseng is the peeled, air-dried root of Panax ginseng. Its active compounds, ginsenosides such as Rb1 and Rg3, have been shown in laboratory and small clinical studies to stimulate dermal papilla cells, support scalp circulation and help prolong the anagen (growth) phase of the hair cycle. It is used topically as a supportive ingredient for thinning hair.",
    takeaways: [
      "Ginsenosides are the active group — Rb1 and Rg3 are the most studied for hair.",
      "The main proposed benefit is keeping follicles in the growth phase for longer.",
      "White ginseng is dried without steaming, unlike red ginseng, preserving a different ginsenoside profile.",
      "It pairs naturally with DHT-focused botanicals such as saw palmetto.",
    ],
    sections: [
      s(
        "White ginseng versus red ginseng",
        "Both come from the same plant, Panax ginseng. White ginseng is peeled and air-dried; red ginseng is steamed before drying, which changes its ginsenoside composition. Both are studied for hair, and white ginseng is valued for its gentler, balanced profile in topical use.",
      ),
      s(
        "How ginsenosides act on the follicle",
        "The dermal papilla is the signalling centre at the base of every follicle. Cell studies show ginsenosides can increase dermal papilla cell proliferation and influence growth-factor signalling associated with the anagen phase.",
        "Ginseng is also linked with improved microcirculation and antioxidant activity, both relevant to a healthy scalp environment.",
      ),
      s(
        "What human studies show",
        "Small clinical studies using ginseng-containing topical formulas have reported improvements in hair density and thickness over 16 to 24 weeks compared with placebo. These studies are encouraging but modest in size, and ginseng is typically one active among several.",
      ),
      s(
        "Its role in Neo Hair Lotion",
        "White ginseng is included at 2% in Neo Hair Lotion, where it supports the cycle-duration axis of the formula — alongside saw palmetto for androgen environment, false daisy for traditional scalp support, horsetail for silica and cantaloupe extract for antioxidant protection.",
      ),
      s(
        "Safety",
        "Topical ginseng is well tolerated by most people. Patch-test first if you have sensitive skin, and stop use if redness or itching persists.",
      ),
    ],
    faqs: [
      {
        q: "Is ginseng good for hair growth?",
        a: "Ginseng may support hair growth by stimulating dermal papilla cells and helping prolong the growth phase. Evidence comes from laboratory work and small clinical studies.",
      },
      {
        q: "What is the difference between white and red ginseng for hair?",
        a: "White ginseng is air-dried and red ginseng is steamed first. Both come from Panax ginseng but have different ginsenoside profiles; both are studied for hair.",
      },
      {
        q: "How long should I use ginseng on my scalp?",
        a: "Studies typically measure results after 16 to 24 weeks of consistent daily use.",
      },
    ],
  },
  {
    slug: "bhringraj-false-daisy-hair-tradition-science",
    title: "Bhringraj (false daisy): the Ayurvedic 'king of hair' meets modern research",
    excerpt:
      "Eclipta alba has been used for scalp care for centuries. We separate tradition from evidence and explain why it earns its place in a modern formula.",
    date: "2026-09-12",
    read: "10 min",
    category: "Ingredient",
    cover: ingFalseDaisy,
    author: "Green Wealth Editorial",
    tags: ["False Daisy", "Bhringraj", "Neo Hair Lotion", "Ingredient Dossier"],
    answer:
      "Bhringraj, also called false daisy (Eclipta alba or Eclipta prostrata), is a herb used in Ayurveda for scalp and hair care for centuries. Animal studies suggest its extract can shorten the time for follicles to enter the growth phase and increase follicle numbers, with one study reporting effects comparable to 2% minoxidil in mice. Human clinical data is still limited.",
    takeaways: [
      "Known in Sanskrit as Bhringraj, often translated as 'king of hair'.",
      "Contains wedelolactone and other coumestans associated with its biological activity.",
      "Animal data is strong; human trials are still needed — tradition and evidence both matter here.",
      "Used at 3% in Neo Hair Lotion as its traditional scalp-support botanical.",
    ],
    sections: [
      s(
        "A plant with a long history",
        "False daisy grows in damp, warm regions across South Asia and beyond. In Ayurvedic practice it is prepared as oils and pastes for the scalp, traditionally associated with darker, fuller hair and a calm scalp. Its Sanskrit name, Bhringraj, is commonly translated as 'ruler of hair'.",
      ),
      s(
        "The active compounds",
        "Eclipta alba contains coumestans such as wedelolactone, along with flavonoids, triterpenoid saponins and alkaloids. Wedelolactone in particular is studied for antioxidant and anti-inflammatory activity.",
      ),
      s(
        "What the research shows",
        "In a frequently cited animal study, topical Eclipta alba extract promoted earlier transition of follicles into the anagen phase and increased follicle density, with results the authors described as comparable to or better than minoxidil. Other animal research supports these hair-promoting effects.",
        "The honest caveat: robust human clinical trials are still limited. Bhringraj is best described as a traditionally used botanical with encouraging preclinical support.",
      ),
      s(
        "Why it sits in Neo Hair Lotion",
        "At 3%, false daisy is one of the two highest-concentration botanicals in Neo Hair Lotion. It brings the traditional scalp-care dimension to a formula whose other actives address circulation, the androgen environment and oxidative load.",
      ),
      s(
        "Safety",
        "Topical use is generally well tolerated. As with any botanical, patch-test first and discontinue use if irritation develops.",
      ),
    ],
    faqs: [
      {
        q: "What is Bhringraj in English?",
        a: "Bhringraj is called false daisy in English. Its botanical name is Eclipta alba, also listed as Eclipta prostrata.",
      },
      {
        q: "Does Bhringraj help hair growth?",
        a: "Animal studies show Bhringraj extract can promote the hair growth phase and increase follicle numbers. Human studies are still limited, so it is best seen as a supportive botanical.",
      },
      {
        q: "Can Bhringraj be used every day?",
        a: "Yes, topical Bhringraj in a formulated product can be used daily. Patch-test first if your scalp is sensitive.",
      },
    ],
  },
  {
    slug: "horsetail-silica-hair-strength",
    title: "Horsetail extract and silica: building stronger hair from the root",
    excerpt:
      "Equisetum arvense is one of nature's richest sources of silica. Here is how silica relates to hair strength and what horsetail brings to scalp care.",
    date: "2026-09-09",
    read: "8 min",
    category: "Ingredient",
    cover: ingHorsetail,
    author: "Green Wealth Editorial",
    tags: ["Horsetail", "Silica", "Neo Hair Lotion", "Ingredient Dossier"],
    answer:
      "Horsetail (Equisetum arvense) is a fern-like plant naturally rich in silica, a mineral associated with the strength and elasticity of hair, skin and nails. Silica supports the connective structures around the follicle and may reduce brittleness. Small studies using silica-containing supplements have reported improved hair thickness and strength in women with self-perceived thinning.",
    takeaways: [
      "Horsetail is among the most silica-rich plants known.",
      "Silica is linked to hair tensile strength and elasticity rather than growth speed.",
      "It targets the quality of the strand that emerges, complementing growth-focused actives.",
      "Used at 3% in Neo Hair Lotion.",
    ],
    sections: [
      s(
        "A living fossil",
        "Horsetail is a descendant of plants that grew hundreds of millions of years ago. Its hollow, jointed stems accumulate silica from the soil, which gives the plant its rigid, slightly abrasive texture.",
      ),
      s(
        "Why silica matters for hair",
        "Silica, in the form of orthosilicic acid, is involved in the formation of collagen and connective tissue. Research links silicon status to hair tensile strength and elasticity. Stronger strands break less, which contributes to hair looking fuller over time.",
      ),
      s(
        "What the research shows",
        "A 2016 placebo-controlled study of a supplement containing horsetail-derived silica reported increased hair growth and thickness in women with self-perceived thinning over 90 and 180 days. Topical data for horsetail alone is limited; it is typically one active within a broader formula.",
      ),
      s(
        "Its role in the Green Wealth system",
        "In Neo Hair Lotion, horsetail addresses the structural axis — the quality of the strand — while ginseng, saw palmetto and false daisy work on the growth cycle and follicle environment.",
      ),
      s(
        "Safety",
        "Topical horsetail extract is generally well tolerated. Oral horsetail supplements are a different matter and should be discussed with a clinician, particularly for people with kidney conditions.",
      ),
    ],
    faqs: [
      {
        q: "Is horsetail good for hair?",
        a: "Horsetail is rich in silica, which is associated with stronger, more elastic hair. Small supplement studies have reported improved hair thickness.",
      },
      {
        q: "Does silica make hair grow faster?",
        a: "Silica is linked more to strength and thickness than growth speed. Stronger hair breaks less, which helps hair look fuller.",
      },
    ],
  },
  {
    slug: "biotin-for-hair-myths-and-facts",
    title: "Biotin for hair: myths, facts and when it genuinely helps",
    excerpt:
      "Biotin is the most famous hair vitamin — and the most misunderstood. A clear guide to what biotin does, who benefits and why topical biotin is used in scalp oils.",
    date: "2026-09-06",
    read: "8 min",
    category: "Ingredient",
    cover: ingBiotin,
    author: "Green Wealth Editorial",
    tags: ["Biotin", "Ghori Rosemary Oil", "Vitamins", "Ingredient Dossier"],
    answer:
      "Biotin (vitamin B7) is a water-soluble vitamin needed for the metabolism of fats, carbohydrates and amino acids, including those used to build keratin. Biotin supplements clearly help people with a biotin deficiency, but evidence that extra biotin improves hair in healthy people is weak. In topical scalp products, biotin is used as a conditioning, supportive ingredient alongside other actives.",
    takeaways: [
      "Biotin is essential for keratin-related metabolism, but true deficiency is uncommon.",
      "Supplementing without a deficiency has limited evidence for hair growth.",
      "High-dose biotin supplements can interfere with some laboratory blood tests — tell your doctor.",
      "Topical biotin in Ghori Rosemary Oil plays a supporting, conditioning role.",
    ],
    sections: [
      s(
        "What biotin does in the body",
        "Biotin is a coenzyme for carboxylase enzymes involved in processing fats, sugars and amino acids. Because hair is built from keratin, a protein, biotin has become closely associated with hair health.",
      ),
      s(
        "Myth: more biotin means more hair",
        "A 2017 review found that in almost all reported cases where biotin improved hair, the person had an underlying deficiency or condition. For most healthy people, there is little evidence that extra biotin speeds growth.",
      ),
      s(
        "Fact: deficiency causes hair problems",
        "Biotin deficiency, though uncommon, can cause thinning hair, brittle nails and skin changes. Risk factors include certain genetic conditions, some medications, long-term antibiotic use and heavy consumption of raw egg whites. A clinician can assess this.",
      ),
      s(
        "Why biotin appears in scalp oils",
        "In Ghori Rosemary Oil, biotin is paired with rosemary leaf oil, peppermint oil, vitamin E, aloe vera, castor seed oil and coconut oil. Its role is supportive and conditioning — the growth-oriented work comes from rosemary and scalp massage.",
      ),
      s(
        "An important safety note",
        "High-dose oral biotin can distort some laboratory test results, including certain thyroid and cardiac tests. If you take biotin supplements, tell your doctor before blood tests.",
      ),
    ],
    faqs: [
      {
        q: "Does biotin actually help hair growth?",
        a: "Biotin helps hair when a person is deficient. For people with normal biotin levels, evidence that extra biotin improves hair growth is limited.",
      },
      {
        q: "Can you apply biotin directly to the scalp?",
        a: "Yes, biotin is used in topical scalp products as a supportive, conditioning ingredient. Its effect is milder than correcting a deficiency through diet.",
      },
      {
        q: "What are signs of biotin deficiency?",
        a: "Signs can include thinning hair, brittle nails and a red, scaly rash. A clinician can confirm deficiency with testing.",
      },
    ],
  },
];
