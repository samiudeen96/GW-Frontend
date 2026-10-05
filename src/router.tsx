import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import {
  createLocaleRef,
  DEFAULT_LOCALE,
  localeFromPath,
  stripLocalePrefix,
  withLocalePrefix,
} from "./lib/i18n/locale";

/** Paths that must never be locale-prefixed (RPC + server routes + assets). */
const isNonAppPath = (pathname: string) =>
  pathname.startsWith("/_serverFn") ||
  pathname.startsWith("/_server") ||
  pathname.startsWith("/api/") ||
  pathname.startsWith("/@") ||
  pathname.startsWith("/assets/");

export const getRouter = () => {
  const queryClient = new QueryClient();

  // One locale ref per router instance → per SSR request on the server.
  const localeRef = createLocaleRef(
    typeof document !== "undefined" ? localeFromPath(window.location.pathname) : DEFAULT_LOCALE,
  );

  const router = createRouter({
    routeTree,
    context: { queryClient, localeRef },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Arabic is served under /ar/*; the router works on locale-agnostic paths and
    // re-adds the prefix when committing URLs, so <Link to="/shop"> stays correct
    // in both locales without duplicating any route files.
    rewrite: {
      input: ({ url }) => {
        if (isNonAppPath(url.pathname)) return url;
        const locale = localeFromPath(url.pathname);
        localeRef.current = locale;
        if (locale === DEFAULT_LOCALE) return url;
        const next = new URL(url);
        next.pathname = stripLocalePrefix(url.pathname);
        return next;
      },
      output: ({ url }) => {
        if (localeRef.current === DEFAULT_LOCALE || isNonAppPath(url.pathname)) return url;
        const next = new URL(url);
        next.pathname = withLocalePrefix(url.pathname, localeRef.current);
        return next;
      },
    },
  });

  return router;
};
