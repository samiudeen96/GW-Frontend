/** Journal formatting helpers shared by the blog pages. */
import type { TranslateFn } from "@/lib/i18n/core";

/** Long-form publication date (`June 14, 2026`); ISO dates are read as UTC. */
export const formatDate = (iso: string, locale: string) =>
  new Date(iso).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

/** `9 min` with the unit translated. */
export const readTime = (read: string, t: TranslateFn) =>
  read.replace("min", t("blog.chrome.minutes", "min"));

export const postTitle = (t: TranslateFn, slug: string, fallback: string) =>
  t(`blog.${slug}.title`, fallback);

export const postExcerpt = (t: TranslateFn, slug: string, fallback: string) =>
  t(`blog.${slug}.excerpt`, fallback);

export const postCategory = (t: TranslateFn, category: string) =>
  t(`blog.category.${category}`, category);
