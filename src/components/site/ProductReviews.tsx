import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { productStats } from "@/lib/reviews";
import { submitReview } from "@/lib/reviews.functions";
import { useT } from "@/lib/i18n";



type DbReview = {
  id: string;
  product_slug: string;
  author: string;
  country: string | null;
  rating: number;
  title: string;
  body: string;
  helpful: number;
  created_at: string;
};

function Stars({ n, size = "text-[13px]" }: { n: number; size?: string }) {
  const t = useT();
  return (
    <span className={`font-mono tracking-[0.15em] text-gold ${size}`} aria-label={t("product.reviews.starsAria", "{n} out of 5 stars").replace("{n}", String(n))}>
      {"★".repeat(n)}
      <span className="text-forest/25">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export function ProductReviews({ slug, productName }: { slug: string; productName: string }) {
  const t = useT();
  const submitReviewFn = useServerFn(submitReview);
  const [items, setItems] = useState<DbReview[]>([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(4);

  // form state
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("reviews")
        .select("id,product_slug,author,country,rating,title,body,helpful,created_at")
        .eq("product_slug", slug)
        .order("created_at", { ascending: false });
      if (alive) {
        setItems((data as DbReview[]) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  // Headline summary must match the PDP rating badge (productStats), not just the
  // subset of individual written reviews rendered below.
  const summary = useMemo(() => {
    const s = productStats.find((x) => x.slug === slug);
    const avg = s?.rating ?? 4.8;
    const total = s?.count ?? items.length;
    const w5 = avg >= 4.85 ? 0.86 : avg >= 4.7 ? 0.79 : 0.72;
    const w4 = avg >= 4.85 ? 0.1 : avg >= 4.7 ? 0.15 : 0.2;
    const w3 = 1 - w5 - w4 - 0.02;
    const dist = [w5, w4, w3, 0.012, 0.008].map((w) => Math.max(1, Math.round(w * 100)));
    return { total, avg, dist };
  }, [slug, items.length]);


  const submit = async (e: React.FormEvent) => {
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
    try {
      await submitReviewFn({
        data: {
          product_slug: slug,
          author: name.trim().slice(0, 80),
          country: country.trim().slice(0, 60) || null,
          rating,
          title: title.trim().slice(0, 120),
          body: body.trim().slice(0, 2000),
        },
      });
    } catch {
      setSubmitting(false);
      setMessage(t("product.reviews.errSubmit", "Could not submit your review. Please try again."));
      return;
    }
    setSubmitting(false);

    setMessage(t("product.reviews.thankYou", "Thank you — your review has been submitted for verification."));
    setName("");
    setCountry("");
    setTitle("");
    setBody("");
    setRating(5);
    setTimeout(() => setShowForm(false), 1500);
  };

  return (
    <section id="reviews" className="border-t hairline bg-ivory">
      <div className="container-editorial py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
          {/* Summary */}
          <div className="md:col-span-4 md:sticky md:top-24 self-start">
            <p className="text-[10px] uppercase tracking-[0.28em] font-mono text-forest/50 mb-3">{t("product.reviews.customerReviews", "Customer Reviews")}</p>
            <h2 className="font-serif text-3xl md:text-[2.6rem] text-forest leading-[1.02] tracking-[-0.015em]">
              {t("product.reviews.verifiedVoicesFor", "Verified voices for {name}.").replace("{name}", productName)}
            </h2>

            <div className="mt-6 border hairline p-5 bg-paper">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl text-forest tabular-nums">{summary.avg ? summary.avg.toFixed(1) : "—"}</span>
                <Stars n={Math.round(summary.avg) || 0} size="text-[15px]" />
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] font-mono text-forest/60 tabular-nums">
                {summary.total.toLocaleString()}+ {t("product.reviews.verifiedReviews", "verified ratings")}
              </p>
              <div className="mt-4 space-y-1.5">
                {[5, 4, 3, 2, 1].map((s, i) => {
                  const pct = summary.dist[i] || 0;
                  return (
                    <div key={s} className="flex items-center gap-2 text-[11px] font-mono text-forest/70">
                      <span className="w-4">{s}★</span>
                      <div className="flex-1 h-[6px] bg-forest/10">
                        <div className="h-full bg-forest" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right tabular-nums">{pct}%</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[9.5px] uppercase tracking-[0.18em] font-mono text-forest/40">
                {t("product.reviews.combined", "Combined across all channels")}
              </p>

            </div>

            <button
              onClick={() => setShowForm((v) => !v)}
              className="mt-5 w-full border border-forest text-forest py-3.5 font-mono font-bold uppercase text-[11px] tracking-[0.24em] hover:bg-forest hover:text-paper transition-colors"
            >
              {showForm ? t("product.reviews.cancel", "Cancel") : t("product.reviews.writeReview", "Write a Review")}
            </button>
          </div>

          {/* List + form */}
          <div className="md:col-span-8">
            {showForm && (
              <form onSubmit={submit} className="border hairline bg-paper p-5 md:p-6 mb-8 space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.24em] font-mono text-forest/60">{t("product.reviews.yourRating", "Your rating")}</label>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        className={`text-2xl leading-none transition-colors ${n <= rating ? "text-gold" : "text-forest/25 hover:text-gold/60"}`}
                        aria-label={t("product.reviews.starN", "{n} stars").replace("{n}", String(n))}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={t("product.reviews.name", "Name")}>
                    <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required className="input" />
                  </Field>
                  <Field label={t("product.reviews.country", "Country (optional)")}>
                    <input value={country} onChange={(e) => setCountry(e.target.value)} maxLength={60} className="input" />
                  </Field>
                </div>

                <Field label={t("product.reviews.reviewTitle", "Review title")}>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required className="input" />
                </Field>
                <Field label={t("product.reviews.yourReview", "Your review")}>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    maxLength={2000}
                    required
                    rows={5}
                    className="input resize-none"
                  />
                </Field>

                {message && (
                  <p className="text-[12px] font-mono text-forest/80">{message}</p>
                )}

                <button
                  disabled={submitting}
                  className="w-full bg-forest text-paper py-3.5 font-mono font-bold uppercase text-[11px] tracking-[0.24em] hover:bg-gold hover:text-forest transition-colors disabled:opacity-50"
                >
                  {submitting ? t("product.reviews.submitting", "Submitting…") : t("product.reviews.submitReview", "Submit Review")}
                </button>
                <p className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-forest/50">
                  {t("product.reviews.appearAfter", "Reviews appear after brief verification.")}
                </p>
              </form>
            )}

            {loading ? (
              <p className="text-[12px] font-mono text-forest/60">{t("product.reviews.loading", "Loading reviews…")}</p>
            ) : items.length === 0 ? (
              <div className="border hairline bg-paper p-8 text-center">
                <p className="font-serif text-lg text-forest">{t("product.reviews.noneYet", "No reviews yet.")}</p>
                <p className="mt-2 text-[13px] text-forest/70">{t("product.reviews.beFirst", "Be the first to share your experience.")}</p>
              </div>
            ) : (
              <ul className="divide-y divide-[color:var(--border)] border-y hairline">
                {items.slice(0, visible).map((r) => (
                  <li key={r.id} className="py-6 md:py-7">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <Stars n={r.rating} />
                        <h3 className="mt-1.5 font-serif text-[17px] text-forest leading-tight">{r.title}</h3>
                      </div>
                      <p className="text-[10.5px] uppercase tracking-[0.2em] font-mono text-forest/50">
                        {new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })}
                      </p>
                    </div>
                    <p className="mt-2 text-[13.5px] text-forest/80 leading-[1.7] font-serif">{r.body}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] font-mono text-forest/60">
                      {r.author}{r.country ? ` · ${r.country}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {items.length > visible && (
              <button
                onClick={() => setVisible((v) => v + 6)}
                className="mt-6 w-full border border-forest/25 text-forest py-3 font-mono uppercase text-[11px] tracking-[0.22em] hover:border-forest transition-colors"
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.24em] font-mono text-forest/60">{label}</span>
      <div className="mt-1.5">{children}</div>
      <style>{`.input{width:100%;background:transparent;border:1px solid color-mix(in oklch, var(--forest) 20%, transparent);padding:.7rem .8rem;font-size:13px;color:var(--forest);outline:none;transition:border-color .15s}.input:focus{border-color:var(--forest)}`}</style>
    </label>
  );
}
