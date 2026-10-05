/**
 * i18n · legal page sections
 *
 * Purpose: translate the developer-authored English `LegalSection[]` arrays that
 * live inside each legal route into the active locale without duplicating the
 * arrays per language. Key actions: `useLegalSections(ns, sections)`.
 * Integration points: `/terms`, `/privacy`, `/refund-policy`,
 * `/shipping-returns`, `/cookie-policy` routes and their `legal.<ns>.*`
 * dictionary namespaces in `src/lib/i18n/ar/`.
 *
 * Key contract: section at array index `i` (0-based) reads
 * `legal.<ns>.s<i+1>.title` and `legal.<ns>.s<i+1>.html`, falling back to the
 * English source when a translation is missing.
 */
import { useMemo } from "react";

import type { LegalSection } from "@/components/site/LegalSections";
import { useT } from "./index";

export function useLegalSections(ns: string, sections: LegalSection[]): LegalSection[] {
  const t = useT();
  return useMemo(
    () =>
      sections.map((s, i) => ({
        title: t(`legal.${ns}.s${i + 1}.title`, s.title),
        html: t(`legal.${ns}.s${i + 1}.html`, s.html),
      })),
    [ns, sections, t],
  );
}
