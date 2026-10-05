import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type PriceTier = { minQty: number; price: number };

export type CurrencyMeta = {
  code: string;
  symbol: string;
  position: "before" | "after";
  decimals: number;
  country?: string;
};

// Fetched from greenwealth.com — Odoo `res.currency` set.
export const CURRENCIES: CurrencyMeta[] = [
  { code: "USD", symbol: "$", position: "before", decimals: 2, country: "Other countries" },
  { code: "AED", symbol: "AED", position: "after", decimals: 2, country: "UAE" },
  { code: "SAR", symbol: "SAR", position: "after", decimals: 2, country: "Saudi Arabia" },
  { code: "QAR", symbol: "QR", position: "after", decimals: 2, country: "Qatar" },
  { code: "KWD", symbol: "KWD", position: "after", decimals: 3, country: "Kuwait" },
  { code: "BHD", symbol: "BD", position: "after", decimals: 3, country: "Bahrain" },
  { code: "OMR", symbol: "OMR", position: "after", decimals: 3, country: "Oman" },
  { code: "GBP", symbol: "£", position: "before", decimals: 2, country: "United Kingdom" },
  { code: "EUR", symbol: "€", position: "after", decimals: 2, country: "Eurozone" },
  { code: "AUD", symbol: "AU$", position: "before", decimals: 2, country: "Australia" },
  { code: "CAD", symbol: "CA$", position: "before", decimals: 2, country: "Canada" },
  { code: "SGD", symbol: "S$", position: "before", decimals: 2, country: "Singapore" },
  { code: "INR", symbol: "₹", position: "before", decimals: 2, country: "India" },
  { code: "PKR", symbol: "PKR", position: "after", decimals: 2, country: "Pakistan" },
  { code: "AFN", symbol: "Afs", position: "after", decimals: 2, country: "Afghanistan" },
];

// Per-product, per-currency tier prices synced from greenwealth.com Odoo pricelists (2026-09-30).
// USD/EUR/SGD use the "Default - ROW" USD tiers. Shampoo SAR and Rosemary AED 45 kept as set by owner.
export const TIER_PRICES: Record<string, Record<string, PriceTier[]>> = {
  "neo-hair-lotion": {
    USD: [{ minQty: 1, price: 40 }, { minQty: 5, price: 38 }, { minQty: 10, price: 35 }],
    EUR: [{ minQty: 1, price: 40 }, { minQty: 5, price: 38 }, { minQty: 10, price: 35 }],
    SGD: [{ minQty: 1, price: 40 }, { minQty: 5, price: 38 }, { minQty: 10, price: 35 }],
    SAR: [{ minQty: 1, price: 150 }, { minQty: 3, price: 145 }, { minQty: 10, price: 140 }],
    QAR: [{ minQty: 1, price: 140 }, { minQty: 3, price: 125 }, { minQty: 10, price: 110 }],
    KWD: [{ minQty: 1, price: 12 }, { minQty: 3, price: 11 }, { minQty: 10, price: 10 }],
    BHD: [{ minQty: 1, price: 15 }, { minQty: 3, price: 13 }, { minQty: 10, price: 10 }],
    OMR: [{ minQty: 1, price: 15 }, { minQty: 3, price: 13 }, { minQty: 10, price: 11 }],
    GBP: [{ minQty: 1, price: 30 }, { minQty: 5, price: 28 }, { minQty: 10, price: 26 }],
    AFN: [{ minQty: 1, price: 3100 }, { minQty: 2, price: 3000 }],
    AUD: [{ minQty: 1, price: 50 }],
    CAD: [{ minQty: 1, price: 50 }],
    AED: [{ minQty: 1, price: 135 }, { minQty: 3, price: 125 }, { minQty: 10, price: 120 }],
    INR: [{ minQty: 1, price: 2400 }, { minQty: 4, price: 2350 }, { minQty: 7, price: 2300 }, { minQty: 10, price: 2250 }],
    PKR: [{ minQty: 1, price: 9500 }],
  },
  "neo-hair-shampoo": {
    USD: [{ minQty: 1, price: 40 }, { minQty: 5, price: 38 }, { minQty: 10, price: 35 }],
    EUR: [{ minQty: 1, price: 40 }, { minQty: 5, price: 38 }, { minQty: 10, price: 35 }],
    SGD: [{ minQty: 1, price: 40 }, { minQty: 5, price: 38 }, { minQty: 10, price: 35 }],
    SAR: [{ minQty: 1, price: 140 }, { minQty: 3, price: 130 }, { minQty: 10, price: 120 }],
    QAR: [{ minQty: 1, price: 140 }, { minQty: 3, price: 125 }, { minQty: 10, price: 110 }],
    KWD: [{ minQty: 1, price: 12 }, { minQty: 3, price: 11 }, { minQty: 10, price: 10 }],
    BHD: [{ minQty: 1, price: 15 }, { minQty: 3, price: 13 }, { minQty: 10, price: 10 }],
    OMR: [{ minQty: 1, price: 15 }, { minQty: 3, price: 13 }, { minQty: 10, price: 11 }],
    GBP: [{ minQty: 1, price: 30 }, { minQty: 5, price: 28 }, { minQty: 10, price: 26 }],
    AFN: [{ minQty: 1, price: 3100 }, { minQty: 2, price: 3000 }],
    AUD: [{ minQty: 1, price: 50 }],
    CAD: [{ minQty: 1, price: 50 }],
    AED: [{ minQty: 1, price: 135 }],
    INR: [{ minQty: 1, price: 2600 }],
    PKR: [{ minQty: 1, price: 9000 }],
  },
  "ghori-rosemary-oil": {
    USD: [{ minQty: 1, price: 14 }],
    AED: [{ minQty: 1, price: 45 }],
    SAR: [{ minQty: 1, price: 50 }],
    QAR: [{ minQty: 1, price: 60 }],
    KWD: [{ minQty: 1, price: 4 }],
    BHD: [{ minQty: 1, price: 5 }],
    OMR: [{ minQty: 1, price: 6 }],
    GBP: [{ minQty: 1, price: 13.99 }],
    INR: [{ minQty: 1, price: 999 }],
    PKR: [{ minQty: 1, price: 4500 }],
    AFN: [{ minQty: 1, price: 1000 }],
    AUD: [{ minQty: 1, price: 20 }],
    CAD: [{ minQty: 1, price: 19.99 }],
  },
  "ghori-dermaroller": {
    USD: [{ minQty: 1, price: 6 }],
    AED: [{ minQty: 1, price: 20 }],
    SAR: [{ minQty: 1, price: 25 }],
    QAR: [{ minQty: 1, price: 25 }],
    KWD: [{ minQty: 1, price: 1.5 }],
    BHD: [{ minQty: 1, price: 2 }],
    OMR: [{ minQty: 1, price: 2 }],
    GBP: [{ minQty: 1, price: 6 }],
    INR: [{ minQty: 1, price: 300 }],
    PKR: [{ minQty: 1, price: 2000 }],
    AFN: [{ minQty: 1, price: 400 }],
    AUD: [{ minQty: 1, price: 6 }],
  },
};

