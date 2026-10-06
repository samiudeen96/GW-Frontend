/**
 * Frontend contracts for backend responses. Derived from how the pages use the
 * data; align with the OpenAPI spec when the backend is connected.
 */

export type VerifyStatus = "verified" | "invalid" | "limit" | "error";

export type VerifyResult = {
  status: VerifyStatus;
  message: string;
  product?: string;
  batch?: string;
  publicCode?: string;
  checks?: number;
  /** WhatsApp support deep link for unverified results. */
  whatsapp?: string;
};

export type OrderTracking = {
  trackingCarrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
};

export type OrderItem = {
  slug: string;
  name: string;
  qty: number;
  unitPriceCents: number;
};

export type OrderAddress = {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  zip?: string;
  country: string;
};

export type TrackedOrder = {
  orderNumber: string;
  customerName: string;
  status: string;
  paymentMethod: string;
  paymentStatus?: string;
  currency: string;
  itemsTotalCents: number;
  shippingTotalCents: number;
  grandTotalCents: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: OrderAddress | null;
  tracking: OrderTracking;
  routedTargetCode?: string | null;
  source?: string;
};

export type ActionResult<T = undefined> =
  ({ ok: true } & (T extends undefined ? object : { data: T })) | { ok: false; error: string };
