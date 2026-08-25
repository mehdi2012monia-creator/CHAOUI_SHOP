"use client";

import { useEffect, useState } from "react";
import { IconCheck, IconStore } from "@/components/ui";
import { SearchConsoleCard } from "./search-console";
import { StatusCard } from "./status-card";

function Copy({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex gap-2">
      <input
        className="input bg-white font-mono text-xs"
        dir="ltr"
        readOnly
        value={value}
        onFocus={(e) => e.currentTarget.select()}
      />
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }}
        className={`btn-press shrink-0 rounded-lg px-4 text-xs font-extrabold transition ${
          copied
            ? "bg-mint-600 text-white"
            : "border border-ink/15 bg-white hover:border-ink/40"
        }`}
      >
        {copied ? "تم ✓" : "نسخ"}
      </button>
    </div>
  );
}

function CopyBox({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        <input className="input font-mono text-xs" dir="ltr" readOnly value={value} />
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
          className={`btn-press shrink-0 rounded-lg px-4 text-xs font-extrabold transition ${
            copied
              ? "bg-mint-600 text-white"
              : "border border-ink/15 bg-white hover:border-ink/40"
          }`}
        >
          {copied ? "تم النسخ ✓" : "نسخ"}
        </button>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative pr-11">
      <span className="absolute right-0 top-0 grid h-8 w-8 place-items-center rounded-full bg-majorelle-600 text-sm font-extrabold text-white">
        {n}
      </span>
      <h4 className="pt-1 font-extrabold">{title}</h4>
      <div className="mt-1.5 text-[13px] leading-7 text-ink/65">{children}</div>
    </li>
  );
}

