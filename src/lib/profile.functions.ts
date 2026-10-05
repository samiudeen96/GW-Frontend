/**
 * Module: Customer profile — server functions
 *
 * Purpose: authenticated avatar upload for the customer portal.
 * Users: signed-in customers on /account.
 * Integration points: src/lib/profile.server.ts, Lovable Cloud storage.
 *
 * Client stub: calls the backend over HTTP; logic lives in backend/src/functions/profile.functions.ts.
 */

import { rpc, type ClientFn } from "./rpc-client";
import type * as Backend from "@backend/functions/profile.functions";

export const uploadMyAvatar: ClientFn<typeof Backend.uploadMyAvatar> = rpc("uploadMyAvatar");
