/**
 * i18n · server runtime (imports the dictionaries; never import from islands)
 *
 * Translation contract: `t("some.key", "English fallback")`. English copy lives
 * inline as the fallback; other locales read from their dictionary and fall back
 * to English when a key is missing, so pages never break mid-translation.
 *
 * Pages: `const t = createT(Astro.locals.locale)`.
 * Islands: pass `i18n={islandI18n(locale, ["cart.", "commerce."])}` and call
 * `useT()` from `@/lib/i18n/react` inside. Only the listed key prefixes are
 * serialised into the page, which keeps the dictionary out of client bundles.
 *
 * Dictionaries are local today; they will come from the API later.
 */
import { AR_DICTIONARY } from "./ar";
import { translator, type IslandI18n, type Messages, type TranslateFn } from "./core";
import { DEFAULT_LOCALE, type Locale } from "./locale";

export * from "./locale";
export * from "./core";

const DICTIONARIES: Partial<Record<Locale, Messages>> = {
  ar: AR_DICTIONARY,
};

export function getMessages(locale: Locale): Messages {
  return DICTIONARIES[locale] ?? {};
}

export function createT(locale: Locale = DEFAULT_LOCALE): TranslateFn {
  return translator(getMessages(locale));
}

/** Dictionary subset for an island: every key starting with one of `prefixes`. */
export function islandI18n(locale: Locale, prefixes: string[]): IslandI18n {
  const all = getMessages(locale);
  const messages: Messages = {};
  for (const key in all) {
    if (prefixes.some((p) => key.startsWith(p))) messages[key] = all[key];
  }
  return { locale, messages };
}
