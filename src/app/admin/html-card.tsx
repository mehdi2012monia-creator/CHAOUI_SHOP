"use client";

import { useEffect, useState } from "react";
import { Spinner } from "./ui";

/**
 * بطاقة مختصرة لرابط وكود ملف HTML — تظهر في «نظرة عامة»
 * حتى يصل إليها صاحب المتجر بسرعة دون البحث في التبويبات.
 */
export function HtmlCard() {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<"" | "url" | "admin" | "code" | "embed">("");
  const [loadingCode, setLoadingCode] = useState(false);
  const [size, setSize] = useState<number | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const fileUrl = `${origin}/api/export/html`;
  const adminUrl = `${fileUrl}#admin`;
  const embedCode = `<iframe src="${fileUrl}" width="100%" height="1400" frameborder="0" style="border:0" allowfullscreen></iframe>`;

  const flash = (k: typeof copied) => {
    setCopied(k);
    setTimeout(() => setCopied(""), 2000);
  };

  const copy = (text: string, k: typeof copied) => {
    navigator.clipboard?.writeText(text);
    flash(k);
  };

  const copyCode = async () => {
    setLoadingCode(true);
    try {
      const res = await fetch("/api/export/html");
      const txt = await res.text();
      await navigator.clipboard?.writeText(txt);
      setSize(txt.length);
      flash("code");
    } finally {
      setLoadingCode(false);
    }
  };

  const Row = ({
    label,
    value,
    hint,
    k,
  }: {
    label: string;
    value: string;
    hint?: string;
    k: typeof copied;
  }) => (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        <input
          readOnly
          dir="ltr"
          value={value}
          onFocus={(e) => e.currentTarget.select()}
          className="input bg-paper font-mono text-[11px]"
        />
        <button
          type="button"
          onClick={() => copy(value, k)}
          className={`btn-press shrink-0 rounded-lg px-4 text-xs font-extrabold transition ${
            copied === k
              ? "bg-mint-600 text-white"
              : "border border-ink/15 bg-white hover:border-ink/40"
          }`}
        >
          {copied === k ? "تم ✓" : "نسخ"}
        </button>
      </div>
      {hint && (
        <p className="mt-1.5 text-[11px] font-bold text-ink/45">{hint}</p>
      )}
    </div>
  );

  return (
    <div className="rounded-xl border-2 border-majorelle-500/30 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold">📄 كود HTML — نسخة المتجر المستقلة</h3>
          <p className="mt-1 text-xs font-bold text-ink/45">
            ملف واحد كامل (تصميم + منتجات + سلة + لوحة تحكم) جاهز لـ Google
            Sites أو أي استضافة
          </p>
        </div>
        <a
          href="/api/export/html"
          target="_blank"
          rel="noreferrer"
          className="btn-press rounded-lg bg-ink px-4 py-2.5 text-xs font-extrabold text-paper transition hover:bg-majorelle-600"
        >
          👁 فتح المعاينة
        </a>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Row
          label="🔗 رابط الملف"
          value={fileUrl}
          hint="افتحه أو ضعه في Google Sites عبر: إدراج ← تضمين ← رابط"
          k="url"
        />
        <Row
          label="🔐 رابط يفتح لوحة التحكم مباشرة"
          value={adminUrl}
          hint="احفظه في المفضلة — أو انقر 5 مرات على الشعار داخل الملف"
          k="admin"
        />
      </div>

      <div className="mt-4">
        <label className="label">🧩 كود التضمين في Google Sites</label>
        <div className="flex gap-2">
          <textarea
            readOnly
            dir="ltr"
            rows={2}
            value={embedCode}
            onFocus={(e) => e.currentTarget.select()}
            className="input resize-none bg-paper font-mono text-[11px] leading-6"
          />
          <button
            type="button"
            onClick={() => copy(embedCode, "embed")}
            className={`btn-press h-max shrink-0 rounded-lg px-4 py-2.5 text-xs font-extrabold transition ${
              copied === "embed"
                ? "bg-mint-600 text-white"
                : "border border-ink/15 bg-white hover:border-ink/40"
            }`}
          >
            {copied === "embed" ? "تم ✓" : "نسخ"}
          </button>
        </div>
      </div>

      {/* حزمة GitHub */}
      <div className="mt-4 rounded-lg border-2 border-mint-600/35 bg-mint-100/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <b className="text-[13px] text-mint-600">
              📦 حزمة جاهزة للرفع على GitHub
            </b>
            <p className="mt-1 text-[11px] leading-6 font-bold text-ink/55">
              ملف ZIP يحتوي <b>index.html</b> + <b>مجلد الصور</b> + README بدليل
              النشر — جاهز مباشرة لـ GitHub Pages
            </p>
          </div>
          <a
            href="/api/export/zip"
            className="btn-press shrink-0 rounded-lg bg-mint-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-mint-600/25 transition hover:bg-mint-600/90"
          >
            ⬇ تحميل الحزمة (ZIP)
          </a>
        </div>
        <div
          dir="ltr"
          className="mt-3 rounded-md bg-white/70 p-3 font-mono text-[10px] leading-6 text-ink/60"
        >
          chaouishop-github.zip
          <br />
          ├── index.html
          <br />
          ├── images/products/ <span className="text-ink/40">(10 صور)</span>
          <br />
          ├── README.md
          <br />
          └── .nojekyll
        </div>
      </div>

      {/* صفحة التحميل */}
      <div className="mt-3 rounded-lg border-2 border-ink/20 bg-ink p-4 text-paper">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <b className="text-[13px] text-saffron-300">
              📥 صفحة التحميل — كل الملفات في مكان واحد
            </b>
            <p className="mt-1 text-[11px] leading-6 font-bold text-paper/55">
              المشروع الكامل · الحزمة الثابتة · ملف HTML — بتحميل تلقائي
            </p>
          </div>
          <a
            href="/download"
            target="_blank"
            rel="noreferrer"
            className="btn-press shrink-0 rounded-lg bg-saffron-400 px-5 py-2.5 text-sm font-extrabold text-ink transition hover:bg-saffron-300"
          >
            فتح صفحة التحميل ←
          </a>
        </div>
        <div className="mt-3 rounded-md bg-white/8 px-3.5 py-2.5">
          <p className="text-[10px] font-bold text-paper/45">
            روابط قصيرة — اكتبها في المتصفح مباشرة:
          </p>
          <p dir="ltr" className="mt-1 font-mono text-[11px] leading-6">
            <span className="text-saffron-300">{origin}/dl</span>
            <span className="text-paper/35"> — صفحة التحميل</span>
            <br />
            <span className="text-saffron-300">{origin}/zip</span>
            <span className="text-paper/35"> — المشروع مباشرة</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5 border-t border-ink/10 pt-4">
        <button
          type="button"
          onClick={copyCode}
          disabled={loadingCode}
          className={`btn-press flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-extrabold transition disabled:opacity-60 ${
            copied === "code"
              ? "bg-mint-600 text-white"
              : "bg-majorelle-600 text-white shadow-md shadow-majorelle-600/25 hover:bg-majorelle-700"
          }`}
        >
          {loadingCode && <Spinner className="h-4 w-4" />}
          {copied === "code" ? "✓ تم نسخ كود HTML كاملاً" : "📋 نسخ كود HTML كاملاً"}
        </button>
        <a
          href="/api/export/html?download=1"
          className="btn-press rounded-lg border border-ink/15 bg-white px-5 py-2.5 text-sm font-extrabold transition hover:border-ink/40"
        >
          ⬇ تحميل ملف HTML فقط
        </a>
        {size !== null && (
          <span className="self-center text-[11px] font-bold text-ink/45">
            حجم الكود: {(size / 1024).toFixed(0)} كيلوبايت
          </span>
        )}
      </div>

      <p className="mt-3.5 rounded-lg bg-saffron-100/70 px-4 py-3 text-[12px] leading-6 font-bold text-ink/65">
        💡 الملف <b>يتولّد لحظياً</b> من منتجاتك الحالية — أي تعديل في الأثمنة أو
        المخزون يظهر تلقائياً عند إعادة التحميل. والطلبات القادمة منه تصلك هنا
        في تبويب <b>الطلبات</b>.
      </p>
    </div>
  );
}
