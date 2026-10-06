/**
 * Payments (browser). SAR card / mada payments go through Moyasar's hosted
 * payment page: `startSarPayment` creates the order + invoice and returns the
 * hosted page URL; `confirmSarPayment` verifies the invoice when the shopper
 * lands back on `/payment/callback/:intent`.
 *
 * TODO(api): POST {PUBLIC_API_URL}/payments/sar/start and
 * POST {PUBLIC_API_URL}/payments/sar/confirm.
 */
import type { ActionResult, OrderAddress } from "./types";

/** Canonical checkout order payload (integer minor units). */
export type CheckoutOrder = {
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  countryCode: string;
  currency: string;
  shippingTotalCents: number;
  paymentMethod: "card" | "cod" | "pay_on_site";
  couponCode: string | null;
  codFeeCents: number;
  shippingAddress: OrderAddress;
  items: {
    productSlug: string;
    name: string;
    quantity: number;
    unitPriceCents: number;
  }[];
};

export type StartPaymentResult = { redirectUrl: string };

export type PaymentStatus = "paid" | "pending" | "failed" | "unknown";

export type ConfirmPaymentResult = {
  status: PaymentStatus;
  orderNumber: string | null;
  amountCents: number | null;
  currency: string;
  message: string;
};

export async function startSarPayment(_input: {
  order: CheckoutOrder;
  /** Site origin the provider redirects back to (`{origin}/payment/callback/:intent`). */
  origin: string;
}): Promise<ActionResult<StartPaymentResult>> {
  return {
    ok: false,
    error: "Online card payment is not connected yet. Please contact us on WhatsApp to order.",
  };
}

export async function confirmSarPayment(_input: {
  intentId: string;
}): Promise<ActionResult<ConfirmPaymentResult>> {
  return { ok: false, error: "Payment confirmation is not connected yet." };
}
