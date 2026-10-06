/** Adds one or more cart lines (a single product or a whole combo) and opens the drawer. */
import { addToCart } from "@/lib/stores/cart";

type Props = {
  lines: Array<{ slug: string; qty: number }>;
  label: string;
  className?: string;
};

export default function AddToBag({ lines, label, className }: Props) {
  return (
    <button
      type="button"
      onClick={() => lines.forEach((l) => addToCart(l.slug, l.qty))}
      className={className}
    >
      {label}
    </button>
  );
}
