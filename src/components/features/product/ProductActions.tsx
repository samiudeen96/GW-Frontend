/** "Add" + "Quick view" buttons for a related product (paired list and cards). */
import { addToCart } from "@/lib/stores/cart";

import { $quickViewSlug } from "./store";

type Props = {
  slug: string;
  available: boolean;
  className: string;
  buttonClassName: string;
  labels: { add: string; addAria: string; view: string; viewAria: string };
};

export default function ProductActions({
  slug,
  available,
  className,
  buttonClassName,
  labels,
}: Props) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => addToCart(slug, 1)}
        disabled={!available}
        className={buttonClassName}
        aria-label={labels.addAria}
      >
        {labels.add}
      </button>
      <button
        type="button"
        onClick={() => $quickViewSlug.set(slug)}
        className={buttonClassName}
        aria-label={labels.viewAria}
      >
        {labels.view}
      </button>
    </div>
  );
}
