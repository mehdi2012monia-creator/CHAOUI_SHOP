"use client";

import { useCallback, useEffect, useState } from "react";

type Pack = {
  id: string;
  href: string;
  file: string;
  icon: string;
  title: string;
  desc: string;
  contents: string[];
  size: string;
  tone: string;
};

const PACKS: Pack[] = [
  {
    id: "project",
    href: "/api/export/project",
    file: "chaouishop-project.zip",
    icon: "📥",
    title: "المشروع الكامل",
    desc: "كود المصدر كاملاً — للرفع على GitHub والنشر على Vercel",
    contents: [
      "📁 src — كود المتجر واللوحة (54 ملف)",
      "📁 public/images/products — 10 صور",
      "📄 package.json — الاعتماديات",
      "📄 .env.example — نموذج بدون أسرار",
      "📄 README.md + أدلة النشر الثلاثة",
      "📄 START-HERE.md — أوامر جاهزة",
    ],
    size: "≈ 1.4 ميغابايت · 77 ملف",
    tone: "mint",
  },
  {
    id: "static",
    href: "/api/export/zip",
    file: "chaouishop-github.zip",
    icon: "📦",
    title: "الحزمة الثابتة",
    desc: "متجر جاهز للنشر على GitHub Pages بدون خادم",
    contents: [
      "📄 index.html — المتجر كاملاً",
      "📁 images/products — 10 صور",
      "📄 README.md — دليل النشر",
      "📄 .nojekyll",
    ],
    size: "≈ 1.2 ميغابايت · 14 ملف",
    tone: "majorelle",
  },
  {
    id: "html",
    href: "/api/export/html?download=1",
    file: "chaouishop-store.html",
    icon: "📄",
    title: "ملف HTML فقط",
    desc: "ملف واحد للصق في Google Sites",
    contents: [
      "📄 index.html — تصميم + منتجات + سلة",
      "🔐 لوحة تحكم (5 نقرات على الشعار)",
    ],
    size: "≈ 77 كيلوبايت · ملف واحد",
    tone: "saffron",
  },
];

const TONES: Record<string, { border: string; bg: string; btn: string; text: string }> = {
  mint: {
    border: "border-mint-600/40",
    bg: "bg-mint-100/50",
    btn: "bg-mint-600 hover:bg-mint-600/90 shadow-mint-600/25",
    text: "text-mint-600",
  },
  majorelle: {
    border: "border-majorelle-500/40",
    bg: "bg-majorelle-50",
    btn: "bg-majorelle-600 hover:bg-majorelle-700 shadow-majorelle-600/25",
    text: "text-majorelle-700",
  },
  saffron: {
    border: "border-saffron-500/40",
    bg: "bg-saffron-100/60",
    btn: "bg-ink hover:bg-majorelle-600 shadow-ink/25",
    text: "text-saffron-600",
  },
};

