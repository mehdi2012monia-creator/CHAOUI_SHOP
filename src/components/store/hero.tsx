"use client";

import { useStore } from "./store-context";
import { mad } from "@/lib/format";
import { IconCheck, IconFlame, IconTruck } from "@/components/ui";

const PERKS = ["الدفع عند الاستلام", "توصيل 24–48 ساعة", "إرجاع خلال 7 أيام"];

export function Hero() {
  const { products, setCategory, scrollToProducts, addToCart } = useStore();
  const deal =
    products.find((p) => p.featured && p.oldPrice) ?? products[0] ?? null;

  return (
    <section className="relative overflow-hidden">
      <div className="zellige absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-saffron-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-majorelle-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div>
          <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-1.5 text-xs font-extrabold text-ink/70 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-saffron-500" />
            متجر مغربي 100% — نوصلو لجميع المدن
          </span>

          <h1
            className="animate-rise mt-5 font-display text-[52px] leading-[1.04] sm:text-6xl lg:text-[76px]"
            style={{ animationDelay: "80ms" }}
          >
            دارك تستاهل{" "}
            <span className="relative inline-block text-majorelle-600">
              الأحسن
              <svg
                viewBox="0 0 120 14"
                className="absolute -bottom-1.5 right-0 w-full text-saffron-400"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 10C25 4 60 3 117 7"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p
            className="animate-rise mt-5 max-w-xl text-lg leading-8 text-ink/65"
            style={{ animationDelay: "160ms" }}
          >
            تجهيزات المنزل، المطبخ، وأحدث الإلكترونينيات بأثمنة مناسبة وجودة
            مضمونة. اختار منتجاتك، وخلص غير ملي يوصلك الطلب لباب الدار.
          </p>

          <div
            className="animate-rise mt-8 flex flex-wrap items-center gap-3.5"
            style={{ animationDelay: "240ms" }}
          >
            <button
              type="button"
              onClick={scrollToProducts}
              className="btn-press rounded-lg bg-majorelle-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-majorelle-600/30 transition hover:bg-majorelle-700"
            >
              تسوق الآن
            </button>
            <button
              type="button"
              onClick={() => {
                setCategory("عروض خاصة");
                scrollToProducts();
              }}
              className="btn-press flex items-center gap-2 rounded-lg border-2 border-ink/15 bg-white px-6 py-3 text-sm font-extrabold text-ink transition hover:border-saffron-500 hover:text-saffron-600"
            >
              <IconFlame className="h-4 w-4 text-saffron-500" />
              عروض اليوم
            </button>
          </div>

          <ul
            className="animate-rise mt-9 flex flex-wrap gap-x-7 gap-y-2.5"
            style={{ animationDelay: "320ms" }}
          >
            {PERKS.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 text-[13px] font-bold text-ink/70"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-saffron-100 text-saffron-600">
                  <IconCheck className="h-3 w-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* الجهة البصرية: قوس مغربي */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="arch absolute -inset-3 translate-x-4 translate-y-4 border-2 border-saffron-400/70" />
          <div className="arch relative aspect-[4/5] overflow-hidden border-[7px] border-white bg-paper-soft shadow-2xl shadow-ink/25">
            <img
              src="https://images.pexels.com/photos/38147593/pexels-photo-38147593.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
              alt="صالون مغربي عصري"
              className="h-full w-full object-cover"
            />
          </div>

          {deal && (
            <button
              type="button"
              onClick={() => addToCart(deal, 1, true)}
              className="animate-float absolute -right-3 top-16 flex items-center gap-3 rounded-xl bg-white p-3 pr-3 text-right shadow-xl shadow-ink/15 transition hover:scale-105 sm:-right-8"
            >
              <img
                src={deal.image}
                alt={deal.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <span>
                <span className="block max-w-[130px] truncate text-xs font-extrabold">
                  {deal.name}
                </span>
                <span className="mt-0.5 block text-sm font-extrabold text-majorelle-600">
                  {mad(deal.price)}
                  {deal.oldPrice && (
                    <span className="ms-1.5 text-[11px] font-bold text-ink/35 line-through">
                      {mad(deal.oldPrice)}
                    </span>
                  )}
                </span>
              </span>
            </button>
          )}

          <div className="animate-float-slow absolute -left-2 bottom-10 flex items-center gap-3 rounded-xl bg-ink px-4 py-3 text-paper shadow-xl sm:-left-6">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-saffron-400 text-ink">
              <IconTruck className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-extrabold">توصيل مجاني</span>
              <span className="block text-[11px] text-paper/60">
                للطلبات فوق 500 د.م
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
