"use client";

import { useStore } from "./store-context";
import {
  IconCart,
  IconFlame,
  IconSearch,
  IconSpark,
  SecretLogo,
} from "@/components/ui";

const TICKER = [
  "الدفع عند الاستلام متاح في جميع المدن",
  "توصيل مجاني للطلبات فوق 500 د.م",
  "توصيل سريع خلال 24 إلى 48 ساعة",
  "ضمان سنة كاملة على الإلكترونيات",
  "إرجاع مجاني خلال 7 أيام",
];

export function Header() {
  const {
    cartCount,
    setCartOpen,
    setStep,
    search,
    setSearch,
    categories,
    category,
    setCategory,
    scrollToProducts,
  } = useStore();

  const chips = ["الكل", ...categories, "عروض خاصة"];

  const pick = (c: string) => {
    setCategory(c);
    scrollToProducts();
  };

  return (
    <>
      {/* شريط العروض المتحرك */}
      <div dir="ltr" className="overflow-hidden bg-saffron-400 text-ink">
        <div className="animate-marquee flex w-max">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span
              key={i}
              className="flex items-center gap-3 px-6 py-2 text-[13px] font-bold whitespace-nowrap"
            >
              <IconSpark className="h-3 w-3 shrink-0 opacity-70" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-4 py-3.5">
            <SecretLogo />

            <form
              className="relative hidden flex-1 items-center md:flex md:max-w-xl"
              onSubmit={(e) => {
                e.preventDefault();
                scrollToProducts();
              }}
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن منتج، جهاز، فكرة لدارك..."
                className="input rounded-full py-2.5 pr-5 pl-11"
              />
              <button
                type="submit"
                aria-label="بحث"
                className="absolute left-1.5 grid h-8.5 w-8.5 place-items-center rounded-full bg-ink text-paper transition hover:bg-majorelle-600"
              >
                <IconSearch className="h-4 w-4" />
              </button>
            </form>

            <div className="ms-auto flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setStep("cart");
                  setCartOpen(true);
                }}
                className="btn-press relative grid h-11 w-11 place-items-center rounded-lg border border-ink/15 bg-white text-ink transition hover:border-majorelle-500 hover:text-majorelle-600"
                aria-label="السلة"
              >
                <IconCart className="h-5.5 w-5.5" />
                {cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="animate-pop absolute -top-1.5 -left-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-majorelle-600 px-1 text-[11px] font-extrabold text-white"
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <form
            className="relative mb-3 flex items-center md:hidden"
            onSubmit={(e) => {
              e.preventDefault();
              scrollToProducts();
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="input rounded-full py-2.5 pr-5 pl-11"
            />
            <button
              type="submit"
              aria-label="بحث"
              className="absolute left-1.5 grid h-8.5 w-8.5 place-items-center rounded-full bg-ink text-paper"
            >
              <IconSearch className="h-4 w-4" />
            </button>
          </form>

          <nav className="no-scrollbar -mb-px flex gap-2 overflow-x-auto pb-3">
            {chips.map((c) => {
              const active = category === c;
              const isDeals = c === "عروض خاصة";
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => pick(c)}
                  className={`btn-press flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-bold transition ${
                    active
                      ? isDeals
                        ? "border-saffron-500 bg-saffron-400 text-ink"
                        : "border-ink bg-ink text-paper"
                      : "border-ink/15 bg-white text-ink/65 hover:border-ink/40 hover:text-ink"
                  }`}
                >
                  {isDeals && <IconFlame className="h-3.5 w-3.5" />}
                  {c}
                </button>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
