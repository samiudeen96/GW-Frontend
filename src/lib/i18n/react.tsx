/**
 * i18n · island runtime
 *
 * Wrap an island's root in <I18nProvider i18n={props.i18n}> and use the hooks in
 * any component below it. `i18n` comes from `islandI18n()` on the server.
 */
import { createContext, useContext, useMemo, type ReactNode } from "react";

import { translator, type IslandI18n, type TranslateFn } from "./core";
import { DEFAULT_LOCALE, LOCALE_META, type Locale, withLocalePrefix } from "./locale";

type I18nValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  isRtl: boolean;
  t: TranslateFn;
  /** Prefix a locale-agnostic path for the active locale. */
  path: (p: string) => string;
};

const FALLBACK: I18nValue = {
  locale: DEFAULT_LOCALE,
  dir: "ltr",
  isRtl: false,
  t: (_key, fallback) => fallback,
  path: (p) => p,
};

const I18nContext = createContext<I18nValue>(FALLBACK);

export function I18nProvider({ i18n, children }: { i18n?: IslandI18n; children: ReactNode }) {
  const value = useMemo<I18nValue>(() => {
    if (!i18n) return FALLBACK;
    const dir = LOCALE_META[i18n.locale].dir;
    return {
      locale: i18n.locale,
      dir,
      isRtl: dir === "rtl",
      t: translator(i18n.messages),
      path: (p) => withLocalePrefix(p, i18n.locale),
    };
  }, [i18n]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}

export function useT(): TranslateFn {
  return useI18n().t;
}

export function useLocalePath(): (p: string) => string {
  return useI18n().path;
}
