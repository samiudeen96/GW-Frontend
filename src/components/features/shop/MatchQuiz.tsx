/**
 * "Which one first?" match quiz on /shop. Three questions score the products;
 * the winner is shown with open / add-to-bag actions. Product summaries arrive
 * pre-translated and pre-priced from the server.
 */
import { useMemo, useState } from "react";

import type { IslandI18n } from "@/lib/i18n/core";
import { I18nProvider, useI18n } from "@/lib/i18n/react";
import type { IslandImage } from "@/lib/images";
import { addToCart } from "@/lib/stores/cart";

import { QUIZ, type QuizKey } from "./shop-data";

export type QuizProduct = {
  slug: string;
  name: string;
  href: string;
  image: IslandImage;
  imageAlt: string;
  imageTitle: string;
  /** Formatted base price in the active currency. */
  price: string;
  role: string;
};

type Props = {
  i18n: IslandI18n;
  products: QuizProduct[];
};

function Quiz({ products }: { products: QuizProduct[] }) {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<Partial<Record<QuizKey, number>>>({});
  const [step, setStep] = useState(0);

  const scores = useMemo(() => {
    const s: Record<string, number> = {};
    QUIZ.forEach((q) => {
      const idx = answers[q.key];
      if (idx !== undefined) {
        Object.entries(q.options[idx].score).forEach(([slug, n]) => {
          s[slug] = (s[slug] ?? 0) + n;
        });
      }
    });
    return s;
  }, [answers]);

  const complete = Object.keys(answers).length === QUIZ.length;
  const winnerSlug = complete ? Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] : null;
  const winner = products.find((p) => p.slug === winnerSlug);
  const question = QUIZ[step];

  return (
    <div className="border hairline bg-paper">
      <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1fr]">
        <div className="border-b hairline p-6 md:p-10 lg:border-e lg:border-b-0">
          <h2 className="mt-2 font-serif text-2xl leading-tight text-forest md:text-4xl">
            {t("shop.quiz.title", "Which one first?")}
          </h2>
          <p className="mt-4 text-[13.5px] leading-relaxed text-forest/70">
            {t(
              "shop.quiz.intro",
              "Three quick questions. We'll match you to the best starting essential in the collection.",
            )}
          </p>

          {winner && (
            <div className="mt-6 border hairline bg-ivory">
              <div className="flex items-center gap-4 p-4 md:p-5">
                <div className="h-20 w-20 shrink-0 overflow-hidden border hairline bg-white md:h-24 md:w-24">
                  <img
                    src={winner.image.src}
                    srcSet={winner.image.srcSet}
                    sizes="96px"
                    alt={winner.imageAlt}
                    title={winner.imageTitle}
                    className="h-full w-full object-contain p-1"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[9.5px] tracking-[0.28em] text-moss uppercase">
                    {t("shop.quiz.yourMatch", "Your match")}
                  </div>
                  <div className="mt-1 font-serif text-lg leading-tight text-forest md:text-xl">
                    {winner.name.replace(/®/g, "")}
                  </div>
                  <div className="mt-1 font-mono text-[11.5px] text-forest/60">
                    {winner.price} · {winner.role}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 border-t hairline">
                <a
                  href={winner.href}
                  className="border-e hairline py-2.5 text-center font-mono text-[10px] tracking-[0.28em] text-forest uppercase transition-colors hover:bg-forest hover:text-paper"
                >
                  {t("shop.quiz.open", "Open")}
                </a>
                <button
                  type="button"
                  onClick={() => addToCart(winner.slug, 1)}
                  className="py-2.5 text-center font-mono text-[10px] tracking-[0.28em] text-forest uppercase transition-colors hover:bg-forest hover:text-paper"
                >
                  {t("shop.addToBag", "Add to Bag")}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setStep(0);
                }}
                className="w-full border-t hairline py-2 font-mono text-[9.5px] tracking-[0.28em] text-forest/50 uppercase transition-colors hover:text-moss"
              >
                {t("shop.quiz.retake", "Retake")}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col p-6 md:p-10">
          {!complete ? (
            <>
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.28em] text-forest/50 uppercase">
                <span>
                  {t("shop.quiz.questionOf", "Question")} {step + 1} {t("shop.quiz.of", "of")}{" "}
                  {QUIZ.length}
                </span>
                <div className="flex gap-1">
                  {QUIZ.map((q, i) => (
                    <span
                      key={q.key}
                      className={`h-[3px] w-6 ${i <= step ? "bg-moss" : "bg-ink/10"}`}
                    />
                  ))}
                </div>
              </div>
              <h3 className="mt-4 font-serif text-xl leading-snug text-forest md:text-2xl">
                {t(`shop.quiz.q.${question.key}`, question.q)}
              </h3>
              <div className="mt-5 grid grid-cols-1 gap-px border hairline bg-ink/10">
                {question.options.map((opt, i) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      setAnswers((a) => ({ ...a, [question.key]: i }));
                      if (step < QUIZ.length - 1) setStep(step + 1);
                    }}
                    className="flex items-center justify-between gap-3 bg-paper px-4 py-4 text-start text-[13px] text-forest transition-colors hover:bg-forest hover:text-paper"
                  >
                    <span>{t(`shop.quiz.opt.${question.key}.${i}`, opt.label)}</span>
                    <span className="font-mono text-[10px] opacity-60">→</span>
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="mt-4 self-start font-mono text-[10px] tracking-[0.28em] text-forest/50 uppercase hover:text-moss"
                >
                  {t("shop.quiz.back", "← Back")}
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-1 flex-col justify-center py-6 text-center">
              <div className="eyebrow text-moss">{t("shop.quiz.complete", "Complete")}</div>
              <div className="mt-2 font-serif text-2xl text-forest">
                {t("shop.quiz.ready", "Your recommendation is ready.")}
              </div>
              <p className="mx-auto mt-3 max-w-sm text-[13px] text-forest/70">
                {t(
                  "shop.quiz.readyIntro",
                  "See your match on the left. Full ritual delivers the fullest results across 90–120 days.",
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MatchQuiz({ i18n, products }: Props) {
  return (
    <I18nProvider i18n={i18n}>
      <Quiz products={products} />
    </I18nProvider>
  );
}
