/**
 * Module: Customer Account — server functions
 *
 * Purpose: authenticated, email-scoped read of a shopper's own order history
 * (both native orders and mirrored legacy greenwealth.com orders), derived
 * address book and lifetime stats.
 * Users: signed-in customers on /account.
 * Integration points: orders + order_items (native), gw_orders (mirror).
 *
 * Client stub: calls the backend over HTTP; logic lives in backend/src/functions/account.functions.ts.
 */

import { rpc, type ClientFn } from "./rpc-client";
import type * as Backend from "@backend/functions/account.functions";

export type { AccountAddress, AccountOrderItem, AccountOrder, AccountOverview } from "@backend/functions/account.functions";

export const getMyAccount: ClientFn<typeof Backend.getMyAccount> = rpc("getMyAccount");
