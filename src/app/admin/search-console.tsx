"use client";

import { useEffect, useState } from "react";

function Copy({ value, label }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex gap-2">
      <input
        className="input font-mono text-xs"
        dir="ltr"
        readOnly
        value={value}
        onFocus={(e) => e.currentTarget.select()}
      />
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        }}
        className={`btn-press shrink-0 rounded-lg px-4 text-xs font-extrabold transition ${
          done
            ? "bg-mint-600 text-white"
            : "border border-ink/15 bg-white hover:border-ink/40"
        }`}
      >
        {done ? "تم ✓" : label ?? "نسخ"}
      </button>
    </div>
  );
}

export function SearchConsoleCard() {
  const [live, setLive] = useState("");
  const [customOn, setCustomOn] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [verify, setVerify] = useState("");
  const [gfile, setGfile] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [switching, setSwitching] = useState(false);

  const load = () =>
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((s: Record<string, string>) => {
        setCustomOn(s.site_url_enabled === "true");
        setCustomUrl((s.site_url || "").replace(/\/$/, ""));
        setVerify(s.google_verification || "");
        setGfile(s.google_html_file || "");
      })
      .catch(() => {});

  useEffect(() => {
    setLive(window.location.origin);
    void load();
  }, []);

  // الرابط الذي سيراه Google فعلياً
  const active = customOn && customUrl ? customUrl : live;

  const save = async (payload: Record<string, string>, note: string) => {
    setBusy(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: payload }),
    });
    setBusy(false);
    if (res.ok) {
      setMsg(note);
      setTimeout(() => setMsg(""), 2600);
      void load();
    }
  };

  const useLiveUrl = async () => {
    setSwitching(true);
    await save({ site_url_enabled: "false" }, "تم التحويل للرابط العامل");
    setSwitching(false);
  };

  return (
    <div className="rounded-xl border-2 border-mint-600/35 bg-white p-5">
      <span className="rounded-md bg-mint-100 px-2.5 py-1 text-[11px] font-extrabold text-mint-600">
        Google Search Console
      </span>
      <h3 className="mt-3 font-extrabold">رابط الموقع للتحقق والنشر</h3>
      <p className="mt-1 text-xs leading-6 font-bold text-ink/45">
        انسخ هذا الرابط وألصقه في Search Console عند إضافة موقع جديد (اختر
        <b> بادئة عنوان URL / URL prefix</b>)
      </p>

      {/* الرابط الرئيسي */}
      <div className="mt-4 rounded-lg border border-ink/10 bg-paper p-4">
        <label className="label">🔗 عنوان الموقع (URL prefix)</label>
        <Copy value={active} label="نسخ الرابط" />

        {customOn && (
          <div className="mt-3 rounded-lg border border-saffron-500/35 bg-saffron-100/70 px-3.5 py-3">
            <p className="text-[12px] leading-6 font-bold text-ink/70">
              ⚠️ <b className="text-saffron-600">تنبيه مهم:</b> هذا النطاق لن
              يجتاز التحقق إلا إذا كان <b>مشترى ومربوطاً</b> بالخادم فعلاً. إن
              لم يكن جاهزاً بعد، حوّل مؤقتاً إلى الرابط العامل لتتحقق الآن:
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              <code
                dir="ltr"
                className="rounded bg-white px-2.5 py-1.5 font-mono text-[11px] font-bold break-all"
              >
                {live}
              </code>
              <button
                type="button"
                disabled={switching}
                onClick={useLiveUrl}
                className="btn-press rounded-lg bg-ink px-4 py-2 text-xs font-extrabold text-paper transition hover:bg-majorelle-600 disabled:opacity-60"
              >
                {switching ? "..." : "استعمل الرابط العامل"}
              </button>
            </div>
          </div>
        )}

        {!customOn && (
          <p className="mt-2.5 text-[11px] font-bold text-mint-600">
            ✅ هذا الرابط يعمل الآن وجاهز للتحقق مباشرة
          </p>
        )}
      </div>

      {/* خريطة الموقع */}
      <div className="mt-4 rounded-lg border border-ink/10 bg-paper p-4">
        <label className="label">
          🗺️ خريطة الموقع (ألصقها في Sitemaps بعد التحقق)
        </label>
        <Copy value={`${active}/sitemap.xml`} />
        <p className="mt-2 text-[11px] font-bold text-ink/45">
          في Search Console: القائمة الجانبية ← <b>Sitemaps</b> ← ألصق{" "}
          <span dir="ltr" className="font-mono">
            sitemap.xml
          </span>{" "}
          ← إرسال
        </p>
      </div>

      {/* طرق التحقق */}
      <h4 className="mt-6 font-extrabold">طريقتان للتحقق من الملكية</h4>

      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        {/* الطريقة أ */}
        <div className="rounded-lg border border-ink/10 bg-paper p-4">
          <p className="text-xs font-extrabold text-majorelle-700">
            الطريقة أ — علامة HTML (الأسهل)
          </p>
          <p className="mt-1.5 text-[11px] leading-6 font-bold text-ink/50">
            في Search Console اختر <b>HTML tag</b>، ستجد وسماً مثل:
            <br />
            <span dir="ltr" className="font-mono text-[10px]">
              &lt;meta name=&quot;google-site-verification&quot;
              content=&quot;<b>AbC123...</b>&quot; /&gt;
            </span>
            <br />
            انسخ قيمة <b>content</b> فقط والصقها هنا:
          </p>
          <div className="mt-2.5 flex gap-2">
            <input
              className="input font-mono text-xs"
              dir="ltr"
              value={verify}
              onChange={(e) => setVerify(e.target.value)}
              placeholder="AbC123dEf456..."
            />
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                save(
                  { google_verification: verify.trim() },
                  "تم حفظ رمز التحقق — اضغط Verify في Google"
                )
              }
              className="btn-press shrink-0 rounded-lg bg-majorelle-600 px-4 text-xs font-extrabold text-white transition hover:bg-majorelle-700 disabled:opacity-60"
            >
              حفظ
            </button>
          </div>
          {verify && (
            <p className="mt-2 text-[11px] font-bold text-mint-600">
              ✓ الوسم مُضاف في رأس كل صفحة — ارجع لـ Google واضغط Verify
            </p>
          )}
        </div>

        {/* الطريقة ب */}
        <div className="rounded-lg border border-ink/10 bg-paper p-4">
          <p className="text-xs font-extrabold text-majorelle-700">
            الطريقة ب — ملف HTML
          </p>
          <p className="mt-1.5 text-[11px] leading-6 font-bold text-ink/50">
            إن اخترت <b>HTML file</b>، سيعطيك Google ملفاً باسم مثل{" "}
            <span dir="ltr" className="font-mono text-[10px]">
              google1a2b3c.html
            </span>
            . اكتب اسم الملف هنا وسيُقدَّم تلقائياً من جذر موقعك:
          </p>
          <div className="mt-2.5 flex gap-2">
            <input
              className="input font-mono text-xs"
              dir="ltr"
              value={gfile}
              onChange={(e) => setGfile(e.target.value)}
              placeholder="google1a2b3c4d5e.html"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                save(
                  { google_html_file: gfile.trim() },
                  "تم تفعيل ملف التحقق"
                )
              }
              className="btn-press shrink-0 rounded-lg bg-majorelle-600 px-4 text-xs font-extrabold text-white transition hover:bg-majorelle-700 disabled:opacity-60"
            >
              حفظ
            </button>
          </div>
          {gfile && (
            <a
              href={`/${gfile.trim()}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-[11px] font-bold text-mint-600 underline"
            >
              ✓ تحقق من عمل الملف: /{gfile.trim()}
            </a>
          )}
        </div>
      </div>

      {msg && (
        <p className="animate-rise mt-3 text-xs font-extrabold text-mint-600">
          {msg}
        </p>
      )}

      {/* الخطوات */}
      <ol className="mt-6 grid gap-2.5 rounded-lg bg-ink p-4 text-[12px] leading-6 font-bold text-paper/70">
        <li>
          <b className="text-saffron-400">1.</b> افتح{" "}
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noreferrer"
            className="text-saffron-300 underline"
          >
            search.google.com/search-console
          </a>{" "}
          وسجّل الدخول بحساب Google
        </li>
        <li>
          <b className="text-saffron-400">2.</b> اضغط <b>Add property</b> ← اختر{" "}
          <b>URL prefix</b> (الخانة اليمنى) ← ألصق الرابط أعلاه
        </li>
        <li>
          <b className="text-saffron-400">3.</b> اختر طريقة التحقق (أ أو ب)
          والصق القيمة هنا ثم اضغط <b>Verify</b> في Google
        </li>
        <li>
          <b className="text-saffron-400">4.</b> بعد نجاح التحقق: <b>Sitemaps</b>{" "}
          ← ألصق <span dir="ltr">sitemap.xml</span> ← <b>Submit</b>
        </li>
        <li>
          <b className="text-saffron-400">5.</b> استعمل <b>URL Inspection</b> ثم{" "}
          <b>Request indexing</b> لتسريع ظهور الصفحة الرئيسية
        </li>
      </ol>
    </div>
  );
}
