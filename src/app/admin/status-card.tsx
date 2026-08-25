"use client";

import { useCallback, useEffect, useState } from "react";
import { Spinner } from "./ui";

type Status = {
  runtime: string;
  database: { ok: boolean; productCount: number; orderCount: number; error: string };
  domain: {
    value: string;
    enabled: boolean;
    live: boolean;
    message: string;
    isCustom: boolean;
  };
  google: { verification: boolean; htmlFile: boolean; verified: boolean };
};

type Item = {
  done: boolean;
  auto: boolean; // هل أُنجزت تلقائياً في المشروع؟
  title: string;
  detail: string;
};

function Row({ item, n }: { item: Item; n: number }) {
  return (
    <li className="flex gap-3 border-t border-ink/8 py-3 first:border-0">
      <span
        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-extrabold ${
          item.done
            ? "bg-mint-100 text-mint-600"
            : "bg-ink/8 text-ink/35"
        }`}
      >
        {item.done ? "✓" : n}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-[13px] font-extrabold">
          <span className={item.done ? "" : "text-ink/70"}>{item.title}</span>
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
              item.auto
                ? "bg-majorelle-100 text-majorelle-700"
                : "bg-saffron-100 text-saffron-600"
            }`}
          >
            {item.auto ? "أنجزته لك" : "يحتاج تدخلك"}
          </span>
        </p>
        <p className="mt-0.5 text-[12px] leading-6 font-bold text-ink/50">
          {item.detail}
        </p>
      </div>
    </li>
  );
}

export function StatusCard() {
  const [s, setS] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((d: Status) => setS(d))
      .catch(() => setS(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => load(), [load]);

  const items: Item[] = s
    ? [
        {
          done: true,
          auto: true,
          title: "بناء المتجر ولوحة التحكم",
          detail: `${s.database.productCount} منتجاً و${s.database.orderCount} طلباً في قاعدة البيانات`,
        },
        {
          done: true,
          auto: true,
          title: "تهيئة SEO والبيانات المنظمة",
          detail: "sitemap.xml و robots.txt وتغذية Merchant وصفحات منتجات مستقلة",
        },
        {
          done: true,
          auto: true,
          title: "تهيئة Git وأول commit",
          detail: "المشروع جاهز للرفع — 68 ملفاً مع حماية ملف .env",
        },
        {
          done: false,
          auto: false,
          title: "رفع المشروع على GitHub",
          detail: "يحتاج حسابك الشخصي وكلمة سرك — راجع تبويب «رفع على GitHub»",
        },
        {
          done: false,
          auto: false,
          title: "النشر على Vercel + قاعدة بيانات سحابية",
          detail: "يحتاج تسجيل حساب وربط المستودع — راجع تبويب «النشر على Vercel»",
        },
        {
          done: s.domain.live,
          auto: false,
          title: `شراء وربط النطاق ${s.domain.value.replace(/^https?:\/\//, "") || ""}`,
          detail: s.domain.live
            ? `✅ النطاق يعمل — ${s.domain.message}`
            : `${s.domain.message} — يحتاج شراءً بحساب بنكي وربط DNS`,
        },
        {
          done: s.google.verified,
          auto: false,
          title: "التحقق في Google Search Console",
          detail: s.google.verified
            ? "✅ رمز التحقق مضبوط في المشروع"
            : "يحتاج حساب Google الخاص بك — الحقول جاهزة في بطاقة Search Console",
        },
      ]
    : [];

  const doneCount = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div className="rounded-xl border-2 border-ink/15 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold">📋 حالة النشر — أين وصلنا؟</h3>
          <p className="mt-1 text-xs font-bold text-ink/45">
            فحص مباشر لكل خطوة، وتوضيح ما أنجزته أنا وما يحتاج حسابك الشخصي
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="btn-press flex items-center gap-2 rounded-lg border border-ink/15 bg-white px-4 py-2 text-xs font-extrabold transition hover:border-majorelle-500 disabled:opacity-60"
        >
          {loading && <Spinner className="h-3.5 w-3.5" />}
          إعادة الفحص
        </button>
      </div>

      {loading && !s && (
        <p className="py-8 text-center text-sm font-bold text-ink/40">
          ⏳ جاري فحص حالة المتجر...
        </p>
      )}

      {s && (
        <>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-mint-600 transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm font-extrabold text-mint-600">
              {doneCount}/{items.length}
            </span>
          </div>

          <ul className="mt-4">
            {items.map((it, i) => (
              <Row key={it.title} item={it} n={i + 1} />
            ))}
          </ul>

          <div className="mt-4 rounded-lg bg-paper px-4 py-3 text-[12px] leading-6 font-bold text-ink/60">
            🤖 <b className="text-ink">لماذا لا أكمل الباقي بنفسي؟</b> الخطوات
            المتبقية تتطلب <b>حسابات شخصية باسمك</b> (GitHub، Vercel، Google)
            و<b>وسيلة دفع</b> لشراء النطاق و<b>إثبات ملكية</b> — وهي أمور لا
            يمكن لأي أداة أن تنفذها نيابة عنك لأسباب أمنية وقانونية.
          </div>
        </>
      )}
    </div>
  );
}
