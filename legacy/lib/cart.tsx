import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct, formatPrice } from "./products";

type CartItem = { slug: string; qty: number };
type CartCtx = {
  items: CartItem[];
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  count: number;
  subtotal: number;
  subtotalLabel: string;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "gw_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const add = useCallback((slug: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) return prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { slug, qty }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, qty } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const i of items) {
      const p = getProduct(i.slug);
      if (!p) continue;
      count += i.qty;
      subtotal += p.price * i.qty;
    }
    return { count, subtotal };
  }, [items]);

  const value: CartCtx = {
    items,
    add,
    remove,
    setQty,
    clear,
    open,
    setOpen,
    count,
    subtotal,
    subtotalLabel: formatPrice(subtotal),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const noopCart: CartCtx = {
  items: [],
  add: () => {},
  remove: () => {},
  setQty: () => {},
  clear: () => {},
  open: false,
  setOpen: () => {},
  count: 0,
  subtotal: 0,
  subtotalLabel: formatPrice(0),
};

export function useCart() {
  const c = useContext(Ctx);
  return c ?? noopCart;
}
