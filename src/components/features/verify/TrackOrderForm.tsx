/**
 * Order lookup form for /track-order. Calls `trackOrder` and renders either the
 * order summary (with TrackingPanel) or the not-found/error state. Needs the
 * `commerce.trackOrder`, `commerce.tracking` and `commerce.summary` keys.
 */
import { useState, type SubmitEvent } from "react";

import { TrackingPanel } from "@/components/react/TrackingPanel";
import { trackOrder } from "@/lib/api/orders";
import type { ActionResult, TrackedOrder } from "@/lib/api/types";
import type { IslandI18n } from "@/lib/i18n/core";
import { I18nProvider, useI18n } from "@/lib/i18n/react";
import { formatMoney } from "@/lib/pricing";

type Props = {
  i18n: IslandI18n;
};

const STATUS_LABEL: Record<string, string> = {
  received: "Order received",
  routed: "Routed to fulfillment",
  synced: "Confirmed with fulfillment",
  sync_failed: "Fulfillment sync delayed",
  unroutable: "Routing review needed",
};

const STATUS_KEY: Record<string, string> = {
  received: "commerce.trackOrder.status.received",
  routed: "commerce.trackOrder.status.routed",
  synced: "commerce.trackOrder.status.synced",
  sync_failed: "commerce.trackOrder.status.sync_failed",
  unroutable: "commerce.trackOrder.status.unroutable",
};

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "en-GB" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

function OrderResult({ order }: { order: TrackedOrder }) {
  const { t, locale } = useI18n();
  const fallbackLabel = STATUS_LABEL[order.status] ?? order.status.replace(/_/g, " ");
  const statusKey = STATUS_KEY[order.status];
  const statusLabel = statusKey ? t(statusKey, fallbackLabel) : fallbackLabel;
  const addr = order.shippingAddress;
  const addressLines = addr
    ? [addr.line1, addr.line2, addr.city, addr.state, addr.zip, addr.country]
        .filter(Boolean)
        .join(", ")
    : "";
  const money = (cents: number) => formatMoney(cents / 100, order.currency);

  return (
    <div className="border hairline bg-paper">
      <div className="border-b hairline p-6 md:p-8">
        <div className="mb-3 eyebrow" data-ltr>
          {order.orderNumber}
        </div>
        <h2 className="mb-1 font-serif text-2xl">{statusLabel}</h2>
        <p className="text-sm text-muted-foreground">
          {t("commerce.trackOrder.placedOn", "Placed on")} {formatDate(order.createdAt, locale)}
        </p>
      </div>

      <div className="border-b hairline p-6 md:p-8">
        <h3 className="mb-4 text-xs font-bold tracking-[0.15em] uppercase">
          {t("commerce.trackOrder.items", "Items")}
        </h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between gap-4 text-sm">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="ms-2 text-muted-foreground">× {item.qty}</span>
              </div>
              <div className="tabular-nums">{money(item.unitPriceCents * item.qty)}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2 border-t hairline pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">
              {t("commerce.summary.subtotal", "Subtotal")}
            </span>
            <span className="tabular-nums">{money(order.itemsTotalCents)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">
              {t("commerce.summary.shipping", "Shipping")}
            </span>
            <span className="tabular-nums">{money(order.shippingTotalCents)}</span>
          </div>
          <div className="flex justify-between gap-4 font-semibold">
            <span>{t("commerce.summary.total", "Total")}</span>
            <span className="tabular-nums">{money(order.grandTotalCents)}</span>
          </div>
        </div>
      </div>

      <div className="border-b hairline p-6 md:p-8">
        <TrackingPanel tracking={order.tracking} status={order.status} compact />
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:gap-8 md:p-8">
        <div>
          <h3 className="mb-2 text-xs font-bold tracking-[0.15em] uppercase">
            {t("commerce.trackOrder.shipTo", "Ship to")}
          </h3>
          <p className="text-sm leading-relaxed">
            {order.customerName}
            <br />
            {addressLines || t("commerce.trackOrder.addressNotRecorded", "Address not recorded")}
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-xs font-bold tracking-[0.15em] uppercase">
            {t("commerce.trackOrder.payment", "Payment")}
          </h3>
          <p className="text-sm capitalize">
            {order.paymentMethod || t("commerce.trackOrder.notRecorded", "Not recorded")}
          </p>
          {order.routedTargetCode && (
            <p className="mt-1 text-sm text-muted-foreground">
              {t("commerce.trackOrder.routedTo", "Routed to")} {order.routedTargetCode}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full bg-transparent border hairline p-3 text-sm outline-none focus:border-forest";

function TrackForm() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActionResult<TrackedOrder> | null>(null);

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const form = new FormData(e.currentTarget);
    // `phone` is collected as in the legacy form; the API contract only types
    // orderNumber + email today. TODO(api): add `phone` to trackOrder's input.
    const input = {
      orderNumber: String(form.get("orderNumber") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
    };
    try {
      setResult(await trackOrder(input));
    } catch (err) {
      setResult({ ok: false, error: err instanceof Error ? err.message : String(err) });
    } finally {
      setLoading(false);
    }
  }

  const usedAtCheckout = t("commerce.trackOrder.usedAtCheckout", "Used at checkout");

  return (
    <>
      <form onSubmit={onSubmit} className="mb-10 grid gap-4">
        <label className="block">
          <span className="mb-2 block eyebrow">
            {t("commerce.trackOrder.orderNumber", "Order number")}
          </span>
          <input
            name="orderNumber"
            required
            placeholder="GW-260811-A1B2C"
            data-ltr
            className={inputClass}
          />
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block eyebrow">{t("commerce.trackOrder.email", "Email")}</span>
            <input
              name="email"
              type="email"
              placeholder={usedAtCheckout}
              data-ltr
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-2 block eyebrow">{t("commerce.trackOrder.phone", "Phone")}</span>
            <input
              name="phone"
              type="tel"
              placeholder={usedAtCheckout}
              data-ltr
              className={inputClass}
            />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          {t(
            "commerce.trackOrder.helper",
            "Enter either the email or phone number from your order.",
          )}
        </p>
        <button
          type="submit"
          disabled={loading}
          className="justify-self-start bg-forest px-7 py-4 text-xs tracking-[0.18em] text-ivory uppercase disabled:opacity-60"
        >
          {loading
            ? t("commerce.trackOrder.lookingUp", "Looking up...")
            : t("commerce.trackOrder.track", "Track")}
        </button>
      </form>

      {result && !result.ok && (
        <div className="border hairline bg-paper p-6 md:p-8" role="status" aria-live="polite">
          <h2 className="mb-2 font-serif text-xl">
            {t("commerce.trackOrder.notFoundTitle", "Order not found")}
          </h2>
          <p className="text-sm text-muted-foreground">{result.error}</p>
        </div>
      )}

      {result?.ok && <OrderResult order={result.data} />}
    </>
  );
}

export default function TrackOrderForm({ i18n }: Props) {
  return (
    <I18nProvider i18n={i18n}>
      <TrackForm />
    </I18nProvider>
  );
}
