import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { posts } from "@/lib/blog-posts";
import { ingredients } from "@/lib/ingredients";
import { countries } from "@/lib/countries";
import { COMBOS } from "@/lib/combos";
import { SITE_ORIGIN } from "@/lib/seo";

type Entry = { path: string; lastmod?: string; changefreq?: string; priority?: string };

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: Entry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/shop", changefreq: "weekly", priority: "0.9" },
          { path: "/blogs", changefreq: "weekly", priority: "0.8" },
          { path: "/blogs/series", changefreq: "weekly", priority: "0.7" },
          { path: "/reviews", changefreq: "weekly", priority: "0.8" },
          { path: "/verify", changefreq: "monthly", priority: "0.8" },
          { path: "/real-vs-fake", changefreq: "monthly", priority: "0.8" },
          { path: "/how-to-use", changefreq: "monthly", priority: "0.7" },
          { path: "/how-to-use-neo-hair-lotion", changefreq: "monthly", priority: "0.7" },
          { path: "/how-to-verify-original-neo-hair-lotion", changefreq: "monthly", priority: "0.7" },
          { path: "/how-to-spot-fake-vs-original-neo-hair-lotion", changefreq: "monthly", priority: "0.7" },
          { path: "/buy-neo-hair-lotion-in-wholesale", changefreq: "monthly", priority: "0.7" },
          { path: "/neo-hair-lotion-reviews", changefreq: "weekly", priority: "0.7" },
          { path: "/hair-science", changefreq: "monthly", priority: "0.7" },
          { path: "/about", changefreq: "monthly", priority: "0.6" },
          { path: "/wholesale", changefreq: "monthly", priority: "0.6" },
          { path: "/contact", changefreq: "monthly", priority: "0.5" },
          { path: "/faq", changefreq: "monthly", priority: "0.8" },
          { path: "/track-order", changefreq: "monthly", priority: "0.4" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/legal", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
          { path: "/shipping-returns", changefreq: "yearly", priority: "0.3" },
          { path: "/refund-policy", changefreq: "yearly", priority: "0.3" },
          { path: "/cookie-policy", changefreq: "yearly", priority: "0.3" },
          { path: "/accessibility", changefreq: "yearly", priority: "0.3" },
          { path: "/ingredients", changefreq: "monthly", priority: "0.7" },
          { path: "/comparison/neo-vs-minoxidil", changefreq: "monthly", priority: "0.7" },
        ];
        const productEntries: Entry[] = products.map((p) => ({
          path: `/product/${p.slug}`,
          changefreq: "weekly",
          priority: "0.9",
        }));
        const comboEntries: Entry[] = COMBOS.map((c) => ({
          path: `/combo/${c.code.toLowerCase()}`,
          changefreq: "weekly",
          priority: "0.8",
        }));
        const blogEntries: Entry[] = posts.map((post) => ({
          path: `/blogs/${post.slug}`,
          changefreq: "monthly",
          priority: "0.7",
          lastmod: post.date,
        }));
        const ingredientEntries: Entry[] = ingredients.map((i) => ({
          path: `/ingredients/${i.slug}`,
          changefreq: "monthly",
          priority: "0.6",
        }));
        const countryEntries: Entry[] = countries.map((c) => ({
          path: `/countries/${c.slug}`,
          changefreq: "weekly",
          priority: "0.8",
        }));
        const all = [...staticEntries, ...productEntries, ...comboEntries, ...blogEntries, ...ingredientEntries, ...countryEntries];
        // Every page exists in English (bare path) and Arabic (/ar prefix); each
        // entry declares both editions via xhtml:link alternates.
        const urls = all
          .flatMap((e) =>
            (["en", "ar"] as const).map((locale) => {
              const loc = `${SITE_ORIGIN}${locale === "ar" ? (e.path === "/" ? "/ar" : `/ar${e.path}`) : e.path}`;
              const enHref = `${SITE_ORIGIN}${e.path}`;
              const arHref = `${SITE_ORIGIN}${e.path === "/" ? "/ar" : `/ar${e.path}`}`;
              return [
                `  <url>`,
                `    <loc>${loc}</loc>`,
                `    <xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>`,
                `    <xhtml:link rel="alternate" hreflang="ar" href="${arHref}"/>`,
                `    <xhtml:link rel="alternate" hreflang="x-default" href="${enHref}"/>`,
                e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
                e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
                e.priority ? `    <priority>${e.priority}</priority>` : null,
                `  </url>`,
              ]
                .filter(Boolean)
                .join("\n");
            }),
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
