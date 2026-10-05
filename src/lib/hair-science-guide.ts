/**
 * Hair Science guide content — hair problems, product-free solutions,
 * product roles and combined-use expectations. Bilingual (en / ar).
 * Claims are cosmetic and qualified; not medical advice.
 */
type L = { en: string; ar: string };
export const pickL = (l: L, locale: string) => (locale === "ar" ? l.ar : l.en);

export type HairProblem = {
  key: string;
  name: L;
  what: L;
  why: L;
  signs: L;
  habits: L[];
  doctor: L;
};

export const HAIR_PROBLEMS: HairProblem[] = [
  {
    key: "aga",
    name: { en: "Pattern thinning (androgenetic alopecia)", ar: "الترقق الوراثي (الثعلبة الأندروجينية)" },
    what: { en: "Follicles slowly shrink, so each new hair grows thinner and shorter.", ar: "تنكمش البصيلات تدريجيًا، فينمو كل شعر جديد أرفع وأقصر." },
    why: { en: "Genetics plus sensitivity to DHT, a hormone made from testosterone.", ar: "الوراثة مع حساسية البصيلات لهرمون DHT المشتق من التستوستيرون." },
    signs: { en: "Receding temples, a thinning crown, or a widening parting.", ar: "انحسار الصدغين، أو خفة في التاج، أو اتساع مفرق الشعر." },
    habits: [
      { en: "Start early — shrinking follicles respond better than dormant ones.", ar: "ابدأ مبكرًا — البصيلات المنكمشة تستجيب أفضل من الخاملة." },
      { en: "Take monthly photos in the same light to track change honestly.", ar: "التقط صورًا شهرية بالإضاءة نفسها لتتابع التغيّر بصدق." },
      { en: "Manage weight and blood sugar; insulin resistance is linked to thinning.", ar: "حافظ على الوزن وسكر الدم؛ فمقاومة الإنسولين ترتبط بالترقق." },
    ],
    doctor: { en: "If loss is fast, patchy, or starts before 20 — ask about medical options.", ar: "إذا كان التساقط سريعًا أو على شكل بقع أو بدأ قبل العشرين — استشر طبيبًا." },
  },
  {
    key: "te",
    name: { en: "Stress shedding (telogen effluvium)", ar: "التساقط بسبب الإجهاد (تساقط الطور الانتهائي)" },
    what: { en: "Many hairs switch into the resting phase at once, then fall 2–3 months later.", ar: "تدخل شعيرات كثيرة طور الراحة معًا، ثم تتساقط بعد شهرين إلى ثلاثة." },
    why: { en: "Illness, fever, surgery, crash dieting, childbirth or intense stress.", ar: "المرض أو الحمى أو الجراحة أو الحمية القاسية أو الولادة أو الضغط الشديد." },
    signs: { en: "Diffuse shedding all over; more hair in the shower and on the pillow.", ar: "تساقط منتشر في كل الرأس؛ شعر أكثر في الحمام وعلى الوسادة." },
    habits: [
      { en: "Eat enough protein (roughly a palm-sized portion each meal).", ar: "تناول بروتينًا كافيًا (حصة بحجم كف اليد تقريبًا في كل وجبة)." },
      { en: "Protect sleep: 7–9 hours helps normalise the growth cycle.", ar: "حافظ على النوم: 7–9 ساعات تساعد على انتظام دورة النمو." },
      { en: "Be patient — this type usually recovers on its own in 6–9 months.", ar: "تحلَّ بالصبر — هذا النوع يتعافى غالبًا وحده خلال 6–9 أشهر." },
    ],
    doctor: { en: "If shedding lasts more than 6 months, check iron, thyroid and vitamin D.", ar: "إذا استمر التساقط أكثر من 6 أشهر، افحص الحديد والغدة الدرقية وفيتامين د." },
  },
  {
    key: "dandruff",
    name: { en: "Dandruff and flaky scalp", ar: "القشرة وتقشر فروة الرأس" },
    what: { en: "Skin cells shed too fast and clump into visible flakes.", ar: "تتجدد خلايا الجلد بسرعة كبيرة وتتكتل في قشور ظاهرة." },
    why: { en: "Overgrowth of a normal scalp yeast (Malassezia) feeding on oil.", ar: "تكاثر خميرة طبيعية في الفروة (مالاسيزيا) تتغذى على الزيوت." },
    signs: { en: "White or yellow flakes, itching, sometimes redness.", ar: "قشور بيضاء أو صفراء، حكة، وأحيانًا احمرار." },
    habits: [
      { en: "Wash regularly — skipping washes lets oil and yeast build up.", ar: "اغسل بانتظام — ترك الغسل يسمح بتراكم الزيوت والخميرة." },
      { en: "Rinse thoroughly; product residue worsens flaking.", ar: "اشطف جيدًا؛ بقايا المنتجات تزيد التقشر." },
      { en: "Avoid scratching, which inflames the scalp further.", ar: "تجنب الحك لأنه يزيد التهاب الفروة." },
    ],
    doctor: { en: "Thick, red, crusted patches may be seborrhoeic dermatitis or psoriasis.", ar: "البقع السميكة الحمراء المتقشرة قد تكون التهابًا دهنيًا أو صدفية." },
  },
  {
    key: "oily",
    name: { en: "Oily scalp", ar: "فروة الرأس الدهنية" },
    what: { en: "Sebaceous glands produce more oil than the scalp needs.", ar: "تفرز الغدد الدهنية زيتًا أكثر مما تحتاجه الفروة." },
    why: { en: "Hormones, heat and humidity, genetics, or harsh over-washing.", ar: "الهرمونات أو الحرارة والرطوبة أو الوراثة أو الغسل القاسي المفرط." },
    signs: { en: "Hair looks flat and greasy within a day of washing.", ar: "يبدو الشعر مسطحًا ودهنيًا خلال يوم من الغسل." },
    habits: [
      { en: "Use lukewarm, not hot, water.", ar: "استخدم ماءً فاترًا لا ساخنًا." },
      { en: "Keep conditioner on lengths only, never the roots.", ar: "ضع البلسم على الأطراف فقط وليس على الجذور." },
      { en: "Wash pillowcases and caps weekly.", ar: "اغسل أغطية الوسائد والقبعات أسبوعيًا." },
    ],
    doctor: { en: "Sudden oiliness with acne or irregular cycles can signal hormonal change.", ar: "الدهون المفاجئة مع حب الشباب أو اضطراب الدورة قد تشير إلى تغيّر هرموني." },
  },
  {
    key: "dry",
    name: { en: "Dry, tight or itchy scalp", ar: "فروة جافة أو مشدودة أو مثيرة للحكة" },
    what: { en: "The scalp's moisture barrier is weakened.", ar: "ضعف الحاجز الذي يحفظ رطوبة الفروة." },
    why: { en: "Harsh sulfate cleansers, hot showers, air-conditioning, hard water.", ar: "المنظفات القاسية بالسلفات، والاستحمام الساخن، والتكييف، والماء العسر." },
    signs: { en: "Fine small flakes, tightness after washing, itch without oiliness.", ar: "قشور ناعمة صغيرة، شد بعد الغسل، وحكة دون دهون." },
    habits: [
      { en: "Drink enough water and shorten hot showers.", ar: "اشرب ماءً كافيًا وقلّل مدة الاستحمام الساخن." },
      { en: "Choose gentle, sulfate-free cleansing.", ar: "اختر تنظيفًا لطيفًا خاليًا من السلفات." },
      { en: "Include omega-3 foods such as fish, walnuts or flax.", ar: "أضف أطعمة غنية بأوميغا 3 مثل السمك والجوز وبذور الكتان." },
    ],
    doctor: { en: "Persistent itch with rash or hair loss needs a dermatologist.", ar: "الحكة المستمرة مع طفح أو تساقط تحتاج إلى طبيب جلدية." },
  },
  {
    key: "breakage",
    name: { en: "Breakage and split ends", ar: "تكسر الشعر وتقصف الأطراف" },
    what: { en: "The hair shaft snaps along its length — the root is fine.", ar: "ينكسر ساق الشعرة على طولها — والجذر سليم." },
    why: { en: "Heat styling, bleaching, rough towel-drying, tight elastics.", ar: "التصفيف الحراري والتشقير والتجفيف القاسي بالمنشفة والأربطة المشدودة." },
    signs: { en: "Short broken pieces with no white bulb at the end.", ar: "قطع قصيرة مكسورة بدون بصيلة بيضاء في نهايتها." },
    habits: [
      { en: "Lower heat-tool temperature and always use a heat protectant.", ar: "خفّض حرارة أدوات التصفيف واستخدم دائمًا واقيًا حراريًا." },
      { en: "Pat dry with a soft cotton T-shirt; detangle from ends upward.", ar: "جفّف بالتربيت بقميص قطني ناعم وفكّ التشابك من الأطراف صعودًا." },
      { en: "Trim split ends every 8–12 weeks.", ar: "قصّ الأطراف المتقصفة كل 8–12 أسبوعًا." },
    ],
    doctor: { en: "Rarely needed — unless breakage comes with brittle nails or fatigue.", ar: "نادرًا ما يلزم — إلا إذا صاحب التكسر هشاشة الأظافر أو التعب." },
  },
  {
    key: "traction",
    name: { en: "Traction hair loss", ar: "التساقط بسبب الشد" },
    what: { en: "Constant pulling damages follicles at the hairline.", ar: "الشد المستمر يضر البصيلات عند خط الشعر." },
    why: { en: "Tight ponytails, braids, buns, extensions or head coverings.", ar: "ذيل الحصان المشدود أو الضفائر أو الكعكة أو الوصلات أو أغطية الرأس الضيقة." },
    signs: { en: "Thinning along the edges and temples; small bumps at the hairline.", ar: "خفة على الأطراف والصدغين؛ نتوءات صغيرة عند خط الشعر." },
    habits: [
      { en: "Loosen styles and change the position daily.", ar: "أرخِ التسريحات وغيّر موضعها يوميًا." },
      { en: "Use soft scrunchies instead of thin elastic bands.", ar: "استخدم ربطات ناعمة بدل الأربطة المطاطية الرفيعة." },
      { en: "Give hair style-free days each week.", ar: "امنح شعرك أيامًا بلا تسريحات كل أسبوع." },
    ],
    doctor: { en: "Early traction loss reverses; long-term scarring may not — act early.", ar: "تساقط الشد المبكر قابل للعكس؛ أما التندب طويل الأمد فقد لا يكون — تصرّف مبكرًا." },
  },
  {
    key: "postpartum",
    name: { en: "Postpartum shedding", ar: "تساقط ما بعد الولادة" },
    what: { en: "Hair held during pregnancy sheds all at once after birth.", ar: "الشعر المحتفظ به أثناء الحمل يتساقط دفعة واحدة بعد الولادة." },
    why: { en: "Estrogen drops sharply after delivery.", ar: "انخفاض حاد في الإستروجين بعد الولادة." },
    signs: { en: "Heavy shedding 2–4 months after birth, often at the temples.", ar: "تساقط كثيف بعد 2–4 أشهر من الولادة، غالبًا عند الصدغين." },
    habits: [
      { en: "Continue prenatal nutrition, especially iron and protein.", ar: "استمري في تغذية الحمل، خاصة الحديد والبروتين." },
      { en: "Choose gentle styles while regrowth comes in.", ar: "اختاري تسريحات لطيفة أثناء إعادة النمو." },
      { en: "It usually settles by the baby's first birthday.", ar: "يستقر عادة بحلول عيد ميلاد الطفل الأول." },
    ],
    doctor: { en: "If breastfeeding, ask your doctor before starting any topical product.", ar: "إذا كنتِ مرضعة، استشيري طبيبك قبل بدء أي منتج موضعي." },
  },
  {
    key: "areata",
    name: { en: "Patchy loss (alopecia areata)", ar: "التساقط على شكل بقع (الثعلبة البقعية)" },
    what: { en: "The immune system attacks follicles, causing round bald patches.", ar: "يهاجم الجهاز المناعي البصيلات، فتظهر بقع صلعاء دائرية." },
    why: { en: "Autoimmune; can be triggered by stress or illness.", ar: "مناعي ذاتي؛ قد يحفزه الضغط أو المرض." },
    signs: { en: "Smooth, coin-sized patches that appear suddenly.", ar: "بقع ناعمة بحجم العملة تظهر فجأة." },
    habits: [
      { en: "Reduce stress where you can; it can trigger flares.", ar: "خفّف الضغط قدر الإمكان؛ فقد يثير النوبات." },
      { en: "Protect bare patches from sun.", ar: "احمِ البقع المكشوفة من الشمس." },
    ],
    doctor: { en: "Always see a dermatologist — this needs medical treatment, not cosmetics.", ar: "راجع طبيب جلدية دائمًا — هذه الحالة تحتاج علاجًا طبيًا لا مستحضرات تجميل." },
  },
  {
    key: "grey",
    name: { en: "Premature greying", ar: "الشيب المبكر" },
    what: { en: "Pigment cells in the follicle stop making melanin early.", ar: "تتوقف خلايا الصبغة في البصيلة عن إنتاج الميلانين مبكرًا." },
    why: { en: "Mostly genetic; also smoking, stress, low B12, copper or iron.", ar: "غالبًا وراثي؛ وأيضًا التدخين والضغط ونقص B12 أو النحاس أو الحديد." },
    signs: { en: "Grey or white strands before your mid-30s.", ar: "شعيرات رمادية أو بيضاء قبل منتصف الثلاثينيات." },
    habits: [
      { en: "Stop smoking — it is strongly linked to early greying.", ar: "أقلع عن التدخين — فهو مرتبط بقوة بالشيب المبكر." },
      { en: "Check B12 and ferritin levels, especially if vegetarian.", ar: "افحص مستوى B12 والفيريتين، خاصة إن كنت نباتيًا." },
    ],
    doctor: { en: "Greying with fatigue or tingling may point to a vitamin deficiency.", ar: "الشيب مع التعب أو التنميل قد يدل على نقص فيتامين." },
  },
];

