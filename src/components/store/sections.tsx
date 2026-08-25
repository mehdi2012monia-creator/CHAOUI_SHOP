"use client";

import { useMemo } from "react";
import { useStore } from "./store-context";
import { ProductCard } from "./product-card";
import {
  IconArrowLeft,
  IconBox,
  IconCash,
  IconChat,
  IconHeadset,
  IconPhone,
  IconShield,
  IconTruck,
  Reveal,
  SecretLogo,
} from "@/components/ui";

/* ------------------------- لافتات الأقسام ------------------------- */

const BANNERS = [
  {
    title: "تجهيزات المنزل والمطبخ",
    subtitle: "كل ما تحتاجه دارك بأثمنة مناسبة",
    category: "المطبخ",
    image:
      "https://images.pexels.com/photos/5556176/pexels-photo-5556176.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    title: "إلكترونيات بأحدث صيحات",
    subtitle: "سماعات، ساعات ذكية وأكثر",
    category: "إلكترونيات",
    image:
      "https://images.pexels.com/photos/29581125/pexels-photo-29581125.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];

export function CategoryBanners() {
  const { setCategory, scrollToProducts } = useStore();
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <div className="grid gap-5 md:grid-cols-2">
        {BANNERS.map((b, i) => (
          <Reveal key={b.title} delay={i * 120}>
            <button
              type="button"
              onClick={() => {
                setCategory(b.category);
                scrollToProducts();
              }}
              className="group relative block h-60 w-full overflow-hidden rounded-xl text-right shadow-lg shadow-ink/10"
            >
              <img
                src={b.image}
                alt={b.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-ink/85 via-ink/40 to-transparent" />
              <div className="absolute inset-y-0 right-0 flex flex-col justify-center pr-7 sm:pr-9">
                <span className="text-xs font-extrabold text-saffron-300">
                  {b.subtitle}
                </span>
                <h3 className="mt-1.5 font-display text-3xl text-white sm:text-4xl">
                  {b.title}
                </h3>
                <span className="mt-3.5 inline-flex w-max items-center gap-2 rounded-lg bg-white/95 px-4 py-2 text-xs font-extrabold text-ink transition group-hover:bg-saffron-400">
                  تسوق القسم
                  <IconArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1" />
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------- الأكثر مبيعاً ------------------------- */

export function FeaturedSection() {
  const { products } = useStore();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  if (featured.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 lg:px-8">
      <Reveal>
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold tracking-wide text-saffron-600">
              الأكثر طلباً هذا الأسبوع
            </span>
            <h2 className="mt-1.5 font-display text-4xl sm:text-5xl">
              اختيارات عملائنا
            </h2>
          </div>
          <span className="mb-2 hidden text-sm font-bold text-ink/45 sm:block">
            {featured.length} منتجات مميزة
          </span>
        </div>
      </Reveal>
      <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {featured.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 90}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------- كل المنتجات ------------------------- */

export function AllProducts() {
  const { products, categories, category, setCategory, search, scrollToProducts } =
    useStore();

  const filtered = useMemo(() => {
    let list = products;
    if (category === "عروض خاصة") {
      list = list.filter((p) => p.oldPrice && p.oldPrice > p.price);
    } else if (category !== "الكل") {
      list = list.filter((p) => p.category === category);
    }
    const q = search.trim();
    if (q) {
      list = list.filter(
        (p) => p.name.includes(q) || p.description.includes(q)
      );
    }
    return list;
  }, [products, category, search]);

  const chips = ["الكل", ...categories, "عروض خاصة"];

  return (
    <section id="products" className="scroll-mt-32 bg-paper-soft/60 py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold tracking-wide text-majorelle-600">
                كتالوج المتجر
              </span>
              <h2 className="mt-1.5 font-display text-4xl sm:text-5xl">
                كل المنتجات
              </h2>
            </div>
            <span className="rounded-full border border-ink/10 bg-white px-4 py-1.5 text-xs font-extrabold text-ink/60">
              {filtered.length} منتج
            </span>
          </div>
        </Reveal>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`btn-press shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-bold transition ${
                category === c
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 bg-white text-ink/60 hover:border-ink/40 hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-ink/20 bg-white/60 py-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-ink/5 text-ink/30">
              <IconBox className="h-7 w-7" />
            </span>
            <p className="mt-4 font-extrabold">ما لقيناش نتائج</p>
            <p className="mt-1 text-sm text-ink/50">
              جرب كلمة بحث أخرى أو قسم آخر
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory("الكل");
                scrollToProducts();
              }}
              className="btn-press mt-5 rounded-lg bg-ink px-6 py-2.5 text-sm font-bold text-paper transition hover:bg-majorelle-600"
            >
              عرض كل المنتجات
            </button>
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------- شريط الثقة ------------------------- */

const TRUST = [
  {
    icon: IconTruck,
    title: "توصيل سريع",
    sub: "24 إلى 48 ساعة لجميع المدن",
  },
  {
    icon: IconCash,
    title: "الدفع عند الاستلام",
    sub: "خلّص غير ملي توصلك السلعة",
  },
  {
    icon: IconShield,
    title: "جودة مضمونة",
    sub: "منتجات أصلية 100% مع الضمان",
  },
  {
    icon: IconHeadset,
    title: "دعم 7 أيام في الأسبوع",
    sub: "فريقنا جاهز للرد على استفساراتك",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-white/10 bg-ink">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 lg:grid-cols-4 lg:px-8">
        {TRUST.map((t, i) => (
          <Reveal key={t.title} delay={i * 90}>
            <div className="flex items-center gap-3.5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-saffron-400/15 text-saffron-400">
                <t.icon className="h-5.5 w-5.5" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-paper">{t.title}</p>
                <p className="mt-0.5 text-xs text-paper/50">{t.sub}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------- الفوتر ------------------------- */

export function Footer() {
  const { categories, setCategory, scrollToProducts } = useStore();
  return (
    <footer className="bg-ink text-paper/65">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:px-8">
        <div>
          <SecretLogo dark />
          <p className="mt-4 max-w-xs text-sm leading-7">
            متجر مغربي متخصص في المواد المنزلية والإلكترونيات. نختارو ليك أحسن
            المنتجات بأثمنة مناسبة، مع التوصيل لجميع المدن والدفع عند الاستلام.
          </p>
          <div className="mt-5 flex gap-2.5">
            <a
              href="tel:0600000000"
              className="btn-press flex items-center gap-2 rounded-lg border border-white/15 px-3.5 py-2 text-xs font-bold text-paper transition hover:border-saffron-400 hover:text-saffron-300"
            >
              <IconPhone className="h-3.5 w-3.5" />
              اتصل بنا
            </a>
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noreferrer"
              className="btn-press flex items-center gap-2 rounded-lg bg-saffron-400 px-3.5 py-2 text-xs font-extrabold text-ink transition hover:bg-saffron-300"
            >
              <IconChat className="h-3.5 w-3.5" />
              واتساب
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-xl text-paper">الأقسام</h4>
          <ul className="mt-4 grid gap-2.5 text-sm font-bold">
            {categories.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => {
                    setCategory(c);
                    scrollToProducts();
                  }}
                  className="transition hover:text-saffron-300"
                >
                  {c}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  setCategory("عروض خاصة");
                  scrollToProducts();
                }}
                className="text-saffron-400 transition hover:text-saffron-300"
              >
                عروض خاصة
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl text-paper">معلومات</h4>
          <ul className="mt-4 grid gap-2.5 text-sm font-bold">
            <li className="cursor-pointer transition hover:text-saffron-300">من نحن</li>
            <li className="cursor-pointer transition hover:text-saffron-300">شروط التوصيل</li>
            <li className="cursor-pointer transition hover:text-saffron-300">سياسة الإرجاع</li>
            <li className="cursor-pointer transition hover:text-saffron-300">الأسئلة الشائعة</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl text-paper">معلومات الاتصال</h4>
          <ul className="mt-4 grid gap-3 text-sm font-bold">
            <li className="flex items-center gap-2.5">
              <IconPhone className="h-4 w-4 text-saffron-400" />
              <span dir="ltr">0600-000000</span>
            </li>
            <li className="flex items-center gap-2.5">
              <IconTruck className="h-4 w-4 text-saffron-400" />
              التوصيل لجميع مدن المغرب
            </li>
            <li className="flex items-center gap-2.5">
              <IconCash className="h-4 w-4 text-saffron-400" />
              الدفع عند الاستلام
            </li>
          </ul>
          <div className="mt-5 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-xs leading-6">
            ساعات العمل: من الاثنين إلى السبت
            <br />
            9:00 صباحاً — 8:00 مساءً
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs font-bold text-paper/45 lg:px-8">
          <span>© 2026 MEHDISHOP — جميع الحقوق محفوظة</span>
          <span className="flex items-center gap-1.5">
            صنع بإتقان في المغرب
            <span className="text-saffron-400">★</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
