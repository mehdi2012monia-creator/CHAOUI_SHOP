"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/db/schema";
import { IconCart, QtyStepper } from "@/components/ui";

const CART_KEY = "mehdishop-cart-v1";

type Line = { productId: number; qty: number };

export function ProductPageActions({ product }: { product: Product }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const out = product.stock <= 0;

  const add = (goToCart: boolean) => {
    let lines: Line[] = [];
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) lines = JSON.parse(raw) as Line[];
    } catch {
      lines = [];
    }
    const existing = lines.find((l) => l.productId === product.id);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock);
    } else {
      lines.push({ productId: product.id, qty: Math.min(qty, product.stock) });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
    router.push(goToCart ? "/?cart=1" : "/#products");
  };

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <QtyStepper
        qty={qty}
        onChange={(q) => setQty(Math.max(1, Math.min(q, product.stock)))}
        max={Math.max(product.stock, 1)}
      />
      <button
        type="button"
        disabled={out}
        onClick={() => add(true)}
        className="btn-press flex flex-1 items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3.5 text-sm font-extrabold text-paper transition hover:bg-majorelle-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <IconCart className="h-4.5 w-4.5" />
        أضف إلى السلة واطلب الآن
      </button>
    </div>
  );
}
