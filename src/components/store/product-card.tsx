"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/db/schema";
import { mad } from "@/lib/format";
import { useStore } from "./store-context";
import {
  IconCart,
  IconCheck,
  IconStar,
  IconX,
  QtyStepper,
} from "@/components/ui";

export function discountOf(p: Product): number | null {
  if (!p.oldPrice || p.oldPrice <= p.price) return null;
  return Math.round((1 - p.price / p.oldPrice) * 100);
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, setQuickView } = useStore();
  const disc = discountOf(product);
  const out = product.stock <= 0;

  return (
    <article
      onClick={() => setQuickView(product)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-ink/10 bg-white transition duration-300 hover:-translate-y-1.5 hover:border-ink/20 hover:shadow-[0_18px_40px_-14px_rgba(14,23,38,0.3)]"
    >
      <div className="relative aspect-square overflow-hidden bg-paper-soft">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {disc !== null && (
          <span className="absolute top-3 right-3 rounded-md bg-saffron-400 px-2 py-1 text-[11px] font-extrabold text-ink shadow-sm">
            -{disc}%
          </span>
        )}
        {out && (
          <div className="absolute inset-0 grid place-items-center bg-ink/55 backdrop-blur-[2px]">
            <span className="rounded-md bg-white px-3 py-1.5 text-xs font-extrabold text-ink">
              نفذ المخزون
            </span>
          </div>
        )}
        {!out && (
          <button
            type="button"
            aria-label="أضف إلى السلة"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1, false);
            }}
            className="btn-press absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-ink text-paper shadow-lg transition duration-300 hover:bg-majorelle-600 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
          >
            <IconCart className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      <div className="p-3.5 sm:p-4">
        <span className="text-[11px] font-extrabold text-majorelle-600/80">
          {product.category}
        </span>
        <h3 className="mt-1 line-clamp-2 min-h-11 text-sm leading-[1.55] font-bold">
          <a
            href={`/produit/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="transition hover:text-majorelle-600"
          >
            {product.name}
          </a>
        </h3>
        <div className="mt-2.5 flex items-end justify-between gap-2">
          <div>
            <span className="text-[17px] font-extrabold text-ink">
              {mad(product.price)}
            </span>
            {product.oldPrice && (
              <span className="ms-2 text-xs font-bold text-ink/35 line-through">
                {mad(product.oldPrice)}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 rounded-md bg-saffron-100 px-1.5 py-0.5 text-[11px] font-extrabold text-saffron-600">
            <IconStar className="h-3 w-3" />
            4.{(product.id % 3) + 6}
          </span>
        </div>
      </div>
    </article>
  );
}

/* --------------------------- نظرة سريعة --------------------------- */

export function QuickView() {
  const { quickView, setQuickView, addToCart } = useStore();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [quickView]);

  if (!quickView) return null;
  const p = quickView;
  const disc = discountOf(p);
  const out = p.stock <= 0;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-ink/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) setQuickView(null);
      }}
    >
      <div className="animate-rise relative grid w-full max-w-3xl overflow-hidden rounded-xl bg-paper shadow-2xl md:grid-cols-2">
        <button
          type="button"
          aria-label="إغلاق"
          onClick={() => setQuickView(null)}
          className="absolute top-3 left-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow-md transition hover:bg-white"
        >
          <IconX className="h-4.5 w-4.5" />
        </button>

        <div className="relative aspect-square bg-paper-soft md:aspect-auto md:min-h-[460px]">
          <img
            src={p.image}
            alt={p.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {disc !== null && (
            <span className="absolute top-4 right-4 rounded-md bg-saffron-400 px-2.5 py-1 text-xs font-extrabold text-ink shadow">
              خصم {disc}%
            </span>
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-7">
          <span className="text-xs font-extrabold text-majorelle-600">
            {p.category}
          </span>
          <h2 className="mt-1.5 text-2xl leading-9 font-extrabold">{p.name}</h2>

          <div className="mt-2 flex items-center gap-1 text-saffron-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <IconStar key={i} className="h-4 w-4" />
            ))}
            <span className="ms-1 text-xs font-bold text-ink/50">
              ({18 + (p.id % 40)} تقييم)
            </span>
          </div>

          <p className="mt-3.5 text-sm leading-7 text-ink/65">{p.description}</p>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-extrabold text-majorelle-700">
              {mad(p.price)}
            </span>
            {p.oldPrice && (
              <span className="pb-1 text-sm font-bold text-ink/35 line-through">
                {mad(p.oldPrice)}
              </span>
            )}
          </div>

          <p
            className={`mt-1.5 text-xs font-bold ${
              out ? "text-danger" : "text-mint-600"
            }`}
          >
            {out
              ? "نفذ المخزون حالياً"
              : p.stock <= 5
                ? `بقيت ${p.stock} قطع فقط — أسرع!`
                : "متوفر في المخزون"}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <QtyStepper
              qty={qty}
              onChange={(q) => setQty(Math.max(1, Math.min(q, p.stock)))}
              max={p.stock}
            />
            <button
              type="button"
              disabled={out}
              onClick={() => {
                addToCart(p, qty, true);
                setQuickView(null);
              }}
              className="btn-press flex flex-1 items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-extrabold text-paper transition hover:bg-majorelle-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconCart className="h-4.5 w-4.5" />
              أضف إلى السلة
            </button>
          </div>

          <ul className="mt-6 grid gap-2 border-t border-ink/10 pt-4 text-xs font-bold text-ink/60">
            <li className="flex items-center gap-2">
              <IconCheck className="h-3.5 w-3.5 text-mint-600" />
              الدفع عند الاستلام — خلّص غير ملي توصلك السلعة
            </li>
            <li className="flex items-center gap-2">
              <IconCheck className="h-3.5 w-3.5 text-mint-600" />
              توصيل سريع لجميع المدن خلال 24 إلى 48 ساعة
            </li>
            <li className="flex items-center gap-2">
              <IconCheck className="h-3.5 w-3.5 text-mint-600" />
              إرجاع مجاني خلال 7 أيام إذا ما عجبكش المنتج
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
