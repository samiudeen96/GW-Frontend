/**
 * Scratch-code entry form for /verify. Submits to `verifySecretCode` and shows
 * the checking / result panels in a dialog. Needs `verify.` keys in `i18n`.
 */
import { useState, type SubmitEvent } from "react";

import { VerifyCheckingPanel, VerifyResultPanel } from "@/components/react/VerifyResultPanel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { VerifyResult } from "@/lib/api/types";
import { verifySecretCode } from "@/lib/api/verify";
import type { IslandI18n } from "@/lib/i18n/core";
import { I18nProvider, useI18n } from "@/lib/i18n/react";

type Props = {
  i18n: IslandI18n;
};

function Form() {
  const { t } = useI18n();
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [open, setOpen] = useState(false);

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!code.trim() || checking) return;
    setChecking(true);
    setResult(null);
    setOpen(true);
    try {
      setResult(await verifySecretCode({ code: code.trim() }));
    } catch {
      setResult({
        status: "error",
        message: t(
          "verify.form.networkError",
          "We could not reach the verification service. Please try again in a moment.",
        ),
      });
    } finally {
      setChecking(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor="verify-code-input" className="mb-4 block eyebrow">
          {t("verify.form.label", "Scratch verification code")}
        </label>
        <div className="flex border-b border-ink/60 focus-within:border-forest">
          <input
            id="verify-code-input"
            name="verifyCode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t("verify.form.placeholder", "e.g. enter 12 digit code")}
            inputMode="numeric"
            dir="ltr"
            className="flex-1 bg-transparent py-3 text-start text-base tracking-[0.15em] uppercase outline-none"
            autoComplete="off"
            maxLength={40}
          />
          <button
            type="submit"
            disabled={checking}
            className="px-4 py-3 text-xs tracking-[0.18em] text-forest uppercase disabled:opacity-50"
          >
            {checking ? t("verify.form.submitting", "Checking") : t("verify.form.submit", "Verify")}
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {t(
            "verify.form.helper",
            "Scratch the black area on the sticker to reveal your 12 digit code, then enter it exactly. Do not use products that fail verification.",
          )}
        </p>
      </form>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-xl rounded-none border-0 bg-transparent p-0 shadow-none data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-2xl"
          aria-describedby={undefined}
        >
          {/* Radix requires an accessible title; the panels carry the visible copy. */}
          <DialogTitle className="sr-only">
            {t("verify.form.label", "Scratch verification code")}
          </DialogTitle>
          {checking && !result && <VerifyCheckingPanel />}
          {result && !checking && <VerifyResultPanel result={result} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function VerifyForm({ i18n }: Props) {
  return (
    <I18nProvider i18n={i18n}>
      <Form />
    </I18nProvider>
  );
}
