/**
 * Module: Order Integration Hub — public server functions
 *
 * Purpose: the only client-callable surface for placing an order, tracking an
 * order, and for the admin integration-health view. Domain logic lives in
 * ./integrations/*.
 * Users: checkout (place order), customers (track order), operations (health screen).
 * Integration points: dispatch.server.ts -> Odoo + GoHighLevel.
 *
 * Client stub: calls the backend over HTTP; logic lives in backend/src/functions/orders.functions.ts.
 */

import { rpc, type ClientFn } from "./rpc-client";
import type * as Backend from "@backend/functions/orders.functions";

export type { TrackedOrder } from "@backend/functions/orders.functions";

export const placeOrder: ClientFn<typeof Backend.placeOrder> = rpc("placeOrder");
export const trackOrder: ClientFn<typeof Backend.trackOrder> = rpc("trackOrder");
export const getIntegrationHealth: ClientFn<typeof Backend.getIntegrationHealth> = rpc("getIntegrationHealth");