export type ProductRole = { slug: string; name: L; role: L; how: L; when: L; targets: L };

export const PRODUCT_ROLES: ProductRole[] = [
  {
    slug: "neo-hair-lotion",
    name: { en: "Neo Hair Lotion", ar: "لوشن نيو للشعر" },
    role: { en: "The treatment. Delivers the botanical complex straight to the follicle.", ar: "العلاج. يوصل المركب النباتي مباشرة إلى البصيلة." },
    how: { en: "Part hair, spray 10–15 times on a dry scalp, massage 1–2 minutes. Do not rinse.", ar: "افرق الشعر، رشّ 10–15 مرة على فروة جافة، ودلّك 1–2 دقيقة. لا تشطفه." },
    when: { en: "Twice daily, morning and night.", ar: "مرتين يوميًا، صباحًا ومساءً." },
    targets: { en: "Pattern thinning, stress shedding, postpartum shedding.", ar: "الترقق الوراثي، تساقط الإجهاد، تساقط ما بعد الولادة." },
  },
  {
    slug: "neo-hair-shampoo",
    name: { en: "Neo Hair Shampoo", ar: "شامبو نيو للشعر" },
    role: { en: "The foundation. Cleans oil and build-up without stripping the scalp.", ar: "الأساس. ينظف الدهون والتراكمات دون تجريد الفروة." },
    how: { en: "Massage into wet scalp, leave 2–3 minutes, rinse well.", ar: "دلّكه في فروة مبللة، اتركه 2–3 دقائق، واشطف جيدًا." },
    when: { en: "3–4 times a week, or daily for oily scalps.", ar: "3–4 مرات أسبوعيًا، أو يوميًا للفروة الدهنية." },
    targets: { en: "Oily scalp, dandruff, dry scalp, clogged follicles.", ar: "الفروة الدهنية، القشرة، الفروة الجافة، البصيلات المسدودة." },
  },
  {
    slug: "ghori-rosemary-oil",
    name: { en: "Ghori Rosemary Oil", ar: "زيت غوري بإكليل الجبل" },
    role: { en: "The nourisher. Rosemary, mint and biotin oil for massage and length care.", ar: "المغذي. زيت إكليل الجبل والنعناع والبيوتين للتدليك والعناية بالأطوال." },
    how: { en: "A few drops on the scalp, massage 5 minutes; leave 1–2 hours or overnight, then wash.", ar: "بضع قطرات على الفروة، دلّك 5 دقائق؛ اتركه 1–2 ساعة أو طوال الليل ثم اغسل." },
    when: { en: "2–3 evenings a week, before a wash day.", ar: "2–3 أمسيات أسبوعيًا، قبل يوم الغسل." },
    targets: { en: "Breakage, dryness, dull lengths, weak regrowth.", ar: "التكسر، الجفاف، الأطوال الباهتة، ضعف النمو الجديد." },
  },
  {
    slug: "ghori-dermaroller",
    name: { en: "Ghori Derma Roller 0.5 mm", ar: "ديرما رولر غوري 0.5 مم" },
    role: { en: "The amplifier. Micro-channels help actives reach deeper.", ar: "المُضخِّم. القنوات الدقيقة تساعد المكونات على الوصول أعمق." },
    how: { en: "On a clean, dry scalp roll each area 4–5 times in each direction, light pressure.", ar: "على فروة نظيفة وجافة، مرّر على كل منطقة 4–5 مرات في كل اتجاه بضغط خفيف." },
    when: { en: "Once a week, before the lotion. Disinfect after each use.", ar: "مرة أسبوعيًا قبل اللوشن. عقّمه بعد كل استخدام." },
    targets: { en: "Pattern thinning and slow responders.", ar: "الترقق الوراثي وبطء الاستجابة." },
  },
];

