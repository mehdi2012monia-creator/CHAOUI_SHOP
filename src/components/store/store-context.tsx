"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/db/schema";

export type CartLine = { productId: number; qty: number };
export type CheckoutStep = "cart" | "form" | "done";
type Toast = { id: number; msg: string };

type StoreCtx = {
  products: Product[];
  categories: string[];
  shippingFee: number;
  freeThreshold: number;
  cart: CartLine[];
  lines: (CartLine & { product: Product })[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  cartOpen: boolean;
  setCartOpen: (b: boolean) => void;
  step: CheckoutStep;
  setStep: (s: CheckoutStep) => void;
  lastOrder: { ref: string; total: number } | null;
  addToCart: (p: Product, qty?: number, openDrawer?: boolean) => void;
  setQty: (id: number, qty: number) => void;
  removeLine: (id: number) => void;
  clearCart: () => void;
  search: string;
  setSearch: (s: string) => void;
  category: string;
  setCategory: (c: string) => void;
  quickView: Product | null;
  setQuickView: (p: Product | null) => void;
  toasts: Toast[];
  toast: (msg: string) => void;
  scrollToProducts: () => void;
};

const Ctx = createContext<StoreCtx | null>(null);

const CART_KEY = "mehdishop-cart-v1";

export function StoreProvider({
  products,
  categories,
  shippingFee,
  freeThreshold,
  children,
}: {
  products: Product[];
  categories: string[];
  shippingFee: number;
  freeThreshold: number;
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [lastOrder, setLastOrder] = useState<{
    ref: string;
    total: number;
  } | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setCart(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    // فتح السلة تلقائياً عند العودة من صفحة منتج (/?cart=1)
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("cart") === "1") {
        setStep("cart");
        setCartOpen(true);
        window.history.replaceState({}, "", window.location.pathname);
      }
      const q = params.get("q");
      if (q) setSearch(q);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  useEffect(() => {
    document.body.style.overflow = cartOpen || quickView ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, quickView]);

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const addToCart = useCallback(
    (p: Product, qty = 1, openDrawer = false) => {
      let capped = false;
      setCart((prev) => {
        const existing = prev.find((l) => l.productId === p.id);
        const current = existing?.qty ?? 0;
        const next = Math.min(current + qty, Math.max(p.stock, 1));
        capped = next === current;
        if (existing) {
          return prev.map((l) =>
            l.productId === p.id ? { ...l, qty: next } : l
          );
        }
        return [...prev, { productId: p.id, qty: Math.min(qty, p.stock) }];
      });
      if (capped) toast("وصلت للكمية القصوى المتوفرة في المخزون");
      else toast(`تمت إضافة «${p.name}» إلى السلة`);
      if (openDrawer) {
        setStep("cart");
        setCartOpen(true);
      }
    },
    [toast]
  );

  const setQty = useCallback((id: number, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.productId !== id)
        : prev.map((l) => (l.productId === id ? { ...l, qty } : l))
    );
  }, []);

  const removeLine = useCallback(
    (id: number) => setCart((prev) => prev.filter((l) => l.productId !== id)),
    []
  );

  const clearCart = useCallback(() => setCart([]), []);

  const lines = useMemo(
    () =>
      cart
        .map((l) => {
          const product = products.find((p) => p.id === l.productId);
          return product ? { ...l, product } : null;
        })
        .filter((x): x is CartLine & { product: Product } => x !== null),
    [cart, products]
  );

  const cartCount = useMemo(
    () => lines.reduce((s, l) => s + l.qty, 0),
    [lines]
  );
  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.product.price * l.qty, 0),
    [lines]
  );
  const shipping =
    subtotal === 0 || subtotal >= freeThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  const scrollToProducts = useCallback(() => {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const value: StoreCtx = {
    products,
    categories,
    shippingFee,
    freeThreshold,
    cart,
    lines,
    cartCount,
    subtotal,
    shipping,
    total,
    cartOpen,
    setCartOpen,
    step,
    setStep,
    lastOrder,
    addToCart,
    setQty,
    removeLine,
    clearCart,
    search,
    setSearch,
    category,
    setCategory,
    quickView,
    setQuickView,
    toasts,
    toast,
    scrollToProducts,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-6 left-4 z-[70] flex flex-col gap-2 sm:left-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-rise pointer-events-auto flex items-center gap-2.5 rounded-lg bg-ink py-3 pr-3.5 pl-4 text-sm font-bold text-paper shadow-xl"
        >
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint-600 text-white">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
