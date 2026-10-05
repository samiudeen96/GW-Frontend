import { abs, absAr, breadcrumbLd, localeOf } from "@/lib/seo";
import { TrackingPanel } from "@/components/site/TrackingPanel";
import { trackOrder, type TrackedOrder } from "@/lib/orders.functions";
import { formatMoney } from "@/lib/pricing";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Page";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { useT, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/track-order")({
  head: (ctx) => {
    const locale = localeOf(ctx);
    const isAr = locale === "ar";
    const url = isAr ? absAr("/track-order") : abs("/track-order");
    return {
      meta: [
        { title: isAr ? "تتبّع الطلب — Green Wealth" : "Track Order — Green Wealth" },
        {
          name: "description",
          content: isAr
            ? "تتبّع حالة طلبك من Green Wealth."
            : "Track the status of your Green Wealth order.",
        },
        { property: "og:title", content: isAr ? "تتبّع الطلب — Green Wealth" : "Track Order — Green Wealth" },
        {
          property: "og:description",
          content: isAr
            ? "تحقّق من الحالة اللحظية لطلبك من Green Wealth باستخدام رقم الطلب مع البريد الإلكتروني أو الهاتف."
            : "Check the live status of your Green Wealth order with your order number and email or phone.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        breadcrumbLd([
          { name: isAr ? "الرئيسية" : "Home", path: "/" },
          { name: isAr ? "تتبّع الطلب" : "Track Order", path: "/track-order" },
        ]),
      ],
    };
  },
  component: TrackPage,
});

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
  const t = useT();
  const locale = useLocale();
  const fallbackLabel = STATUS_LABEL[order.status] ?? order.status.replace(/_/g, " ");
  const statusKey = STATUS_KEY[order.status];
  const statusLabel = statusKey ? t(statusKey, fallbackLabel) : fallbackLabel;
  const addr = order.shippingAddress;
  const addressLines = [addr.line1, addr.line2, addr.city, addr.state, addr.zip, addr.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="border hairline bg-paper">
      <div className="p-6 md:p-8 border-b hairline">
        <div className="eyebrow mb-3" data-ltr>{order.orderNumber}</div>
        <h2 className="font-serif text-2xl mb-1">{statusLabel}</h2>
        <p className="text-sm text-muted-foreground">
          {t("commerce.trackOrder.placedOn", "Placed on")} {formatDate(order.createdAt, locale)}
        </p>
      </div>

      <div className="p-6 md:p-8 border-b hairline">
        <h3 className="text-xs uppercase tracking-[0.15em] font-bold mb-4">{t("commerce.trackOrder.items", "Items")}</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between gap-4 text-sm">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground ml-2">× {item.quantity}</span>
              </div>
              <div className="tabular-nums">{formatMoney(item.lineTotalCents / 100, order.currency)}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t hairline space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t("commerce.summary.subtotal", "Subtotal")}</span>
            <span className="tabular-nums">{formatMoney(order.itemsTotalCents / 100, order.currency)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t("commerce.summary.shipping", "Shipping")}</span>
            <span className="tabular-nums">{formatMoney(order.shippingTotalCents / 100, order.currency)}</span>
          </div>
          <div className="flex justify-between gap-4 font-semibold">
            <span>{t("commerce.summary.total", "Total")}</span>
            <span className="tabular-nums">{formatMoney(order.grandTotalCents / 100, order.currency)}</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 border-b hairline">
        <TrackingPanel tracking={order.tracking} status={order.status} compact />
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <h3 className="text-xs uppercase tracking-[0.15em] font-bold mb-2">{t("commerce.trackOrder.shipTo", "Ship to")}</h3>
          <p className="text-sm leading-relaxed">
            {order.customerName}
            <br />
            {addressLines || t("commerce.trackOrder.addressNotRecorded", "Address not recorded")}
          </p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-[0.15em] font-bold mb-2">{t("commerce.trackOrder.payment", "Payment")}</h3>
          <p className="text-sm capitalize">{order.paymentMethod ?? t("commerce.trackOrder.notRecorded", "Not recorded")}</p>
          {order.routedTargetCode && (
            <p className="text-sm text-muted-foreground mt-1">
              {t("commerce.trackOrder.routedTo", "Routed to")} {order.routedTargetCode}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function TrackPage() {
  const t = useT();
  const lookup = useServerFn(trackOrder);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: true; order: TrackedOrder } | { ok: false; error: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await lookup({
        data: {
          orderNumber: String(form.get("orderNumber") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
        },
      });
      setResult(res);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader eyebrow={t("commerce.trackOrder.eyebrow", "Orders")} title={t("commerce.trackOrder.title", "Track your order.")} />
      <div className="container-editorial py-12 md:py-20 max-w-2xl">
        <form onSubmit={onSubmit} className="grid gap-4 mb-10">
          <label className="block">
            <span className="eyebrow mb-2 block">{t("commerce.trackOrder.orderNumber", "Order number")}</span>
            <input
              name="orderNumber"
              required
              placeholder="GW-260811-A1B2C"
              data-ltr
              className="w-full bg-transparent border hairline p-3 text-sm outline-none focus:border-forest"
            />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="eyebrow mb-2 block">{t("commerce.trackOrder.email", "Email")}</span>
              <input
                name="email"
                type="email"
                placeholder={t("commerce.trackOrder.usedAtCheckout", "Used at checkout")}
                data-ltr
                className="w-full bg-transparent border hairline p-3 text-sm outline-none focus:border-forest"
              />
            </label>
            <label className="block">
              <span className="eyebrow mb-2 block">{t("commerce.trackOrder.phone", "Phone")}</span>
              <input
                name="phone"
                type="tel"
                placeholder={t("commerce.trackOrder.usedAtCheckout", "Used at checkout")}
                data-ltr
                className="w-full bg-transparent border hairline p-3 text-sm outline-none focus:border-forest"
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("commerce.trackOrder.helper", "Enter either the email or phone number from your order.")}
          </p>
          <button
            type="submit"
            disabled={loading}
            className="justify-self-start bg-forest text-ivory px-7 py-4 text-xs uppercase tracking-[0.18em] disabled:opacity-60"
          >
            {loading ? t("commerce.trackOrder.lookingUp", "Looking up...") : t("commerce.trackOrder.track", "Track")}
          </button>
        </form>

        {result && !result.ok && (
          <div className="border hairline p-6 md:p-8 bg-paper">
            <h2 className="font-serif text-xl mb-2">{t("commerce.trackOrder.notFoundTitle", "Order not found")}</h2>
            <p className="text-sm text-muted-foreground">{result.error}</p>
          </div>
        )}

        {result?.ok && <OrderResult order={result.order} />}
      </div>
    </>
  );
}
