import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLocale } from "@/lib/i18n";
import { COMBINED_STAGES, GUIDE_UI, HAIR_PROBLEMS, PRODUCT_ROLES, SYNERGY_ROWS, pickL } from "@/lib/hair-science-guide";

const pad = (n: number) => String(n).padStart(2, "0");

export function HairGuideSections() {
  const locale = useLocale();
  const u = (k: string) => pickL(GUIDE_UI[k], locale);
  const [open, setOpen] = useState(HAIR_PROBLEMS[0].key);
  const active = HAIR_PROBLEMS.find((p) => p.key === open) ?? HAIR_PROBLEMS[0];
  const arrow = locale === "ar" ? "←" : "→";

  return (
    <>
      {/* Problems & solutions */}
      <section id="problems" className="container-editorial py-14 md:py-20">
        <div className="eyebrow mb-3">{u("problemsEyebrow")}</div>
        <h2 className="font-serif text-3xl md:text-4xl max-w-3xl text-ink">{u("problemsTitle")}</h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/75">{u("problemsIntro")}</p>

        <div className="mt-10 grid lg:grid-cols-[320px_1fr] border hairline">
          <ul className="flex lg:block overflow-x-auto lg:overflow-visible border-b lg:border-b-0 lg:border-e hairline">
            {HAIR_PROBLEMS.map((p, i) => (
              <li key={p.key} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setOpen(p.key)}
                  aria-pressed={open === p.key}
                  className={`w-full text-start px-4 py-3 lg:py-4 flex gap-3 items-baseline border-e lg:border-e-0 lg:border-b hairline transition-colors ${
                    open === p.key ? "bg-forest text-paper" : "bg-paper hover:bg-ivory text-ink"
                  }`}
                >
                  <span className={`font-mono text-[11px] ${open === p.key ? "text-paper/60" : "text-ink/40"}`}>{pad(i + 1)}</span>
                  <span className="text-sm leading-snug whitespace-nowrap lg:whitespace-normal">{pickL(p.name, locale)}</span>
                </button>
              </li>
            ))}
          </ul>
          <article className="p-6 md:p-10 bg-paper">
            <h3 className="font-serif text-2xl md:text-3xl text-ink">{pickL(active.name, locale)}</h3>
            <dl className="mt-6 grid sm:grid-cols-3 gap-px bg-ink/10 border hairline">
              {(["what", "why", "signs"] as const).map((k) => (
                <div key={k} className="bg-paper p-4">
                  <dt className="eyebrow mb-2">{u(k)}</dt>
                  <dd className="text-sm leading-relaxed text-ink/80">{pickL(active[k], locale)}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 bg-ivory border hairline p-5">
              <div className="eyebrow text-forest mb-3">{u("habits")}</div>
              <ul className="space-y-2">
                {active.habits.map((h) => (
                  <li key={h.en} className="flex gap-3 text-sm leading-relaxed text-ink/85">
                    <span className="mt-2 w-1.5 h-1.5 bg-forest shrink-0" />
                    <span>{pickL(h, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-5 text-sm leading-relaxed border-s-2 border-forest ps-4 text-ink/80">
              <span className="eyebrow block mb-1">{u("doctor")}</span>
              {pickL(active.doctor, locale)}
            </p>
          </article>
        </div>
      </section>

      {/* Product roles */}
      <section id="products" className="border-y hairline bg-ivory">
        <div className="container-editorial py-14 md:py-20">
          <div className="eyebrow mb-3">{u("productsEyebrow")}</div>
          <h2 className="font-serif text-3xl md:text-4xl max-w-3xl text-ink mb-10">{u("productsTitle")}</h2>
          <div className="grid md:grid-cols-2 gap-px bg-ink/10 border hairline">
            {PRODUCT_ROLES.map((p, i) => (
              <article key={p.slug} className="bg-paper p-6 md:p-8 flex flex-col">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-2xl text-ink">{pickL(p.name, locale)}</h3>
                  <span className="font-serif text-3xl text-forest/25">{pad(i + 1)}</span>
                </div>
                <p className="mt-2 text-[15px] text-ink/80 leading-relaxed">{pickL(p.role, locale)}</p>
                <dl className="mt-5 space-y-3 text-sm flex-1">
                  {(["how", "when", "targets"] as const).map((k) => (
                    <div key={k} className="grid grid-cols-[110px_1fr] gap-3 border-t hairline pt-3">
                      <dt className="eyebrow">{u(k)}</dt>
                      <dd className="text-ink/80 leading-relaxed">{pickL(p[k], locale)}</dd>
                    </div>
                  ))}
                </dl>
                <Link to="/product/$slug" params={{ slug: p.slug }} className="mt-6 self-start text-xs uppercase tracking-[0.2em] border-b border-forest pb-1 text-forest">
                  {u("view")} {arrow}
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-8 bg-forest text-paper p-6 md:p-8">
            <div className="eyebrow text-paper/60 mb-2">{u("weekly")}</div>
            <p className="text-[15px] leading-relaxed max-w-4xl">{u("weeklyBody")}</p>
          </div>
        </div>
      </section>

      {/* Combined results */}
      <section id="combined" className="container-editorial py-14 md:py-20">
        <div className="eyebrow mb-3">{u("combinedEyebrow")}</div>
        <h2 className="font-serif text-3xl md:text-4xl max-w-3xl text-ink mb-10">{u("combinedTitle")}</h2>
        <ol className="relative border-s-2 border-forest/30 ms-2 md:ms-0 md:border-s-0 md:grid md:grid-cols-5 md:gap-px md:bg-ink/10 md:border hairline">
          {COMBINED_STAGES.map((s, i) => (
            <li key={s.range.en} className="relative ps-6 pb-8 md:p-6 md:bg-paper">
              <span className="absolute -start-[7px] top-1 w-3 h-3 bg-forest md:hidden" />
              <div className="md:h-1 md:bg-forest md:mb-5" style={{ opacity: 0.35 + i * 0.16 }} />
              <div className="eyebrow text-forest">{pickL(s.range, locale)}</div>
              <h3 className="font-serif text-xl mt-1 text-ink">{pickL(s.title, locale)}</h3>
              <p className="mt-2 text-sm text-ink/75 leading-relaxed">{pickL(s.body, locale)}</p>
              <ul className="mt-3 space-y-1.5">
                {s.results.map((r) => (
                  <li key={r.en} className="text-sm text-ink/85 flex gap-2">
                    <span className="text-forest">+</span>
                    <span>{pickL(r, locale)}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <h3 className="font-serif text-2xl mt-14 mb-5 text-ink">{u("synergyTitle")}</h3>
        <div className="border hairline divide-y divide-ink/10">
          {SYNERGY_ROWS.map((r) => (
            <div key={r.combo.en} className="grid md:grid-cols-[260px_200px_1fr] gap-3 md:gap-6 items-center p-4 md:p-5 bg-paper">
              <div className="font-serif text-lg text-ink">{pickL(r.combo, locale)}</div>
              <div className="flex gap-1" aria-label={`${r.level}/5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`h-2 flex-1 ${i < r.level ? "bg-forest" : "bg-ink/10"}`} />
                ))}
              </div>
              <div className="text-sm text-ink/75">{pickL(r.note, locale)}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground max-w-3xl leading-relaxed">{u("note")}</p>
      </section>
    </>
  );
}
