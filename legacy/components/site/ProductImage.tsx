/**
 * Purpose: Single responsive image primitive for product imagery.
 * Users: PDP gallery, product cards, editorial plates.
 * Key actions: emit AVIF + WebP sources with width descriptors, sizes, and
 *   correct loading/decoding/fetchpriority hints for LCP.
 * Integration points: src/lib/product-images.ts (build-time variants).
 */
import { pictureFor } from "@/lib/product-images";

type Props = {
  src: string;
  alt: string;
  /** SEO/tooltip title. Defaults to the alt text when omitted. */
  title?: string;
  className?: string;
  /** Responsive sizes attribute. Defaults to a full-width-on-mobile product tile. */
  sizes?: string;
  /** Mark as the LCP candidate: eager + high priority. */
  priority?: boolean;
  draggable?: boolean;
};

export function ProductImage({
  src,
  alt,
  title,
  className,
  sizes = "(min-width: 1024px) 640px, 100vw",
  priority = false,
  draggable,
}: Props) {
  const pic = pictureFor(src);
  const img = (
    <img
      src={pic?.img.src ?? src}
      alt={alt}
      title={title ?? (alt || undefined)}
      width={pic?.img.w}
      height={pic?.img.h}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "low"}
      draggable={draggable}
      className={className}
    />
  );


  if (!pic) return img;

  return (
    <picture className="contents">
      {Object.entries(pic.sources).map(([format, srcSet]) => (
        <source key={format} type={`image/${format}`} srcSet={srcSet} sizes={sizes} />
      ))}
      {img}
    </picture>
  );
}
