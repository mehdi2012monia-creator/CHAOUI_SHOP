"use client";

import { useEffect, useState, type ReactNode } from "react";

function Copy({ value, ml = false }: { value: string; ml?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex gap-2">
      {ml ? (
        <textarea
          readOnly
          value={value}
          rows={value.split("\n").length}
          dir="ltr"
          onFocus={(e) => e.currentTarget.select()}
          className="input resize-none font-mono text-[11px] leading-6"
        />
      ) : (
        <input
          readOnly
          value={value}
          dir="ltr"
          onFocus={(e) => e.currentTarget.select()}
          className="input font-mono text-xs"
        />
      )}
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        }}
        className={`btn-press h-max shrink-0 rounded-lg px-4 py-2.5 text-xs font-extrabold transition ${
          done
            ? "bg-mint-600 text-white"
            : "border border-ink/15 bg-white hover:border-ink/40"
        }`}
      >
        {done ? "تم ✓" : "نسخ"}
      </button>
    </div>
  );
}

function Step({
  n,
  title,
  badge,
  children,
}: {
  n: number;
  title: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <li className="relative rounded-xl border border-ink/10 bg-white p-5 pr-14">
      <span className="absolute right-4 top-5 grid h-8 w-8 place-items-center rounded-full bg-majorelle-600 text-sm font-extrabold text-white">
        {n}
      </span>
      <div className="flex flex-wrap items-center gap-2.5">
        <h4 className="font-extrabold">{title}</h4>
        {badge && (
          <span className="rounded-md bg-saffron-100 px-2 py-0.5 text-[10px] font-extrabold text-saffron-600">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-2 text-[13px] leading-7 text-ink/65">{children}</div>
    </li>
  );
}

export function VercelTab() {
  const [origin, setOrigin] = useState("");
  const [domain, setDomain] = useState("chaouishop.app");

  useEffect(() => {
    setOrigin(window.location.origin);
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((s: Record<string, string>) => {
        if (s.site_url)
          setDomain(s.site_url.replace(/^https?:\/\//, "").replace(/\/$/, ""));
      })
      .catch(() => {});
  }, []);

  const envVars = `DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NEXT_PUBLIC_SITE_URL=https://${domain}
SETUP_TOKEN=mehdi-secret-2026`;

  return (
    <div className="grid gap-5">
      {/* مقدمة */}
      <div className="rounded-xl border-2 border-ink/15 bg-ink p-5 text-paper">
        <h3 className="font-display text-3xl">نشر المتجر على Vercel</h3>
        <p className="mt-2 text-sm leading-7 text-paper/65">
          Vercel هي أفضل استضافة لمشاريع Next.js — مجانية للاستعمال الشخصي، مع
          شهادة SSL تلقائية ونشر فوري عند كل تعديل. الوقت المتوقع:{" "}
          <b className="text-saffron-300">15 دقيقة</b>.
        </p>
        <div className="mt-4 grid gap-2.5 text-[13px] font-bold sm:grid-cols-3">
          <span className="rounded-lg bg-white/8 px-3.5 py-2.5">
            ✅ استضافة مجانية
          </span>
          <span className="rounded-lg bg-white/8 px-3.5 py-2.5">
            🔒 https تلقائي
          </span>
          <span className="rounded-lg bg-white/8 px-3.5 py-2.5">
            🌍 ربط نطاقك الخاص
          </span>
        </div>
      </div>

      <ol className="grid gap-4">
        <Step n={1} title="ارفع المشروع على GitHub" badge="مرة واحدة">
          أنشئ مستودعاً جديداً على{" "}
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noreferrer"
            className="font-extrabold text-majorelle-600 underline"
          >
            github.com/new
          </a>{" "}
          ثم ارفع ملفات المشروع إليه:
          <div className="mt-2.5">
            <Copy
              ml
              value={`git init
git add .
git commit -m "MEHDISHOP store"
git branch -M main
git remote add origin https://github.com/USERNAME/mehdishop.git
git push -u origin main`}
            />
          </div>
          <p className="mt-2 text-[12px] text-ink/45">
            استبدل <b>USERNAME</b> باسم حسابك على GitHub.
          </p>
        </Step>

        <Step n={2} title="أنشئ قاعدة بيانات PostgreSQL مجانية">
          اختر إحدى الخدمتين وانسخ رابط الاتصال (Connection String):
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <a
              href="https://neon.tech"
              target="_blank"
              rel="noreferrer"
              className="btn-press rounded-lg border border-ink/15 bg-paper p-3.5 transition hover:border-majorelle-500"
            >
              <b className="block text-[13px]">Neon</b>
              <span className="text-[11px] font-bold text-ink/50">
                الأسرع مع Vercel — اختر Pooled connection
              </span>
            </a>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="btn-press rounded-lg border border-ink/15 bg-paper p-3.5 transition hover:border-majorelle-500"
            >
              <b className="block text-[13px]">Supabase</b>
              <span className="text-[11px] font-bold text-ink/50">
                Settings ← Database ← Connection string
              </span>
            </a>
          </div>
          <p className="mt-2.5 text-[12px] text-ink/45">
            يجب أن ينتهي الرابط بـ{" "}
            <span dir="ltr" className="font-mono">
              ?sslmode=require
            </span>{" "}
            — تم ضبط المشروع ليدعم SSL تلقائياً.
          </p>
        </Step>

        <Step n={3} title="استورد المشروع في Vercel">
          افتح{" "}
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noreferrer"
            className="font-extrabold text-majorelle-600 underline"
          >
            vercel.com/new
          </a>{" "}
          ← <b>Import Git Repository</b> ← اختر مستودعك. سيكتشف Vercel أنه مشروع
          Next.js تلقائياً — <b>لا تغيّر أي إعداد بناء</b>.
        </Step>

        <Step n={4} title="أضف متغيرات البيئة" badge="مهم">
          قبل الضغط على Deploy، افتح <b>Environment Variables</b> وأضف:
          <div className="mt-2.5">
            <Copy ml value={envVars} />
          </div>
          <ul className="mt-3 grid gap-1.5 text-[12px] text-ink/60">
            <li>
              <b>DATABASE_URL</b> — رابط قاعدة البيانات من الخطوة 2
            </li>
            <li>
              <b>NEXT_PUBLIC_SITE_URL</b> — نطاقك (أو رابط vercel.app مؤقتاً)
            </li>
            <li>
              <b>SETUP_TOKEN</b> — كلمة سر تختارها لحماية مسار التهيئة
            </li>
          </ul>
          <p className="mt-2.5 text-[12px] font-bold text-ink/45">
            ثم اضغط <b>Deploy</b> وانتظر دقيقتين.
          </p>
        </Step>

        <Step n={5} title="هيّئ قاعدة البيانات" badge="من المتصفح">
          بعد نجاح النشر، افتح هذا الرابط مرة واحدة لإنشاء الجداول وإضافة
          المنتجات:
          <div className="mt-2.5">
            <Copy value={`https://${domain}/api/setup?token=mehdi-secret-2026`} />
          </div>
          <p className="mt-2 text-[12px] text-ink/45">
            استبدل الرمز بالقيمة التي وضعتها في <b>SETUP_TOKEN</b>. ستظهر صفحة
            تأكيد خضراء بالخطوات المنجزة.
          </p>
          <a
            href="/api/setup"
            target="_blank"
            rel="noreferrer"
            className="btn-press mt-3 inline-block rounded-lg border border-ink/15 bg-paper px-4 py-2 text-xs font-extrabold transition hover:border-majorelle-500"
          >
            🧪 جرّب المسار على النسخة الحالية
          </a>
        </Step>

        <Step n={6} title="اربط نطاقك الخاص">
          في Vercel: <b>Settings ← Domains ← Add</b> واكتب{" "}
          <span dir="ltr" className="font-mono text-[12px]">
            {domain}
          </span>
          . ثم أضف سجلّات DNS عند مسجّل النطاق:
          <div className="mt-2.5 overflow-x-auto rounded-lg bg-ink p-3.5">
            <table className="w-full text-right font-mono text-[11px] text-paper/80">
              <thead className="text-paper/45">
                <tr>
                  <th className="pb-1.5">Type</th>
                  <th className="pb-1.5">Name</th>
                  <th className="pb-1.5">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pt-1">A</td>
                  <td className="pt-1">@</td>
                  <td className="pt-1">76.76.21.21</td>
                </tr>
                <tr>
                  <td className="pt-1">CNAME</td>
                  <td className="pt-1">www</td>
                  <td className="pt-1">cname.vercel-dns.com</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12px] text-ink/45">
            انسخ القيم الفعلية من Vercel. الانتشار يستغرق من دقائق إلى ساعات،
            وشهادة SSL تُضاف تلقائياً.
          </p>
        </Step>
      </ol>

      {/* بعد النشر */}
      <div className="rounded-xl border border-mint-600/30 bg-mint-100/50 p-5">
        <h3 className="font-extrabold text-mint-600">✅ بعد النشر</h3>
        <ul className="mt-3 grid gap-2 text-[13px] leading-7 font-bold text-ink/70">
          <li>
            • لوحة التحكم تعمل على{" "}
            <span dir="ltr" className="font-mono text-[12px]">
              https://{domain}/admin
            </span>{" "}
            أو بالنقر 5 مرات على الشعار
          </li>
          <li>
            • كل <span dir="ltr">git push</span> جديد ينشر التحديث تلقائياً خلال
            دقيقة
          </li>
          <li>
            • أرسل خريطة الموقع إلى Search Console من تبويب{" "}
            <b>النشر على Google</b>
          </li>
          <li>
            • احذف <b>SETUP_TOKEN</b> من المتغيرات بعد التهيئة لمزيد من الأمان
          </li>
        </ul>
      </div>

      {/* حل المشاكل */}
      <div className="rounded-xl border border-ink/10 bg-white p-5">
        <h3 className="font-extrabold">🔧 حل المشاكل الشائعة</h3>
        <div className="mt-3 grid gap-3 text-[13px] leading-7">
          <div className="rounded-lg bg-paper p-3.5">
            <b>خطأ 500 عند فتح المتجر</b>
            <p className="text-ink/60">
              غالباً الجداول غير موجودة — افتح{" "}
              <span dir="ltr" className="font-mono text-[12px]">
                /api/setup?token=...
              </span>{" "}
              مرة واحدة.
            </p>
          </div>
          <div className="rounded-lg bg-paper p-3.5">
            <b>DATABASE_URL is required</b>
            <p className="text-ink/60">
              المتغير ناقص في Vercel — أضفه ثم اضغط{" "}
              <b>Redeploy</b> (الإعدادات لا تُطبّق إلا بعد إعادة نشر).
            </p>
          </div>
          <div className="rounded-lg bg-paper p-3.5">
            <b>الصور لا تظهر</b>
            <p className="text-ink/60">
              تأكد أن مجلد <span dir="ltr">public/images</span> مرفوع إلى
              GitHub (لا تضعه في <span dir="ltr">.gitignore</span>).
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-[12px] font-bold text-ink/40">
        الرابط الحالي للمعاينة:{" "}
        <span dir="ltr" className="font-mono">
          {origin}
        </span>
      </p>
    </div>
  );
}
