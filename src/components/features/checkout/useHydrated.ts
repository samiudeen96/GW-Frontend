/**
 * `false` on the server and during hydration, `true` afterwards. Cart islands
 * read the cart from localStorage, so they render a neutral placeholder until
 * hydrated to keep the server HTML and first client render identical.
 */
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
