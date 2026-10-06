/**
 * PDP reviews: rating summary, write-a-review form and the review list with
 * "show more". Needs `islandI18n(locale, ["product.reviews."])`.
 * Reviews arrive pre-translated from the server; submission goes through
 * `submitReview` (placeholder until the API is connected).
 */
import { useState, type FormEvent, type ReactNode } from "react";

import { submitReview } from "@/lib/api/reviews";
import type { IslandI18n } from "@/lib/i18n/core";
import { I18nProvider, useI18n } from "@/lib/i18n/react";

export type ReviewItem = {
  id: string;
  rating: number;
  title: string;
  body: string;
  author: string;
  country: string | null;
  /** ISO date; local seed reviews have none. */
  date?: string;
};

type Props = {
  i18n: IslandI18n;
  slug: string;
  productName: string;
  summary: { avg: number; total: number; dist: number[] };
  items: ReviewItem[];
};

const inputCls =
  "w-full border border-forest/20 bg-transparent px-[0.8rem] py-[0.7rem] text-[13px] text-forest outline-none transition-colors focus:border-forest";
const labelCls = "font-mono text-[10px] tracking-[0.24em] text-forest/60 uppercase";

function Stars({ n, size = "text-[13px]" }: { n: number; size?: string }) {
  const { t } = useI18n();
  return (
    <span
      className={`font-mono tracking-[0.15em] text-gold ${size}`}
      aria-label={t("product.reviews.starsAria", "{n} out of 5 stars").replace("{n}", String(n))}
    >
      {"★".repeat(n)}
      <span className="text-forest/25">{"★".repeat(5 - n)}</span>
    </span>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Reviews({ slug, productName, summary, items }: Omit<Props, "i18n">) {
  const { t, locale } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(4);

  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!name.trim() || !title.trim() || !body.trim()) {
      setMessage(t("product.reviews.errRequired", "Please complete name, title, and review."));
      return;
    }
    if (body.trim().length < 15) {
      setMessage(t("product.reviews.errTooShort", "Please write at least 15 characters."));
      return;
    }
    setSubmitting(true);
    const fail = t("product.reviews.errSubmit", "Could not submit your review. Please try again.");
    try {
      const res = await submitReview({
        productSlug: slug,
        author: name.trim().slice(0, 80),
        country: country.trim().slice(0, 60) || null,
        rating,
        title: title.trim().slice(0, 120),
        body: body.trim().slice(0, 2000),
      });
      if (!res.ok) {
        setMessage(res.error || fail);
        return;
      }
    } catch {
      setMessage(fail);
      return;
    } finally {
      setSubmitting(false);
    }

    setMessage(
      t("product.reviews.thankYou", "Thank you — your review has been submitted for verification."),
    );
    setName("");
    setCountry("");
    setTitle("");
    setBody("");
    setRating(5);
    setTimeout(() => setShowForm(false), 1500);
  };

  const dateFmt = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  return (
    <section id="reviews" className="border-t hairline bg-ivory">
      <div className="container-editorial py-14 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-14">
          <div className="self-start md:sticky md:top-24 md:col-span-4">
            <p className="mb-3 font-mono text-[10px] tracking-[0.28em] text-forest/50 uppercase">
              {t("product.reviews.customerReviews", "Customer Reviews")}
            </p>
            <h2 className="font-serif text-3xl leading-[1.02] tracking-[-0.015em] text-forest md:text-[2.6rem]">
              {t("product.reviews.verifiedVoicesFor", "Verified voices for {name}.").replace(
                "{name}",
                productName,
              )}
            </h2>

            <div className="mt-6 border hairline bg-paper p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl text-forest tabular-nums">
                  {summary.avg ? summary.avg.toFixed(1) : "—"}
                </span>
                <Stars n={Math.round(summary.avg) || 0} size="text-[15px]" />
              </div>
              <p className="mt-1 font-mono text-[11px] tracking-[0.22em] text-forest/60 uppercase tabular-nums">
                {summary.total.toLocaleString()}+{" "}
                {t("product.reviews.verifiedReviews", "verified ratings")}
              </p>
              <div className="mt-4 space-y-1.5">
                {[5, 4, 3, 2, 1].map((s, i) => {
                  const pct = summary.dist[i] || 0;
                  return (
                    <div
                      key={s}
                      className="flex items-center gap-2 font-mono text-[11px] text-forest/70"
                    >
                      <span className="w-4">{s}★</span>
                      <div className="h-[6px] flex-1 bg-forest/10">
                        <div className="h-full bg-forest" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-end tabular-nums">{pct}%</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 font-mono text-[9.5px] tracking-[0.18em] text-forest/40 uppercase">
                {t("product.reviews.combined", "Combined across all channels")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              aria-expanded={showForm}
              className="mt-5 w-full border border-forest py-3.5 font-mono text-[11px] font-bold tracking-[0.24em] text-forest uppercase transition-colors hover:bg-forest hover:text-paper"
            >
              {showForm
                ? t("product.reviews.cancel", "Cancel")
                : t("product.reviews.writeReview", "Write a Review")}
            </button>
          </div>

          <div className="md:col-span-8">
            {showForm && (
              <form
                onSubmit={submit}
                className="mb-8 space-y-4 border hairline bg-paper p-5 md:p-6"
              >
                <div>
                  <span className={labelCls}>{t("product.reviews.yourRating", "Your rating")}</span>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        aria-pressed={n === rating}
                        className={`text-2xl leading-none transition-colors ${n <= rating ? "text-gold" : "text-forest/25 hover:text-gold/60"}`}
                        aria-label={t("product.reviews.starN", "{n} stars").replace(
                          "{n}",
                          String(n),
                        )}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label={t("product.reviews.name", "Name")}>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={80}
                      required
                      autoComplete="name"
                      className={inputCls}
                    />
                  </Field>
                  <Field label={t("product.reviews.country", "Country (optional)")}>
                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      maxLength={60}
                      autoComplete="country-name"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field label={t("product.reviews.reviewTitle", "Review title")}>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                    required
                    className={inputCls}
                  />
                </Field>
                <Field label={t("product.reviews.yourReview", "Your review")}>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    maxLength={2000}
                    required
                    rows={5}
                    className={`${inputCls} resize-none`}
                  />
                </Field>

                {message && (
                  <p className="font-mono text-[12px] text-forest/80" role="status">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-forest py-3.5 font-mono text-[11px] font-bold tracking-[0.24em] text-paper uppercase transition-colors hover:bg-gold hover:text-forest disabled:opacity-50"
                >
                  {submitting
                    ? t("product.reviews.submitting", "Submitting…")
                    : t("product.reviews.submitReview", "Submit Review")}
                </button>
                <p className="font-mono text-[10.5px] tracking-[0.18em] text-forest/50 uppercase">
                  {t("product.reviews.appearAfter", "Reviews appear after brief verification.")}
                </p>
              </form>
            )}

            {items.length === 0 ? (
              <div className="border hairline bg-paper p-8 text-center">
                <p className="font-serif text-lg text-forest">
                  {t("product.reviews.noneYet", "No reviews yet.")}
                </p>
                <p className="mt-2 text-[13px] text-forest/70">
                  {t("product.reviews.beFirst", "Be the first to share your experience.")}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-[color:var(--border)] border-y hairline">
                {items.slice(0, visible).map((r) => (
                  <li key={r.id} className="py-6 md:py-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <Stars n={r.rating} />
                        <h3 className="mt-1.5 font-serif text-[17px] leading-tight text-forest">
                          {r.title}
                        </h3>
                      </div>
                      {r.date && (
                        <p className="font-mono text-[10.5px] tracking-[0.2em] text-forest/50 uppercase">
                          {dateFmt(r.date)}
                        </p>
                      )}
                    </div>
                    <p className="mt-2 font-serif text-[13.5px] leading-[1.7] text-forest/80">
                      {r.body}
                    </p>
                    <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-forest/60 uppercase">
                      {r.author}
                      {r.country ? ` · ${r.country}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {items.length > visible && (
              <button
                type="button"
                onClick={() => setVisible((v) => v + 6)}
                className="mt-6 w-full border border-forest/25 py-3 font-mono text-[11px] tracking-[0.22em] text-forest uppercase transition-colors hover:border-forest"
              >
                {t("product.reviews.showMore", "Show more reviews")}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProductReviews({ i18n, ...props }: Props) {
  return (
    <I18nProvider i18n={i18n}>
      <Reviews {...props} />
    </I18nProvider>
  );
}
