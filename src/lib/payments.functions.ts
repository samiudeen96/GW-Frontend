/**
 * Module: Payments — public server functions (Moyasar / SAR)
 *
 * Purpose: start a hosted Moyasar payment for SAR orders and confirm the result
 * after the customer returns from the hosted page. The order is only recorded and
 * pushed to the ERP once Moyasar reports the invoice as paid.
 * Users: checkout, payment return page.
 * Integration points: Moyasar Invoice API, payment_intents table, dispatch.server.ts.
 *
 * Client stub: calls the backend over HTTP; logic lives in backend/src/functions/payments.functions.ts.
 */

import { rpc, type ClientFn } from "./rpc-client";
import type * as Backend from "@backend/functions/payments.functions";

export type { StartPaymentResult, ConfirmPaymentResult } from "@backend/functions/payments.functions";

export const startSarPayment: ClientFn<typeof Backend.startSarPayment> = rpc("startSarPayment");
export const confirmSarPayment: ClientFn<typeof Backend.confirmSarPayment> = rpc("confirmSarPayment");
