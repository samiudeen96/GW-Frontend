/** Opens the cart drawer and shows the item count. */
import { useStore } from "@nanostores/react";

import { $cartCount, $cartOpen } from "@/lib/stores/cart";

type Props = {
  variant?: "icon" | "tile";
  label: string;
  /** Tile variant: secondary line under the label. */
  hint?: string;
};

function BagIcon({ className }: { className: string }) {
  return (
    <span
      className={`relative inline-flex items-end justify-center border border-current ${className}`}
    >
      <span className="absolute -top-1.5 h-1.5 w-2.5 rounded-t-xs border-x border-t border-current" />
    </span>
  );
}

export default function CartButton({ variant = "icon", label, hint }: Props) {
  const count = useStore($cartCount);
  const open = () => {
    window.dispatchEvent(new CustomEvent("mobile-menu:close"));
    $cartOpen.set(true);
  };

  if (variant === "tile") {
    return (
      <button
        type="button"
        onClick={open}
        className="group flex min-h-[62px] w-full flex-col justify-between border border-brass/30 bg-forest-dark/20 p-3 text-start transition-colors hover:border-brass/60 hover:bg-forest-dark/30"
      >
        <span className="font-mono text-[9px] tracking-[0.24em] text-brass uppercase">{label}</span>
        <span className="flex items-center gap-2 text-[13px] leading-tight text-paper/90">
          <BagIcon className="h-4 w-3" />
          {hint}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center border border-brass/80 bg-forest text-brass transition-colors hover:bg-brass hover:text-forest sm:w-auto sm:px-3"
    >
      <BagIcon className="h-3.5 w-3.5" />
      <span className="ms-1.5 hidden font-mono text-[10px] tracking-wider sm:inline" data-ltr>
        {String(count).padStart(2, "0")}
      </span>
    </button>
  );
}
