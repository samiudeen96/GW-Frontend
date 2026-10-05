/**
 * Active currency. The server reads it from the `gw-currency` cookie (see
 * middleware) and renders prices in it; changing it rewrites the cookie and
 * reloads so every server-rendered price updates.
 */
import { CURRENCY_COOKIE } from "@/lib/currency-cookie";
import { COUNTRY_TO_CURRENCY } from "@/data/pricing";
import { DEFAULT_CURRENCY, isCurrency } from "@/lib/pricing";

const AUTO_KEY = "gw-currency-auto";
const ONE_YEAR = 60 * 60 * 24 * 365;

function readCookie(): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${CURRENCY_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function writeCookie(code: string) {
  document.cookie = `${CURRENCY_COOKIE}=${encodeURIComponent(code)}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

export function setCurrency(code: string) {
  if (!isCurrency(code)) return;
  writeCookie(code);
  try {
    localStorage.setItem(AUTO_KEY, "1");
  } catch {
    /* storage unavailable */
  }
  window.location.reload();
}

async function detectFromIp(): Promise<string> {
  const endpoints = ["https://ipapi.co/json/", "https://ipwho.is/"];
  for (const url of endpoints) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const data = (await res.json()) as { country_code?: string; country?: string };
      const cc = data.country_code || data.country;
      if (cc) return COUNTRY_TO_CURRENCY[cc.toUpperCase()] ?? DEFAULT_CURRENCY;
    } catch {
      /* try next provider */
    }
  }
  return DEFAULT_CURRENCY;
}

/** First visit only: guess the currency from the visitor's IP, then reload once if it differs. */
export async function autoDetectCurrency(current: string) {
  try {
    if (readCookie() || localStorage.getItem(AUTO_KEY)) return;
    localStorage.setItem(AUTO_KEY, "1");
  } catch {
    return;
  }
  const detected = await detectFromIp();
  writeCookie(detected);
  if (detected !== current) window.location.reload();
}
