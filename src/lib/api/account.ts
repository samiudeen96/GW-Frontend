/**
 * Customer account (browser): session, order history, address book and
 * password management. The backend owns sessions and account data.
 * TODO(api): wire to the backend account endpoints. Until then every visitor is
 * treated as signed out and the actions return a "not connected" error.
 */
import type { ActionResult, OrderAddress, OrderTracking } from "./types";

export type SessionUser = { id: string; email: string | null };

export type AccountSession = { signedIn: false } | { signedIn: true; user: SessionUser };

export type AccountOrderItem = {
  slug?: string;
  name: string;
  quantity: number;
  unitPriceCents?: number;
  lineTotalCents: number;
};

/** Shipping address as recorded on an order (fields may be missing on archive orders). */
export type AccountOrderAddress = Partial<OrderAddress> & {
  name?: string;
  phone?: string;
};

export type AccountOrder = {
  id: string;
  orderNumber: string;
  /** Raw backend/ERP status; mapped to a shopper-facing label in the UI. */
  status: string;
  /** "legacy" marks orders mirrored from the old greenwealth.com store. */
  source?: "native" | "legacy";
  createdAt: string;
  currency: string;
  itemsTotalCents: number;
  shippingTotalCents: number;
  grandTotalCents: number;
  paymentMethod: string | null;
  paymentStatus: string | null;
  items: AccountOrderItem[];
  shippingAddress: AccountOrderAddress;
  tracking: OrderTracking;
};

/** Address-book entry derived from the shipping addresses on past orders. */
export type AccountAddress = OrderAddress & {
  id: string;
  name: string;
  phone?: string;
  usedCount: number;
  lastUsedAt: string | null;
};

export type AccountStats = {
  orderCount: number;
  lifetimeByCurrency: { currency: string; totalCents: number }[];
  firstOrderAt: string | null;
  lastOrderAt: string | null;
};

export type AccountOverview = {
  orders: AccountOrder[];
  addresses: AccountAddress[];
  stats: AccountStats;
};

const NOT_CONNECTED = { ok: false as const, error: "Customer accounts are not connected yet." };

/** TODO(api): GET /auth/session. */
export async function getAccountSession(): Promise<AccountSession> {
  return { signedIn: false };
}

/** TODO(api): GET /account (orders, derived addresses, lifetime stats). */
export async function getMyAccount(): Promise<ActionResult<AccountOverview>> {
  return NOT_CONNECTED;
}

/** Set or replace the signed-in customer's password. TODO(api): POST /account/password. */
export async function setAccountPassword(_input: { password: string }): Promise<ActionResult> {
  return { ok: false, error: "Password sign-in is not connected yet." };
}

/** Email a password-reset link. TODO(api): POST /auth/password-reset. */
export async function requestPasswordReset(_input: { email: string }): Promise<ActionResult> {
  return {
    ok: false,
    error: "Password reset is not connected yet. Please sign in with an emailed OTP.",
  };
}
