/** Currencies and per-product tier prices (local content source; replaced by the API later). */

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
    USD: [
      { minQty: 1, price: 40 },
      { minQty: 5, price: 38 },
      { minQty: 10, price: 35 },
    ],
    EUR: [
      { minQty: 1, price: 40 },
      { minQty: 5, price: 38 },
      { minQty: 10, price: 35 },
    ],
    SGD: [
      { minQty: 1, price: 40 },
      { minQty: 5, price: 38 },
      { minQty: 10, price: 35 },
    ],
    SAR: [
      { minQty: 1, price: 150 },
      { minQty: 3, price: 145 },
      { minQty: 10, price: 140 },
    ],
    QAR: [
      { minQty: 1, price: 140 },
      { minQty: 3, price: 125 },
      { minQty: 10, price: 110 },
    ],
    KWD: [
      { minQty: 1, price: 12 },
      { minQty: 3, price: 11 },
      { minQty: 10, price: 10 },
    ],
    BHD: [
      { minQty: 1, price: 15 },
      { minQty: 3, price: 13 },
      { minQty: 10, price: 10 },
    ],
    OMR: [
      { minQty: 1, price: 15 },
      { minQty: 3, price: 13 },
      { minQty: 10, price: 11 },
    ],
    GBP: [
      { minQty: 1, price: 30 },
      { minQty: 5, price: 28 },
      { minQty: 10, price: 26 },
    ],
    AFN: [
      { minQty: 1, price: 3100 },
      { minQty: 2, price: 3000 },
    ],
    AUD: [{ minQty: 1, price: 50 }],
    CAD: [{ minQty: 1, price: 50 }],
    AED: [
      { minQty: 1, price: 135 },
      { minQty: 3, price: 125 },
      { minQty: 10, price: 120 },
    ],
    INR: [
      { minQty: 1, price: 2400 },
      { minQty: 4, price: 2350 },
      { minQty: 7, price: 2300 },
      { minQty: 10, price: 2250 },
    ],
    PKR: [{ minQty: 1, price: 9500 }],
  },
  "neo-hair-shampoo": {
    USD: [
      { minQty: 1, price: 40 },
      { minQty: 5, price: 38 },
      { minQty: 10, price: 35 },
    ],
    EUR: [
      { minQty: 1, price: 40 },
      { minQty: 5, price: 38 },
      { minQty: 10, price: 35 },
    ],
    SGD: [
      { minQty: 1, price: 40 },
      { minQty: 5, price: 38 },
      { minQty: 10, price: 35 },
    ],
    SAR: [
      { minQty: 1, price: 140 },
      { minQty: 3, price: 130 },
      { minQty: 10, price: 120 },
    ],
    QAR: [
      { minQty: 1, price: 140 },
      { minQty: 3, price: 125 },
      { minQty: 10, price: 110 },
    ],
    KWD: [
      { minQty: 1, price: 12 },
      { minQty: 3, price: 11 },
      { minQty: 10, price: 10 },
    ],
    BHD: [
      { minQty: 1, price: 15 },
      { minQty: 3, price: 13 },
      { minQty: 10, price: 10 },
    ],
    OMR: [
      { minQty: 1, price: 15 },
      { minQty: 3, price: 13 },
      { minQty: 10, price: 11 },
    ],
    GBP: [
      { minQty: 1, price: 30 },
      { minQty: 5, price: 28 },
      { minQty: 10, price: 26 },
    ],
    AFN: [
      { minQty: 1, price: 3100 },
      { minQty: 2, price: 3000 },
    ],
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

// ISO-3166 alpha-2 country → supported currency. Anything unlisted falls back to USD.
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD",
  AE: "AED",
  SA: "SAR",
  QA: "QAR",
  KW: "KWD",
  BH: "BHD",
  OM: "OMR",
  GB: "GBP",
  IE: "EUR",
  AU: "AUD",
  CA: "CAD",
  SG: "SGD",
  IN: "INR",
  PK: "PKR",
  AF: "AFN",
  // Eurozone
  AT: "EUR",
  BE: "EUR",
  CY: "EUR",
  EE: "EUR",
  FI: "EUR",
  FR: "EUR",
  DE: "EUR",
  GR: "EUR",
  IT: "EUR",
  LV: "EUR",
  LT: "EUR",
  LU: "EUR",
  MT: "EUR",
  NL: "EUR",
  PT: "EUR",
  SK: "EUR",
  SI: "EUR",
  ES: "EUR",
  HR: "EUR",
};
