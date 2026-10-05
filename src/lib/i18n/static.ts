/**
 * i18n · static (non-React) translation
 *
 * Purpose: let route `head()` functions and other non-component code translate
 * copy for a known locale, since hooks are unavailable there.
 * Integration points: `src/lib/seo.ts` `localeOf(ctx)` supplies the locale.
 */
import { AR_DICTIONARY } from "./ar";

export type StaticTranslate = (key: string, fallback: string) => string;

export function tStatic(locale: string): StaticTranslate {
  if (locale !== "ar") return (_key, fallback) => fallback;
  return (key, fallback) => AR_DICTIONARY[key] || fallback;
}
