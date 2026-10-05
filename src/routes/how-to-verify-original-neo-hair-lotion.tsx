import { canonicalFor, localeOf } from "@/lib/seo";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/how-to-verify-original-neo-hair-lotion")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const title = locale === "ar"
      ? "كيفية التحقق من لوشن نيو للشعر الأصلي — بوابة الأصالة"
      : "How to Verify Original Neo Hair Lotion — Authenticity Portal";
    const description = locale === "ar"
      ? "أدخل رمز الخدش الخاص بك للتحقق من أصالة لوشن نيو للشعر. بوابة التحقق الرسمية من جرين ولث."
      : "Enter your scratch-off code to verify authentic Neo Hair Lotion. Official Green Wealth verification portal.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/verify", locale) }],
    };
  },
  component: () => <Navigate to="/verify" replace />,
});
