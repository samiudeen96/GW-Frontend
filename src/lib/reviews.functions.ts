import { rpc, type ClientFn } from "./rpc-client";
import type * as Backend from "@backend/functions/reviews.functions";

export const submitReview: ClientFn<typeof Backend.submitReview> = rpc("submitReview");
