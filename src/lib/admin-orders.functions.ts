/**
 * Module: Order management server functions (typed RPC boundary)
 *
 * Purpose: expose the staff-only order desk operations to the /admin client —
 * list, detail, KPI, lifecycle, notes, tracking, email and ERP retry, export.
 * Users: Green Wealth owners / admins.
 * Integration points: src/lib/admin-orders.server.ts, Lovable Cloud auth.
 *
 * Client stub: calls the backend over HTTP; logic lives in backend/src/functions/admin-orders.functions.ts.
 */

import { rpc, type ClientFn } from "./rpc-client";
import type * as Backend from "@backend/functions/admin-orders.functions";

export const adminListOrders: ClientFn<typeof Backend.adminListOrders> = rpc("adminListOrders");
export const adminOrderMetrics: ClientFn<typeof Backend.adminOrderMetrics> = rpc("adminOrderMetrics");
export const adminOrderDetail: ClientFn<typeof Backend.adminOrderDetail> = rpc("adminOrderDetail");
export const adminUpdateOrderStatus: ClientFn<typeof Backend.adminUpdateOrderStatus> = rpc("adminUpdateOrderStatus");
export const adminAddOrderNote: ClientFn<typeof Backend.adminAddOrderNote> = rpc("adminAddOrderNote");
export const adminSetTracking: ClientFn<typeof Backend.adminSetTracking> = rpc("adminSetTracking");
export const adminResendConfirmation: ClientFn<typeof Backend.adminResendConfirmation> = rpc("adminResendConfirmation");
export const adminRetryPush: ClientFn<typeof Backend.adminRetryPush> = rpc("adminRetryPush");
export const adminExportOrdersCsv: ClientFn<typeof Backend.adminExportOrdersCsv> = rpc("adminExportOrdersCsv");
