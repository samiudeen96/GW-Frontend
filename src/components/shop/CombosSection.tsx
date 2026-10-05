/**
 * Module: Shop — Curated Combos
 *
 * Purpose: renders pre-composed product sets with tier-accurate pricing.
 * Users: storefront shoppers.
 * Integration points: src/lib/combos.ts (data + pricing), cart via onAddCombo.
 */

import { Link } from "@tanstack/react-router";
import { COMBOS, comboPricing, comboProducts, type Combo, type ComboLine } from "@/lib/combos";
import { formatMoney } from "@/lib/pricing";
import { ProductImage } from "@/components/site/ProductImage";
import { useT } from "@/lib/i18n";

export function CombosSection({
  currency,
  onAddCombo,
}: {
  currency: string;
  onAddCombo: (lines: ComboLine[]) => void;
}) {
  const t = useT();
  return (
    <section className="container-editorial mt-10 md:mt-16">
      <div className="flex items-end justify-between mb-4 md:mb-6">
        <div>
          <div className="text-[9.5px] uppercase tracking-[0.32em] font-mono text-moss">{t("shop.combo.sets", "Sets")}</div>
          <h2 className="font-serif text-2xl md:text-3xl text-forest mt-2">{t("shop.combo.curatedCombos", "Curated Combos")}</h2>
        </div>
        <div className="hidden md:block text-[10px] uppercase tracking-[0.28em] font-mono text-forest/60">
          {t("shop.combo.preComposed", "Pre-composed · One click to bag")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-ink/10 border hairline">
        {COMBOS.map((combo) => (
          <ComboTile
            key={combo.code}
            combo={combo}
            currency={currency}
            onAdd={() => onAddCombo(combo.lines)}
          />
        ))}
      </div>
    </section>
  );
}

function ComboTile({
  combo,
  currency,
  onAdd,
}: {
  combo: Combo;
  currency: string;
  onAdd: () => void;
}) {
  const t = useT();
  const { total, reference, savings, units } = comboPricing(combo, currency);
  const lines = comboProducts(combo);

  return (
    <article
      className={`bg-paper p-5 md:p-6 flex flex-col ${
        combo.featured ? "ring-1 ring-inset ring-gold/50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-moss">
            {t(`shop.combo.${combo.code}.step`, combo.step)}
          </div>
          <Link
            to="/combo/$code"
            params={{ code: combo.code.toLowerCase() }}
            className="block font-serif text-lg md:text-xl text-forest mt-1.5 leading-snug hover:text-moss transition-colors"
          >
            {t(`shop.combo.${combo.code}.name`, combo.name)}
          </Link>
        </div>
        {combo.featured && (
          <span className="text-[9px] uppercase tracking-[0.24em] font-mono text-forest border border-gold px-2 py-1 whitespace-nowrap">
            {t("shop.combo.mostChosen", "Most chosen")}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-px bg-ink/10 border hairline">
        {lines.map(({ product, qty }) => (
          <div key={product.slug} className="relative bg-white flex-1 aspect-square">
            <ProductImage
              src={product.image}
              alt={t(`product.${product.slug}.imageAlts.0`, product.imageAlts?.[0] ?? `${product.name} — ${product.size} product photograph`)}
              sizes="(min-width: 1280px) 140px, 30vw"
              className="w-full h-full object-contain p-2"
            />
            {qty > 1 && (
              <span className="absolute bottom-1 right-1 text-[10px] font-mono text-forest bg-paper border hairline px-1.5">
                ×{qty}
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="text-[13px] leading-relaxed text-forest/75 mt-4">{t(`shop.combo.${combo.code}.purpose`, combo.purpose)}</p>

      <ul className="mt-4 space-y-1.5 text-[12px] font-mono text-forest/70">
        {lines.map(({ product, qty }) => (
          <li key={product.slug} className="flex justify-between gap-3">
            <span className="truncate">
              {qty > 1 ? `${qty} × ` : ""}
              {t(`product.${product.slug}.name`, product.name)}
            </span>
            <Link
              to="/product/$slug"
              params={{ slug: product.slug }}
              className="text-moss underline underline-offset-2 whitespace-nowrap"
            >
              {t("shop.combo.view", "View")}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <div className="flex items-end justify-between border-t hairline pt-4">
          <div>
            <div className="text-[9.5px] uppercase tracking-[0.28em] font-mono text-moss">
              {units} {units === 1 ? t("shop.combo.unit", "unit") : t("shop.combo.units", "units")}
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl text-forest">{formatMoney(total, currency)}</span>
              {savings > 0 && (
                <span className="text-[12px] font-mono text-forest/45 line-through">
                  {formatMoney(reference, currency)}
                </span>
              )}
            </div>
          </div>
          {savings > 0 && (
            <div className="text-[10px] uppercase tracking-[0.24em] font-mono text-moss">
              {t("shop.combo.saveTogether", "Save")} {formatMoney(savings, currency)}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 w-full bg-forest text-paper text-[11px] uppercase tracking-[0.28em] font-mono py-3.5 hover:bg-moss transition-colors"
        >
          {t("shop.combo.addComboToBag", "Add combo to bag")}
        </button>
      </div>
    </article>
  );
}
