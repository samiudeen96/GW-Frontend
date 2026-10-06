/**
 * Product reviews (browser).
 * TODO(api): POST {PUBLIC_API_URL}/reviews to submit, GET /products/:slug/reviews
 * for approved reviews. Until then the PDP lists the local seed reviews.
 */
import type { ActionResult } from "./types";

/** A customer review as the backend will return it (approved reviews only). */
export type ProductReview = {
  id: string;
  productSlug: string;
  author: string;
  country: string | null;
  rating: number;
  title: string;
  body: string;
  helpful: number;
  createdAt: string;
};

export type ReviewSubmission = {
  productSlug: string;
  author: string;
  country: string | null;
  rating: number;
  title: string;
  body: string;
};

export async function submitReview(_input: ReviewSubmission): Promise<ActionResult> {
  return { ok: false, error: "Review submission is not connected yet." };
}
