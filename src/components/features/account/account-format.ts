/** Formatting + shopper-status helpers for the account portal (island-safe). */
import type { TranslateFn } from "@/lib/i18n/core";

export function money(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return `${currency} ${(cents / 100).toFixed(2)}`;
  }
}

export function dateLabel(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

type CustomerStatus = { label: string; key: string; tone: string };

/* Internal ERP/routing states are never shown to customers — they are folded
   into plain-language shopper statuses. */
const CONFIRMED: CustomerStatus = { label: "Confirmed", key: "confirmed", tone: "text-forest" };
const PROCESSING: CustomerStatus = {
  label: "Processing",
  key: "processing",
  tone: "text-muted-foreground",
};
const SHIPPED: CustomerStatus = { label: "Shipped", key: "shipped", tone: "text-forest" };
const DELIVERED: CustomerStatus = { label: "Delivered", key: "delivered", tone: "text-forest" };
const CANCELLED: CustomerStatus = {
  label: "Cancelled",
  key: "cancelled",
  tone: "text-destructive",
};

const CUSTOMER_STATUS: Record<string, CustomerStatus> = {
  received: CONFIRMED,
  routed: CONFIRMED,
  synced: CONFIRMED,
  sync_failed: CONFIRMED,
  unroutable: CONFIRMED,
  confirmed: CONFIRMED,
  paid: CONFIRMED,
  processing: PROCESSING,
  packed: PROCESSING,
  shipped: SHIPPED,
  in_transit: SHIPPED,
  out_for_delivery: { label: "Out for delivery", key: "outForDelivery", tone: "text-forest" },
  fulfilled: DELIVERED,
  delivered: DELIVERED,
  completed: DELIVERED,
  cancelled: CANCELLED,
  canceled: CANCELLED,
  refunded: { label: "Refunded", key: "refunded", tone: "text-destructive" },
};

export function customerStatus(raw: string): CustomerStatus {
  return CUSTOMER_STATUS[raw.trim().toLowerCase()] ?? PROCESSING;
}

/** Translated shopper status for a raw backend status. */
export function statusLabel(t: TranslateFn, raw: string) {
  const s = customerStatus(raw);
  return t(`commerce.account.status.${s.key}`, s.label);
}

const LABEL_TO_KEY: Record<string, string> = {
  Confirmed: "confirmed",
  Processing: "processing",
  Shipped: "shipped",
  "Out for delivery": "outForDelivery",
  Delivered: "delivered",
  Cancelled: "cancelled",
  Refunded: "refunded",
};

/** Translated shopper status for an English shopper label ("Shipped"). */
export function statusLabelFromLabel(t: TranslateFn, label: string) {
  return t(`commerce.account.status.${LABEL_TO_KEY[label] ?? "processing"}`, label);
}

export const CLOSED_STATUSES = [
  "delivered",
  "completed",
  "fulfilled",
  "cancelled",
  "canceled",
  "refunded",
];
