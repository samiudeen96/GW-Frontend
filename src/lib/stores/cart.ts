/**
 * Cart store shared by every island (header button, drawer, product page, cart
 * page, checkout). Persisted to localStorage; loaded after hydration so server
 * and first client render match.
 */
import { atom, computed, onMount } from "nanostores";

export type CartItem = { slug: string; qty: number };

const STORAGE_KEY = "gw_cart_v1";

export const $cartItems = atom<CartItem[]>([]);
export const $cartOpen = atom(false);
export const $cartCount = computed($cartItems, (items) => items.reduce((n, i) => n + i.qty, 0));

function read(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter(
          (i): i is CartItem => typeof i?.slug === "string" && Number.isFinite(i?.qty) && i.qty > 0,
        )
      : [];
  } catch {
    return [];
  }
}

onMount($cartItems, () => {
  $cartItems.set(read());
  const unlisten = $cartItems.listen((items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  });
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) $cartItems.set(read());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    unlisten();
    window.removeEventListener("storage", onStorage);
  };
});

export function addToCart(slug: string, qty = 1, { open = true } = {}) {
  const items = $cartItems.get();
  const existing = items.find((i) => i.slug === slug);
  $cartItems.set(
    existing
      ? items.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i))
      : [...items, { slug, qty }],
  );
  if (open) $cartOpen.set(true);
}

export function setCartQty(slug: string, qty: number) {
  const items = $cartItems.get();
  $cartItems.set(
    qty <= 0
      ? items.filter((i) => i.slug !== slug)
      : items.map((i) => (i.slug === slug ? { ...i, qty } : i)),
  );
}

export function removeFromCart(slug: string) {
  $cartItems.set($cartItems.get().filter((i) => i.slug !== slug));
}

export function clearCart() {
  $cartItems.set([]);
}
