/**
 * Product-page client state shared between the PDP islands: the selected
 * quantity (buy box, sticky bar, compact CTA) and the product open in the
 * quick-view modal.
 */
import { atom } from "nanostores";

export const $pdpQty = atom(1);

export const $quickViewSlug = atom<string | null>(null);

export function setPdpQty(qty: number) {
  $pdpQty.set(Math.max(1, qty));
}

/** Window event that asks the gallery to show a figure (detail: image index). */
export const GALLERY_FIGURE_EVENT = "pdp:figure";