export type CombinedStage = { range: L; title: L; body: L; results: L[] };

export const COMBINED_STAGES: CombinedStage[] = [
  {
    range: { en: "Weeks 1–4", ar: "الأسابيع 1–4" },
    title: { en: "Reset the scalp", ar: "إعادة ضبط الفروة" },
    body: { en: "Shampoo clears build-up so the lotion can reach the follicle; oil calms dryness.", ar: "يزيل الشامبو التراكمات ليصل اللوشن إلى البصيلة؛ ويهدئ الزيت الجفاف." },
    results: [
      { en: "Cleaner, calmer scalp; less itch and flaking", ar: "فروة أنظف وأهدأ؛ حكة وقشرة أقل" },
      { en: "Oil balance improves between washes", ar: "توازن الدهون يتحسن بين الغسلات" },
      { en: "Some shedding may continue — normal at this stage", ar: "قد يستمر بعض التساقط — طبيعي في هذه المرحلة" },
    ],
  },
  {
    range: { en: "Weeks 5–8", ar: "الأسابيع 5–8" },
    title: { en: "Shedding slows", ar: "تباطؤ التساقط" },
    body: { en: "Weekly rolling plus twice-daily lotion supports circulation and follicle anchoring.", ar: "الوخز الأسبوعي مع اللوشن مرتين يوميًا يدعمان الدورة الدموية وتثبيت البصيلات." },
    results: [
      { en: "Noticeably fewer hairs in the shower and brush", ar: "شعر أقل بوضوح في الحمام والفرشاة" },
      { en: "Roots feel stronger when pulled gently", ar: "الجذور تبدو أقوى عند الشد الخفيف" },
    ],
  },
  {
    range: { en: "Weeks 9–16", ar: "الأسابيع 9–16" },
    title: { en: "First new growth", ar: "أول نمو جديد" },
    body: { en: "Resting follicles re-enter the growth phase. Consistency matters most here.", ar: "تعود البصيلات الخاملة إلى طور النمو. الانتظام أهم شيء هنا." },
    results: [
      { en: "Fine baby hairs along the hairline and parting", ar: "شعيرات ناعمة جديدة على خط الشعر والمفرق" },
      { en: "Less visible scalp in bright light", ar: "ظهور أقل للفروة تحت الضوء القوي" },
    ],
  },
  {
    range: { en: "Months 4–6", ar: "الأشهر 4–6" },
    title: { en: "Density builds", ar: "زيادة الكثافة" },
    body: { en: "New hairs thicken and lengthen; the oil protects them from breakage.", ar: "تتكاثف الشعيرات الجديدة وتطول؛ ويحميها الزيت من التكسر." },
    results: [
      { en: "Fuller look, especially at the crown and temples", ar: "مظهر أكثف، خاصة في التاج والصدغين" },
      { en: "Stronger, shinier lengths with fewer split ends", ar: "أطوال أقوى وألمع مع تقصف أقل" },
    ],
  },
  {
    range: { en: "Months 6–12", ar: "الأشهر 6–12" },
    title: { en: "Maintain the result", ar: "الحفاظ على النتيجة" },
    body: { en: "Keep shampoo and lotion; the roller can drop to every two weeks.", ar: "استمر بالشامبو واللوشن؛ ويمكن تقليل الرولر إلى كل أسبوعين." },
    results: [
      { en: "Stable density and a healthy shedding rate", ar: "كثافة مستقرة ومعدل تساقط صحي" },
      { en: "Stopping may let pattern thinning resume over time", ar: "التوقف قد يسمح بعودة الترقق الوراثي مع الوقت" },
    ],
  },
];

