/**
 * Module: Auth — client-callable server functions
 *
 * Purpose: issue Green Wealth one-time passwords (OTP) by email. A 6-digit
 * Green Wealth code is minted server-side and mapped to the provider's own
 * one-time token, so shoppers always type exactly 6 digits regardless of the
 * provider's code length.
 * Users: /account sign in, checkout contact step.
 * Integration points: Lovable Cloud auth admin API, public.auth_otp_codes,
 * ./email.server.ts (Resend).
 *
 * Client stub: calls the backend over HTTP; logic lives in backend/src/functions/auth.functions.ts.
 */

import { rpc, type ClientFn } from "./rpc-client";
import type * as Backend from "@backend/functions/auth.functions";

export const requestEmailOtp: ClientFn<typeof Backend.requestEmailOtp> = rpc("requestEmailOtp");
export const exchangeEmailOtp: ClientFn<typeof Backend.exchangeEmailOtp> = rpc("exchangeEmailOtp");
