import { CURRENCIES, useRegion } from "@/lib/pricing";
import { useT } from "@/lib/i18n";

export function CurrencySelect({
  className = "",
  tone = "dark",
}: {
  className?: string;
  /** "dark" = dark text for light surfaces, "light" = light text for forest surfaces */
  tone?: "dark" | "light";
}) {
  const t = useT();
  const { currency, setCurrency } = useRegion();
  const toneClass =
    tone === "light"
      ? "border-brass/50 text-paper hover:text-brass hover:border-brass"
      : "border-forest/25 text-forest hover:bg-forest hover:text-paper";
  return (
    <label className={`relative inline-flex items-center w-full ${className}`}>
      <span className="sr-only">{t("commerce.currency.label", "Currency")}</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className={`appearance-none bg-transparent border px-2 py-1 pr-6 w-full text-[11px] uppercase tracking-widest font-bold transition-colors cursor-pointer focus:outline-none ${toneClass}`}
        aria-label={t("commerce.currency.selectAria", "Select currency")}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code} className="bg-paper text-forest">
            {c.code}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-1 size-3 opacity-60"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 5l3 3 3-3" />
      </svg>
    </label>
  );
}
