/**
 * Quick-view modal for related products. Opens when `$quickViewSlug` is set
 * (see ProductActions); product summaries arrive pre-resolved in `items`.
 */
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";

import type { IslandImage } from "@/lib/images";
import { formatMoney } from "@/lib/pricing";
import { addToCart } from "@/lib/stores/cart";

import { $quickViewSlug } from "./store";

export type QuickViewItem = {
  slug: string;
  brand: string;
  name: string;
  overview: string;
  benefits: string[];
  image: IslandImage;
  imageAlt: string;
  imageTitle: string;
  /** Base (single-unit) price in the active currency. */
  price: number;
  available: boolean;
  href: string;
};

type Labels = {
  dialog: string;
  closeAria: string;
  close: string;
  price: string;
  decrease: string;
  increase: string;
  add: string;
  unavailable: string;
  viewFullDetails: string;
};

type Props = {
  items: Record<string, QuickViewItem>;
  currency: string;
  labels: Labels;
};

function Modal({
  product,
  currency,
  labels,
  onClose,
}: {
  product: QuickViewItem;
  currency: string;
  labels: Labels;
  onClose: () => void;
}) {
  const [qty, setQty] = useState(1);
  const total = product.price * qty;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${labels.dialog} ${product.name}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-forest/60 backdrop-blur-sm"
        aria-label={labels.closeAria}
      />
      <div className="relative max-h-[90dvh] w-full max-w-4xl overflow-y-auto border hairline bg-paper shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-[1fr_1.1fr]">
          <div className="flex aspect-square items-center justify-center border-b hairline bg-ivory p-8 md:aspect-auto md:min-h-[420px] md:border-e md:border-b-0 md:p-12">
            <img
              src={product.image.src}
              srcSet={product.image.srcSet}
              sizes="(min-width: 768px) 420px, 100vw"
              width={product.image.width}
              height={product.image.height}
              alt={product.imageAlt}
              title={product.imageTitle}
              className="h-full w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="flex flex-col p-6 md:p-8 lg:p-10">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] tracking-[0.28em] text-moss uppercase">
                  {product.brand}
                </span>
                <h2 className="mt-1 font-serif text-2xl leading-tight text-forest md:text-3xl">
                  {product.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 border hairline px-3 py-2 font-mono text-[10px] tracking-[0.2em] text-forest uppercase transition-colors hover:bg-forest hover:text-paper"
              >
                {labels.close}
              </button>
            </div>

            <p className="mb-6 font-serif text-[13px] leading-[1.65] text-forest/75">
              {product.overview}
            </p>

            {product.benefits.length > 0 && (
              <ul className="mb-6 space-y-2">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex gap-2.5 text-[12px] leading-[1.55] text-forest/85">
                    <span className="shrink-0 text-gold" aria-hidden="true">
                      —
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto border-t hairline pt-6">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="font-mono text-[11px] tracking-[0.22em] text-forest/60 uppercase">
                  {labels.price}
                </span>
                <span className="font-serif text-2xl text-forest tabular-nums md:text-3xl" data-ltr>
                  {formatMoney(total, currency)}
                </span>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <div className="flex items-center border hairline bg-paper">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2.5 font-mono text-forest hover:text-moss"
                    aria-label={labels.decrease}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono text-xs text-forest">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-2.5 font-mono text-forest hover:text-moss"
                    aria-label={labels.increase}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  disabled={!product.available}
                  onClick={() => {
                    addToCart(product.slug, qty);
                    onClose();
                  }}
                  className="flex-1 bg-forest px-4 py-2.5 font-mono text-[11px] font-bold tracking-[0.18em] text-paper uppercase transition-colors hover:bg-moss disabled:opacity-50"
                >
                  {product.available
                    ? `${labels.add} · ${formatMoney(total, currency)}`
                    : labels.unavailable}
                </button>
              </div>

              <a
                href={product.href}
                className="block w-full border hairline py-2.5 text-center font-mono text-[10px] tracking-[0.2em] text-forest uppercase transition-colors hover:bg-forest hover:text-paper"
              >
                {labels.viewFullDetails}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const close = () => $quickViewSlug.set(null);

export default function QuickView({ items, currency, labels }: Props) {
  const slug = useStore($quickViewSlug);
  const product = slug ? items[slug] : undefined;
  if (!product) return null;
  return (
    <Modal
      key={product.slug}
      product={product}
      currency={currency}
      labels={labels}
      onClose={close}
    />
  );
}
