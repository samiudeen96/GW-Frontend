import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, follow" }],
  }),
  component: BlogLegacyRedirect,
});

function BlogLegacyRedirect() {
  const { slug } = Route.useParams();
  return <Navigate to="/blogs/$slug" params={{ slug }} replace />;
}