export const SYNERGY_ROWS: { combo: L; level: number; note: L }[] = [
  { combo: { en: "Lotion alone", ar: "اللوشن وحده" }, level: 2, note: { en: "Good base — works best on a clean scalp.", ar: "أساس جيد — يعمل أفضل على فروة نظيفة." } },
  { combo: { en: "Lotion + Shampoo", ar: "اللوشن + الشامبو" }, level: 3, note: { en: "Clean follicles absorb more; less build-up.", ar: "البصيلات النظيفة تمتص أكثر؛ تراكم أقل." } },
  { combo: { en: "Lotion + Shampoo + Oil", ar: "اللوشن + الشامبو + الزيت" }, level: 4, note: { en: "Adds length strength and less breakage.", ar: "يضيف قوة للأطوال وتكسرًا أقل." } },
  { combo: { en: "Full system + Derma Roller", ar: "النظام الكامل + ديرما رولر" }, level: 5, note: { en: "The most complete routine for stubborn thinning.", ar: "الروتين الأكمل للترقق العنيد." } },
];

export const GUIDE_UI: Record<string, L> = {
  navProblems: { en: "Problems & Solutions", ar: "المشاكل والحلول" },
  navProducts: { en: "Product Roles", ar: "دور المنتجات" },
  navCombined: { en: "Combined Results", ar: "نتائج الاستخدام المشترك" },
  problemsEyebrow: { en: "Diagnose first", ar: "شخّص أولًا" },
  problemsTitle: { en: "Every common hair problem — explained simply.", ar: "كل مشاكل الشعر الشائعة — بشرح بسيط." },
  problemsIntro: { en: "Most hair concerns fall into one of ten patterns. Find yours, then start with the habits below — they cost nothing and help every routine work better.", ar: "معظم مشاكل الشعر تندرج تحت أحد عشرة أنماط. اعثر على نمطك، ثم ابدأ بالعادات أدناه — فهي مجانية وتساعد أي روتين على العمل بشكل أفضل." },
  what: { en: "What it is", ar: "ما هي" },
  why: { en: "Why it happens", ar: "لماذا تحدث" },
  signs: { en: "Signs", ar: "العلامات" },
  habits: { en: "Solutions without products", ar: "حلول بدون منتجات" },
  doctor: { en: "See a doctor if", ar: "راجع طبيبًا إذا" },
  productsEyebrow: { en: "The Green Wealth system", ar: "نظام جرين ولث" },
  productsTitle: { en: "Four products, four distinct jobs.", ar: "أربعة منتجات، أربع مهام مختلفة." },
  role: { en: "Role", ar: "الدور" },
  how: { en: "How to use", ar: "طريقة الاستخدام" },
  when: { en: "How often", ar: "عدد المرات" },
  targets: { en: "Best for", ar: "الأنسب لـ" },
  view: { en: "View product", ar: "عرض المنتج" },
  combinedEyebrow: { en: "Combined use", ar: "الاستخدام المشترك" },
  combinedTitle: { en: "What to expect when you use them together.", ar: "ما الذي تتوقعه عند استخدامها معًا." },
  synergyTitle: { en: "How each combination adds up", ar: "كيف تتراكم فائدة كل تركيبة" },
  weekly: { en: "A typical week", ar: "أسبوع نموذجي" },
  weeklyBody: { en: "Daily: lotion morning and night · Mon, Wed, Fri: shampoo · Tue, Sat evening: rosemary oil, washed out next morning · Sunday: derma roller, then lotion.", ar: "يوميًا: اللوشن صباحًا ومساءً · الاثنين والأربعاء والجمعة: الشامبو · مساء الثلاثاء والسبت: زيت إكليل الجبل ويُغسل صباحًا · الأحد: ديرما رولر ثم اللوشن." },
  note: { en: "Timelines are typical ranges from cosmetic use, not guarantees. Results vary with genetics, health and consistency. Not medical advice.", ar: "الجداول الزمنية نطاقات نموذجية للاستخدام التجميلي وليست ضمانات. تختلف النتائج حسب الوراثة والصحة والانتظام. ليست نصيحة طبية." },
};
