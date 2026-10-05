/**
 * Verification outcome panels (checking / verified / not recognised / limit /
 * service unavailable). Used inside islands; needs an <I18nProvider> above it
 * with the `verify.` prefix.
 */
import type { VerifyResult } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/react";

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
  const { t } = useI18n();
  return (
    <div className="mt-6 border hairline bg-paper p-5" role="status" aria-live="polite">
      <div className="mb-3 eyebrow">{t("verify.checking.label", "Checking")}</div>
      <div className="space-y-2">
        <div className="h-3 w-2/3 animate-pulse bg-ink/10" />
        <div className="h-3 w-1/3 animate-pulse bg-ink/10" />
      </div>
      <p className="mt-4 text-xs tracking-[0.16em] text-muted-foreground uppercase">
        {t("verify.checking.status", "Contacting verification service")}
      </p>
    </div>
  );
}

export function VerifyResultPanel({ result }: { result: VerifyResult }) {
  const { t, path } = useI18n();

  const neutral = {
    shell: "bg-paper border hairline text-ink",
    rule: "bg-ink/10",
    meta: "text-muted-foreground",
    mark: "border-ink/30 text-ink",
    eyebrow: "",
  };
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
      ...neutral,
      shell: "bg-white border hairline text-ink",
      label: t("verify.status.invalid.label", "Not recognised"),
      headline: t("verify.status.invalid.headline", "This code is not in our production records."),
    },
    limit: {
      ...neutral,
      label: t("verify.status.limit.label", "Check limit reached"),
      headline: t(
        "verify.status.limit.headline",
        "This code has already been checked several times.",
      ),
    },
    error: {
      ...neutral,
      label: t("verify.status.error.label", "Service unavailable"),
      headline: t("verify.status.error.headline", "We could not reach the verification service."),
    },
  };

  const GUIDANCE: Record<VerifyResult["status"], string[]> = {
    verified: [
      t(
        "verify.guidance.verified.1",
        "Keep the carton until the bottle is finished — the code is your proof of purchase.",
      ),
      t("verify.guidance.verified.2", "Store below 30°C, away from direct sunlight."),
    ],
    invalid: [
      t("verify.guidance.invalid.1", "Re-enter the code exactly as printed, including hyphens."),
      t(
        "verify.guidance.invalid.2",
        "Confirm the silver panel was intact before you scratched it.",
      ),
      t("verify.guidance.invalid.3", "Do not use the product until authenticity is confirmed."),
    ],
    limit: [
      t("verify.guidance.limit.1", "Multiple checks can mean a resealed or duplicated label."),
      t(
        "verify.guidance.limit.2",
        "Send us photos of the carton and sticker so we can trace the batch.",
      ),
    ],
    error: [
      t("verify.guidance.error.1", "Check your connection and try again in a moment."),
      t(
        "verify.guidance.error.2",
        "If it keeps failing, send us the code and we will verify it manually.",
      ),
    ],
  };

  const tone = TONES[result.status];
  const cell = result.status === "verified" ? "bg-forest" : "bg-white";
  const rows: { label: string; value: string }[] = [];
  if (result.product)
    rows.push({ label: t("verify.result.product", "Product"), value: result.product });
  if (result.batch) rows.push({ label: t("verify.result.batch", "Batch"), value: result.batch });
  if (result.publicCode)
    rows.push({ label: t("verify.result.publicCode", "Public code"), value: result.publicCode });
  if (typeof result.checks === "number")
    rows.push({ label: t("verify.result.checks", "Checks"), value: String(result.checks) });

  const outlineBtn =
    "border border-current px-4 py-2.5 text-xs uppercase tracking-[0.18em] hover:bg-forest hover:text-ivory hover:border-forest transition-colors";

  return (
    <div className={`mt-6 ${tone.shell}`} role="status" aria-live="polite">
      <div className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className={`flex h-10 w-10 shrink-0 items-center justify-center border-2 text-lg leading-none ${tone.mark}`}
          >
            {MARKS[result.status]}
          </span>
          <div className="min-w-0">
            <div className={`eyebrow ${tone.eyebrow}`}>{tone.label}</div>
            <p className="mt-2 text-base leading-snug md:text-lg">{tone.headline}</p>
            <p className={`mt-2 text-sm leading-relaxed ${tone.meta}`}>{result.message}</p>
          </div>
        </div>

        {rows.length > 0 && (
          <dl className="mt-5 grid grid-cols-2 gap-px bg-current/10">
            {rows.map((r) => (
              <div key={r.label} className={`p-3 ${cell}`}>
                <dt className={`text-[10px] tracking-[0.18em] uppercase ${tone.meta}`}>
                  {r.label}
                </dt>
                <dd className="mt-1 text-sm break-all" dir="ltr">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className={`mt-5 h-px ${tone.rule}`} />

        {result.status !== "verified" && (
          <div className="mt-5 border-s-4 border-current bg-destructive p-4 text-destructive-foreground">
            <p className="text-sm leading-snug font-bold tracking-[0.12em] uppercase md:text-base">
              {t(
                "verify.warning.title",
                "Do not use this product. Authenticity has not been confirmed.",
              )}
            </p>
            <p className="mt-2 text-xs leading-relaxed opacity-90 md:text-sm">
              {t(
                "verify.warning.body",
                "Unverified products may be counterfeit, expired, or improperly stored. Stop use immediately and contact our support team for verification.",
              )}
            </p>
          </div>
        )}

        <ul className="mt-4 space-y-2">
          {GUIDANCE[result.status].map((line) => (
            <li key={line} className={`relative ps-4 text-sm leading-relaxed ${tone.meta}`}>
              <span aria-hidden="true" className="absolute start-0 top-0">
                —
              </span>
              {line}
            </li>
          ))}
        </ul>

        {result.status !== "verified" ? (
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={path("/contact")} className={outlineBtn}>
              {t("verify.cta.contactSupport", "Contact support")}
            </a>
            {result.whatsapp && (
              <a
                href={result.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={outlineBtn}
              >
                {t("verify.cta.whatsapp", "Message us on WhatsApp")}
              </a>
            )}
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={path("/shop")}
              className="bg-gold px-4 py-2.5 text-xs font-semibold tracking-[0.18em] text-forest uppercase"
            >
              {t("verify.cta.shopAuthorized", "Shop authorized stock")}
            </a>
            <a
              href={path("/real-vs-fake")}
              className="border border-ivory/40 px-4 py-2.5 text-xs tracking-[0.18em] uppercase"
            >
              {t("verify.cta.realVsFakeGuide", "Real vs fake guide")}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
