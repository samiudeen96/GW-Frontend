import { reviews, type Review } from "@/data/reviews";

/**
 * Up to `n` reviews for a product, preferring ones with a result photo. Falls
 * back to text-only reviews while the photos are unavailable.
 */
export function featuredReviews(product: Review["product"] = "Neo Hair Lotion", n = 3): Review[] {
  const forProduct = reviews.filter((r) => r.product === product);
  const withPhoto = forProduct.filter((r) => r.image);
  return (withPhoto.length ? withPhoto : forProduct).slice(0, n);
}

/** A broad set for carousels, preferring reviews with photos. */
export function carouselReviews(n = 8): Review[] {
  const withPhoto = reviews.filter((r) => r.image);
  return (withPhoto.length ? withPhoto : reviews).slice(0, n);
}
