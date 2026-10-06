/** Overview + Orders tabs of the account portal (order rows with line items and tracking). */
import { useMemo, useState } from "react";

import { TrackingPanel } from "@/components/react/TrackingPanel";
import type { AccountOrder } from "@/lib/api/account";
import { useI18n } from "@/lib/i18n/react";

import { customerStatus, dateLabel, money, statusLabelFromLabel } from "./account-format";
import { AddressLines, EmptyState, Line, SectionTitle } from "./AccountParts";

export function OverviewTab({
  orders,
  onSeeOrders,
}: {
  orders: AccountOrder[];
  onSeeOrders: () => void;
}) {
  const { t } = useI18n();
  const recent = orders.slice(0, 3);

  return (
    <div>
      <SectionTitle
        note={orders.length ? t("commerce.account.mostRecent", "Most recent") : undefined}
      >
        {t("commerce.account.recentOrders", "Recent orders")}
      </SectionTitle>
      {recent.length === 0 ? (
        <EmptyState
          title={t("commerce.account.empty.ordersTitle", "No orders yet")}
          body={t(
            "commerce.account.empty.ordersBodyOverview",
            "When you place an order it will appear here with full line items and shipment status.",
          )}
          ctaLabel={t("commerce.account.empty.cta", "Shop the collection")}
          to="/shop"
        />
      ) : (
        <>
          <div className="space-y-px border hairline bg-ink/[0.08]">
            {recent.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
          {orders.length > recent.length && (
            <button
              type="button"
              onClick={onSeeOrders}
              className="mt-6 border hairline px-5 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase"
            >
              {t("commerce.account.viewAllOrders", "View all")} {orders.length}{" "}
              {t("commerce.account.ordersWord", "orders")}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function OrdersTab({ orders }: { orders: AccountOrder[] }) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const statuses = useMemo(
    () => ["all", ...Array.from(new Set(orders.map((o) => customerStatus(o.status).label)))],
    [orders],
  );

  const filtered = orders.filter((o) => {
    const matchesStatus = status === "all" || customerStatus(o.status).label === status;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.items.some((i) => i.name.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  return (
    <div>
      <SectionTitle note={`${filtered.length} ${t("commerce.account.of", "of")} ${orders.length}`}>
        {t("commerce.account.orderHistory", "Order history")}
      </SectionTitle>

      {orders.length === 0 ? (
        <EmptyState
          title={t("commerce.account.empty.ordersTitle", "No orders yet")}
          body={t(
            "commerce.account.empty.ordersBody",
            "Orders placed with this email — including earlier greenwealth.com purchases — appear here automatically.",
          )}
          ctaLabel={t("commerce.account.empty.cta", "Shop the collection")}
          to="/shop"
        />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-px border hairline bg-ink/[0.08] sm:grid-cols-[1fr_200px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(
                "commerce.account.searchPlaceholder",
                "Search order number or product",
              )}
              className="bg-paper px-4 py-3 text-base outline-none focus:bg-moss/[0.04]"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-paper px-4 py-3 text-xs font-semibold tracking-[0.16em] uppercase outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === "all"
                    ? t("commerce.account.allStatuses", "All statuses")
                    : statusLabelFromLabel(t, s)}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
              {t("commerce.account.noMatch", "No orders match this filter.")}
            </p>
          ) : (
            <div className="space-y-px border hairline bg-ink/[0.08]">
              {filtered.map((o) => (
                <OrderRow key={o.id} order={o} expandable />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OrderRow({ order, expandable = false }: { order: AccountOrder; expandable?: boolean }) {
  const { t, path } = useI18n();
  const [open, setOpen] = useState(false);
  const { label: rawStatusLabel, tone } = customerStatus(order.status);
  const label = statusLabelFromLabel(t, rawStatusLabel);

  return (
    <div className="group bg-paper transition-colors hover:bg-moss/[0.035]">
      <div className="grid grid-cols-1 gap-4 border-s-2 border-transparent p-5 transition-colors group-hover:border-gold md:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="text-xs font-bold tracking-[0.18em] uppercase">{order.orderNumber}</p>
            <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
              {dateLabel(order.createdAt)}
            </p>
            <p
              className={`border-s-2 border-current ps-2 text-[10px] font-semibold tracking-[0.16em] uppercase ${tone}`}
            >
              {label}
            </p>
            {order.source === "legacy" && (
              <p className="border hairline px-2 py-0.5 text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                {t("commerce.account.archive", "Archive")}
              </p>
            )}
          </div>
          <p className="mt-2 truncate text-xs text-muted-foreground">
            {order.items.length > 0
              ? order.items.map((i) => `${i.quantity} × ${i.name}`).join("  ·  ")
              : t("commerce.account.lineItemsUnavailable", "Line items unavailable")}
          </p>
        </div>
        <div className="flex items-center gap-5 md:justify-end">
          <p className="font-serif text-lg whitespace-nowrap">
            {money(order.grandTotalCents, order.currency)}
          </p>
          {expandable && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="border hairline px-3 py-2 text-[11px] font-semibold tracking-[0.16em] uppercase"
            >
              {open
                ? t("commerce.account.close", "Close")
                : t("commerce.account.details", "Details")}
            </button>
          )}
        </div>
      </div>

      {expandable && open && (
        <div className="grid grid-cols-1 gap-px border-t hairline bg-ink/[0.08] md:grid-cols-2">
          <div className="bg-paper p-5">
            <p className="mb-3 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              {t("commerce.trackOrder.items", "Items")}
            </p>
            <div className="space-y-2">
              {order.items.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  {t("commerce.account.noLineItems", "No line items recorded.")}
                </p>
              )}
              {order.items.map((i, idx) => (
                <div key={`${i.name}-${idx}`} className="flex justify-between gap-4 text-xs">
                  <span className="min-w-0">
                    {i.quantity} × {i.name}
                  </span>
                  <span className="whitespace-nowrap">
                    {money(i.lineTotalCents, order.currency)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t hairline pt-3 text-xs">
              <Line
                label={t("commerce.trackOrder.items", "Items")}
                value={money(order.itemsTotalCents, order.currency)}
              />
              <Line
                label={t("commerce.summary.shipping", "Shipping")}
                value={money(order.shippingTotalCents, order.currency)}
              />
              <Line
                label={t("commerce.summary.total", "Total")}
                value={money(order.grandTotalCents, order.currency)}
                bold
              />
            </div>
          </div>
          <div className="bg-paper p-5">
            <p className="mb-3 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              {t("commerce.account.shippingAddress", "Shipping address")}
            </p>
            <AddressLines a={order.shippingAddress} />
            <div className="mt-5 border-t hairline pt-5">
              <TrackingPanel tracking={order.tracking} status={order.status} compact />
            </div>
            <p className="mt-5 mb-2 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              {t("commerce.trackOrder.payment", "Payment")}
            </p>
            <p className="text-xs">
              {(order.paymentMethod ?? "—").toUpperCase()}
              {order.paymentStatus ? ` · ${order.paymentStatus.replace(/_/g, " ")}` : ""}
            </p>
            <a
              href={path("/track-order")}
              className="mt-5 inline-flex bg-forest px-5 py-3 text-[11px] font-semibold tracking-[0.18em] text-paper uppercase"
            >
              {t("commerce.account.trackThisOrder", "Track this order")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
