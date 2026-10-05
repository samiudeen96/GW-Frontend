#!/usr/bin/env node
/**
 * Module: CI SEO Validation
 *
 * Purpose: fail the build when any indexable route is missing required SEO
 * metadata (title, description, OG tags, canonical, twitter card, JSON-LD,
 * BreadcrumbList) or is absent from sitemap.xml.
 * Users: CI / deploy pipeline (runs as part of `bun run build`).
 * Integration points: src/routes/**, src/routes/sitemap[.]xml.ts, src/lib/seo.ts.
 *
 * Usage: node scripts/seo-validate.mjs
 * Exit code 1 blocks the build/deploy.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROUTES_DIR = "src/routes";
const SITEMAP_FILE = join(ROUTES_DIR, "sitemap[.]xml.ts");

/** Routes that are intentionally excluded from indexing checks entirely. */
const SKIP_FILES = new Set(["__root.tsx", "README.md", "sitemap[.]xml.ts"]);

const errors = [];
const warnings = [];

function fail(route, message) {
  errors.push(`${route}: ${message}`);
}

/** Convert a TanStack flat route filename into its URL path. */
function filenameToPath(file) {
  const base = file.replace(/\.tsx?$/, "");
  const segments = base.split(".").filter((s) => s !== "index");
  if (segments.length === 0) return "/";
  return "/" + segments.join("/");
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      // API routes are not indexable pages.
      if (entry === "api") continue;
      out.push(...walk(full));
      continue;
    }
    if (dir !== ROUTES_DIR) continue; // only flat route files at the top level
    if (SKIP_FILES.has(entry)) continue;
    if (!/\.tsx$/.test(entry)) continue;
    out.push(entry);
  }
  return out;
}

const sitemapSrc = readFileSync(SITEMAP_FILE, "utf8");
const routeFiles = walk(ROUTES_DIR).sort();

if (routeFiles.length === 0) {
  console.error("SEO validation: no route files found — refusing to pass.");
  process.exit(1);
}

for (const file of routeFiles) {
  const src = readFileSync(join(ROUTES_DIR, file), "utf8");
  const path = filenameToPath(file);
  const isDynamic = path.includes("$");
  const label = `${file} (${path})`;

  const noindex = /content:\s*["'`]noindex/.test(src);
  // Redirect stubs only need a title/description + canonical pointing at the target.
  const isRedirectStub = /<Navigate\s/.test(src);

  if (!/head\s*:\s*\(/.test(src)) {
    if (noindex) continue;
    fail(label, "missing head() metadata");
    continue;
  }

  const require_ = (re, what) => {
    if (!re.test(src)) fail(label, `missing ${what}`);
  };

  // Non-indexable pages are excluded from search; nothing further to check.
  if (noindex) continue;

  require_(/\{\s*title\s*[,}]|\{\s*title:\s*["'`]|\{\s*title:\s*[a-zA-Z`]/, "<title> meta entry");

  require_(/name:\s*["']description["']/, "meta description");
  require_(/rel:\s*["']canonical["']/, "canonical link");

  if (isRedirectStub) continue;

  require_(/property:\s*["']og:title["']/, "og:title");
  require_(/property:\s*["']og:description["']/, "og:description");
  require_(/property:\s*["']og:url["']/, "og:url");
  require_(/property:\s*["']og:type["']/, "og:type");
  require_(/name:\s*["']twitter:card["']/, "twitter:card");
  require_(/application\/ld\+json|breadcrumbLd\(/, "JSON-LD structured data");

  if (path !== "/") {
    require_(/BreadcrumbList|breadcrumbLd\(/, "BreadcrumbList JSON-LD");
  }

  // Canonical + og:url must self-reference this route (abs("/path") or a
  // template built from the route params).
  const selfRef = isDynamic
    ? /abs\(\s*`/.test(src) || /const\s+url\s*=/.test(src)
    : new RegExp(`abs\\(\\s*["'\`]${path}["'\`]`).test(src) || src.includes(`"${path}"`);
  if (!selfRef) fail(label, "canonical/og:url does not self-reference the route");

  // Sitemap coverage.
  if (isDynamic) {
    const base = path.slice(0, path.indexOf("/$")) || path;
    if (!sitemapSrc.includes(`${base}/`)) {
      fail(label, `dynamic route family "${base}/*" not present in sitemap.xml`);
    }
  } else if (!new RegExp(`["'\`]${path}["'\`]|path:\\s*\`${path}`).test(sitemapSrc)) {
    fail(label, `path not listed in sitemap.xml`);
  }
}

// Sitemap must not advertise paths that no longer exist.
const knownPaths = new Set(routeFiles.map((f) => filenameToPath(f)));
for (const m of sitemapSrc.matchAll(/\{\s*path:\s*["']([^"']+)["']/g)) {
  const p = m[1];
  if (!knownPaths.has(p)) warnings.push(`sitemap.xml lists "${p}" but no route file matches it`);
}

for (const w of warnings) console.warn(`SEO warning — ${w}`);

if (errors.length > 0) {
  console.error(`\nSEO validation FAILED — ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error("\nDeployment blocked. Fix the metadata above and rebuild.\n");
  process.exit(1);
}

console.log(`SEO validation passed — ${routeFiles.length} routes checked, sitemap coverage OK.`);