export function PublishTab() {
  const [origin, setOrigin] = useState("");
  const [preview, setPreview] = useState("");
  const [customOn, setCustomOn] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [copiedHtml, setCopiedHtml] = useState(false);

  useEffect(() => {
    const here = window.location.origin;
    setPreview(here);
    setOrigin(here);
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((s: Record<string, string>) => {
        const on = s.site_url_enabled === "true";
        setCustomOn(on);
        setCustomUrl((s.site_url || "").replace(/\/$/, ""));
        if (on && s.site_url) setOrigin(s.site_url.replace(/\/$/, ""));
      })
      .catch(() => {});
  }, []);

  const embedCode = `<iframe src="${origin}" width="100%" height="1200" frameborder="0" style="border:0" allowfullscreen></iframe>`;

  return (
    <div className="grid gap-5">
      {/* حالة الموقع */}
      <div className="rounded-xl border border-ink/10 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-mint-100 text-mint-600">
            <IconStore className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-extrabold">متجرك جاهز للنشر والفهرسة</h3>
            <p className="text-xs font-bold text-ink/45">
              تم تفعيل SEO، خريطة الموقع، البيانات المنظمة وملف Google Merchant
            </p>
          </div>
        </div>

        <div
          className={`mt-4 rounded-lg border px-4 py-3 ${
            customOn
              ? "border-saffron-500/30 bg-saffron-100/60"
              : "border-mint-600/25 bg-mint-100/60"
          }`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-extrabold text-ink/50">
              {customOn ? "النطاق المخصص:" : "الرابط الحالي (يعمل):"}
            </span>
            <a
              href={origin}
              target="_blank"
              rel="noreferrer"
              dir="ltr"
              className="font-mono text-[13px] font-extrabold break-all text-majorelle-700 hover:underline"
            >
              {origin.replace(/^https?:\/\//, "")}
            </a>
          </div>
          <p className="mt-1.5 text-[11px] leading-6 font-bold text-ink/50">
            {customOn ? (
              <>
                ⚠️ النطاق المخصص مفعّل — تأكد أنه مربوط فعلاً وإلا لن تعمل
                الروابط. عطّله من الإعدادات للعودة للرابط التلقائي.
              </>
            ) : (
              <>
                ✅ كل الروابط تعمل تلقائياً على رابط الخادم الحالي.
                {customUrl && (
                  <>
                    {" "}
                    نطاقك المحفوظ{" "}
                    <b dir="ltr">{customUrl.replace(/^https?:\/\//, "")}</b>{" "}
                    معطّل — فعّله من الإعدادات بعد ربطه.
                  </>
                )}
              </>
            )}
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <CopyBox label="رابط المتجر الحالي" value={origin} />
          <CopyBox label="خريطة الموقع (Sitemap)" value={`${origin}/sitemap.xml`} />
          <CopyBox label="ملف robots.txt" value={`${origin}/robots.txt`} />
          <CopyBox
            label="تغذية المنتجات (Google Merchant)"
            value={`${origin}/api/feed.xml`}
          />
          <CopyBox label="ملف HTML الجاهز" value={`${origin}/api/export/html`} />
        </div>
      </div>

      <StatusCard />

      <SearchConsoleCard />

      {/* ملف HTML الجاهز */}
      <div className="rounded-xl border-2 border-majorelle-500/30 bg-white p-5">
        <span className="rounded-md bg-majorelle-100 px-2.5 py-1 text-[11px] font-extrabold text-majorelle-700">
          ملف HTML جاهز
        </span>
        <h3 className="mt-3 font-extrabold">
          نسخة HTML كاملة من المتجر (ملف واحد)
        </h3>
        <p className="mt-1 text-xs leading-6 font-bold text-ink/45">
          ملف HTML واحد يحتوي التصميم، المنتجات، السلة وإتمام الطلب — بدون أي
          ملفات خارجية. يتولّد تلقائياً من منتجاتك الحالية، والطلبات تصلك مباشرة
          إلى لوحة التحكم (ومع واتساب كخطة احتياطية).
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <a
            href="/api/export/html?live=1"
            target="_blank"
            rel="noreferrer"
            className="btn-press rounded-lg bg-ink px-5 py-2.5 text-sm font-extrabold text-paper transition hover:bg-majorelle-600"
          >
            👁 معاينة الملف
          </a>
          <a
            href="/api/export/html?download=1"
            className="btn-press rounded-lg bg-majorelle-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-majorelle-600/25 transition hover:bg-majorelle-700"
          >
            ⬇ تحميل بنطاق {origin.replace(/^https?:\/\//, "")}
          </a>
          {customOn && (
            <a
              href="/api/export/html?download=1&live=1"
              className="btn-press rounded-lg border border-ink/15 bg-white px-5 py-2.5 text-sm font-extrabold transition hover:border-ink/40"
            >
              ⬇ تحميل نسخة تعمل الآن (الرابط الحالي)
            </a>
          )}
          <button
            type="button"
            onClick={async () => {
              const res = await fetch("/api/export/html");
              const txt = await res.text();
              await navigator.clipboard?.writeText(txt);
              setCopiedHtml(true);
              setTimeout(() => setCopiedHtml(false), 2000);
            }}
            className={`btn-press rounded-lg px-5 py-2.5 text-sm font-extrabold transition ${
              copiedHtml
                ? "bg-mint-600 text-white"
                : "border border-ink/15 bg-white hover:border-ink/40"
            }`}
          >
            {copiedHtml ? "✓ تم نسخ كود HTML" : "📋 نسخ كود HTML كاملاً"}
          </button>
        </div>

        <div className="mt-4 rounded-lg border-2 border-saffron-500/40 bg-saffron-100/70 p-4">
          <b className="text-[13px] text-saffron-600">
            🔐 ثلاث طرق لفتح لوحة التحكم داخل ملف HTML
          </b>
          <ul className="mt-2.5 grid gap-2 text-[12px] leading-6 font-bold text-ink/70">
            <li>
              <b className="text-ink">١. رابط مباشر</b> — أضف{" "}
              <span dir="ltr" className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px]">
                #admin
              </span>{" "}
              في نهاية رابط الملف، فتُفتح اللوحة فوراً:
            </li>
          </ul>
          <div className="mt-2">
            <Copy value={`${preview}/api/export/html#admin`} />
          </div>
          <ul className="mt-2.5 grid gap-2 text-[12px] leading-6 font-bold text-ink/70">
            <li>
              <b className="text-ink">٢. زر في أسفل الصفحة</b> — رابط «🔐 لوحة
              التحكم» في الفوتر
            </li>
            <li>
              <b className="text-ink">٣. النقر 5 مرات</b> على شعار MEHDISHOP في
              الأعلى
            </li>
          </ul>
          <p className="mt-2.5 text-[11px] leading-6 font-bold text-ink/50">
            اللوحة تعرض الإحصائيات والطلبيات (مع تغيير الحالة) وإدارة المنتجات —
            وكل تعديل يُحفظ مباشرة في قاعدة بيانات متجرك.
          </p>
        </div>

        <div className="mt-3 rounded-lg bg-paper px-4 py-3 text-[12px] leading-6 font-bold text-ink/60">
          <b className="text-ink">أين تستعمله؟</b>
          <br />• ارفعه على أي استضافة ثابتة (Google Drive، Netlify، GitHub
          Pages) واستعمل رابطه في Google Sites عبر <b>إدراج ← تضمين ← رابط</b>
          <br />• أو الصق محتواه في <b>إدراج ← تضمين ← رمز التضمين</b> إذا كان
          حجمه أقل من 10,000 حرف (يعتمد على عدد منتجاتك)
          <br />• أو افتحه محلياً بأي متصفح — يشتغل بدون إنترنت (ما عدا الصور)
        </div>
      </div>

      {/* ربط النطاق */}
      <div className="rounded-xl border-2 border-saffron-500/40 bg-white p-5">
        <span className="rounded-md bg-saffron-100 px-2.5 py-1 text-[11px] font-extrabold text-saffron-600">
          خطوة مطلوبة
        </span>
        <h3 className="mt-3 font-extrabold">
          كيف تجعل {origin.replace(/^https?:\/\//, "")} يعمل فعلاً
        </h3>
        <p className="mt-1 text-xs leading-6 font-bold text-ink/45">
          كل روابط المتجر تستعمل الآن نطاقك. لكي يفتح النطاق في المتصفح، يجب
          شراؤه وربطه بالخادم — هذه الخطوات مرة واحدة فقط:
        </p>

        <ol className="mt-5 grid gap-5">
          <Step n={1} title="اشترِ النطاق">
            من أي مسجّل نطاقات مثل{" "}
            <a
              href="https://domains.google"
              target="_blank"
              rel="noreferrer"
              className="font-extrabold text-majorelle-600 underline"
            >
              Squarespace Domains
            </a>
            ، <b>Namecheap</b>، <b>GoDaddy</b> أو <b>Genious.ma</b> (مغربي).
            الثمن عادة 100–150 د.م في السنة لنطاق <b>.com</b>.
          </Step>
          <Step n={2} title="انشر المتجر على Vercel">
            ارفع المشروع على GitHub ثم اربطه بـ{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="font-extrabold text-majorelle-600 underline"
            >
              Vercel
            </a>{" "}
            مع قاعدة بيانات من Neon أو Supabase (كلها مجانية للبداية).
          </Step>
          <Step n={3} title="اربط النطاق بالمشروع">
            في Vercel: <b>Settings ← Domains ← Add</b> واكتب{" "}
            <span dir="ltr" className="font-mono text-[11px]">
              {origin.replace(/^https?:\/\//, "")}
            </span>
            . سيعطيك Vercel سجلّات DNS تضعها عند مسجّل النطاق:
            <div className="mt-2.5 overflow-x-auto rounded-lg bg-ink p-3">
              <table className="w-full text-right font-mono text-[11px] text-paper/80">
                <thead className="text-paper/45">
                  <tr>
                    <th className="pb-1">Type</th>
                    <th className="pb-1">Name</th>
                    <th className="pb-1">Value</th>
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
            <span className="mt-1.5 block text-[11px] text-ink/45">
              (القيم الفعلية يعرضها Vercel — انسخها منه مباشرة)
            </span>
          </Step>
          <Step n={4} title="انتظر انتشار DNS">
            من دقائق إلى بضع ساعات. بعدها يفتح نطاقك مباشرة وتُضاف شهادة SSL
            تلقائياً (https). كل روابط المتجر والـ sitemap و Merchant ستعمل
            فوراً بدون أي تعديل إضافي.
          </Step>
        </ol>

        {origin.endsWith(".app") && (
          <div className="mt-5 rounded-lg border border-majorelle-500/25 bg-majorelle-50 px-4 py-3 text-[12px] leading-6 font-bold text-ink/65">
            🔒 <b className="text-majorelle-700">ملاحظة عن نطاقات .app:</b>{" "}
            امتداد <b>.app</b> مسجّل في قائمة HSTS، أي أن المتصفحات{" "}
            <b>تفرض https تلقائياً</b> ولا تفتحه أبداً عبر http. لذا كل الروابط
            هنا تستعمل <span dir="ltr" className="font-mono">https://</span> —
            وهذا ممتاز للثقة وترتيب Google. تأكد فقط أن شهادة SSL مفعّلة في
            الاستضافة (Vercel يفعّلها تلقائياً).
          </div>
        )}

        <div className="mt-5 rounded-lg bg-paper px-4 py-3 text-[12px] leading-6 font-bold text-ink/60">
          ⏳ <b className="text-ink">إلى أن يصبح النطاق جاهزاً:</b> متجرك يعمل
          الآن على{" "}
          <a
            href={preview}
            target="_blank"
            rel="noreferrer"
            dir="ltr"
            className="font-mono text-[11px] text-majorelle-600 underline"
          >
            {preview.replace(/^https?:\/\//, "")}
          </a>{" "}
          — استعمل زر «تحميل نسخة تعمل الآن» أعلاه إذا أردت ملف HTML يشتغل
          مباشرة قبل ربط النطاق.
        </div>
      </div>

      {/* الطريقة 1: Google Sites */}
      <div className="rounded-xl border border-ink/10 bg-white p-5">
        <span className="rounded-md bg-saffron-100 px-2.5 py-1 text-[11px] font-extrabold text-saffron-600">
          الطريقة 1 — الأسرع
        </span>
        <h3 className="mt-3 font-extrabold">عرض المتجر داخل Google Sites</h3>
        <p className="mt-1 text-xs font-bold text-ink/45">
          تم السماح بالتضمين (iframe) في إعدادات الأمان، لذا سيشتغل المتجر داخل
          صفحتك على Google Sites بشكل كامل
        </p>

        <ol className="mt-5 grid gap-5">
          <Step n={1} title="انشر المتجر على استضافة تدعم Next.js">
            Google Sites لا يشغّل قواعد البيانات، لذا ينشر المتجر أولاً على{" "}
            <b>Vercel</b> (مجاناً) مع قاعدة بيانات <b>Neon</b> أو{" "}
            <b>Supabase</b>، ثم تحصل على رابط مثل{" "}
            <span dir="ltr" className="font-mono text-xs">
              mehdishop.vercel.app
            </span>
          </Step>
          <Step n={2} title="افتح موقعك في Google Sites">
            من محرر الموقع اختر: <b>إدراج ← تضمين (Embed) ← عبر الرابط</b> والصق
            رابط متجرك، أو اختر <b>رمز التضمين</b> والصق الكود التالي:
          </Step>
          <Step n={3} title="اضبط الارتفاع ثم انشر">
            وسّع إطار التضمين ليأخذ عرض الصفحة كاملاً واضغط <b>نشر</b> في الأعلى.
            متجرك يصبح مباشراً على نطاق Google.
          </Step>
        </ol>

        <div className="mt-5">
          <CopyBox label="كود التضمين الجاهز" value={embedCode} />
        </div>
      </div>

      {/* الطريقة 2: بحث Google */}
      <div className="rounded-xl border border-ink/10 bg-white p-5">
        <span className="rounded-md bg-majorelle-100 px-2.5 py-1 text-[11px] font-extrabold text-majorelle-700">
          الطريقة 2 — الأقوى
        </span>
        <h3 className="mt-3 font-extrabold">ظهور المتجر في بحث Google</h3>
        <p className="mt-1 text-xs font-bold text-ink/45">
          كل منتج له صفحة مستقلة ببيانات منظمة (Product Schema) تُظهر الثمن
          بالدرهم والتوفر مباشرة في نتائج البحث
        </p>

        <ol className="mt-5 grid gap-5">
          <Step n={1} title="سجّل الموقع في Google Search Console">
            ادخل إلى{" "}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noreferrer"
              className="font-extrabold text-majorelle-600 underline"
            >
              search.google.com/search-console
            </a>{" "}
            وأضف نطاق متجرك، ثم أثبت الملكية.
          </Step>
          <Step n={2} title="أضف رمز التحقق">
            ضع الرمز الذي يعطيك إياه Google في متغير البيئة{" "}
            <span dir="ltr" className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[11px]">
              GOOGLE_SITE_VERIFICATION
            </span>{" "}
            وسيُضاف تلقائياً في رأس كل صفحة.
          </Step>
          <Step n={3} title="أرسل خريطة الموقع">
            في Search Console افتح <b>Sitemaps</b> وألصق رابط{" "}
            <span dir="ltr" className="font-mono text-[11px]">
              /sitemap.xml
            </span>{" "}
            — تتحدث تلقائياً كلما أضفت منتجاً جديداً.
          </Step>
          <Step n={4} title="اعرض منتجاتك في Google Shopping مجاناً">
            أنشئ حساباً في{" "}
            <a
              href="https://merchants.google.com"
              target="_blank"
              rel="noreferrer"
              className="font-extrabold text-majorelle-600 underline"
            >
              Google Merchant Center
            </a>
            ، ثم <b>Products ← Add product feed ← Scheduled fetch</b> وألصق رابط
            التغذية{" "}
            <span dir="ltr" className="font-mono text-[11px]">
              /api/feed.xml
            </span>
            .
          </Step>
        </ol>
      </div>

      {/* تذكير مهم */}
      <div className="rounded-xl border border-saffron-500/30 bg-saffron-100/60 p-5">
        <h3 className="flex items-center gap-2 font-extrabold text-saffron-600">
          <IconCheck className="h-4.5 w-4.5" />
          خطوة أخيرة بعد النشر
        </h3>
        <p className="mt-2 text-[13px] leading-7 text-ink/70">
          بعد الحصول على رابطك النهائي، ضع المتغير{" "}
          <span dir="ltr" className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px]">
            NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
          </span>{" "}
          في إعدادات البيئة. هذا يضمن أن خريطة الموقع، الروابط الأساسية
          (canonical) وملف Merchant تستعمل نطاقك الحقيقي بدل الرابط المؤقت.
        </p>
      </div>
    </div>
  );
}
