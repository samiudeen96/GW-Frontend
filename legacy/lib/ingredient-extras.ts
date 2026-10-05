// Deep enrichment data for the Ingredient Glossary.
// Keyed by the slug generated in src/lib/ingredients.ts.
// This file is presentation content only — no business logic.

export type IngredientExtra = {
  tags: string[];
  family?: string;
  partUsed?: string;
  activeCompounds?: string[];
  history: string;
  traditionalUses: string[];
  modernResearch: string;
  mechanism: { title: string; body: string }[];
  bestFor: string[];
  safety: string;
  pairsWith?: string[];
};

export const ingredientExtras: Record<string, IngredientExtra> = {
  "cantaloupe": {
    tags: ["Antioxidant", "Scalp Barrier", "Hydration", "Adaptogen"],
    family: "Cucurbitaceae",
    partUsed: "Ripe fruit pulp — cold-processed",
    activeCompounds: ["Superoxide dismutase (SOD)", "Beta-carotene", "Vitamin C", "Potassium"],
    history:
      "Cantaloupe (Cucumis melo) has been cultivated for over 4,000 years, first grown in Persia and Egypt before spreading through the Mediterranean. Historical texts from the Islamic Golden Age describe melon pulp being applied to sunburned skin and the scalp to cool, hydrate and calm inflammation. In the 1990s French researchers isolated a particularly stable strain of superoxide dismutase (SOD B®) from a specific cultivar of Cucumis melo grown in the south of France — this became the foundation of modern melon-based cosmeceuticals.",
    traditionalUses: [
      "Cooling scalp poultice in hot climates",
      "Post-sun soothing compress",
      "Folk remedy for dry, flaking skin",
      "Traditional Ayurvedic hair rinse for pitta (heat) imbalance",
    ],
    modernResearch:
      "Melon-derived SOD is one of the most studied antioxidant enzymes in dermatology. It neutralises the superoxide radical — the primary reactive oxygen species produced during oxidative stress — into hydrogen peroxide, which is then broken down by catalase. Studies on melon-concentrate supplementation have shown measurable reductions in oxidative markers around the follicle and improved scalp barrier resilience.",
    mechanism: [
      { title: "Neutralises free radicals", body: "SOD converts superoxide (O₂⁻) into less harmful compounds before it can damage follicle stem cells and the dermal papilla." },
      { title: "Restores hydration", body: "High potassium and natural sugars help the scalp hold water, easing the tightness and flaking that block healthy growth." },
      { title: "Cools inflammation", body: "Beta-carotene and vitamin C down-regulate low-grade scalp inflammation linked to shedding and premature miniaturisation." },
    ],
    bestFor: ["Oxidative stress", "Dry / tight scalp", "Post-sun recovery", "Sensitive skin"],
    safety: "Non-comedogenic. No reported contraindications with topical use. Safe alongside minoxidil, finasteride and most prescription regimens.",
    pairsWith: ["White Ginseng", "Horsetail Extract"],
  },

  "saw-palmetto": {
    tags: ["DHT Support", "Follicle Protection", "Men's Health", "Adaptogen"],
    family: "Arecaceae (palm family)",
    partUsed: "Ripe berries (fatty acid extract)",
    activeCompounds: ["Beta-sitosterol", "Lauric acid", "Oleic acid", "Free fatty acids"],
    history:
      "Serenoa repens is native to the Atlantic coast of the southeastern United States. The Seminole and other indigenous peoples of Florida consumed the berries for centuries as a food, tonic and remedy for urinary and reproductive complaints. European settlers noted its effects and by the late 1800s saw palmetto extract was a standard entry in the U.S. Pharmacopoeia. Modern interest surged in the 1990s when European clinicians began prescribing standardised extracts for benign prostatic hyperplasia — and researchers realised the same 5-alpha-reductase pathway drives androgenetic hair loss.",
    traditionalUses: [
      "Native American berry tonic for vitality",
      "European herbal treatment for prostate health",
      "Traditional support for male reproductive wellness",
      "Folk remedy for thinning hair at the crown",
    ],
    modernResearch:
      "Saw palmetto is one of the few natural inhibitors of 5-alpha-reductase — the enzyme that converts testosterone into DHT (dihydrotestosterone). DHT is the primary androgen responsible for follicle miniaturisation in androgenetic alopecia. Randomised trials of topical and oral saw palmetto have shown modest but consistent improvements in hair count and density in men with early-stage pattern loss, without the systemic side-effect profile of pharmaceutical inhibitors.",
    mechanism: [
      { title: "Inhibits 5-alpha-reductase", body: "Beta-sitosterol and free fatty acids competitively block the enzyme that turns testosterone into DHT at the follicle." },
      { title: "Protects follicle stem cells", body: "Lower local DHT means less signalling for the follicle to shrink and shorten its growth phase." },
      { title: "Extends the anagen phase", body: "By calming the miniaturisation signal, the growing (anagen) phase of each follicle lasts longer, producing thicker, longer strands." },
    ],
    bestFor: ["Androgenetic thinning", "Crown & temple recession", "Post-shed recovery", "Men in their 20s–40s"],
    safety: "Well tolerated topically. Not recommended for pregnant or breastfeeding women. Speak to a clinician before combining with hormonal medications.",
    pairsWith: ["White Ginseng", "Cantaloupe"],
  },

  "white-ginseng": {
    tags: ["Adaptogen", "Circulation", "Anti-inflammatory", "Cell Renewal"],
    family: "Araliaceae",
    partUsed: "Peeled and sun-dried root (Radix Alba)",
    activeCompounds: ["Ginsenosides (Rg1, Rb1, Rh1)", "Polysaccharides", "Phenolic acids"],
    history:
      "Panax ginseng has been the most revered herb in East Asian medicine for over 2,000 years. The name Panax comes from the Greek panakes — 'all-healing'. Traditional Korean and Chinese medicine distinguishes red ginseng (steamed) from white ginseng (peeled and air-dried), with white ginseng considered gentler and better suited to daily use and topical applications. Historical texts from the Han Dynasty and the Donguibogam (1613 AD) describe scalp preparations of ginseng root to darken hair, prevent premature greying and stimulate regrowth.",
    traditionalUses: [
      "Daily tonic for chi (life energy) in Traditional Chinese Medicine",
      "Korean royal court hair oil to prevent greying",
      "Scalp massage for post-illness recovery of hair",
      "Winter tonic to restore vitality",
    ],
    modernResearch:
      "Modern research has isolated more than 30 ginsenosides — the triterpene saponins responsible for ginseng's activity. Ginsenoside Rg1 in particular has been shown to activate the Wnt/β-catenin pathway inside dermal papilla cells, one of the master switches that keeps follicles in the growing phase. Ginseng also improves microcirculation and modulates the stress-hormone response at the follicle, both of which help protect against stress-induced shedding.",
    mechanism: [
      { title: "Activates Wnt/β-catenin", body: "Ginsenoside Rg1 signals the dermal papilla to stay in anagen (growth), delaying the shift into rest and shed phases." },
      { title: "Improves scalp microcirculation", body: "Ginseng dilates the fine capillaries around the follicle, delivering more oxygen and nutrients to the bulb." },
      { title: "Buffers stress hormones", body: "As a true adaptogen, ginseng dampens the cortisol spikes linked to telogen effluvium (stress shedding)." },
    ],
    bestFor: ["Stress-related shedding", "Slow-growing hair", "Dull, low-energy scalp", "Premature greying support"],
    safety: "Excellent topical safety profile. Very high-dose oral use may interact with blood-thinners and diabetes medication — topical application avoids this.",
    pairsWith: ["Saw Palmetto", "Cantaloupe", "Horsetail Extract"],
  },

  "horsetail-extract": {
    tags: ["Silica", "Strength", "Structural Support", "Mineral"],
    family: "Equisetaceae",
    partUsed: "Sterile aerial stems",
    activeCompounds: ["Organic silica (up to 10%)", "Flavonoids", "Potassium", "Saponins"],
    history:
      "Equisetum arvense — horsetail or 'scouring rush' — is one of the oldest plants on Earth, a living fossil that has changed little in 400 million years. Because its stems are so rich in silica they were used across medieval Europe to polish metal and scrub cookware. Greek physicians Dioscorides and Galen prescribed horsetail decoctions for wounds and hair loss. In the Islamic medical tradition (Ibn Sina, 11th century) it was recommended as a tonic for brittle nails and thinning hair — uses that modern nutritional science has largely vindicated.",
    traditionalUses: [
      "Wound-healing poultice (Ancient Greece and Rome)",
      "Ibn Sina's tonic for brittle hair and nails",
      "Traditional European remedy for oedema",
      "Folk hair rinse for shine and strength",
    ],
    modernResearch:
      "Horsetail is the most concentrated botanical source of bioavailable silica known. Silica is a required cofactor for the enzymes that cross-link collagen and build the keratin protein your hair is made of. Studies on oral silica supplementation have shown measurable increases in hair thickness and tensile strength. Applied topically, horsetail delivers silica directly to the follicle and forms part of the mineral matrix the new hair shaft is built from.",
    mechanism: [
      { title: "Supplies bioavailable silica", body: "Silica is essential for building the disulfide bonds in keratin — the protein that gives each strand its strength and flexibility." },
      { title: "Reinforces the hair shaft", body: "Regular exposure to silica-rich extract measurably improves tensile strength and reduces breakage." },
      { title: "Firms the scalp matrix", body: "Silica supports the collagen scaffolding of the dermis where the follicle is anchored." },
    ],
    bestFor: ["Brittle, breakage-prone hair", "Fine or limp strands", "Weak nails alongside thinning hair", "Post-chemical or heat damage"],
    safety: "Only Equisetum arvense (not E. palustre) is used cosmetically. No topical contraindications reported.",
    pairsWith: ["Biotin", "Panthenol", "White Ginseng"],
  },

  "false-daisy": {
    tags: ["Ayurveda", "King of Hair", "Cooling", "Follicle Nourishment"],
    family: "Asteraceae",
    partUsed: "Whole herb (leaves and stems)",
    activeCompounds: ["Wedelolactone", "Ecliptasaponins", "Flavonoids", "Coumestans"],
    history:
      "Eclipta prostrata — known in Sanskrit as Bhringraj, 'the ruler of hair' — is one of the oldest and most respected herbs in Ayurveda. The Charaka Samhita (~300 BCE) and the Sushruta Samhita both name Bhringraj as the primary botanical for keeping hair dark, thick and strong into old age. Traditional Ayurvedic practice involves warming Bhringraj-infused oil (often in a base of sesame or coconut) and massaging it into the scalp weekly — a ritual called shiro abhyanga that has been performed in South Asia for more than two millennia.",
    traditionalUses: [
      "Ayurvedic hair oil (Bhringraj taila) for scalp massage",
      "Traditional remedy against premature greying",
      "Cooling herb for pitta imbalance and scalp heat",
      "Rasayana (rejuvenation) tonic in classical Ayurveda",
    ],
    modernResearch:
      "Peer-reviewed studies on Eclipta alba extracts have shown promising results on hair growth in animal models — in some studies matching or exceeding the follicle counts produced by 2% minoxidil. The wedelolactone in Bhringraj has demonstrated 5-alpha-reductase inhibition and improved dermal papilla cell activity. Bhringraj's cooling, anti-inflammatory action also makes it particularly useful for scalps that run hot, itch or flake.",
    mechanism: [
      { title: "Boosts follicle density", body: "Extracts have been shown to increase the number of follicles in the anagen (growing) phase in animal models." },
      { title: "Cools scalp inflammation", body: "Wedelolactone and flavonoids down-regulate the inflammatory cascade that shortens the growth phase." },
      { title: "Supports pigment cells", body: "Traditional use for greying is supported by early research suggesting Bhringraj protects melanocytes at the follicle base." },
    ],
    bestFor: ["Slow growth", "Premature greying concerns", "Hot, itchy scalp", "Combination with oil-based rituals"],
    safety: "Excellent traditional and modern safety record. Very rare contact sensitivity — patch test if you have known Asteraceae allergies.",
    pairsWith: ["Rosemary Leaf Oil", "White Ginseng"],
  },

  "coconut-derived-surfactants": {
    tags: ["Gentle Cleansing", "Sulfate-free", "Coconut", "Barrier-safe"],
    family: "Arecaceae (Cocos nucifera derived)",
    partUsed: "Fatty acids from mature coconut kernel",
    activeCompounds: ["Cocamidopropyl betaine", "Sodium cocoyl isethionate", "Decyl glucoside"],
    history:
      "Sulfate detergents (SLS/SLES) revolutionised shampoo in the 1950s because they produced dramatic foam and stripped oil aggressively. By the 1990s dermatologists were documenting the downside — barrier disruption, scalp dryness and hair-shaft porosity. Coconut-derived surfactants emerged as the gold-standard replacement: they are made by reacting fatty acids from Cocos nucifera with mild amino acid or sugar chemistry, producing a family of cleansers that lift dirt and sebum without stripping the scalp's protective lipid layer.",
    traditionalUses: [
      "Coconut oil as a traditional cleansing and conditioning agent across South Asia and the Pacific",
      "Coconut milk baths for scalp care in Ayurveda",
      "Fresh coconut water as a cooling rinse",
      "Modern replacement for harsh sulfate detergents in premium haircare",
    ],
    modernResearch:
      "Comparative dermatology studies consistently show that coconut-derived amphoteric and non-ionic surfactants produce far less transepidermal water loss and less protein damage to the hair shaft than sulfate detergents, while maintaining effective cleansing performance. This is why they are the standard base for medical, paediatric and post-transplant haircare.",
    mechanism: [
      { title: "Cleanses at low irritation potential", body: "Amino acid and sugar-based head groups lift oil and dirt with minimal disruption to the scalp's lipid bilayer." },
      { title: "Preserves the acid mantle", body: "Buffered close to the scalp's natural pH (~5.5), keeping the microbiome intact." },
      { title: "Protects colour and treatments", body: "Doesn't strip out the actives (Bhringraj, ginseng, biotin) delivered by the rest of the formula." },
    ],
    bestFor: ["Sensitive scalps", "Colour-treated hair", "Daily washing", "Post-treatment aftercare"],
    safety: "Some individuals with cocamidopropyl betaine sensitivity should patch test. Otherwise one of the mildest cleansing systems available.",
    pairsWith: ["Panthenol", "Botanical Extract Blend"],
  },

  "panthenol": {
    tags: ["Provitamin B5", "Humectant", "Repair", "Shine"],
    family: "Vitamin B group",
    partUsed: "Provitamin B5 (D-panthenol)",
    activeCompounds: ["D-panthenol → pantothenic acid on the scalp"],
    history:
      "Pantothenic acid was isolated in 1931 by Roger J. Williams, who named it from the Greek pantothen — 'from everywhere' — because it was found in almost every food he tested. Its provitamin form, panthenol, entered cosmetic use in the 1940s and became a defining ingredient in Pantene's original 1945 launch. Today it is one of the most extensively studied humectants in dermatology and one of the very few actives that is genuinely both moisturising and reparative.",
    traditionalUses: [
      "Post-war medical wound-care ingredient",
      "1940s hospital burn-recovery ointments",
      "Standard humectant in paediatric skincare",
      "Modern haircare's benchmark repair ingredient",
    ],
    modernResearch:
      "On contact with the scalp, D-panthenol converts to pantothenic acid — a component of Coenzyme A, which is required for the metabolism of every cell in the body, including the follicle. Panthenol also penetrates the hair shaft, binding water molecules along the way and swelling the cortex slightly, which visibly increases shine and body.",
    mechanism: [
      { title: "Binds water deep in the cortex", body: "Panthenol is a true humectant — it holds water inside the hair shaft, not just on the surface." },
      { title: "Fuels follicle metabolism", body: "Converts to pantothenic acid, a building block of Coenzyme A used by the follicle to build keratin." },
      { title: "Smooths and thickens strands", body: "Slight controlled swelling of the cortex adds visible body and light-reflecting shine." },
    ],
    bestFor: ["Dry, thirsty hair", "Post-heat / post-colour repair", "Fine hair needing body", "Daily-wash routines"],
    safety: "Exceptionally well tolerated. Safe during pregnancy and breastfeeding. Safe for children.",
    pairsWith: ["Coconut-Derived Surfactants", "Biotin"],
  },

  "botanical-extract-blend": {
    tags: ["Synergy", "Multi-active", "Scalp Health", "Antioxidant"],
    partUsed: "Blended botanical extracts (proprietary)",
    activeCompounds: ["Polyphenols", "Flavonoids", "Terpenes", "Micro-minerals"],
    history:
      "The idea that a combination of botanicals outperforms any single herb goes back to almost every traditional medicine system in the world — the concept is called 'synergy' in modern pharmacology and 'formula' in classical Chinese, Ayurvedic and Unani medicine. A carefully balanced multi-herb blend allows individual actives to reinforce one another, buffer each other's edges, and cover more of the biological pathways involved in hair growth than any solo extract could.",
    traditionalUses: [
      "Classical multi-herb tonic formulas (TCM, Ayurveda, Unani)",
      "Traditional 'kadha' and decoction blends for hair",
      "Layered scalp oil rituals in South Asian culture",
      "Modern cosmeceutical formulation practice",
    ],
    modernResearch:
      "The extract blend combines botanicals whose active families cover the four axes of a healthy growth cycle: circulation, hormonal signalling (5-alpha-reductase modulation), oxidative protection and structural support. Each individual member is documented in peer-reviewed literature; combined at balanced ratios they hit more of the growth pathway simultaneously than any monobotanical could.",
    mechanism: [
      { title: "Multi-pathway coverage", body: "Different botanicals address circulation, hormone signalling, inflammation and structural support in one shot." },
      { title: "Buffered irritation profile", body: "Balanced formulation prevents any single active from becoming too concentrated and sensitising." },
      { title: "Antioxidant reservoir", body: "Polyphenols and flavonoids create a pool of free-radical scavengers that persist on the scalp between washes." },
    ],
    bestFor: ["Everyday scalp health", "Prevention-first users", "Post-treatment maintenance", "All hair types"],
    safety: "Blend components selected for a wide safety margin. Patch test recommended for very sensitive skin.",
    pairsWith: ["Coconut-Derived Surfactants", "Panthenol"],
  },

  "rosemary-leaf-oil": {
    tags: ["Circulation", "Minoxidil Comparator", "Mediterranean", "Aromatic"],
    family: "Lamiaceae",
    partUsed: "Fresh leaves — steam distilled essential oil",
    activeCompounds: ["1,8-cineole", "Camphor", "Alpha-pinene", "Rosmarinic acid", "Carnosic acid"],
    history:
      "Rosmarinus officinalis has been sacred and medicinal in the Mediterranean world since antiquity. Greek students wore garlands of rosemary during exams for memory. Roman physicians prescribed rosemary oil for scalp health and hair strength. In medieval Europe rosemary infusions were the standard tonic for thinning hair. The recent surge in scientific interest began in 2015 when a landmark six-month randomised trial in SKINmed showed 2% rosemary oil produced hair-growth results comparable to 2% minoxidil — with significantly less scalp itching.",
    traditionalUses: [
      "Ancient Greek and Roman hair tonic",
      "Medieval European tincture for thinning hair",
      "Traditional Mediterranean cooking herb and preservative",
      "Aromatherapy for memory, focus and circulation",
    ],
    modernResearch:
      "The 2015 Panahi trial (SKINmed) directly compared 2% rosemary oil against 2% minoxidil in men with androgenetic alopecia over six months. Both groups showed significant hair count increases; the rosemary arm reported far less scalp itching. Subsequent studies have supported rosemary's role as a circulation-boosting, DHT-modulating and antioxidant scalp active — and it remains one of the very few natural ingredients backed by a direct comparator trial against a pharmaceutical.",
    mechanism: [
      { title: "Increases scalp circulation", body: "Warming compounds gently dilate scalp capillaries, delivering more oxygen and nutrients to the follicle." },
      { title: "Modulates DHT locally", body: "Carnosic acid demonstrates 5-alpha-reductase modulation, reducing the local androgen signal that miniaturises follicles." },
      { title: "Neutralises oxidative stress", body: "Rosmarinic and carnosic acid are two of the most potent plant antioxidants known." },
    ],
    bestFor: ["Early androgenetic thinning", "Poor scalp circulation", "Anyone wanting a research-backed natural alternative", "Combination with scalp massage"],
    safety: "Dilute in a carrier oil for direct scalp use (Ghori® is already formulated at cosmetic-grade dilution). Avoid during pregnancy at high concentrations.",
    pairsWith: ["Peppermint Oil", "Biotin", "Vitamin E"],
  },

  "biotin": {
    tags: ["Vitamin B7", "Keratin Synthesis", "Structural", "Follicle Nutrition"],
    family: "Vitamin B group",
    partUsed: "Vitamin B7 (biotin)",
    activeCompounds: ["Biotin (vitamin B7 / vitamin H)"],
    history:
      "Biotin was isolated in the 1930s, when researchers noticed that laboratory animals fed large amounts of raw egg white (which contains avidin, a biotin-binding protein) developed hair loss and skin lesions — a condition that reversed completely with a specific yeast extract. That extract was biotin. From the 1940s onwards biotin has been a defining nutrient in the science of hair, skin and nail health, and biotin deficiency remains one of the very few nutritional causes of hair loss that reliably reverses with supplementation.",
    traditionalUses: [
      "1930s deficiency-reversal research",
      "Post-war supplementation for hair and nail health",
      "Standard entry in every dermatology hair-loss workup",
      "Ubiquitous ingredient in modern hair supplements",
    ],
    modernResearch:
      "Biotin acts as a coenzyme for four carboxylase enzymes involved in metabolism — including the enzymes that build the amino acids that form keratin. In genuine biotin deficiency, supplementation reliably reverses hair thinning and brittle nails. Topical delivery via a lipophilic carrier (like Ghori® rosemary oil) allows biotin to penetrate close to the follicle where it is most useful.",
    mechanism: [
      { title: "Supports keratin production", body: "Biotin is a cofactor for the enzymes that build the amino acid backbone of keratin, the primary protein of hair." },
      { title: "Strengthens the shaft", body: "Adequate biotin at the follicle reduces breakage and improves nail plate integrity — both markers of hair-forming metabolism." },
      { title: "Enables follicle metabolism", body: "Without biotin, the metabolic enzymes at the follicle simply cannot function at full capacity." },
    ],
    bestFor: ["Brittle, breakage-prone hair", "Weak nails", "Anyone on restricted diets", "Post-partum hair concerns"],
    safety: "Water-soluble vitamin with a very wide safety margin. High-dose oral biotin can interfere with certain lab tests — inform your doctor. Topical application is not associated with this effect.",
    pairsWith: ["Rosemary Leaf Oil", "Panthenol", "Horsetail Extract"],
  },

  "peppermint-oil": {
    tags: ["Cooling", "Circulation", "Menthol", "Aromatic"],
    family: "Lamiaceae",
    partUsed: "Leaves — steam distilled essential oil",
    activeCompounds: ["Menthol (35–55%)", "Menthone", "1,8-cineole", "Limonene"],
    history:
      "Mentha × piperita is a hybrid mint first classified in England in 1753, but the mint family has been used medicinally in Egypt, Greece and Rome for thousands of years. Its cooling, tingling character comes from menthol, which activates the TRPM8 cold-receptor in the skin. Traditional herbalism prescribed peppermint for headaches, digestion and scalp complaints; modern interest surged when a 2014 study in Toxicological Research showed 3% peppermint oil outperformed both saline and 3% minoxidil for follicle count and dermal thickness in a mouse model — one of the strongest single-oil results ever published.",
    traditionalUses: [
      "Ancient Egyptian temple medicine",
      "European folk remedy for headaches and tension",
      "Traditional scalp massage oil for cooling and clarity",
      "Modern aromatherapy for focus and alertness",
    ],
    modernResearch:
      "The 2014 Oh et al. peppermint oil study is the most-cited paper on the ingredient. Menthol's activation of the cold-receptor causes a reflex increase in scalp micro-circulation — the same mechanism that produces its familiar tingle. Peppermint also has documented antimicrobial activity useful for scalps prone to dandruff or biofilm buildup.",
    mechanism: [
      { title: "Triggers cold-receptor circulation", body: "Menthol activates TRPM8, producing a reflex rush of blood to the scalp that delivers oxygen and nutrients." },
      { title: "Cools and refreshes", body: "The signature tingle isn't just sensory — it signals active scalp engagement." },
      { title: "Reduces microbial load", body: "Documented action against common scalp yeasts and bacteria that can drive flaking and itch." },
    ],
    bestFor: ["Oily / congested scalp", "Anyone who enjoys sensory scalp treatments", "Poor scalp circulation", "Combination with rosemary oil"],
    safety: "Always dilute — undiluted essential oil can irritate. Avoid contact with eyes. Not recommended for children under 6 or during pregnancy at therapeutic doses.",
    pairsWith: ["Rosemary Leaf Oil", "Vitamin E"],
  },

  "vitamin-e": {
    tags: ["Antioxidant", "Barrier Repair", "Emollient", "Preservative"],
    family: "Fat-soluble vitamins (tocopherol family)",
    partUsed: "Tocopherol / tocopheryl acetate",
    activeCompounds: ["Alpha-tocopherol", "Mixed tocopherols"],
    history:
      "Vitamin E was discovered in 1922 by Herbert Evans and Katharine Bishop at UC Berkeley, who found a fat-soluble compound in wheat germ oil essential for reproduction in rats. Its Greek-derived name — tocopherol, 'to carry a pregnancy' — reflects that first discovery. Dermatological use began in the 1950s and vitamin E is now the workhorse antioxidant of cosmetic chemistry, present in almost every serious oil-based formula both to protect the skin and to protect the formula itself from oxidation.",
    traditionalUses: [
      "1922 nutritional discovery in wheat germ oil",
      "Post-war dermatology for burns and scars",
      "Standard scalp-oil enrichment across the 20th century",
      "Universal antioxidant in modern cosmetic formulation",
    ],
    modernResearch:
      "A 2010 study on tocotrienols (a member of the vitamin E family) showed a measurable increase in hair count in volunteers with mild hair loss after eight months of supplementation. Topically, vitamin E is the primary lipid-soluble antioxidant — it terminates the chain reactions of lipid peroxidation that would otherwise damage cell membranes and the fatty envelope of the follicle. It also stabilises the oil base itself, protecting all the other actives from going rancid.",
    mechanism: [
      { title: "Terminates lipid peroxidation", body: "Alpha-tocopherol donates an electron to stop free-radical chain reactions in cell membranes and oil formulations alike." },
      { title: "Reinforces the scalp barrier", body: "Fat-soluble and lipophilic, vitamin E integrates directly into the scalp's lipid bilayer, improving hydration and resilience." },
      { title: "Protects the formula", body: "Prevents the oxidation of the carrier oils and other actives — extending the useful life of every drop of product." },
    ],
    bestFor: ["Dry / weathered scalp", "Post-sun and pollution exposure", "Combined with any oil-based system", "Barrier repair"],
    safety: "Very high safety profile. Rare contact dermatitis in individuals with vitamin E sensitivity — patch test if concerned.",
    pairsWith: ["Rosemary Leaf Oil", "Biotin"],
  },

  "aloe-vera": {
    tags: ["Hydration", "Scalp Comfort", "Barrier Support", "Humectant"],
    family: "Asphodelaceae",
    partUsed: "Inner-leaf gel, purified and decolourised",
    activeCompounds: ["Acemannan polysaccharides", "Glucomannans", "Amino acids", "Plant sterols"],
    history:
      "Aloe vera has been documented in skin and scalp care for more than 3,500 years. The Ebers Papyrus of ancient Egypt described aloe preparations, while Greek, Roman, Ayurvedic and Unani traditions used the fresh inner-leaf gel for heat, dryness and irritated skin. Modern cosmetic processing removes the yellow latex layer and purifies the clear gel so its water-binding polysaccharides can be used without the irritating anthraquinones found in whole-leaf sap.",
    traditionalUses: [
      "Cooling gel for sun-exposed or irritated skin",
      "Ayurvedic scalp pack for heat, dryness and flaking",
      "Unani preparation for soothing the skin barrier",
      "Fresh-leaf hair mask used to improve softness and manageability",
    ],
    modernResearch:
      "Aloe's best-supported topical role is moisturising and soothing rather than directly stimulating hair growth. Its acemannan-rich polysaccharide fraction forms a flexible, water-binding film and supports the appearance of barrier recovery. Laboratory and clinical skin research also describes anti-inflammatory and wound-supporting activity, but evidence for treating alopecia remains limited; in this formula aloe is used to improve scalp comfort and condition the application environment.",
    mechanism: [
      { title: "Binds water at the scalp", body: "Acemannan and glucomannans form a light hydrophilic film that slows moisture loss without leaving a heavy oily layer." },
      { title: "Supports barrier comfort", body: "Polysaccharides and plant sterols help calm the look of redness and support recovery from dryness or repeated cleansing." },
      { title: "Conditions the surface", body: "Amino acids and natural sugars improve slip, helping reduce friction between strands and making the scalp treatment easier to distribute." },
    ],
    bestFor: ["Dry or tight scalp", "Visible flaking", "Scalp discomfort", "Lightweight hydration"],
    safety: "Purified, decolourised inner-leaf aloe is generally well tolerated topically. Patch test before first use, avoid broken skin, and discontinue if irritation occurs. This cosmetic use should not be confused with ingesting aloe latex.",
    pairsWith: ["Vitamin E", "Coconut Oil", "Rosemary Leaf Oil"],
  },

  "castor-seed-oil": {
    tags: ["Conditioning", "Occlusive", "Gloss", "Ricinoleic Acid"],
    family: "Euphorbiaceae",
    partUsed: "Seeds — oil expressed and refined to cosmetic grade",
    activeCompounds: ["Ricinoleic acid", "Oleic acid", "Linoleic acid", "Tocopherols"],
    history:
      "Castor oil has an exceptionally long cosmetic record. Seeds of Ricinus communis have been found in ancient Egyptian sites, and the oil appears in Egyptian, Greek, Ayurvedic and later European preparations for skin and hair. Its unusually high ricinoleic-acid content gives it the dense, glossy texture that distinguished it from lighter seed oils. Modern cosmetic-grade castor oil is carefully expressed and refined; the toxic protein ricin remains in the seed residue and is not present in properly processed oil.",
    traditionalUses: [
      "Ancient Egyptian hair and skin conditioning oil",
      "Ayurvedic scalp massage and protective hair packs",
      "Traditional pomade for edges, brows and dry ends",
      "Carrier oil for concentrated aromatic botanicals",
    ],
    modernResearch:
      "Castor oil is well established as an emollient and occlusive conditioner, but direct human evidence that it increases follicle number or growth rate is lacking. Its value in hair care comes from coating the cuticle, reducing moisture loss and friction, and increasing visible gloss. Ricinoleic acid also shows anti-inflammatory and antimicrobial activity in laboratory work, although these findings do not establish castor oil as a treatment for scalp disease or alopecia.",
    mechanism: [
      { title: "Seals the cuticle", body: "Its viscous fatty-acid film fills surface irregularities, reducing roughness and improving reflected shine." },
      { title: "Reduces moisture escape", body: "The occlusive layer slows water loss from dry fibres and helps ends remain flexible between washes." },
      { title: "Lowers mechanical friction", body: "Improved lubrication reduces snagging during combing and styling, helping fragile lengths retain their apparent density." },
    ],
    bestFor: ["Dry or porous lengths", "Frizz and flyaways", "Brittle ends", "Protective scalp-oil routines"],
    safety: "Cosmetic-grade castor oil is generally well tolerated, although its dense texture can cause buildup on fine or oily hair. Patch test before use and avoid applying to an actively inflamed scalp.",
    pairsWith: ["Coconut Oil", "Vitamin E", "Rosemary Leaf Oil"],
  },

  "coconut-oil": {
    tags: ["Protein Retention", "Cortex Penetration", "Conditioning", "Lauric Acid"],
    family: "Arecaceae",
    partUsed: "Mature coconut kernel — expressed oil",
    activeCompounds: ["Lauric acid", "Myristic acid", "Caprylic acid", "Capric acid"],
    history:
      "Coconut oil has been central to hair care across South and Southeast Asia, the Pacific and coastal East Africa for centuries. Traditional routines apply the oil before washing to protect long hair from water and handling. Modern fibre science has helped explain this practice: coconut oil's high lauric-acid content and straight molecular structure give it an affinity for hair proteins and allow part of the oil to penetrate beyond the cuticle.",
    traditionalUses: [
      "Pre-wash oiling across South Asian hair traditions",
      "Pacific Island conditioning for sun- and salt-exposed hair",
      "Ayurvedic carrier for infused herbs",
      "Protective dressing for long, braided or textured hair",
    ],
    modernResearch:
      "Among commonly tested cosmetic oils, coconut oil has some of the clearest evidence for reducing protein loss from hair fibres. Controlled fibre studies found benefits when it was used before or after washing on both damaged and undamaged hair. This is a strand-protection effect, not proof of new follicle growth: coconut oil helps preserve existing length by reducing swelling, porosity and grooming-related breakage.",
    mechanism: [
      { title: "Penetrates the fibre", body: "Lauric acid has a low molecular weight and strong affinity for keratin, allowing it to move into the hair shaft rather than remaining only on the surface." },
      { title: "Reduces wash-related protein loss", body: "Pre-wash oiling limits repeated water-driven swelling and contraction, helping the cuticle retain structural proteins." },
      { title: "Improves flexibility and slip", body: "A thin lipid film lubricates neighbouring fibres, reducing combing force, tangling and breakage along the lengths." },
    ],
    bestFor: ["Porous or damaged hair", "Pre-wash protection", "Long or textured hair", "Breakage-prone lengths"],
    safety: "Generally safe for topical cosmetic use. Coconut oil can feel heavy or contribute to buildup on fine hair and may not suit every acne-prone hairline. Patch test if coconut sensitivity is suspected.",
    pairsWith: ["Castor Seed Oil", "Vitamin E", "Aloe Vera"],
  },

  "rosemary": {
    tags: ["Circulation", "Anti-inflammatory", "DHT Support", "Freshness"],
    family: "Lamiaceae (mint family)",
    partUsed: "Aerial parts — leaves and flowering tops",
    activeCompounds: ["Carnosic acid", "Rosmarinic acid", "1,8-cineole", "Camphor"],
    history:
      "Rosmarinus officinalis has grown wild along the Mediterranean coast for over 5,000 years. Ancient Greek scholars wore rosemary garlands during examinations, believing it sharpened memory. Egyptian tombs from 3,000 BC contained sprigs of rosemary, and Roman physicians prescribed rosemary-infused oils for scalp massage to darken hair and prevent baldness. Medieval European monks distilled it into 'Queen of Hungary Water' — one of the first alcohol-based cosmetics on record — used for a wide range of scalp and skin complaints.",
    traditionalUses: [
      "Roman scalp oil to prevent hair loss and greying",
      "Medieval European hair rinse for shine and freshness",
      "Ayurvedic scalp massage for kapha imbalance",
      "Middle Eastern folk remedy for dandruff",
    ],
    modernResearch:
      "A landmark 2015 randomised trial (Panahi et al., SKINmed Journal) compared rosemary oil to minoxidil 2% over six months in 100 men with androgenetic alopecia. Both groups showed statistically significant increases in hair count, with rosemary matching minoxidil on the primary endpoint — and with less scalp itching. Further studies have shown rosemary extract inhibits 5-alpha-reductase and stimulates dermal blood flow, giving it a dual circulation + DHT-modulation profile.",
    mechanism: [
      { title: "Boosts scalp circulation", body: "Volatile terpenes cause a mild, warming vasodilation that increases oxygen and nutrient delivery to the follicle base." },
      { title: "Modulates DHT locally", body: "Carnosic and rosmarinic acids show mild 5-alpha-reductase inhibition, complementing the saw palmetto pathway." },
      { title: "Calms scalp inflammation", body: "Powerful anti-inflammatory and antimicrobial activity reduces low-grade irritation that would otherwise drive shedding." },
    ],
    bestFor: ["Androgenetic thinning", "Sluggish scalp circulation", "Itchy or dandruff-prone scalp", "Daily wash routine"],
    safety: "Generally well tolerated. Avoid direct application of undiluted essential oil. Use cosmetic-grade extracts at label concentration. Pregnant women should consult a clinician before use of concentrated rosemary essential oil.",
    pairsWith: ["Saw Palmetto", "Peppermint Oil", "White Ginseng"],
  },

  "purified-water": {
    tags: ["Base", "Solvent", "Deionised"],
    family: "Inorganic",
    partUsed: "Pharma-grade H₂O",
    activeCompounds: ["H₂O (deionised)"],
    history:
      "Water is the oldest cosmetic ingredient in human history — the base of every wash, tonic and lotion since antiquity. Modern cosmetic manufacturing uses deionised (DI) water, from which mineral ions and metal traces have been removed. This step, standardised in the mid-20th century, is what allows delicate botanical actives and modern surfactants to remain stable and predictable in a bottle for years.",
    traditionalUses: [
      "Ancient Roman bath and hair rinsing",
      "Islamic Golden Age cosmetic distillation",
      "Modern pharmaceutical carrier standard",
    ],
    modernResearch:
      "Deionisation removes calcium, magnesium and iron ions that would otherwise react with surfactants (reducing foam) and oxidise botanical actives. Cosmetic-grade water is filtered by reverse osmosis, UV-sterilised and tested for endotoxins before use.",
    mechanism: [
      { title: "Dissolves the formula", body: "Water is the neutral solvent that carries surfactants, actives and preservatives into a single, stable liquid." },
      { title: "Distributes evenly", body: "Its low viscosity allows the shampoo to spread across every square centimetre of scalp during the wash." },
      { title: "Rinses cleanly", body: "Excellent solvent power carries lifted sebum and product residue down the drain without leaving a film." },
    ],
    bestFor: ["Every rinse-off formula", "Water-based botanical delivery"],
    safety: "Universally safe. Deionised, sterile and endotoxin-tested.",
  },

  "sodium-cocoyl-hydrolyzed-pea-protein": {
    tags: ["Sulfate-Free", "Strengthening", "Amino Acids", "Vegan"],
    family: "Amino-acid surfactants",
    partUsed: "Coconut fatty acids + yellow-pea protein hydrolysate",
    activeCompounds: ["Pea protein hydrolysate", "Coconut fatty acid esters"],
    history:
      "Amino-acid surfactants emerged in Japan in the 1970s as a response to the harshness of sulfate detergents that had dominated shampoos since the 1930s. Sodium Cocoyl Hydrolyzed-Pea Protein is a more recent, plant-based evolution — combining sustainably grown yellow pea protein with coconut-derived fatty acids to create one of the mildest, most substantive cleansers in modern cosmetic chemistry. Widely adopted in premium haircare after 2010 for its ability to clean and simultaneously repair the fibre.",
    traditionalUses: [
      "Modern replacement for sulfate detergents",
      "Standard cleanser in colour-treated hair systems",
      "Vegan alternative to keratin and silk-protein cleansers",
    ],
    modernResearch:
      "Hydrolysed pea protein has a molecular weight low enough (typically 1,000–10,000 Daltons) to penetrate the hair cortex during the wash. Once inside, the peptides plug porosity gaps caused by heat, colour and mechanical damage, measurably increasing tensile strength and reducing breakage. Acylation with coconut fatty acids gives the molecule its cleansing power while retaining biocompatibility with the scalp.",
    mechanism: [
      { title: "Cleans without stripping", body: "The fatty-acid tail lifts sebum and product residue while the protein head keeps foam gentle and pH-balanced." },
      { title: "Rebuilds the cortex", body: "Small pea peptides diffuse into damaged areas of the shaft and reinforce internal bonds." },
      { title: "Locks in colour and moisture", body: "By sealing porosity, it slows the leaching of dye molecules and internal humidity." },
    ],
    bestFor: ["Colour-treated hair", "Damaged, porous strands", "Sensitive scalps", "Daily wash"],
    safety: "Exceptional safety profile. Gluten-free, vegan, biodegradable and suitable for the most sensitive scalps.",
    pairsWith: ["Sodium Cocoyl Alaninate", "Panthenol"],
  },

  "sodium-cocoyl-alaninate": {
    tags: ["Ultra-Mild", "Skin-pH", "Biodegradable", "Amino Acids"],
    family: "Amino-acid surfactants",
    partUsed: "Coconut fatty acids + fermented L-alanine",
    activeCompounds: ["Sodium salt of N-cocoyl-L-alanine"],
    history:
      "Developed in Japan by Ajinomoto in the 1970s as part of the 'Amisoft' family of amino-acid surfactants, Sodium Cocoyl Alaninate quickly became the gold standard for baby shampoos and sensitive-skin cleansers throughout Asia. It reached premium Western haircare in the early 2000s as consumers demanded sulfate-free formulas that still delivered a rich, satisfying lather.",
    traditionalUses: [
      "Japanese baby-shampoo standard",
      "Sensitive-skin dermatology cleansers",
      "Modern premium sulfate-free haircare",
    ],
    modernResearch:
      "Rated by dermatologists as one of the mildest surfactants on the market — significantly less irritating than SLS or SLES on standard patch tests. Its unique amino-acid structure means it functions at the natural pH of skin (around 5.5), preserving the acid mantle that protects against pathogens and moisture loss.",
    mechanism: [
      { title: "Foams at skin-pH", body: "Unlike sulfates that push the scalp to an alkaline pH, alaninate cleans at the scalp's own slightly acidic pH — preserving the barrier." },
      { title: "Low irritation", body: "Alanine-based head group produces small, biocompatible micelles that lift dirt without penetrating and disrupting cell membranes." },
      { title: "Fully biodegradable", body: "Breaks down cleanly in wastewater — one of the most environmentally responsible surfactants available." },
    ],
    bestFor: ["Sensitive scalps", "Colour-treated hair", "Frequent washers", "Post-chemical-service care"],
    safety: "Excellent — approved for baby-shampoo formulations. No known contraindications.",
    pairsWith: ["Sodium Cocoyl Hydrolyzed-Pea Protein"],
  },

  "peg-120-methyl-glucose-dioleate": {
    tags: ["Thickener", "Detangling", "Non-Ionic", "Slip"],
    family: "Glucose-derived non-ionic surfactants",
    partUsed: "Corn glucose + plant-derived oleic acid",
    activeCompounds: ["PEG-120 methyl glucose dioleate ester"],
    history:
      "Introduced to cosmetic chemistry in the late 1980s as a naturally derived alternative to synthetic thickeners like carbomers. Its glucose backbone comes from corn, and the oleic acid from vegetable oils. It became one of the most trusted 'quiet' ingredients in premium salon shampoos — you never see it advertised, but it's why a shampoo feels expensive between the fingers.",
    traditionalUses: [
      "Standard body-builder in salon-grade shampoos",
      "Detangling agent in 2-in-1 cleansing conditioners",
      "Foam stabiliser in luxury body washes",
    ],
    modernResearch:
      "Functions as a non-ionic thickener and viscosity modifier that also deposits a thin conditioning film on the cuticle. Improves wet combability by up to 40% in standardised laboratory testing compared to unthickened surfactant systems.",
    mechanism: [
      { title: "Adds silky viscosity", body: "The long PEG chain creates a molecular network that thickens the water phase without any harsh gelling agents." },
      { title: "Stabilises foam", body: "Slows the collapse of bubbles so the shampoo stays creamy through the entire wash." },
      { title: "Conditions the cuticle", body: "The oleic acid ends deposit a nano-thin film that reduces tangling and static as you rinse." },
    ],
    bestFor: ["Long or fine hair prone to tangling", "Colour-treated hair", "Every wash-and-go routine"],
    safety: "Non-irritating, non-comedogenic. Safe for the eye area and long-term daily use.",
  },

  "disodium-edta": {
    tags: ["Chelator", "Stabiliser", "Hard-Water Fix"],
    family: "Aminopolycarboxylic acid salts",
    partUsed: "Cosmetic-grade sodium salt",
    activeCompounds: ["Ethylenediaminetetraacetic acid disodium salt"],
    history:
      "Synthesised in Germany in 1935 by Ferdinand Münz, EDTA revolutionised industrial chemistry, water treatment and medicine (chelation therapy for heavy-metal poisoning). It entered cosmetic formulation in the 1950s as manufacturers realised that trace metal ions in tap water and raw materials were the hidden cause of rancid oils, discoloured lotions and unstable formulas.",
    traditionalUses: [
      "Industrial water softening",
      "Medical chelation therapy",
      "Universal cosmetic stabiliser since the 1950s",
    ],
    modernResearch:
      "Used at trace levels (0.05–0.20%) in almost every water-based cosmetic. Binds free calcium, magnesium and iron ions that would otherwise interfere with surfactants, catalyse oxidation of botanicals, or leave a dulling film on hair after washing in hard water.",
    mechanism: [
      { title: "Sequesters metal ions", body: "Forms a stable ring-shaped complex around calcium, magnesium and iron ions, deactivating them chemically." },
      { title: "Boosts foam in hard water", body: "Prevents mineral ions from combining with surfactants to form the insoluble 'soap scum' that kills lather." },
      { title: "Protects botanical actives", body: "Removes the metal catalysts that would otherwise oxidise sensitive plant extracts." },
    ],
    bestFor: ["Water-based formulas", "Hard-water regions", "Products with botanical antioxidants"],
    safety: "Safe at typical cosmetic use levels (up to 0.20%). Extensively studied and approved by the CIR expert panel.",
  },

  "sodium-benzoate": {
    tags: ["Preservative", "Paraben-Free", "Food-Grade"],
    family: "Aromatic carboxylic acid salts",
    partUsed: "Sodium salt of benzoic acid",
    activeCompounds: ["Sodium benzoate"],
    history:
      "Benzoic acid was first isolated from gum benzoin (a tree resin from Southeast Asia) in the 16th century by the alchemist Nostradamus. Its sodium salt became the first preservative approved by the U.S. FDA — and remains one of the most widely used food and cosmetic preservatives worldwide, present in everything from soft drinks and salad dressings to premium haircare.",
    traditionalUses: [
      "Traditional preservation of resins and balms",
      "First FDA-approved food preservative",
      "Modern paraben-free cosmetic preservation",
    ],
    modernResearch:
      "Effective against yeasts, moulds and many bacteria at low concentrations (0.05–0.5%). Works best in slightly acidic formulas, where a small fraction converts to active benzoic acid that penetrates microbial cells and disrupts their metabolism. Extensively evaluated by CIR, SCCS and IFRA as safe at cosmetic use levels.",
    mechanism: [
      { title: "Disrupts microbial metabolism", body: "Undissociated benzoic acid enters bacterial and fungal cells and interferes with their energy-producing enzymes." },
      { title: "Keeps the formula sterile", body: "Prevents mould and yeast contamination throughout the product's shelf life, without harsh preservatives." },
      { title: "Broad-spectrum coverage", body: "Effective against the most common cosmetic spoilage organisms while remaining gentle on the scalp." },
    ],
    bestFor: ["Water-based rinse-off products", "Paraben-free formulations", "Every safe daily-use shampoo"],
    safety: "Safe at cosmetic use levels. Naturally occurs in cranberries, prunes, plums and cinnamon.",
  },
};

