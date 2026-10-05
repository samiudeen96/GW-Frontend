/**
 * Image helpers.
 *
 * `ImageSource` is either a bundled asset (ImageMetadata from `src/assets`) or a
 * URL string (public files today, API/CDN URLs later).
 *
 * `islandImage()` pre-computes optimised URLs on the server so React islands
 * receive plain `{ src, srcSet, width, height }` props.
 */
import { getImage } from "astro:assets";

export type ImageSource = ImageMetadata | string;

export type IslandImage = {
  src: string;
  srcSet?: string;
  width?: number;
  height?: number;
};

export const isImageMetadata = (src: ImageSource): src is ImageMetadata => typeof src !== "string";

export const imageUrl = (src: ImageSource) => (typeof src === "string" ? src : src.src);

export async function islandImage(
  src: ImageSource,
  {
    widths = [400, 800, 1200],
    format = "webp",
  }: { widths?: number[]; format?: "webp" | "avif" } = {},
): Promise<IslandImage> {
  if (!isImageMetadata(src)) return { src };
  const usable = widths.filter((w) => w <= src.width);
  const img = await getImage({
    src,
    format,
    widths: usable.length ? usable : [src.width],
  });
  return {
    src: img.src,
    srcSet: img.srcSet.attribute || undefined,
    width: src.width,
    height: src.height,
  };
}
