import { createFileRoute } from "@tanstack/react-router";
import { breadcrumbLd, canonicalFor, hreflangLinks, localeOf } from "@/lib/seo";
import { PageHeader, Prose } from "@/components/site/Page";
import { useT } from "@/lib/i18n";
import { tStatic } from "@/lib/i18n/static";

const EN = {
  eyebrow: "Commitment",
  title: "Accessibility",
  body: "Green Wealth is committed to WCAG 2.2 AA. If you encounter an accessibility barrier, please contact us so we can address it.",
  seoTitle: "Accessibility — Green Wealth",
  seoDescription:
    "Green Wealth is committed to WCAG 2.2 AA accessibility across greenwealth.com. Report any barrier and we will address it.",
};

export const Route = createFileRoute("/accessibility")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const t = tStatic(locale);
    return {
      meta: [
        { title: t("legal.accessibility.seo.title", EN.seoTitle) },
        { name: "description", content: t("legal.accessibility.seo.description", EN.seoDescription) },
        { property: "og:title", content: t("legal.accessibility.seo.ogTitle", EN.seoTitle) },
        { property: "og:description", content: t("legal.accessibility.seo.ogDescription", EN.seoDescription) },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonicalFor("/accessibility", locale) },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: canonicalFor("/accessibility", locale) },
        ...hreflangLinks("/accessibility"),
      ],
      scripts: [breadcrumbLd([{ name: "Home", path: "/" }, { name: "Accessibility", path: "/accessibility" }])],
    };
  },
  component: AccessibilityPage,
});

function AccessibilityPage() {
  const t = useT();
  return (
    <>
      <PageHeader
        eyebrow={t("legal.accessibility.eyebrow", EN.eyebrow)}
        title={t("legal.accessibility.title", EN.title)}
      />
      <Prose>
        <p>{t("legal.accessibility.body", EN.body)}</p>
      </Prose>
    </>
  );
}