export function DownloadClient() {
  const [started, setStarted] = useState<string>("");
  const [origin, setOrigin] = useState("");

  const download = useCallback((pack: Pack) => {
    setStarted(pack.id);
    // تحميل موثوق: رابط مؤقت بخاصية download
    const a = document.createElement("a");
    a.href = pack.href;
    a.download = pack.file;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setStarted(""), 4000);
  }, []);

  useEffect(() => {
    setOrigin(window.location.origin);
    // تحميل تلقائي عند: /download?get=project
    const want = new URLSearchParams(window.location.search).get("get");
    if (!want) return;
    const pack = PACKS.find((p) => p.id === want);
    if (pack) setTimeout(() => download(pack), 400);
  }, [download]);

  return (
    <main className="min-h-screen bg-paper py-10">
      <div className="mx-auto max-w-4xl px-4">
        <header className="text-center">
          <span className="font-display text-3xl">
            MEHDI<span className="text-saffron-500">SHOP</span>
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            تحميل ملفات المتجر
          </h1>
          <p className="mt-2 text-sm font-bold text-ink/50">
            اضغط الزر ليبدأ التحميل مباشرة
          </p>
        </header>

        <div className="mt-8 grid gap-4">
          {PACKS.map((p) => {
            const t = TONES[p.tone];
            const busy = started === p.id;
            return (
              <section
                key={p.id}
                className={`rounded-xl border-2 ${t.border} ${t.bg} p-5`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="flex items-center gap-2.5 text-lg font-extrabold">
                      <span className="text-2xl">{p.icon}</span>
                      {p.title}
                    </h2>
                    <p className="mt-1 text-[13px] font-bold text-ink/55">
                      {p.desc}
                    </p>
                    <ul className="mt-3 grid gap-1 text-[12px] leading-6 font-bold text-ink/60">
                      {p.contents.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                    <p className={`mt-2.5 text-[11px] font-extrabold ${t.text}`}>
                      {p.size}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => download(p)}
                      className={`btn-press rounded-lg px-6 py-3 text-sm font-extrabold text-white shadow-lg transition ${t.btn}`}
                    >
                      {busy ? "⏳ جاري التحميل..." : "⬇ تحميل الآن"}
                    </button>
                    <a
                      href={p.href}
                      download={p.file}
                      className="rounded-lg border border-ink/15 bg-white px-4 py-2 text-center text-[11px] font-extrabold text-ink/55 transition hover:border-ink/40 hover:text-ink"
                    >
                      أو اضغط هنا
                    </a>
                  </div>
                </div>

                {busy && (
                  <p className="animate-rise mt-3 rounded-lg bg-white/80 px-4 py-2.5 text-[12px] font-extrabold text-mint-600">
                    ✓ بدأ التحميل — تحقق من مجلد التنزيلات. إن لم يبدأ، اضغط
                    «أو اضغط هنا».
                  </p>
                )}
              </section>
            );
          })}
        </div>

        {/* روابط مباشرة */}
        <section className="mt-6 rounded-xl border border-ink/10 bg-white p-5">
          <h3 className="font-extrabold">🔗 روابط مباشرة</h3>
          <p className="mt-1 text-xs font-bold text-ink/45">
            اكتب أياً منها في المتصفح ليبدأ التحميل فوراً
          </p>
          <div className="mt-3 grid gap-2">
            {[
              { l: "المشروع الكامل", u: `${origin}/download?get=project` },
              { l: "الحزمة الثابتة", u: `${origin}/download?get=static` },
              { l: "ملف HTML", u: `${origin}/download?get=html` },
            ].map((r) => (
              <div key={r.u} className="flex flex-wrap items-center gap-2">
                <span className="w-28 shrink-0 text-[12px] font-extrabold text-ink/60">
                  {r.l}
                </span>
                <input
                  readOnly
                  dir="ltr"
                  value={r.u}
                  onFocus={(e) => e.currentTarget.select()}
                  className="input flex-1 bg-paper font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(r.u)}
                  className="btn-press shrink-0 rounded-lg border border-ink/15 bg-white px-3.5 py-2 text-[11px] font-extrabold transition hover:border-ink/40"
                >
                  نسخ
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 rounded-xl bg-ink p-5 text-[12px] leading-7 font-bold text-paper/70">
          <b className="text-saffron-300">💡 إن لم يبدأ التحميل:</b>
          <br />• جرّب رابط «أو اضغط هنا» — يفتح الملف مباشرة
          <br />• إن كنت داخل إطار مدمج، افتح الصفحة في تبويب مستقل
          <br />• تأكد أن المتصفح لا يحجب النوافذ المنبثقة لهذا الموقع
        </div>

        <p className="mt-6 text-center">
          <a
            href="/"
            className="text-xs font-extrabold text-ink/45 transition hover:text-ink"
          >
            ← العودة إلى المتجر
          </a>
        </p>
      </div>
    </main>
  );
}
