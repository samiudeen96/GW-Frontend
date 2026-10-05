/**
 * Module: Email — client-callable server functions
 *
 * Purpose: the only browser-reachable email surface. Recipients and templates
 * are fixed server-side; the browser can never choose either.
 * Users: contact page.
 * Integration points: ./email.server.ts (Resend via connector gateway).
 *
 * Client stub: calls the backend over HTTP; logic lives in backend/src/functions/email.functions.ts.
 */

import { rpc, type ClientFn } from "./rpc-client";
import type * as Backend from "@backend/functions/email.functions";

export const sendContactMessage: ClientFn<typeof Backend.sendContactMessage> = rpc("sendContactMessage");
