"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "./store-context";
import { mad } from "@/lib/format";
import { IconCart, IconFlame, IconSpark } from "@/components/ui";
import { discountOf } from "./product-card";

function Countdown() {
  const [left, setLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const mid = new Date(now);
      mid.setHours(24, 0, 0, 0);
      const diff = Math.max(0, mid.getTime() - now.getTime());
      setLeft({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const cells = [
    { v: left.h, l: "ساعة" },
    { v: left.m, l: "دقيقة" },
    { v: left.s, l: "ثانية" },
  ];

  return (
    <div className="flex items-center gap-2" dir="ltr">
      {cells.map((c, i) => (
        <div key={c.l} className="flex items-center gap-2">
          <div className="grid min-w-16 place-items-center rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 backdrop-blur-sm">
            <span className="font-display text-3xl leading-none text-saffron-300 tabular-nums">
              {String(c.v).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[10px] font-bold text-paper/55">
              {c.l}
            </span>
          </div>
          {i < cells.length - 1 && (
            <span className="font-display text-2xl text-paper/30">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function DealsSection() {
  const { products, addToCart, setQuickView } = useStore();
  const deals = useMemo(
    () => products.filter((p) => p.oldPrice && p.oldPrice > p.price),
    [products]
  );

  if (deals.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-ink py-14 lg:py-16">
      <div className="zellige-light absolute inset-0" />
      <div className="pointer-events-none absolute top-0 left-1/3 h-64 w-64 rounded-full bg-majorelle-600/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="flex items-center gap-2 text-xs font-extrabold tracking-wide text-saffron-400">
              <IconFlame className="h-4 w-4" />
              وفر أكثر — الكميات محدودة
            </span>
            <h2 className="mt-2 font-display text-4xl text-paper sm:text-5xl">
              عروض اليوم
            </h2>
            <p className="mt-2 text-sm text-paper/55">
              تخفيضات حقيقية تنتهي منتصف الليل
            </p>
          </div>
          <Countdown />
        </div>

        <div className="no-scrollbar mt-8 flex snap-x gap-4 overflow-x-auto pb-2">
          {deals.map((p) => (
            <article
              key={p.id}
              onClick={() => setQuickView(p)}
              className="group w-60 shrink-0 cursor-pointer snap-start rounded-xl border border-white/10 bg-white/[0.06] p-3 transition hover:border-saffron-400/50 hover:bg-white/[0.09]"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-ink-soft">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2.5 right-2.5 rounded-md bg-saffron-400 px-2 py-0.5 text-[11px] font-extrabold text-ink">
                  -{discountOf(p)}%
                </span>
              </div>
              <h3 className="mt-3 line-clamp-2 min-h-10 text-[13px] leading-5 font-bold text-paper">
                {p.name}
              </h3>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <span className="block text-lg font-extrabold text-saffron-300">
                    {mad(p.price)}
                  </span>
                  <span className="text-[11px] font-bold text-paper/40 line-through">
                    {p.oldPrice ? mad(p.oldPrice) : ""}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="أضف إلى السلة"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p, 1, false);
                  }}
                  className="btn-press grid h-9 w-9 place-items-center rounded-lg bg-saffron-400 text-ink transition hover:bg-saffron-300"
                >
                  <IconCart className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}

          <div className="flex w-44 shrink-0 snap-start items-center justify-center rounded-xl border border-dashed border-saffron-400/40 text-center">
            <div className="px-4">
              <IconSpark className="mx-auto h-6 w-6 text-saffron-400" />
              <p className="mt-2 text-xs leading-5 font-bold text-paper/60">
                عروض جديدة كل يوم — تابعنا!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
