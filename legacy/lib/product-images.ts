/**
 * Purpose: Build-time responsive/modern-format variants for every product image.
 * Users: PDP gallery, product cards, editorial banners.
 * Key actions: resolve a bundled image URL to an AVIF/WebP <picture> payload.
 * Integration points: vite-imagetools (build), ProductImage component (render).
 */

export type PictureData = {
  img: { src: string; w: number; h: number };
  sources: Record<string, string>;
};

const modules = import.meta.glob("/src/assets/**/*.{webp,png,jpg,jpeg}", {
  query: { w: "160;400;640;900;1400", format: "avif;webp", as: "picture" },
  eager: true,
  import: "default",
}) as Record<string, PictureData>;

function baseName(path: string): string {
  const file = path.split("?")[0].split("/").pop() ?? "";
  return file.replace(/\.[a-z0-9]+$/i, "");
}

const byBase = new Map<string, PictureData>();
for (const [path, data] of Object.entries(modules)) {
  byBase.set(baseName(path), data);
}

/** Resolve a bundled (possibly content-hashed) src to its responsive variants. */
export function pictureFor(src: string): PictureData | undefined {
  if (!src) return undefined;
  const name = baseName(src);
  return byBase.get(name) ?? byBase.get(name.replace(/-[-\w]{8}$/, ""));
}
