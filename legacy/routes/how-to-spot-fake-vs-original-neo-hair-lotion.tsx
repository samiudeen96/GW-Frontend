import { canonicalFor, localeOf } from "@/lib/seo";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/how-to-spot-fake-vs-original-neo-hair-lotion")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const title = locale === "ar"
      ? "كيف تُميّز لوشن نيو للشعر المقلّد عن الأصلي"
      : "How to Spot Fake vs Original Neo Hair Lotion";
    const description = locale === "ar"
      ? "تعرّف على كيفية تمييز لوشن نيو للشعر الأصلي عن التقليد المزيّف. تحقّق من الهولوغرام ورمز الخدش وملمس الزجاجة والعبوة."
      : "Learn how to identify original Neo Hair Lotion from counterfeit fakes. Check hologram, scratch code, bottle texture, packaging.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/real-vs-fake", locale) }],
    };
  },
  component: () => <Navigate to="/real-vs-fake" replace />,
});