export const DEFAULT_CURRENCY = "USD";

export function getCurrency(code: string): CurrencyMeta {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function getTiers(slug: string, currency: string): PriceTier[] {
  const bySlug = TIER_PRICES[slug];
  if (!bySlug) return [];
  return bySlug[currency] ?? bySlug[DEFAULT_CURRENCY] ?? [];
}

export function getBasePrice(slug: string, currency: string): number {
  const tiers = getTiers(slug, currency);
  return tiers[0]?.price ?? 0;
}

export function unitPriceForQty(slug: string, qty: number, currency: string): number {
  const tiers = getTiers(slug, currency);
  if (!tiers.length) return 0;
  let price = tiers[0].price;
  for (const t of tiers) {
    if (qty >= t.minQty) price = t.price;
  }
  return price;
}

export function lineTotal(slug: string, qty: number, currency: string): number {
  return unitPriceForQty(slug, qty, currency) * qty;
}


export function formatMoney(value: number, currency: string): string {
  const c = getCurrency(currency);
  const num = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: c.decimals,
    maximumFractionDigits: c.decimals,
  }).format(value);
  return c.position === "before" ? `${c.symbol}${num}` : `${num} ${c.symbol}`;
}

// ---- Region (currency) context ----

type RegionCtx = {
  currency: string;
  setCurrency: (c: string) => void;
};

const RegionContext = createContext<RegionCtx>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
});

const STORAGE_KEY = "gw-currency";
const AUTO_KEY = "gw-currency-auto";

// ISO-3166 alpha-2 country → supported currency. Anything unlisted falls back to USD.
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD",
  AE: "AED",
  SA: "SAR",
  QA: "QAR",
  KW: "KWD",
  BH: "BHD",
  OM: "OMR",
  GB: "GBP", IE: "EUR",
  AU: "AUD",
  CA: "CAD",
  SG: "SGD",
  IN: "INR",
  PK: "PKR",
  AF: "AFN",
  // Eurozone
  AT: "EUR", BE: "EUR", CY: "EUR", EE: "EUR", FI: "EUR", FR: "EUR",
  DE: "EUR", GR: "EUR", IT: "EUR", LV: "EUR", LT: "EUR", LU: "EUR",
  MT: "EUR", NL: "EUR", PT: "EUR", SK: "EUR", SI: "EUR", ES: "EUR", HR: "EUR",
};

async function detectCurrencyFromIP(): Promise<string> {
  const endpoints = [
    { url: "https://ipapi.co/json/", key: "country_code" },
    { url: "https://ipwho.is/", key: "country_code" },
  ];
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, { cache: "no-store" });
      if (!res.ok) continue;
      const data = await res.json();
      const cc: string | undefined = data?.[ep.key] || data?.country;
      if (cc && typeof cc === "string") {
        return COUNTRY_TO_CURRENCY[cc.toUpperCase()] ?? DEFAULT_CURRENCY;
      }
    } catch {}
  }
  return DEFAULT_CURRENCY;
}

export function RegionProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>(DEFAULT_CURRENCY);

  useEffect(() => {
    let cancelled = false;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && CURRENCIES.some((c) => c.code === saved)) {
        setCurrencyState(saved);
        return;
      }
      // Only auto-detect once per browser
      if (localStorage.getItem(AUTO_KEY)) return;
    } catch {}

    (async () => {
      const detected = await detectCurrencyFromIP();
      if (cancelled) return;
      const code = CURRENCIES.some((c) => c.code === detected) ? detected : DEFAULT_CURRENCY;
      setCurrencyState(code);
      try {
        localStorage.setItem(STORAGE_KEY, code);
        localStorage.setItem(AUTO_KEY, "1");
      } catch {}
    })();

    return () => { cancelled = true; };
  }, []);

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
      localStorage.setItem(AUTO_KEY, "1");
    } catch {}
  };

  return (
    <RegionContext.Provider value={{ currency, setCurrency }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  return useContext(RegionContext);
}
