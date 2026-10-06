/**
 * Arabic dictionary · PDP peripherals
 *
 * Purpose: translate the remaining non-product-record copy that appears on
 * Arabic product pages — region labels used by the delivery estimator, courier
 * transit windows, related-journal cards and two commerce strings that had no
 * Arabic entry.
 * Integration points: `src/routes/product.$slug.tsx` (delivery block, related
 * posts), `src/lib/pricing.tsx` region metadata, `src/routes/cart.tsx`,
 * `src/components/site/TrackingPanel.tsx`.
 */
export const arPdpExtra: Record<string, string> = {
  // Region labels (keyed by currency code from src/lib/pricing.tsx)
  "region.country.USD": "بلدان أخرى",
  "region.country.AED": "الإمارات العربية المتحدة",
  "region.country.SAR": "المملكة العربية السعودية",
  "region.country.QAR": "قطر",
  "region.country.KWD": "الكويت",
  "region.country.BHD": "البحرين",
  "region.country.OMR": "عُمان",
  "region.country.GBP": "المملكة المتحدة",
  "region.country.EUR": "منطقة اليورو",
  "region.country.AUD": "أستراليا",
  "region.country.CAD": "كندا",
  "region.country.SGD": "سنغافورة",
  "region.country.INR": "الهند",
  "region.country.PKR": "باكستان",
  "region.country.AFN": "أفغانستان",

  // Courier transit windows
  "product.route.eta3to5": "3–5 أيام عمل",
  "product.route.eta4to7": "4–7 أيام عمل",
  "product.route.eta5to8": "5–8 أيام عمل",
  "product.route.eta5to9": "5–9 أيام عمل",
  "product.route.eta6to9": "6–9 أيام عمل",
  "product.route.eta6to10": "6–10 أيام عمل",

  // Related journal cards
  "blog.neo-hair-lotion-complete-guide.title": "لوشن نيو للشعر: دليل كامل لبروتوكول 120 يومًا",
  "blog.neo-hair-lotion-complete-guide.excerpt":
    "دليل ميداني لاستخدام لوشن نيو للشعر بالطريقة الصحيحة — الجرعة، وتكرار الاستخدام، والجدول الزمني المتوقع، والأخطاء التي تُفقد الكثيرين نتائجهم بصمت.",
  "blog.neo-hair-shampoo-why-sulfate-free-matters.title":
    "شامبو نيو للشعر: كيف يغيّر التنظيف الخالي من الكبريتات ما تستطيع فروة رأسك فعله",
  "blog.neo-hair-shampoo-why-sulfate-free-matters.excerpt":
    "الكبريتات فعّالة — وهنا تكمن المشكلة. نظرة قريبة على ما يزيله شامبو نيو للشعر، وما يحافظ عليه، ولماذا يصنع هذا الفرق على مدى فصل كامل.",
  "blog.dermaroller-scalp-protocol.title":
    "الديرمارولر بالطريقة الصحيحة: بروتوكول لفروة الرأس بلا خرافات",
  "blog.dermaroller-scalp-protocol.excerpt":
    "جهاز الإبر الدقيقة أداة جدّية. استخدامه بإتقان يضاعف أثر البروتوكول الموضعي، واستخدامه بإهمال يعطي النتيجة العكسية. هذه هي الطريقة الصحيحة.",
  "blog.lotion-vs-shampoo-vs-dermaroller.title": "اللوشن والشامبو والديرمارولر: ما وظيفة كل منها",
  "blog.lotion-vs-shampoo-vs-dermaroller.excerpt":
    "ثلاث أدوات، وثلاث وظائف. شرح واضح لكيفية عمل منظومة جرين ولث معًا — وما يحدث إذا استخدمت واحدة منها فقط.",
  "blog.reading-a-hair-growth-timeline.title": "كيف تقرأ الجدول الزمني لنمو الشعر بصدق مع نفسك",
  "blog.reading-a-hair-growth-timeline.excerpt":
    "التقدّم في أي بروتوكول حقيقي للشعر بطيء وغير خطي ويسهل إساءة قراءته. دليل عملي للقياس والتصوير والمراجعة الأمينة عند اليوم 120.",
  "blog.the-five-botanicals-behind-neo-hair-lotion.title":
    "المستخلصات النباتية الخمسة وراء لوشن نيو للشعر",
  "blog.the-five-botanicals-behind-neo-hair-lotion.excerpt":
    "الجينسنغ الأبيض، ونخيل السرينوا، وعشبة إكليبتا، وذيل الحصان، ومستخلص الشمّام — ما يفعله كل منها ولماذا اختارتها التركيبة معًا.",

  // Commerce strings with no Arabic entry
  "commerce.cart.emptyBody":
    "لا يوجد شيء هنا بعد. استكشف مجموعتنا للعناية النباتية بالشعر — موثوقة من قِبل أكثر من مليوني عميل حول العالم.",
  "commerce.tracking.noTracking":
    "تُضاف تفاصيل التتبع لحظة تسليم شحنتك إلى شركة النقل. سنراسلك بالبريد الإلكتروني عند توفّرها.",
};

/** Product category labels (keyed by the English category string). */
export const arProductCategory: Record<string, string> = {
  "product.category.Hair Serum": "سيروم للشعر",
  "product.category.Cleansing": "تنظيف",
  "product.category.Scalp Care": "العناية بفروة الرأس",
  "product.category.Tools": "أدوات",
  "blog.category.Protocol": "بروتوكول",
  "blog.category.Science": "علم",
  "blog.category.Ingredient": "مكوّن",
  "blog.category.Ritual": "روتين",
  "blog.category.Guide": "دليل",
};
