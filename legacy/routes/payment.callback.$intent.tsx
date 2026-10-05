/**
 * Module: Payment return page (Moyasar)
 *
 * Purpose: land the customer after the Moyasar hosted payment page, verify the
 * invoice server-side, and show a clear paid / pending / failed outcome.
 * Users: SAR customers completing card or mada payment.
 * Integration points: payments.functions.ts (confirmSarPayment).
 */

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/site/Page";
import { useCart } from "@/lib/cart";
import { confirmSarPayment, type ConfirmPaymentResult } from "@/lib/payments.functions";
import { abs } from "@/lib/seo";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/payment/callback/$intent")({
  head: () => ({
    meta: [
      { title: "Payment status — Green Wealth" },
      { name: "description", content: "Confirming your Green Wealth payment." },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: abs("/payment/callback") }],
  }),
  component: PaymentCallbackPage,
});

function PaymentCallbackPage() {
  const t = useT();
  const { intent } = Route.useParams();
  const confirm = useServerFn(confirmSarPayment);
  const { clear } = useCart();
  const navigate = useNavigate();
  const [result, setResult] = useState<ConfirmPaymentResult | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    confirm({ data: { intentId: intent } })
      .then((res) => {
        setResult(res);
        if (res.status === "paid") clear();
      })
      .catch(() =>
        setResult({
          status: "unknown",
          orderNumber: null,
          amountCents: null,
          currency: "SAR",
          message: t(
            "commerce.payment.unknownError",
            "We could not confirm this payment automatically. Our team will verify it for you.",
          ),
        }),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent]);

  const amount =
    result?.amountCents != null ? `${(result.amountCents / 100).toFixed(2)} ${result.currency}` : null;

  return (
    <>
      <PageHeader eyebrow={t("commerce.payment.eyebrow", "Secure Payment")} title={t("commerce.payment.title", "Payment status")} />
      <div className="container-editorial py-12 md:py-20 max-w-2xl">
        {!result && (
          <div className="border hairline p-8 md:p-12 bg-paper">
            <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-forest/60 mb-4">
              {t("commerce.payment.verifying", "Verifying with the payment provider")}
            </div>
            <div className="space-y-3">
              <div className="h-3 w-3/4 bg-forest/10 animate-pulse" />
              <div className="h-3 w-1/2 bg-forest/10 animate-pulse" />
              <div className="h-3 w-2/3 bg-forest/10 animate-pulse" />
            </div>
          </div>
        )}

        {result?.status === "paid" && (
          <div className="border-2 border-forest bg-forest text-paper p-8 md:p-12">
            <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-gold mb-4">
              {t("commerce.payment.received", "Payment received")}
            </div>
            <h2 className="font-serif text-2xl md:text-3xl mb-4">{t("commerce.payment.confirmed", "Your order is confirmed")}</h2>
            <dl className="grid grid-cols-2 gap-4 text-xs font-mono uppercase tracking-[0.14em] border-t border-paper/20 pt-5 mb-8">
              {result.orderNumber && (
                <div>
                  <dt className="text-paper/50 mb-1">{t("commerce.payment.order", "Order")}</dt>
                  <dd className="text-gold">{result.orderNumber}</dd>
                </div>
              )}
              {amount && (
                <div>
                  <dt className="text-paper/50 mb-1">{t("commerce.payment.amountCharged", "Amount charged")}</dt>
                  <dd>{amount}</dd>
                </div>
              )}
            </dl>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate({ to: "/order-confirmation" })}
                className="bg-paper text-forest px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold"
              >
                {t("commerce.payment.continue", "Continue")}
              </button>
              <Link
                to="/track-order"
                className="border border-paper/40 px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-center"
              >
                {t("commerce.confirmation.trackOrder", "Track your order")}
              </Link>
            </div>
          </div>
        )}

        {result && result.status !== "paid" && (
          <div className="border-2 border-forest bg-paper p-8 md:p-12">
            <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-forest/60 mb-4">
              {result.status === "pending"
                ? t("commerce.payment.pendingLabel", "Payment pending")
                : t("commerce.payment.notCompletedLabel", "Payment not completed")}
            </div>
            <h2 className="font-serif text-2xl md:text-3xl mb-4">
              {result.status === "pending"
                ? t("commerce.payment.stillConfirming", "We are still confirming this payment")
                : t("commerce.payment.didNotGoThrough", "Your payment did not go through")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{result.message}</p>
            <div className="border-l-4 border-forest bg-ivory p-5 text-sm leading-relaxed mb-8">
              {t("commerce.payment.bagKeptIntact", "Your bag has been kept intact. No order has been dispatched")}
              {result.status === "pending"
                ? ` ${t("commerce.payment.untilClears", "until the payment clears.")}`
                : ` ${t("commerce.payment.nothingCaptured", "and nothing has been captured.")}`}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/checkout"
                className="bg-forest text-paper px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-center"
              >
                {t("commerce.payment.returnToCheckout", "Return to checkout")}
              </Link>
              <Link
                to="/contact"
                className="border hairline px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-center"
              >
                {t("commerce.payment.contactSupport", "Contact support")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
