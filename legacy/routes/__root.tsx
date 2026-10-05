import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { WhatsAppChat } from "@/components/site/WhatsAppChat";
import { CartProvider } from "@/lib/cart";
import { RegionProvider } from "@/lib/pricing";
import { SITE_ORIGIN, localeOf } from "@/lib/seo";
import { LocaleProvider, LOCALE_META, useT, type LocaleRef } from "@/lib/i18n";

function SkipLabel() {
  const t = useT();
  return <>{t("header.skip", "Skip to content")}</>;
}

function NotFoundComponent() {
  const t = useT();
  return (
    <div className="min-h-[60vh] flex items-center justify-center container-editorial">
      <div className="text-center max-w-md">
        <div className="eyebrow mb-6">404 · Not Found</div>
        <h1 className="display-lg">{t("common.notFoundTitle", "The page you are looking for cannot be found.")}</h1>
        <Link
          to="/"
          className="mt-8 inline-block bg-forest text-ivory px-6 py-3 text-xs uppercase tracking-[0.18em]"
        >
          {t("common.returnHome", "Return Home")}
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center container-editorial">
      <div className="text-center max-w-md">
        <div className="eyebrow mb-6">Something went wrong</div>
        <h1 className="display-md">This page didn't load.</h1>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-forest text-ivory px-6 py-3 text-xs uppercase tracking-[0.18em]"
          >
            Try again
          </button>
          <a
            href="/"
            className="border hairline px-6 py-3 text-xs uppercase tracking-[0.18em]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  localeRef: LocaleRef;
}>()({
  head: (ctx) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:locale", content: localeOf(ctx) === "ar" ? "ar_AR" : "en_US" },
      { property: "og:locale:alternate", content: localeOf(ctx) === "ar" ? "en_US" : "ar_AR" },
      { title: "Neo Hair Lotion — Original Hair Growth Spray | Green Wealth" },
      {
        name: "description",
        content:
          "Buy original Neo Hair Lotion with Ginseng & Saw Palmetto. Botanical hair regrowth spray by Green Wealth. Verified authentic, worldwide delivery from Thailand.",
      },
      { name: "author", content: "Green Wealth" },
      { property: "og:site_name", content: "Green Wealth" },
      { property: "og:title", content: "Neo Hair Lotion — Original Hair Growth Spray | Green Wealth" },
      {
        property: "og:description",
        content:
          "Buy original Neo Hair Lotion with Ginseng & Saw Palmetto. Botanical hair regrowth spray by Green Wealth. Verified authentic, worldwide delivery from Thailand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#064e3b" },
      { name: "twitter:title", content: "Neo Hair Lotion — Original Hair Growth Spray | Green Wealth" },
      { name: "twitter:description", content: "Buy original Neo Hair Lotion with Ginseng & Saw Palmetto. Botanical hair regrowth spray by Green Wealth. Verified authentic, worldwide delivery from Thailand." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/53af62b8-75f2-4089-89bd-23ad81470b51" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/53af62b8-75f2-4089-89bd-23ad81470b51" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: import.meta.env.VITE_SUPABASE_URL, crossOrigin: "anonymous" },
      // Single combined webfont request — the Arabic face is only fetched on /ar,
      // so English visitors don't pay for a second render-blocking stylesheet.
      {
        rel: "stylesheet",
        href:
          localeOf(ctx) === "ar"
            ? "https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Epilogue:wght@300;400;500;600&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
            : "https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Epilogue:wght@300;400;500;600&display=swap",
      },
      // Machine-readable site summaries for LLM / AI-search crawlers.
      { rel: "alternate", type: "text/plain", href: `${SITE_ORIGIN}/llms.txt`, title: "llms.txt" },
      { rel: "alternate", type: "text/plain", href: `${SITE_ORIGIN}/llms-full.txt`, title: "llms-full.txt" },
    ],

    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${SITE_ORIGIN}/#organization`,
          name: "Green Wealth",
          alternateName: ["Green Wealth Neo Hair", "greenwealth.com"],
          url: SITE_ORIGIN,
          logo: `${SITE_ORIGIN}/brand-logo.png`,
          image: `${SITE_ORIGIN}/brand-logo.png`,
          description:
            "Authorised distributor of original Neo Hair Lotion, Neo Hair Shampoo, Ghori Rosemary & Biotin Oil and the Ghori Dermaroller. Every unit is scratch-code verifiable and shipped worldwide.",
          slogan: "Batch-verified botanical hair care.",
          knowsAbout: [
            "Neo Hair Lotion",
            "Neo Hair Shampoo",
            "botanical hair regrowth",
            "saw palmetto and ginseng scalp treatment",
            "scratch-code authenticity verification",
            "counterfeit Neo Hair Lotion detection",
          ],
          sameAs: [
            "https://www.instagram.com/greenwealth.official",
            "https://www.facebook.com/greenwealthofficial",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            url: `${SITE_ORIGIN}/contact`,
            availableLanguage: ["en", "ar", "hi", "ur"],
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${SITE_ORIGIN}/#website`,
          name: "Green Wealth",
          url: SITE_ORIGIN,
          inLanguage: "en",
          publisher: { "@id": `${SITE_ORIGIN}/#organization` },
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_ORIGIN}/shop?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const { localeRef } = Route.useRouteContext();
  const locale = localeRef.current;
  const meta = LOCALE_META[locale];
  return (
    <html lang={meta.htmlLang} dir={meta.dir} className={locale === "ar" ? "locale-ar" : undefined}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}


function RootComponent() {
  const { queryClient, localeRef } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider locale={localeRef.current}>
      <RegionProvider>
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-forest focus:text-ivory focus:px-4 focus:py-2"
          >
            {/* locale-aware skip link */}
            <SkipLabel />
          </a>
          <Header />
          <main id="main">
            <Outlet />
          </main>
          <Footer />
          <CartDrawer />
          <WhatsAppChat />
        </CartProvider>
      </RegionProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}
