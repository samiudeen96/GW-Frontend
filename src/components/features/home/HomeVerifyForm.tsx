/**
 * Homepage scratch-code form. Submits to `verifySecretCode` and shows the
 * checking state and verdict in a dialog (loaded on first submit).
 * i18n: `islandI18n(locale, ["verify.", "home.verify."])`.
 */
import { lazy, Suspense, useState, type SubmitEvent } from "react";

import { verifySecretCode } from "@/lib/api/verify";
import type { VerifyResult } from "@/lib/api/types";
import type { IslandI18n } from "@/lib/i18n/core";
import { I18nProvider, useI18n } from "@/lib/i18n/react";

const VerifyDialog = lazy(() => import("./VerifyDialog"));

type Props = { i18n: IslandI18n };

function VerifyForm() {
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
          "home.verify.error",
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
        <label htmlFor="home-scratch-code" className="sr-only">
          {t("home.verify.inputLabel", "Scratch verification code")}
        </label>
        <input
          id="home-scratch-code"
          name="scratchCode"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("home.verify.inputPlaceholder", "e.g. enter 12 digit code")}
          maxLength={40}
          className="mb-4 w-full border border-forest/40 bg-ivory px-4 py-3 text-base font-bold tracking-widest uppercase placeholder:text-forest/40 focus:border-forest focus:outline-none sm:px-5 sm:py-4"
        />
        <button
          type="submit"
          disabled={checking}
          className="w-full bg-forest px-6 py-4 text-[11px] font-bold tracking-[0.22em] text-paper uppercase transition-colors hover:bg-moss disabled:opacity-50"
        >
          {checking
            ? t("home.verify.checking", "Checking")
            : t("home.verify.submit", "Verify Authenticity")}
        </button>
      </form>

      {(open || checking) && (
        <Suspense fallback={null}>
          <VerifyDialog open={open} onOpenChange={setOpen} checking={checking} result={result} />
        </Suspense>
      )}
    </>
  );
}

export default function HomeVerifyForm({ i18n }: Props) {
  return (
    <I18nProvider i18n={i18n}>
      <VerifyForm />
    </I18nProvider>
  );
}
