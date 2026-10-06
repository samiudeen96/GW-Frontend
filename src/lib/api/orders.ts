/**
 * Orders (browser).
 * TODO(api): POST {PUBLIC_API_URL}/orders and GET {PUBLIC_API_URL}/orders/track.
 */
import type { ActionResult, OrderAddress, TrackedOrder } from "./types";

export type PlaceOrderInput = {
  items: { slug: string; qty: number }[];
  currency: string;
  customer: { name: string; email: string; phone: string };
  shippingAddress: OrderAddress;
  paymentMethod: string;
  notes?: string;
};

export type PlaceOrderResult = { orderNumber: string };

export async function placeOrder(_input: PlaceOrderInput): Promise<ActionResult<PlaceOrderResult>> {
  return {
    ok: false,
    error: "Ordering is not connected yet. Please contact us on WhatsApp to order.",
  };
}

/** Look up an order by number plus the email or phone used at checkout. */
export async function trackOrder(_input: {
  orderNumber: string;
  email?: string;
  phone?: string;
}): Promise<ActionResult<TrackedOrder>> {
  return { ok: false, error: "Order tracking is not connected yet. Please contact support." };
}
