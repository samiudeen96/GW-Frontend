/**
 * Module: Admin console server functions.
 *
 * Purpose: authorise staff accounts against public.user_roles and return
 * read-only operational data for the restricted /admin console.
 * Users: Green Wealth owners / admins.
 * Integration points: Supabase (roles, orders, products, reviews).
 *
 * Client stub: calls the backend over HTTP; logic lives in backend/src/functions/admin.functions.ts.
 */

import { rpc, type ClientFn } from "./rpc-client";
import type * as Backend from "@backend/functions/admin.functions";

export const getAdminAccess: ClientFn<typeof Backend.getAdminAccess> = rpc("getAdminAccess");
export const getAdminOverview: ClientFn<typeof Backend.getAdminOverview> = rpc("getAdminOverview");
export const getMirroredStore: ClientFn<typeof Backend.getMirroredStore> = rpc("getMirroredStore");
export const resyncMirroredStore: ClientFn<typeof Backend.resyncMirroredStore> = rpc("resyncMirroredStore");
export const setOrderTracking: ClientFn<typeof Backend.setOrderTracking> = rpc("setOrderTracking");
export const sendEmailTemplatePreviews: ClientFn<typeof Backend.sendEmailTemplatePreviews> = rpc("sendEmailTemplatePreviews");
