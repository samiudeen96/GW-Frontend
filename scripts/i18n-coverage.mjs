/**
 * Arabic translation coverage report.
 *
 * Crawls every /ar/* route against the local dev server, strips head/meta,
 * script and style content, then reports visible Latin-word runs that are not
 * on the allow-list (brand marks, INCI/botanical names, codes, payment logos).
 *
 * Usage: node scripts/i18n-coverage.mjs [baseUrl]
 */

const BASE = process.argv[2] ?? "http://localhost:8080";

const PATHS = [
  "/ar",
  "/ar/shop",
  "/ar/about",
  "/ar/hair-science",
  "/ar/ingredients",
  "/ar/reviews",
  "/ar/testimonials",
  "/ar/blogs",
  "/ar/faq",
  "/ar/verify",
  "/ar/real-vs-fake",
  "/ar/how-to-use",
  "/ar/contact",
  "/ar/wholesale",
  "/ar/cart",
  "/ar/checkout",
  "/ar/track-order",
  "/ar/account",
  "/ar/legal",
  "/ar/terms",
  "/ar/privacy",
  "/ar/refund-policy",
  "/ar/shipping-returns",
  "/ar/cookie-policy",
  "/ar/accessibility",
  "/ar/comparison/neo-vs-minoxidil",
  "/ar/product/neo-hair-lotion",
  "/ar/product/neo-hair-shampoo",
  "/ar/product/ghori-rosemary-oil",
  "/ar/product/ghori-dermaroller",
  "/ar/ingredients/saw-palmetto",
  "/ar/ingredients/white-ginseng",
  "/ar/ingredients/horsetail-extract",
];

// Latin tokens that are expected to stay in Latin script.
const ALLOW = [
  /^(green|wealth|ghori|neo|hair|lotion|shampoo|holding|ltd|llc)$/i,
  /^(inci|sod|dht|ph|ml|kg|cm|mm|usd|aed|sar|eur|sgd|inr|gbp|qar|kwd|bhd|omr)$/i,
  /^(visa|mastercard|amex|paypal|tabby|tamara|moyasar|stripe|apple|google|pay)$/i,
  /^[A-Z0-9][A-Z0-9\-_.]{1,}$/, // codes, batch numbers, abbreviations
  /^[a-z]+(ium|osa|ata|ensis|folia|alba|melo|serrulata|officinalis)$/i, // botanical
  // Botanical / INCI genus + species and biological terms kept in Latin
  /^(cucumis|melo|serenoa|repens|panax|ginseng|equisetum|arvense|eclipta|prostrata|rosmarinus|radix|alba|araliaceae|equisetaceae|lamiaceae|palustre|saw|palmetto|horsetail|rosemary|mint|biotin|oil|anagen|telogen|catagen|wnt|catenin|silica|keratin|extract|panakes|donguibogam)$/i,
  // Legal identity, addresses and contact handles
  /^(greenwealth|theghori|com|trading|limited|holding|reg|legal|support|sales|partners|press|verify|admins|one|omniyat|tower|business|bay|dubai|united|arab|emirates|international|thailand|india|incoterms)$/i,
  // Language switcher label and HTML entity remnants
  /^(english|quot|amp|nbsp|min|max|local|session|storage|chrome|safari|firefox|edge|not)$/i,
];

const stripped = (html) =>
  html
    .replace(/\0/g, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<template\b[^>]*>[\s\S]*?<\/template\s*>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ");

const latinWords = (text) =>
  (text.match(/[A-Za-z][A-Za-z'’]{2,}/g) ?? []).filter(
    (w) => !ALLOW.some((re) => re.test(w)),
  );

const report = [];

for (const path of PATHS) {
  let html;
  try {
    const res = await fetch(BASE + path);
    html = await res.text();
    if (!res.ok) {
      report.push({ path, status: res.status, words: [], total: 0 });
      continue;
    }
  } catch (err) {
    report.push({ path, status: "ERR", words: [], total: 0, error: String(err) });
    continue;
  }
  const words = latinWords(stripped(html));
  const counts = new Map();
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  report.push({ path, status: 200, total: words.length, words: top });
}

const clean = report.filter((r) => r.total === 0).length;
console.log(`Arabic coverage: ${clean}/${report.length} routes with zero stray Latin words\n`);
for (const r of report.sort((a, b) => b.total - a.total)) {
  const flag = r.total === 0 ? "OK  " : "MISS";
  console.log(
    `${flag} ${r.path} — ${r.status} — ${r.total} latin words${
      r.words.length ? ` :: ${r.words.map(([w, c]) => `${w}(${c})`).join(", ")}` : ""
    }`,
  );
}
process.exitCode = 0;
