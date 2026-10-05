import { abs } from "@/lib/seo";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/neo-hair-lotion-reviews")({
  head: () => ({
    meta: [
      { title: "Neo Hair Lotion Reviews — Real Customer Results | Green Wealth" },
      { name: "description", content: "Verified customer reviews and before & after results from real Neo Hair Lotion users across 90+ countries." },
    ],
    links: [{ rel: "canonical", href: abs("/reviews") }],
  }),
  component: () => <Navigate to="/reviews" replace />,
});
