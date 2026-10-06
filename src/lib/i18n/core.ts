/** i18n primitives with no dictionary import: safe to use inside islands. */
import type { Locale } from "./locale";

export type TranslateFn = (key: string, fallback: string) => string;
export type Messages = Record<string, string>;
export type IslandI18n = { locale: Locale; messages: Messages };

export function translator(messages: Messages): TranslateFn {
  return (key, fallback) => messages[key] || fallback;
}
