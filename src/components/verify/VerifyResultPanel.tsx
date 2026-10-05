/**
 * Verification result panel.
 *
 * Purpose: present each authenticity-check outcome (verified / not recognised /
 * check limit reached / service unavailable) with its own distinct, readable
 * visual treatment. Presentation only — no business logic.
 * Users: end customers on /verify.
 * Integration point: consumes VerifyResult from src/lib/verify.functions.ts.
 */
import type { VerifyResult } from "@/lib/verify.functions";
import { useT } from "@/lib/i18n";

type Tone = {
  label: string;
  headline: string;
  shell: string;
  rule: string;
  meta: string;
  mark: string;
  eyebrow: string;
};

const MARKS: Record<VerifyResult["status"], string> = {
  verified: "✓",
  invalid: "×",
  limit: "!",
  error: "—",
};

export function VerifyCheckingPanel() {
  const t = useT();
  return (
    <div className="mt-6 border hairline bg-paper p-5" role="status" aria-live="polite">
      <div className="eyebrow mb-3">{t("verify.checking.label", "Checking")}</div>
      <div className="space-y-2">
        <div className="h-3 w-2/3 bg-hairline animate-pulse" />
        <div className="h-3 w-1/3 bg-hairline animate-pulse" />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {t("verify.checking.status", "Contacting verification service")}
      </p>
    </div>
  );
}

