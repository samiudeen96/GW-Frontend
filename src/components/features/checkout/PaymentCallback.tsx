/**
 * Payment return (Moyasar): verifies the payment intent with the backend and
 * shows a paid / pending / failed outcome. Clears the bag once paid.
 */
import { useEffect, useRef, useState } from "react";

import { confirmSarPayment, type ConfirmPaymentResult } from "@/lib/api/payments";
import type { IslandI18n } from "@/lib/i18n/core";
import { I18nProvider, useI18n } from "@/lib/i18n/react";
import { clearCart } from "@/lib/stores/cart";

type Props = {
  i18n: IslandI18n;
  intent: string;
};

function Status({ intent }: { intent: string }) {
  const { t, path } = useI18n();
  const [result, setResult] = useState<ConfirmPaymentResult | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const unknown = (message: string): ConfirmPaymentResult => ({
      status: "unknown",
      orderNumber: null,
      amountCents: null,
      currency: "SAR",
      message,
    });
    const unknownMessage = t(
      "commerce.payment.unknownError",
      "We could not confirm this payment automatically. Our team will verify it for you.",
    );
    confirmSarPayment({ intentId: intent })
      .then((res) => {
        if (!res.ok) {
          setResult(unknown(res.error || unknownMessage));
          return;
        }
        setResult(res.data);
        if (res.data.status === "paid") clearCart();
      })
      .catch(() => setResult(unknown(unknownMessage)));
  }, [intent, t]);

  const amount =
    result?.amountCents != null
      ? `${(result.amountCents / 100).toFixed(2)} ${result.currency}`
      : null;

  return (
    <div className="container-editorial max-w-2xl py-12 md:py-20">
      {!result && (
        <div className="border hairline bg-paper p-8 md:p-12">
          <div className="mb-4 font-mono text-[10px] tracking-[0.28em] text-forest/60 uppercase">
            {t("commerce.payment.verifying", "Verifying with the payment provider")}
          </div>
          <div className="space-y-3">
            <div className="h-3 w-3/4 animate-pulse bg-forest/10" />
            <div className="h-3 w-1/2 animate-pulse bg-forest/10" />
            <div className="h-3 w-2/3 animate-pulse bg-forest/10" />
          </div>
        </div>
      )}

      {result?.status === "paid" && (
        <div className="border-2 border-forest bg-forest p-8 text-paper md:p-12">
          <div className="mb-4 font-mono text-[10px] tracking-[0.28em] text-gold uppercase">
            {t("commerce.payment.received", "Payment received")}
          </div>
          <h2 className="mb-4 font-serif text-2xl md:text-3xl">
            {t("commerce.payment.confirmed", "Your order is confirmed")}
          </h2>
          <dl className="mb-8 grid grid-cols-2 gap-4 border-t border-paper/20 pt-5 font-mono text-xs tracking-[0.14em] uppercase">
            {result.orderNumber && (
              <div>
                <dt className="mb-1 text-paper/50">{t("commerce.payment.order", "Order")}</dt>
                <dd className="text-gold">{result.orderNumber}</dd>
              </div>
            )}
            {amount && (
              <div>
                <dt className="mb-1 text-paper/50">
                  {t("commerce.payment.amountCharged", "Amount charged")}
                </dt>
                <dd>{amount}</dd>
              </div>
            )}
          </dl>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.assign(path("/order-confirmation"))}
              className="bg-paper px-6 py-3 text-xs font-semibold tracking-[0.2em] text-forest uppercase"
            >
              {t("commerce.payment.continue", "Continue")}
            </button>
            <a
              href={path("/track-order")}
              className="border border-paper/40 px-6 py-3 text-center text-xs font-semibold tracking-[0.2em] uppercase"
            >
              {t("commerce.confirmation.trackOrder", "Track your order")}
            </a>
          </div>
        </div>
      )}

      {result && result.status !== "paid" && (
        <div className="border-2 border-forest bg-paper p-8 md:p-12">
          <div className="mb-4 font-mono text-[10px] tracking-[0.28em] text-forest/60 uppercase">
            {result.status === "pending"
              ? t("commerce.payment.pendingLabel", "Payment pending")
              : t("commerce.payment.notCompletedLabel", "Payment not completed")}
          </div>
          <h2 className="mb-4 font-serif text-2xl md:text-3xl">
            {result.status === "pending"
              ? t("commerce.payment.stillConfirming", "We are still confirming this payment")
              : t("commerce.payment.didNotGoThrough", "Your payment did not go through")}
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{result.message}</p>
          <div className="mb-8 border-s-4 border-forest bg-ivory p-5 text-sm leading-relaxed">
            {t(
              "commerce.payment.bagKeptIntact",
              "Your bag has been kept intact. No order has been dispatched",
            )}
            {result.status === "pending"
              ? ` ${t("commerce.payment.untilClears", "until the payment clears.")}`
              : ` ${t("commerce.payment.nothingCaptured", "and nothing has been captured.")}`}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={path("/checkout")}
              className="bg-forest px-6 py-3 text-center text-xs font-semibold tracking-[0.2em] text-paper uppercase"
            >
              {t("commerce.payment.returnToCheckout", "Return to checkout")}
            </a>
            <a
              href={path("/contact")}
              className="border hairline px-6 py-3 text-center text-xs font-semibold tracking-[0.2em] uppercase"
            >
              {t("commerce.payment.contactSupport", "Contact support")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentCallback({ i18n, intent }: Props) {
  return (
    <I18nProvider i18n={i18n}>
      <Status intent={intent} />
    </I18nProvider>
  );
}
