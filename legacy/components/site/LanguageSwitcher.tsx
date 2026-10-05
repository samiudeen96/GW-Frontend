/**
 * LanguageSwitcher
 *
 * Purpose: switch between the English (`/path`) and Arabic (`/ar/path`) editions.
 * Users: every visitor, from header (desktop) and mobile menu.
 * Key actions: navigate to the same page in the other locale.
 * Integration points: `src/lib/i18n` for locale state, router state for the
 * current locale-agnostic pathname.
 *
 * Uses plain anchors on purpose: a locale change is a document-level change
 * (html lang/dir + font), so a full navigation is the correct, simplest behaviour.
 */
import { useRouterState } from "@tanstack/react-router";

import { LOCALES, LOCALE_META, useI18n, withLocalePrefix } from "@/lib/i18n";

export function LanguageSwitcher({
  className = "",
  variant = "inline",
  tone = "light",
}: {
  className?: string;
  variant?: "inline" | "block";
  tone?: "light" | "dark";
}) {
  const { locale, t } = useI18n();
  const location = useRouterState({ select: (s) => s.location });
  const bare = location.pathname + (location.searchStr ?? "");

  if (variant === "block") {
    const labelClass = tone === "dark" ? "text-brass" : "text-ink/50";
    const gridClass = tone === "dark" ? "bg-brass/30" : "bg-ink/10";
    const activeClass = tone === "dark" ? "bg-brass text-forest" : "bg-forest text-ivory";
    const inactiveClass =
      tone === "dark"
        ? "bg-forest text-paper/70 hover:text-paper"
        : "bg-paper text-ink/70 hover:text-forest";
    return (
      <div className={className}>
        <span className={`block text-[9px] font-mono uppercase tracking-[0.24em] ${labelClass} mb-2`}>
          {t("header.language", "Language")}
        </span>
        <div className={`grid grid-cols-2 gap-px ${gridClass}`}>
          {LOCALES.map((l) => (
            <a
              key={l}
              href={withLocalePrefix(bare, l)}
              hrefLang={LOCALE_META[l].htmlLang}
              className={`px-3 py-3 text-center text-[11px] uppercase tracking-[0.18em] ${
                l === locale ? activeClass : inactiveClass
              }`}
            >
              {LOCALE_META[l].nativeLabel}
            </a>
          ))}
        </div>
      </div>
    );
  }

  const other = LOCALES.find((l) => l !== locale)!;
  return (
    <a
      href={withLocalePrefix(bare, other)}
      hrefLang={LOCALE_META[other].htmlLang}
      aria-label={`${t("header.language", "Language")}: ${LOCALE_META[other].label}`}
      className={`text-[11px] uppercase tracking-[0.18em] text-ink/70 hover:text-forest transition-colors ${className}`}
    >
      {LOCALE_META[other].nativeLabel}
    </a>
  );
}
