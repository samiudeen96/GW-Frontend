/**
 * Product authenticity verification (Odoo).
 *
 * Purpose: server-side proxy to the Odoo `/secret_codes/verify` endpoint so the
 * browser never talks to the ERP directly (no CORS, no credential exposure).
 * Users: end customers on /verify.
 * Integration point: Odoo production base https://ghoritrd.odoo.com/
 *
 * Client stub: calls the backend over HTTP; logic lives in backend/src/functions/verify.functions.ts.
 */

import { rpc, type ClientFn } from "./rpc-client";
import type * as Backend from "@backend/functions/verify.functions";

export type { VerifyResult } from "@backend/functions/verify.functions";

export const verifySecretCode: ClientFn<typeof Backend.verifySecretCode> = rpc("verifySecretCode");
