import { abs } from "@/lib/seo";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/how-to-use-neo-hair-lotion")({
  head: () => ({
    meta: [
      { title: "How to Use Neo Hair Lotion — Step-by-Step Application Guide" },
      { name: "description", content: "Follow this 6-step protocol for maximum hair growth results with Neo Hair Lotion. Timing, dosage, and 120-day plan." },
    ],
    links: [{ rel: "canonical", href: abs("/how-to-use") }],
  }),
  component: () => <Navigate to="/how-to-use" replace />,
});
