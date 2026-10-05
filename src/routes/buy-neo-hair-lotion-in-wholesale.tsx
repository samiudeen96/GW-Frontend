import { abs, canonicalFor, localeOf } from "@/lib/seo";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/buy-neo-hair-lotion-in-wholesale")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const title = locale === "ar"
      ? "شراء لوشن نيو للشعر بالجملة — برنامج الموزع المعتمد"
      : "Buy Neo Hair Lotion Wholesale — Authorized Distributor Program";
    const description = locale === "ar"
      ? "قدّم طلبًا لتصبح موزعًا معتمدًا لجرين ولث. أسعار جملة على لوشن نيو للشعر والشامبو في أكثر من 90 دولة."
      : "Apply to become an authorized Green Wealth distributor. Wholesale pricing on Neo Hair Lotion & Shampoo, 90+ countries.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
      ],
      links: [{ rel: "canonical", href: canonicalFor("/wholesale", locale) }],
    };
  },
  component: () => <Navigate to="/wholesale" replace />,
});
