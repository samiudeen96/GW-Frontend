import type { TranslateFn } from "@/lib/i18n";

export type LegalSection = { title: string; html: string };

/**
 * Translate an English `LegalSection[]`: section `i` (0-based) reads
 * `legal.<ns>.s<i+1>.title` / `.html`, falling back to the English source.
 */
export function translateLegalSections(
  t: TranslateFn,
  ns: string,
  sections: LegalSection[],
): LegalSection[] {
  return sections.map((s, i) => ({
    title: t(`legal.${ns}.s${i + 1}.title`, s.title),
    html: t(`legal.${ns}.s${i + 1}.html`, s.html),
  }));
}
