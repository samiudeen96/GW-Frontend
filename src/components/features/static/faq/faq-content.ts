/** FAQ page content (English source; translated per key in the page). */

export type Faq = { q: string; a: string; related?: { label: string; to: string }[] };
export type FaqSection = { id: string; title: string; faqs: Faq[] };

const PRODUCT_LINKS = {
  lotion: { label: "Neo Hair Lotion", to: "/product/neo-hair-lotion" },
  shampoo: { label: "Neo Hair Shampoo", to: "/product/neo-hair-shampoo" },
  roller: { label: "Ghori Derma Roller", to: "/product/ghori-dermaroller" },
  oil: { label: "Rosemary Oil", to: "/product/ghori-rosemary-oil" },
  verify: { label: "Verify", to: "/verify" },
  fake: { label: "Real vs Fake", to: "/real-vs-fake" },
  shipping: { label: "Shipping & Returns", to: "/shipping-returns" },
  ingredients: { label: "Ingredients", to: "/ingredients" },
} as const;

export const faqSections: FaqSection[] = [
  {
    id: "about-green-wealth",
    title: "About Green Wealth",
    faqs: [
      {
        q: "What is Green Wealth?",
        a: "Green Wealth is a botanical hair-care house whose flagship product, Green Wealth Neo Hair Lotion, is a plant-based scalp treatment made in Thailand. The brand has been in market for over a decade and distributes to more than 40 countries through authorized channels.",
      },
      {
        q: "Where is Green Wealth Neo Hair Lotion manufactured?",
        a: "Green Wealth Neo Hair Lotion is manufactured in Thailand under GMP-certified conditions. \u201CMade in Thailand\u201D is printed on the official product label and every bottle is batch-verifiable.",
        related: [PRODUCT_LINKS.verify],
      },
      {
        q: "Who is the official distributor of Green Wealth products?",
        a: "Ghori Trading LLC, based in the United Arab Emirates, operates the authorized global distribution of Green Wealth Neo Hair Lotion and related products. Purchases through greenwealth.com and listed partners include access to our authenticity verification program.",
      },
      {
        q: "Is Green Wealth a pharmaceutical company?",
        a: "No. Green Wealth formulates cosmetic scalp treatments based on botanical extracts. Its products are not medicines, are not FDA-approved as drugs, and are not intended to treat, cure or prevent any medical condition.",
      },
    ],
  },
  {
    id: "neo-hair-lotion-basics",
    title: "Neo Hair Lotion — Basics",
    faqs: [
      {
        q: "What is Neo Hair Lotion?",
        a: "Green Wealth Neo Hair Lotion is a topical, leave-in botanical spray designed to support scalp health and the appearance of thicker, fuller hair. It contains five herbal extracts in a lightweight, fast-absorbing base and comes in a 120 ml bottle.",
        related: [PRODUCT_LINKS.lotion],
      },
      {
        q: "What is Neo Hair Lotion used for?",
        a: "It is used as a daily scalp treatment for men and women concerned about thinning hair, increased shedding, or scalp comfort. It is applied morning and evening, 6–8 sprays per application, directly onto the scalp.",
      },
      {
        q: "How much does Neo Hair Lotion cost?",
        a: "A single bottle of Green Wealth Neo Hair Lotion is $40 USD (120 ml). Multi-unit pricing brings it to $38 per bottle from 5 units and $35 per bottle from 10 units. Local-currency prices are shown at checkout.",
        related: [PRODUCT_LINKS.lotion],
      },
      {
        q: "How big is a bottle of Neo Hair Lotion?",
        a: "120 ml. At the recommended 6–8 sprays twice daily, a single bottle typically lasts one adult user 30–45 days.",
      },
      {
        q: "What does Neo Hair Lotion smell like?",
        a: "Neo Hair Lotion has a mild herbal scent from its botanical extracts. It is not perfumed and the scent dissipates within a few minutes of application.",
      },
      {
        q: "Does Neo Hair Lotion leave residue or feel greasy?",
        a: "No. Neo Hair Lotion is formulated as a lightweight, fast-absorbing spray. It does not leave a greasy film and is designed to be worn under normal styling without visible residue.",
      },
      {
        q: "What is the shelf life of Neo Hair Lotion?",
        a: "Sealed bottles are best used within 24 months of the manufacturing date printed on the box. Once opened, use within 12 months for best results. Store away from direct sunlight and heat.",
      },
      {
        q: 'What is the "Series Nº NEO-HAIR" code?',
        a: "NEO-HAIR is Green Wealth's internal formula series code for this product line. It appears on the product page, packaging and specification sheet as a reference identifier.",
      },
      {
        q: "Is Neo Hair Lotion suitable for all hair types?",
        a: "Yes. The lotion is applied to the scalp, not the hair length, so it works the same on straight, wavy, curly and coily hair, and on coloured or chemically treated hair.",
      },
      {
        q: "Can I travel with Neo Hair Lotion?",
        a: "Yes. The 120 ml bottle is within most checked-luggage limits and the spray head locks for transit. For cabin baggage, check your airline's 100 ml liquid rule — the bottle may need to go in checked luggage.",
      },
    ],
  },
  {
    id: "ingredients",
    title: "Ingredients",
    faqs: [
      {
        q: "What are the ingredients in Neo Hair Lotion?",
        a: "The active botanical extracts on the official label are: Cucumis melo (Cantaloupe) extract 1%, Serenoa repens (Saw Palmetto) extract 2%, Panax ginseng (White Ginseng) extract 2%, Equisetum arvense (Horsetail) extract 3%, and Eclipta prostrata (False Daisy / Bhringraj) extract. These are delivered in a lightweight aqueous base.",
        related: [PRODUCT_LINKS.ingredients],
      },
      {
        q: "Does Neo Hair Lotion contain minoxidil?",
        a: 'No. Green Wealth Neo Hair Lotion contains no minoxidil. This is a deliberate formulation choice and is stated on the product label as "Minoxidil-free".',
      },
      {
        q: "Does Neo Hair Lotion contain finasteride?",
        a: "No. Neo Hair Lotion contains no finasteride and no other systemic 5-alpha-reductase inhibitors. It is a topical botanical product only.",
      },
      {
        q: "What does Saw Palmetto do in Neo Hair Lotion?",
        a: "Saw Palmetto (Serenoa repens) is traditionally used to support healthy DHT activity at the follicle level. DHT is the hormone signal most associated with pattern hair thinning in both men and women.",
      },
      {
        q: "What does White Ginseng do for hair?",
        a: "White Ginseng (Panax ginseng, Radix Alba) is traditionally used to support scalp micro-circulation, helping oxygen and nutrients reach the follicle bulb. Better circulation is one of the four pathways the formula is designed to address.",
      },
      {
        q: "What is Cantaloupe extract used for in hair care?",
        a: "Cantaloupe (Cucumis melo) extract is a natural source of superoxide dismutase (SOD), an antioxidant enzyme. In Neo Hair Lotion it contributes antioxidant defence to the scalp environment against everyday oxidative stress.",
      },
      {
        q: "What is Horsetail extract and why is it in the formula?",
        a: "Horsetail (Equisetum arvense) is a plant rich in naturally occurring silica, a mineral associated with keratin structure and strand integrity. It is included at 3% to support the structural quality of new hair growth.",
      },
      {
        q: "What is Bhringraj / False Daisy?",
        a: "Bhringraj (Eclipta prostrata), also known as False Daisy, is a traditional Ayurvedic herb used for scalp comfort. It is one of the five botanical actives in the Neo Hair Lotion formula.",
      },
      {
        q: "Is Neo Hair Lotion vegan?",
        a: "Yes. All active ingredients in Green Wealth Neo Hair Lotion are plant-derived. The formula contains no animal-sourced ingredients.",
      },
      {
        q: "Is Neo Hair Lotion cruelty-free?",
        a: "Yes. Neo Hair Lotion is not tested on animals.",
      },
      {
        q: "Is Neo Hair Lotion halal?",
        a: "Neo Hair Lotion is formulated from plant extracts only, with no animal derivatives or pork by-products. For customers who require formal halal certification for a specific market, contact us at hello@greenwealth.com for the current documentation.",
      },
      {
        q: "Does Neo Hair Lotion contain alcohol?",
        a: "The base is a lightweight aqueous solution. For customers with specific alcohol sensitivities, please refer to the full ingredient list printed on your bottle or contact us before purchase.",
      },
      {
        q: "Does Neo Hair Lotion contain parabens or sulfates?",
        a: "The formula is designed around the five declared botanical extracts. It contains no minoxidil and no finasteride. For a complete inclusion / exclusion audit, see the \"What's in / What's not\" section on the product page.",
      },
    ],
  },
  {
    id: "how-it-works",
    title: "How It Works",
    faqs: [
      {
        q: "How does Neo Hair Lotion work?",
        a: "Neo Hair Lotion is engineered to act on four pathways associated with hair thinning: scalp micro-circulation (White Ginseng, Cantaloupe), hormonal balance at the follicle (Saw Palmetto), scalp comfort (False Daisy, Horsetail), and structural support for new growth (Horsetail silica, antioxidants). Together, the five extracts aim to support a healthier scalp environment where thicker-looking hair can appear.",
      },
      {
        q: "Does Neo Hair Lotion regrow hair?",
        a: "Neo Hair Lotion is a cosmetic scalp treatment intended to support the appearance of thicker, fuller hair with consistent use. It is not a medicine and is not marketed as a cure for baldness or medical hair loss. Individual results vary; monthly photos are the best way to track your own progress.",
      },
      {
        q: "Does Neo Hair Lotion work on a receding hairline?",
        a: "Users apply Neo Hair Lotion across the whole scalp including the hairline, temples and crown. Results at the hairline typically take longer to appear than at the crown because hairline follicles are more sensitive to hormonal signals. Consistent twice-daily use across a full 6–12 month cycle is recommended.",
      },
      {
        q: "Does Neo Hair Lotion work on the crown?",
        a: "The crown is one of the areas users most commonly report visible density improvement. Continue applying the spray directly onto the crown twice daily and take monthly photographs from the same angle to track change objectively.",
      },
      {
        q: "Can I use Neo Hair Lotion on my beard?",
        a: "Yes. Neo Hair Lotion can be applied to patchy or receding beard areas using the same 6–8 spray protocol twice daily. Beard follicles respond on a similar timeline to scalp follicles — expect visible change over months, not weeks.",
      },
      {
        q: "Can Neo Hair Lotion be used for eyebrows or eyelashes?",
        a: "No. Neo Hair Lotion is formulated for the scalp and beard area. Do not apply near the eyes or on eyelashes / eyebrows.",
      },
      {
        q: "Will Neo Hair Lotion help postpartum hair loss?",
        a: "Postpartum shedding is usually temporary and hormonal. Neo Hair Lotion can be used as a supportive scalp treatment during this period, but consult your doctor first, especially if you are breastfeeding.",
      },
      {
        q: "Is Neo Hair Lotion suitable for women with female pattern hair loss?",
        a: "Yes, Neo Hair Lotion is formulated for men and women of all ages. Unlike finasteride (which is contraindicated in women), it is a topical botanical product suitable for female use.",
      },
    ],
  },
  {
    id: "how-to-use",
    title: "How to Use",
    faqs: [
      {
        q: "How do I use Neo Hair Lotion?",
        a: "Wash and towel-dry your hair, then spray 6–8 mists of Green Wealth Neo Hair Lotion directly onto the scalp roots — covering crown, temples and hairline. Massage in with fingertips for 2–3 minutes. Leave in; do not rinse. Apply morning and evening, every day.",
        related: [{ label: "How to Use", to: "/how-to-use" }],
      },
      {
        q: "How many sprays per application?",
        a: "6–8 sprays per session, applied directly to the scalp — not to the hair length. Distribute across the areas of concern (crown, temples, hairline, or beard area) rather than concentrating in one spot.",
      },
      {
        q: "Should I apply Neo Hair Lotion to wet or dry hair?",
        a: "Apply to a clean, towel-dried scalp — damp is fine, dripping-wet is not. A clean scalp absorbs the actives better; a hair-product-loaded scalp forms a barrier.",
      },
      {
        q: "Do I rinse Neo Hair Lotion out?",
        a: "No. Neo Hair Lotion is a leave-in treatment. Spray, massage in, and leave it on the scalp. There is no rinse-out step.",
      },
      {
        q: "How long should I leave Neo Hair Lotion on?",
        a: "Ideally at least 15–20 minutes before styling. Because the formula is lightweight and fast-absorbing, you can go about your normal routine after the massage step.",
      },
      {
        q: "Can I use Neo Hair Lotion once a day instead of twice?",
        a: "Twice daily (morning and evening) is the protocol the formula is designed around. Once daily use will slow expected results. If you can only manage once a day, evening is the more important session.",
      },
      {
        q: "Can I style my hair after applying Neo Hair Lotion?",
        a: "Yes. Once the lotion has absorbed (a few minutes), you can style your hair normally. Avoid heavy styling products directly on the scalp itself, as they can block absorption.",
      },
      {
        q: "Should I use a derma roller with Neo Hair Lotion?",
        a: "Optional but recommended for accelerated results. Use a titanium 0.5 mm derma roller (like the Ghori Derma Roller) on the scalp 2–3 times per week, then apply Neo Hair Lotion. Microneedling creates micro-channels that support absorption of active ingredients.",
        related: [PRODUCT_LINKS.roller],
      },
      {
        q: "What if I miss a day of application?",
        a: "Simply resume the normal twice-daily schedule — do not double the dose to compensate. Consistency over months matters far more than any single missed session.",
      },
      {
        q: "Can I apply Neo Hair Lotion before bed?",
        a: "Yes. The evening application can be done right before sleep. The formula absorbs within minutes and does not stain pillowcases.",
      },
      {
        q: "How do I apply it if I have long or thick hair?",
        a: "Part the hair into sections with a comb and spray directly along the part lines so the mist reaches the scalp, not the hair shaft. Then massage with fingertips as normal.",
      },
    ],
  },
  {
    id: "results-timeline",
    title: "Results & Timeline",
    faqs: [
      {
        q: "How long does it take to see results from Neo Hair Lotion?",
        a: "Most consistent users report reduced shedding and improved scalp feel within 3–4 weeks, visible baby hairs at temples and hairline around weeks 4–6, and noticeable density change between months 4 and 6. A full follicle cycle takes 6–12 months, so evaluate seriously at the 6-month mark.",
      },
      {
        q: "What can I expect in the first month?",
        a: "Reduced daily shedding, less scalp itchiness or irritation, and a calmer scalp feel. Visible new hair typically starts appearing in month two, not month one.",
      },
      {
        q: "How long should I use Neo Hair Lotion for the full cycle?",
        a: "Plan for a 6-month protocol minimum, and 12 months for the full follicle cycle. Hair biology cannot be rushed; consistency matters more than any single application.",
      },
      {
        q: "What happens if I stop using Neo Hair Lotion?",
        a: 'Because Neo Hair Lotion is a botanical topical rather than a pharmaceutical vasodilator, users do not report the sudden withdrawal shedding ("dread shed") associated with stopping minoxidil. That said, ongoing scalp support usually requires ongoing use — like any hair-care routine.',
      },
      {
        q: "Will results plateau?",
        a: "Growth cycles are natural, so visible change compounds over months rather than weeks. A monthly-photo record is the best way to see cumulative change that daily observation misses.",
      },
      {
        q: 'Is there a "dread shed" like minoxidil?',
        a: "None reported. Neo Hair Lotion is not a vasodilator and does not force the hair cycle in the way minoxidil does, so the initial and withdrawal shedding phases associated with minoxidil are not part of the Neo Hair Lotion experience.",
      },
      {
        q: "How do I track my progress objectively?",
        a: "Take a photograph of the same areas — crown, temples, hairline — under the same lighting on the first day of each month. Daily mirror checks miss gradual change; month-over-month photos make it obvious.",
      },
      {
        q: "Why do results vary between users?",
        a: "Hair biology differs by age, genetics, how long thinning has been present, scalp condition and consistency of use. Follicles dormant for many years respond more slowly than recently miniaturised ones. This is why the protocol is measured in months, not weeks.",
      },
    ],
  },
  {
    id: "safety-side-effects",
    title: "Safety & Side Effects",
    faqs: [
      {
        q: "Is Neo Hair Lotion safe?",
        a: "Green Wealth Neo Hair Lotion is a topical botanical cosmetic manufactured in Thailand under GMP-certified conditions. It is formulated to be gentle on the scalp, contains no minoxidil and no finasteride, and has been sold to customers in 40+ countries for over a decade. As with any topical product, a patch test is recommended before first use.",
      },
      {
        q: "Does Neo Hair Lotion have side effects?",
        a: "Because Neo Hair Lotion is a topical botanical, systemic side effects (mood, libido, hormonal) associated with oral finasteride do not apply. Rare skin sensitivity to any of the five plant extracts is possible; discontinue use if you experience irritation and consult a dermatologist.",
      },
      {
        q: "How do I patch test Neo Hair Lotion?",
        a: "Spray a small amount on the inside of the forearm or behind the ear and leave for 24 hours. If no redness, itching or irritation appears, the product is suitable to use on your scalp.",
      },
      {
        q: "Can pregnant women use Neo Hair Lotion?",
        a: "If you are pregnant or planning pregnancy, consult your doctor before starting any new topical treatment, including Neo Hair Lotion. Green Wealth does not make specific claims regarding use during pregnancy.",
      },
      {
        q: "Can breastfeeding mothers use Neo Hair Lotion?",
        a: "As with pregnancy, consult your physician before use while breastfeeding.",
      },
      {
        q: "Can teenagers use Neo Hair Lotion?",
        a: "Neo Hair Lotion is intended for adult use. For anyone under 18, consult a physician before starting, especially where hair loss may indicate an underlying medical cause.",
      },
      {
        q: "Can I use Neo Hair Lotion with a sensitive scalp?",
        a: "Neo Hair Lotion is formulated to be gentle and its botanical actives include Bhringraj and Horsetail, traditionally used for scalp comfort. Patch test first, and if you have a diagnosed scalp condition (psoriasis, seborrheic dermatitis, active infection), consult a dermatologist before starting.",
      },
      {
        q: "Can I dye or bleach my hair while using Neo Hair Lotion?",
        a: "Yes, but avoid applying Neo Hair Lotion within 24 hours of a chemical colour or bleach service. Wait until the scalp has fully calmed before resuming twice-daily application.",
      },
      {
        q: "Can I use Neo Hair Lotion with other hair-care products?",
        a: "Yes. Neo Hair Lotion is applied to the scalp only, so it does not interfere with conditioner, styling cream or leave-in products applied to the hair length. For best absorption, apply Neo Hair Lotion first, on a clean scalp.",
      },
      {
        q: "Will Neo Hair Lotion stain my clothes or pillow?",
        a: "No. The formula is a lightweight aqueous solution that absorbs quickly and does not stain fabric.",
      },
      {
        q: "Can I use Neo Hair Lotion after a hair transplant?",
        a: "Many transplant patients use it as a supportive scalp treatment once the scalp has fully healed. Always get your surgeon's clearance first — most advise waiting until the recipient area has settled, typically several weeks post-procedure.",
      },
      {
        q: "What should I do if I experience irritation?",
        a: "Stop use, rinse the scalp with cool water, and let the skin settle for a few days. If irritation persists or you have a diagnosed scalp condition, consult a dermatologist before resuming. A 24-hour patch test before first use prevents most surprises.",
      },
    ],
  },
  {
    id: "compared-to-alternatives",
    title: "Compared to Alternatives",
    faqs: [
      {
        q: "Neo Hair Lotion vs minoxidil — what's the difference?",
        a: "Minoxidil is a synthetic vasodilator (a pharmaceutical) available OTC or by prescription; Neo Hair Lotion is a plant-based topical with five botanical extracts. Minoxidil works by one mechanism (vasodilation); Neo Hair Lotion is designed to act on four pathways — circulation, hormonal balance, scalp comfort and structural support. Minoxidil users commonly experience initial and withdrawal shedding and can experience scalp dryness from propylene glycol; Neo Hair Lotion users do not report these.",
        related: [{ label: "Neo vs Minoxidil", to: "/comparison/neo-vs-minoxidil" }],
      },
      {
        q: "Neo Hair Lotion vs finasteride — what's the difference?",
        a: "Finasteride is a systemic prescription drug (an oral 5-alpha-reductase inhibitor) that blocks DHT throughout the body. Neo Hair Lotion is a topical botanical spray that acts only at the scalp. Finasteride can produce hormonal side effects (libido, mood changes) and is contraindicated for women; Neo Hair Lotion is topical, plant-based, and suitable for men and women.",
      },
      {
        q: "Is Neo Hair Lotion as effective as minoxidil?",
        a: "Comparative studies are limited, and the two products work through different mechanisms. Neo Hair Lotion is chosen by customers who want a botanical, side-effect-lean alternative and are willing to commit to a full 6–12 month protocol. It is not marketed as a pharmaceutical substitute.",
      },
      {
        q: "Neo Hair Lotion vs rosemary oil — which is better?",
        a: "They serve different purposes. Rosemary oil is a single-active essential oil traditionally associated with scalp stimulation. Neo Hair Lotion is a five-extract topical spray designed as a complete scalp protocol. Many users combine both — Ghori Rosemary Mint & Biotin Oil for overnight scalp care, Neo Hair Lotion twice daily as the primary protocol.",
        related: [PRODUCT_LINKS.oil],
      },
      {
        q: "Can I use Neo Hair Lotion alongside minoxidil?",
        a: "Some users layer the two, but if you are using minoxidil under medical guidance, ask your doctor before adding another topical to the same scalp. Neo Hair Lotion and minoxidil have different mechanisms and are not known to interact chemically.",
      },
      {
        q: "Should I use Neo Hair Lotion instead of getting a hair transplant?",
        a: "Neo Hair Lotion is a topical scalp treatment, not a surgical solution. It cannot restore hair to areas where follicles are permanently lost. Some transplant patients use it post-procedure as a supportive scalp treatment; consult your surgeon before doing so.",
      },
    ],
  },
  {
    id: "neo-hair-shampoo",
    title: "Neo Hair Shampoo",
    faqs: [
      {
        q: "What is Neo Hair Shampoo?",
        a: "Neo Hair Shampoo is a revitalising botanical scalp shampoo formulated to complement Neo Hair Lotion. It is a sulfate-free cleanser designed to prepare the scalp for the twice-daily lotion protocol without stripping the barrier.",
        related: [PRODUCT_LINKS.shampoo],
      },
      {
        q: "How much does Neo Hair Shampoo cost?",
        a: "Neo Hair Shampoo is $40 USD per bottle, with multi-unit pricing from 5 units.",
      },
      {
        q: "Is Neo Hair Shampoo sulfate-free?",
        a: "Yes. Neo Hair Shampoo is formulated without sulfates (SLS/SLES). Sulfates clean efficiently but can strip the scalp barrier, which is counterproductive for a scalp-treatment protocol.",
      },
      {
        q: "Do I need Neo Hair Shampoo to use Neo Hair Lotion?",
        a: "No. Any gentle shampoo works. Neo Hair Shampoo is designed to pair with the lotion protocol and is optimised for the same scalp goals, but it is not required.",
      },
      {
        q: "How often should I use Neo Hair Shampoo?",
        a: "Use it as your regular shampoo — typically 3–5 times per week for most hair types. Follow with towel-drying and Neo Hair Lotion application.",
      },
    ],
  },
  {
    id: "ghori-derma-roller",
    title: "Ghori Derma Roller",
    faqs: [
      {
        q: "What is the Ghori Derma Roller?",
        a: "The Ghori Derma Roller is a titanium scalp microneedling tool designed to be used before applying Neo Hair Lotion. Microneedling creates micro-channels in the scalp that support the absorption of topical actives and can help stimulate natural growth factors.",
        related: [PRODUCT_LINKS.roller],
      },
      {
        q: "What needle size is the Ghori Derma Roller?",
        a: "0.5 mm titanium needles. This is the size dermatology literature most commonly cites for scalp use — long enough to create micro-channels, short enough to be used at home safely.",
      },
      {
        q: "How often should I use the derma roller?",
        a: "2–3 times per week, not every day. The scalp needs 24–48 hours between microneedling sessions to recover.",
      },
      {
        q: "How do I use the derma roller with Neo Hair Lotion?",
        a: "On derma-roller days, roll the scalp in vertical, horizontal and diagonal passes for 5–8 minutes (avoid the crown of the head aggressively). Then apply Neo Hair Lotion as normal. Do not use lotion immediately after rolling if the scalp feels tender — wait a few minutes.",
      },
      {
        q: "Does derma rolling hurt?",
        a: "A 0.5 mm roller is designed to be tolerable on the scalp. It should feel like a firm scratch, not a sharp pain. If it hurts, you're pressing too hard.",
      },
      {
        q: "How do I clean the Ghori Derma Roller?",
        a: "Rinse under warm water after each use, then soak in 70% isopropyl alcohol for 5–10 minutes. Air-dry on a clean surface. Never share a derma roller.",
      },
      {
        q: "How long does a derma roller last?",
        a: "Replace every 2–3 months with typical 2–3 times weekly use, or sooner if the needles feel dull or bent.",
      },
    ],
  },
  {
    id: "rosemary-mint-biotin-oil",
    title: "Rosemary Mint & Biotin Oil",
    faqs: [
      {
        q: "What is Ghori Rosemary Mint & Biotin Oil?",
        a: "Ghori Rosemary Mint & Biotin Oil is a lightweight scalp oil combining rosemary essential oil, mint and biotin. It is used as a supportive scalp-care product, often overnight or on rest days, alongside the Neo Hair Lotion protocol.",
        related: [PRODUCT_LINKS.oil],
      },
      {
        q: "How much does Ghori Rosemary Oil cost?",
        a: "$14 USD per bottle, with free worldwide shipping.",
      },
      {
        q: "Can I use Rosemary Oil and Neo Hair Lotion together?",
        a: "Yes, and many users do. Common routines: Neo Hair Lotion twice daily (AM & PM), Ghori Rosemary Mint & Biotin Oil as a pre-shampoo scalp massage 1–2 nights per week.",
      },
      {
        q: "Is Ghori Rosemary Oil a substitute for Neo Hair Lotion?",
        a: "No. Rosemary oil is a single-active supportive product; Neo Hair Lotion is the five-extract primary protocol. They complement each other rather than replace each other.",
      },
    ],
  },
  {
    id: "authenticity",
    title: "Authenticity",
    faqs: [
      {
        q: "How do I verify my Neo Hair Lotion is authentic?",
        a: "Every authentic Green Wealth Neo Hair Lotion bottle ships with a scratch-code verification card inside the sealed carton. Scratch the panel to reveal your unique code, then enter it on the Verify page. Authentic bottles are confirmed instantly; counterfeit or cloned codes will not verify.",
        related: [PRODUCT_LINKS.verify],
      },
      {
        q: "What is the scratch code?",
        a: "The scratch code is a unique alphanumeric identifier printed under a scratch-off panel on the verification card in every sealed carton. Each code can be checked once and is tied to a single manufacturing batch.",
      },
      {
        q: "Where can I buy authentic Neo Hair Lotion?",
        a: "Only through greenwealth.com and its listed authorized partners. Any bottle bought outside this authorized channel — grey-market resellers, unlisted marketplaces, unofficial social sellers — cannot be verified as authentic.",
      },
      {
        q: "Why is Neo Hair Lotion cheaper on some other sites?",
        a: "Deep discounts on marketplace listings are usually one of three things: (1) counterfeit product, (2) expired or near-expired stock, or (3) unauthorized diverted stock with no returns coverage. Authentic Neo Hair Lotion holds its retail price because it ships from official distribution with verified authenticity and a 7-day return.",
      },
      {
        q: "What does a fake Neo Hair Lotion look like?",
        a: "Common counterfeit signs: missing or unreadable scratch-code card, misprinted Thai script on the box, mismatched batch numbers between the bottle and carton, thin or oily-feeling lotion, and cardboard packaging with poor print quality. See the Real vs Fake page for a side-by-side visual guide.",
        related: [PRODUCT_LINKS.fake],
      },
    ],
  },
  {
    id: "shipping-returns",
    title: "Shipping & Returns",
    faqs: [
      {
        q: "Do you ship worldwide?",
        a: "Yes. Green Wealth ships to 140+ countries, and shipping is free with tracking on every order regardless of size.",
        related: [PRODUCT_LINKS.shipping],
      },
      {
        q: "How long does shipping take?",
        a: "Orders placed before the daily cut-off ship the same business day. Typical delivery windows: United States 5–8 business days, UAE / GCC 2–4 business days, UK & Europe 5–8 business days, rest of world 7–14 business days.",
      },
      {
        q: "Is shipping really free?",
        a: "Yes. Free tracked worldwide shipping on all orders, no minimum. You will see the tracking number as soon as the order leaves the warehouse.",
      },
      {
        q: "Do you ship to the UAE?",
        a: "Yes. Dubai and the wider UAE are core markets. Delivery is typically 2–4 business days from dispatch.",
      },
      {
        q: "Do you ship to Saudi Arabia?",
        a: "Yes. Neo Hair Lotion ships to Saudi Arabia with tracked delivery, typically 3–5 business days.",
      },
      {
        q: "How do I track my order?",
        a: "Once dispatched, you will receive a tracking number by email. You can also use the Track Order page to check status any time.",
        related: [{ label: "Track Order", to: "/track-order" }],
      },
      {
        q: "What is your return policy?",
        a: "Unopened bottles can be returned within 7 days of delivery for a refund. Opened bottles are not eligible for return for hygiene reasons.",
        related: [{ label: "Refund Policy", to: "/refund-policy" }],
      },
      {
        q: "What if my bottle arrives damaged?",
        a: "Contact us within 48 hours of delivery with photos and we will arrange a free replacement. Damaged-in-transit claims are not counted against the 7-day exchange window.",
      },
      {
        q: "Do I pay customs duties?",
        a: "For most destinations shipping is delivered-duties-included. In a small number of markets local import taxes may apply on arrival — these are the customer's responsibility. Check your country's import rules if uncertain.",
      },
      {
        q: "What payment methods do you accept?",
        a: "Visa, Mastercard, American Express, Discover, Diners, JCB, UnionPay, Apple Pay and Google Pay. All payments are processed on 256-bit SSL encrypted infrastructure.",
      },
      {
        q: "Which currencies can I pay in?",
        a: "The store automatically shows prices in your local currency — including USD, EUR, GBP, AED, SAR, INR and many more. You can switch currency manually using the selector in the site header.",
      },
      {
        q: "Will I receive an order confirmation?",
        a: "Yes. A confirmation email with your order number and full summary is sent immediately after checkout, followed by a dispatch email with your tracking number. If you do not see them, check spam — or sign in to My Account, where every order is listed.",
      },
    ],
  },
  {
    id: "orders-account",
    title: "Orders & Account",
    faqs: [
      {
        q: "Where can I see my orders?",
        a: "Sign in to your account and open the My Account page — your full order record, delivery status and tracking links live there. You can also check any single order on the Track Order page with your order number and email.",
        related: [{ label: "Track Order", to: "/track-order" }],
      },
      {
        q: "Do I need an account to place an order?",
        a: "No. You can check out as a guest. Creating an account afterwards (with the same email) automatically links your previous orders so your full history appears in one place.",
      },
      {
        q: "Can I change or cancel my order after placing it?",
        a: "Orders placed before the daily cut-off ship the same business day, so changes must be fast. Contact us within 2 hours of ordering via WhatsApp or the contact page and we will do our best to amend or cancel before dispatch. Once a tracking number exists, the order can no longer be changed.",
      },
      {
        q: "Do you offer promo codes?",
        a: "Yes, occasionally — codes are announced by email to subscribers. Apply the code at checkout and the discount is shown in the order summary before you pay; the amount you are charged always matches the discounted total you see.",
      },
      {
        q: "What is cash on delivery (COD) and where is it available?",
        a: "COD lets you pay the courier in cash when the parcel arrives, instead of paying online. It is available in select Gulf markets including the UAE and Saudi Arabia, and carries a small handling fee shown at checkout before you confirm.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. Card payments are processed by PCI-compliant payment providers over 256-bit SSL. Green Wealth never sees or stores your full card number.",
      },
    ],
  },
  {
    id: "international",
    title: "International",
    faqs: [
      {
        q: "Is Neo Hair Lotion popular in the Middle East?",
        a: "Yes — the Middle East, especially the UAE and Saudi Arabia, is one of the largest markets for Green Wealth Neo Hair Lotion. Ghori Trading LLC operates the authorized regional distribution from the UAE.",
      },
      {
        q: "Can I buy Neo Hair Lotion in Dubai?",
        a: "Yes. Green Wealth ships to Dubai and the wider UAE with 2–4 business day delivery. Ordering through greenwealth.com includes access to our authenticity verification service.",
      },
      {
        q: "Is Neo Hair Lotion available in the United States?",
        a: "Yes. Neo Hair Lotion ships to all 50 US states with free tracked delivery in 5–8 business days. It is sold as a cosmetic scalp treatment.",
      },
      {
        q: "What languages does the authenticity leaflet come in?",
        a: "Each sealed carton includes a multi-language usage and authenticity leaflet. If you need documentation in a specific language for regulatory purposes, contact us.",
      },
    ],
  },
];

export const relatedReading = [
  {
    slug: "neo-hair-lotion-complete-guide",
    title: "The complete guide to Neo Hair Lotion",
    eyebrow: "Journal · Guide",
  },
  {
    slug: "the-five-botanicals-behind-neo-hair-lotion",
    title: "The five botanicals behind Neo Hair Lotion",
    eyebrow: "Journal · Science",
  },
  {
    slug: "neo-hair-shampoo-why-sulfate-free-matters",
    title: "Why sulfate-free shampoo matters",
    eyebrow: "Journal · Formulation",
  },
];

/** Related-chip label keys, resolved from the link target. */
export const RELATED_KEY: Record<string, string> = {
  "/product/neo-hair-lotion": "lotion",
  "/product/neo-hair-shampoo": "shampoo",
  "/product/ghori-dermaroller": "roller",
  "/product/ghori-rosemary-oil": "oil",
  "/verify": "verify",
  "/real-vs-fake": "fake",
  "/shipping-returns": "shipping",
  "/ingredients": "ingredients",
  "/how-to-use": "howToUse",
  "/track-order": "trackOrder",
  "/refund-policy": "refundPolicy",
  "/comparison/neo-vs-minoxidil": "neoVsMinoxidil",
};