export function VerifyResultPanel({ result }: { result: VerifyResult }) {
  const t = useT();

  const TONES: Record<VerifyResult["status"], Tone> = {
    verified: {
      label: t("verify.status.verified.label", "Authentic"),
      headline: t("verify.status.verified.headline", "This code matches an authorized batch."),
      shell: "bg-forest text-ivory",
      rule: "bg-gold/40",
      meta: "text-ivory/70",
      mark: "border-gold text-gold",
      eyebrow: "!text-gold",
    },
    invalid: {
      label: t("verify.status.invalid.label", "Not recognised"),
      headline: t("verify.status.invalid.headline", "This code is not in our production records."),
      shell: "bg-white border hairline text-ink",
      rule: "bg-hairline",
      meta: "text-muted-foreground",
      mark: "border-ink/30 text-ink",
      eyebrow: "",
    },
    limit: {
      label: t("verify.status.limit.label", "Check limit reached"),
      headline: t("verify.status.limit.headline", "This code has already been checked several times."),
      shell: "bg-paper border hairline text-ink",
      rule: "bg-hairline",
      meta: "text-muted-foreground",
      mark: "border-ink/30 text-ink",
      eyebrow: "",
    },
    error: {
      label: t("verify.status.error.label", "Service unavailable"),
      headline: t("verify.status.error.headline", "We could not reach the verification service."),
      shell: "bg-paper border hairline text-ink",
      rule: "bg-hairline",
      meta: "text-muted-foreground",
      mark: "border-ink/30 text-ink",
      eyebrow: "",
    },
  };

  const GUIDANCE: Record<VerifyResult["status"], string[]> = {
    verified: [
      t("verify.guidance.verified.1", "Keep the carton until the bottle is finished — the code is your proof of purchase."),
      t("verify.guidance.verified.2", "Store below 30°C, away from direct sunlight."),
    ],
    invalid: [
      t("verify.guidance.invalid.1", "Re-enter the code exactly as printed, including hyphens."),
      t("verify.guidance.invalid.2", "Confirm the silver panel was intact before you scratched it."),
      t("verify.guidance.invalid.3", "Do not use the product until authenticity is confirmed."),
    ],
    limit: [
      t("verify.guidance.limit.1", "Multiple checks can mean a resealed or duplicated label."),
      t("verify.guidance.limit.2", "Send us photos of the carton and sticker so we can trace the batch."),
    ],
    error: [
      t("verify.guidance.error.1", "Check your connection and try again in a moment."),
      t("verify.guidance.error.2", "If it keeps failing, send us the code and we will verify it manually."),
    ],
  };

  const tone = TONES[result.status];

  return (
    <div className={"mt-6 " + tone.shell} role="status" aria-live="polite">
      <div className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className={
              "shrink-0 w-10 h-10 border-2 flex items-center justify-center text-lg leading-none " +
              tone.mark
            }
          >
            {MARKS[result.status]}
          </span>
          <div className="min-w-0">
            <div className={"eyebrow " + tone.eyebrow}>{tone.label}</div>
            <p className="mt-2 text-base md:text-lg leading-snug">{tone.headline}</p>
            <p className={"mt-2 text-sm leading-relaxed " + tone.meta}>{result.message}</p>
          </div>
        </div>

        {(() => {
          const cell = result.status === "verified" ? "bg-forest" : "bg-white";
          const rows: { label: string; value: string }[] = [];
          if (result.product) rows.push({ label: t("verify.result.product", "Product"), value: result.product });
          if (result.batch) rows.push({ label: t("verify.result.batch", "Batch"), value: result.batch });
          if (result.publicCode) rows.push({ label: t("verify.result.publicCode", "Public code"), value: result.publicCode });
          if (typeof result.checks === "number")
            rows.push({ label: t("verify.result.checks", "Checks"), value: String(result.checks) });
          if (!rows.length) return null;
          return (
            <dl className="mt-5 grid grid-cols-2 gap-px bg-current/10">
              {rows.map((r) => (
                <div key={r.label} className={"p-3 " + cell}>
                  <dt className={"text-[10px] uppercase tracking-[0.18em] " + tone.meta}>
                    {r.label}
                  </dt>
                  <dd className="mt-1 text-sm break-all" dir="ltr">{r.value}</dd>
                </div>
              ))}
            </dl>
          );
        })()}


        <div className={"mt-5 h-px " + tone.rule} />

        {result.status !== "verified" && (
          <div className="mt-5 bg-destructive text-destructive-foreground p-4 border-l-4 border-current">
            <p className="text-sm md:text-base font-bold uppercase tracking-[0.12em] leading-snug">
              {t("verify.warning.title", "Do not use this product. Authenticity has not been confirmed.")}
            </p>
            <p className="mt-2 text-xs md:text-sm leading-relaxed opacity-90">
              {t("verify.warning.body", "Unverified products may be counterfeit, expired, or improperly stored. Stop use immediately and contact our support team for verification.")}
            </p>
          </div>
        )}

        <ul className="mt-4 space-y-2">
          {GUIDANCE[result.status].map((line) => (
            <li key={line} className={"text-sm leading-relaxed pl-4 relative " + tone.meta}>
              <span aria-hidden="true" className="absolute left-0 top-0">
                —
              </span>
              {line}
            </li>
          ))}
        </ul>

        {result.status !== "verified" && (
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/contact"
              className="border border-current px-4 py-2.5 text-xs uppercase tracking-[0.18em] hover:bg-forest hover:text-ivory hover:border-forest transition-colors"
            >
              {t("verify.cta.contactSupport", "Contact support")}
            </a>
            {result.whatsapp && (
              <a
                href={result.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-current px-4 py-2.5 text-xs uppercase tracking-[0.18em] hover:bg-forest hover:text-ivory hover:border-forest transition-colors"
              >
                {t("verify.cta.whatsapp", "Message us on WhatsApp")}
              </a>
            )}
          </div>
        )}

        {result.status === "verified" && (
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/shop"
              className="bg-gold text-forest px-4 py-2.5 text-xs uppercase tracking-[0.18em] font-semibold"
            >
              {t("verify.cta.shopAuthorized", "Shop authorized stock")}
            </a>
            <a
              href="/real-vs-fake"
              className="border border-ivory/40 px-4 py-2.5 text-xs uppercase tracking-[0.18em]"
            >
              {t("verify.cta.realVsFakeGuide", "Real vs fake guide")}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
