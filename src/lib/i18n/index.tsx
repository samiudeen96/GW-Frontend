/**
 * i18n · React runtime
 *
 * Purpose: expose the active locale, the translate helper and locale-aware path
 * building to components. Key actions: `useLocale()`, `useT()`, `useLocalePath()`.
 * Integration points: `src/router.tsx` sets the locale from the URL rewrite;
 * `src/routes/__root.tsx` mounts `<LocaleProvider>`.
 *
 * Translation contract: `t("some.key", "English fallback")`. When the active
 * locale is English — or a key has no Arabic entry yet — the English fallback is
 * rendered, so pages never break mid-translation.
 */
import { createContext, useContext, useMemo, type ReactNode } from "react";

import { AR_DICTIONARY } from "./ar";
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  type Locale,
  stripLocalePrefix,
  withLocalePrefix,
} from "./locale";

export * from "./locale";

const DICTIONARIES: Partial<Record<Locale, Record<string, string>>> = {
  ar: AR_DICTIONARY,
};

export type TranslateFn = (key: string, fallback: string) => string;

type LocaleContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  isRtl: boolean;
  t: TranslateFn;
  /** Prefix a locale-agnostic app path for the active locale. */
  path: (p: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<LocaleContextValue>(() => {
    const dict = DICTIONARIES[locale];
    return {
      locale,
      dir: LOCALE_META[locale].dir,
      isRtl: LOCALE_META[locale].dir === "rtl",
      t: (key, fallback) => (dict && dict[key]) || fallback,
      path: (p) => withLocalePrefix(p, locale),
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

const FALLBACK: LocaleContextValue = {
  locale: DEFAULT_LOCALE,
  dir: "ltr",
  isRtl: false,
  t: (_key, fallback) => fallback,
  path: (p) => stripLocalePrefix(p),
};

export function useI18n(): LocaleContextValue {
  return useContext(LocaleContext) ?? FALLBACK;
}

export function useLocale(): Locale {
  return useI18n().locale;
}

export function useT(): TranslateFn {
  return useI18n().t;
}

/** Build a href for the active locale (use for plain anchors / non-router links). */
export function useLocalePath(): (p: string) => string {
  return useI18n().path;
}
