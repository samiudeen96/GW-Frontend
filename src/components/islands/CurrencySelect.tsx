/** Currency picker. Changing it sets the cookie and reloads so server-rendered prices update. */
import { CURRENCIES } from "@/lib/pricing";
import { setCurrency } from "@/lib/stores/currency";

type Props = {
  currency: string;
  label: string;
  ariaLabel: string;
  /** "dark" = dark text for light surfaces, "light" = light text for forest surfaces. */
  tone?: "dark" | "light";
  className?: string;
};

export default function CurrencySelect({
  currency,
  label,
  ariaLabel,
  tone = "dark",
  className = "",
}: Props) {
  const toneClass =
    tone === "light"
      ? "border-brass/50 text-paper hover:text-brass hover:border-brass"
      : "border-forest/25 text-forest hover:bg-forest hover:text-paper";
  return (
    <label className={`relative inline-flex w-full items-center ${className}`}>
      <span className="sr-only">{label}</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className={`w-full cursor-pointer appearance-none border bg-transparent px-2 py-1 pe-6 text-[11px] font-bold tracking-widest uppercase transition-colors focus:outline-none ${toneClass}`}
        aria-label={ariaLabel}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code} className="bg-paper text-forest">
            {c.code}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute end-1 size-3 opacity-60"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M3 5l3 3 3-3" />
      </svg>
    </label>
  );
}
