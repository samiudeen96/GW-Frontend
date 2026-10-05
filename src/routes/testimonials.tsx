import { abs } from "@/lib/seo";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Neo Hair Lotion Testimonials — Green Wealth" },
      { name: "description", content: "Real customer testimonials and before/after results for Neo Hair Lotion from Green Wealth customers worldwide." },
    ],
    links: [{ rel: "canonical", href: abs("/reviews") }],
  }),
  component: () => <Navigate to="/reviews" replace />,
});
