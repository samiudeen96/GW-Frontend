/** Shipment-tracking helpers shared by the account and track-order pages. */
import type { OrderTracking } from "@/lib/api/types";

export type TrackingStageKey = "confirmed" | "shipped" | "delivered";
export type TrackingStage = {
  key: TrackingStageKey;
  label: string;
  done: boolean;
  at: string | null;
};

const CARRIERS: Record<string, { label: string; url?: (n: string) => string }> = {
  dhl: {
    label: "DHL Express",
    url: (n) => `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${n}`,
  },
  aramex: {
    label: "Aramex",
    url: (n) => `https://www.aramex.com/track/results?ShipmentNumber=${n}`,
  },
  fedex: { label: "FedEx", url: (n) => `https://www.fedex.com/fedextrack/?trknbr=${n}` },
  ups: { label: "UPS", url: (n) => `https://www.ups.com/track?tracknum=${n}` },
};

const STATUS_RANK: Record<string, number> = { shipped: 1, delivered: 2 };

export function trackingStages(tracking: OrderTracking, status: string): TrackingStage[] {
  const rank = STATUS_RANK[status.toLowerCase()] ?? 0;
  return [
    { key: "confirmed", label: "Confirmed", done: true, at: tracking.confirmedAt },
    {
      key: "shipped",
      label: "Shipped",
      done: rank >= 1 || !!tracking.shippedAt,
      at: tracking.shippedAt,
    },
    {
      key: "delivered",
      label: "Delivered",
      done: rank >= 2 || !!tracking.deliveredAt,
      at: tracking.deliveredAt,
    },
  ];
}

export function hasTracking(tracking: OrderTracking): boolean {
  return !!(tracking.trackingNumber || tracking.trackingUrl);
}

export function trackingLink(tracking: OrderTracking): string | null {
  if (tracking.trackingUrl) return tracking.trackingUrl;
  const carrier = tracking.trackingCarrier?.toLowerCase();
  const number = tracking.trackingNumber;
  if (!carrier || !number) return null;
  return CARRIERS[carrier]?.url?.(encodeURIComponent(number)) ?? null;
}

export function carrierLabel(carrier: string | null, fallback: string): string {
  if (!carrier) return fallback;
  return CARRIERS[carrier.toLowerCase()]?.label ?? carrier;
}
