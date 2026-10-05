import { rpc, type ClientFn } from "./rpc-client";
import type * as Backend from "@backend/functions/newsletter.functions";

export const subscribeNewsletter: ClientFn<typeof Backend.subscribeNewsletter> = rpc("subscribeNewsletter");
