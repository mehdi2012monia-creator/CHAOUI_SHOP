"use client";

import { useState, type ReactNode } from "react";
import { GithubVisual } from "./github-visual";

function Copy({ value, multi = false }: { value: string; multi?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex gap-2">
      {multi ? (
        <textarea
          readOnly
          value={value}
          rows={value.split("\n").length}
          dir="ltr"
          onFocus={(e) => e.currentTarget.select()}
          className="input resize-none bg-ink font-mono text-[11px] leading-6 text-paper/90"
        />
      ) : (
        <input
          readOnly
          value={value}
          dir="ltr"
          onFocus={(e) => e.currentTarget.select()}
          className="input bg-ink font-mono text-xs text-paper/90"
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
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="relative rounded-xl border border-ink/10 bg-white p-5 pr-14">
      <span className="absolute right-4 top-5 grid h-8 w-8 place-items-center rounded-full bg-ink text-sm font-extrabold text-paper">
        {n}
      </span>
      <h4 className="font-extrabold">{title}</h4>
      <div className="mt-2 text-[13px] leading-7 text-ink/65">{children}</div>
    </li>
  );
}

export function GithubTab() {
  const [user, setUser] = useState("USERNAME");
  const [repo, setRepo] = useState("mehdishop");
  const [mode, setMode] = useState<"visual" | "text">("visual");

  const u = user.trim() || "USERNAME";
  const r = repo.trim() || "mehdishop";
  const remote = `https://github.com/${u}/${r}.git`;

  const firstPush = `git init
git add .
git commit -m "MEHDISHOP store"
git branch -M main
git remote add origin ${remote}
git push -u origin main`;

  const nextPush = `git add .
git commit -m "تحديث المنتجات"
git push`;

  return (
    <div className="grid gap-5">
      {/* مقدمة */}
      <div className="rounded-xl bg-ink p-5 text-paper">
        <h3 className="font-display text-3xl">رفع المشروع على GitHub</h3>
        <p className="mt-2 text-sm leading-7 text-paper/65">
          GitHub هو المستودع الذي يحفظ كود متجرك، ومنه ينشر Vercel تلقائياً. كل
          تعديل ترفعه يصبح مباشراً على متجرك خلال دقيقة.
        </p>
        <div className="mt-4 grid gap-2.5 text-[13px] font-bold sm:grid-cols-3">
          <span className="rounded-lg bg-white/8 px-3.5 py-2.5">
            💾 نسخة احتياطية دائمة
          </span>
          <span className="rounded-lg bg-white/8 px-3.5 py-2.5">
            🔄 نشر تلقائي عند التعديل
          </span>
          <span className="rounded-lg bg-white/8 px-3.5 py-2.5">
            🆓 مجاني بالكامل
          </span>
        </div>
      </div>

      {/* تحميل المشروع كاملاً */}
      <div className="rounded-xl border-2 border-mint-600/40 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-extrabold">
              📥 تحميل المشروع كاملاً (كود المصدر)
            </h3>
            <p className="mt-1 text-xs leading-6 font-bold text-ink/45">
              حزمة ZIP بكل ملفات المشروع — جاهزة للرفع على GitHub والنشر على
              Vercel
            </p>
          </div>
          <a
            href="/api/export/project"
            className="btn-press shrink-0 rounded-lg bg-mint-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-mint-600/25 transition hover:bg-mint-600/90"
          >
            ⬇ تحميل المشروع (ZIP)
          </a>
        </div>

        <div
          dir="ltr"
          className="mt-4 grid gap-1.5 rounded-lg bg-ink p-4 font-mono text-[11px] leading-6 text-paper/80"
        >
          <span>
            📁 <b className="text-saffron-300">public/images/products</b>
            <span className="text-paper/40"> — 10 صور المنتجات</span>
          </span>
          <span>
            📁 <b className="text-saffron-300">src</b>
            <span className="text-paper/40"> — كود المتجر واللوحة</span>
          </span>
          <span>
            📄 <b className="text-saffron-300">README.md</b>
            <span className="text-paper/40"> — وصف المشروع</span>
          </span>
          <span>
            📄 <b className="text-saffron-300">.env.example</b>
            <span className="text-paper/40"> — نموذج بدون أسرار</span>
          </span>
          <span>
            📄 <b className="text-saffron-300">package.json</b>
            <span className="text-paper/40"> — الاعتماديات</span>
          </span>
          <span>
            📄 <b className="text-saffron-300">DEPLOY-*.md</b>
            <span className="text-paper/40"> — أدلة النشر الثلاثة</span>
          </span>
          <span className="mt-1 border-t border-white/10 pt-2 text-paper/35">
            ✕ node_modules · ✕ .next · ✕ .env{" "}
            <span className="text-mint-600">(مستبعدة — أسرارك آمنة)</span>
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2.5">
          <a
            href="/api/export/project?light=1"
            className="btn-press rounded-lg border border-ink/15 bg-white px-4 py-2 text-xs font-extrabold transition hover:border-ink/40"
          >
            ⬇ نسخة خفيفة (بدون package-lock)
          </a>
          <a
            href="/api/export/zip"
            className="btn-press rounded-lg border border-ink/15 bg-white px-4 py-2 text-xs font-extrabold transition hover:border-ink/40"
          >
            📦 حزمة HTML الثابتة بدل ذلك
          </a>
        </div>

        <p className="mt-3.5 rounded-lg bg-saffron-100/70 px-4 py-3 text-[12px] leading-6 font-bold text-ink/65">
          💡 داخل الحزمة ملف <b>«START-HERE.md»</b> فيه أوامر الرفع جاهزة
          وخطوات النشر على Vercel.
        </p>
      </div>

      {/* حالة المشروع */}
      <div className="rounded-xl border border-mint-600/30 bg-mint-100/50 p-5">
        <h3 className="font-extrabold text-mint-600">
          ✅ المشروع جاهز للرفع الآن
        </h3>
        <ul className="mt-2.5 grid gap-1.5 text-[13px] leading-7 font-bold text-ink/70">
          <li>• تمت تهيئة Git وإنشاء أول commit</li>
          <li>
            • ملف <span dir="ltr" className="font-mono text-[12px]">.env</span>{" "}
            مستبعد — كلمات السر ورابط قاعدة البيانات لن تُرفع
          </li>
          <li>• صور المنتجات العشر مضمّنة في المستودع</li>
          <li>• الفرع الرئيسي اسمه main (كما يتوقع GitHub)</li>
        </ul>
      </div>

      {/* الاسم */}
      <div className="rounded-xl border-2 border-majorelle-500/30 bg-white p-5">
        <h3 className="font-extrabold">✏️ اكتب بياناتك لتوليد الأوامر</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">اسم حسابك على GitHub</label>
            <input
              className="input"
              dir="ltr"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="mehdi-alaoui"
            />
          </div>
          <div>
            <label className="label">اسم المستودع</label>
            <input
              className="input"
              dir="ltr"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="mehdishop"
            />
          </div>
        </div>
      </div>

      {/* مبدّل العرض */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-ink/10 bg-white p-3">
        <span className="ms-1 text-xs font-extrabold text-ink/50">
          طريقة العرض:
        </span>
        <button
          type="button"
          onClick={() => setMode("visual")}
          className={`btn-press rounded-lg px-4 py-2 text-xs font-extrabold transition ${
            mode === "visual"
              ? "bg-majorelle-600 text-white shadow-md shadow-majorelle-600/25"
              : "border border-ink/15 bg-white text-ink/55 hover:border-ink/40"
          }`}
        >
          🖼️ دليل بالصور
        </button>
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`btn-press rounded-lg px-4 py-2 text-xs font-extrabold transition ${
            mode === "text"
              ? "bg-majorelle-600 text-white shadow-md shadow-majorelle-600/25"
              : "border border-ink/15 bg-white text-ink/55 hover:border-ink/40"
          }`}
        >
          📝 دليل نصي
        </button>
      </div>

      {mode === "visual" && <GithubVisual user={u} repo={r} />}

      {/* الخطوات */}
      <ol className={`grid gap-4 ${mode === "visual" ? "hidden" : ""}`}>
        <Step n={1} title="أنشئ حساباً على GitHub (إن لم يكن لديك)">
          سجّل مجاناً في{" "}
          <a
            href="https://github.com/signup"
            target="_blank"
            rel="noreferrer"
            className="font-extrabold text-majorelle-600 underline"
          >
            github.com/signup
          </a>{" "}
          — تحتاج بريداً إلكترونياً فقط.
        </Step>

        <Step n={2} title="أنشئ مستودعاً جديداً فارغاً">
          افتح{" "}
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noreferrer"
            className="font-extrabold text-majorelle-600 underline"
          >
            github.com/new
          </a>{" "}
          ثم:
          <ul className="mt-2 grid gap-1.5 text-[12px]">
            <li>
              • <b>Repository name:</b>{" "}
              <span dir="ltr" className="font-mono">
                {r}
              </span>
            </li>
            <li>
              • اختر <b>Private</b> (خاص) إن أردت إخفاء الكود
            </li>
            <li>
              • ⚠️ <b>لا تضع</b> علامة على README أو .gitignore أو License —
              المشروع يحتويها بالفعل
            </li>
            <li>
              • اضغط <b>Create repository</b>
            </li>
          </ul>
        </Step>

        <Step n={3} title="ارفع المشروع (أول مرة)">
          افتح Terminal في مجلد المشروع والصق:
          <div className="mt-2.5">
            <Copy multi value={firstPush} />
          </div>
          <p className="mt-2 text-[12px] text-ink/45">
            إن كان Git مهيّأً مسبقاً، تكفي آخر سطرين فقط (
            <span dir="ltr" className="font-mono">
              remote add
            </span>{" "}
            و{" "}
            <span dir="ltr" className="font-mono">
              push
            </span>
            ).
          </p>
        </Step>

        <Step n={4} title="سجّل الدخول عند الطلب">
          سيطلب منك GitHub اسم المستخدم وكلمة سر. <b>كلمة سر حسابك لن تعمل</b> —
          تحتاج <b>Personal Access Token</b>:
          <ul className="mt-2 grid gap-1.5 text-[12px]">
            <li>
              1. افتح{" "}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noreferrer"
                className="font-extrabold text-majorelle-600 underline"
              >
                github.com/settings/tokens
              </a>
            </li>
            <li>
              2. <b>Generate new token (classic)</b> ← اختر صلاحية <b>repo</b>
            </li>
            <li>3. انسخ الرمز والصقه مكان كلمة السر</li>
          </ul>
          <p className="mt-2 text-[12px] font-bold text-ink/50">
            💡 أسهل بديل: نزّل{" "}
            <a
              href="https://desktop.github.com"
              target="_blank"
              rel="noreferrer"
              className="font-extrabold text-majorelle-600 underline"
            >
              GitHub Desktop
            </a>{" "}
            وارفع المجلد بالسحب والإفلات — بدون أوامر ولا رموز.
          </p>
        </Step>

        <Step n={5} title="تأكد من نجاح الرفع">
          افتح{" "}
          <a
            href={`https://github.com/${u}/${r}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[12px] font-extrabold text-majorelle-600 underline"
            dir="ltr"
          >
            github.com/{u}/{r}
          </a>{" "}
          — يجب أن ترى 66 ملفاً ومجلد{" "}
          <span dir="ltr" className="font-mono">
            public/images
          </span>{" "}
          بصور المنتجات.
        </Step>
      </ol>

      {/* التحديثات اللاحقة */}
      <div className="rounded-xl border border-ink/10 bg-white p-5">
        <h3 className="font-extrabold">🔄 رفع أي تعديل لاحقاً</h3>
        <p className="mt-1 text-xs font-bold text-ink/45">
          ثلاثة أوامر فقط في كل مرة — وإذا كان المتجر منشوراً على Vercel، يتحدث
          تلقائياً خلال دقيقة
        </p>
        <div className="mt-3">
          <Copy multi value={nextPush} />
        </div>
      </div>

      {/* الخطوة التالية */}
      <div className="rounded-xl border-2 border-saffron-500/40 bg-saffron-100/60 p-5">
        <h3 className="font-extrabold text-saffron-600">
          ⏭️ بعد الرفع على GitHub
        </h3>
        <p className="mt-2 text-[13px] leading-7 font-bold text-ink/70">
          انتقل إلى تبويب <b>«النشر على Vercel»</b> واربط المستودع — سيصبح متجرك
          مباشراً على الإنترنت خلال دقيقتين، ثم اربط نطاقك{" "}
          <span dir="ltr" className="font-mono text-[12px]">
            chaouishop.app
          </span>
          .
        </p>
      </div>

      {/* مشاكل */}
      <div className="rounded-xl border border-ink/10 bg-white p-5">
        <h3 className="font-extrabold">🔧 مشاكل شائعة</h3>
        <div className="mt-3 grid gap-3 text-[13px] leading-7">
          <div className="rounded-lg bg-paper p-3.5">
            <b dir="ltr" className="font-mono text-[12px]">
              remote origin already exists
            </b>
            <p className="text-ink/60">
              استعمل{" "}
              <span dir="ltr" className="font-mono text-[12px]">
                git remote set-url origin {remote}
              </span>
            </p>
          </div>
          <div className="rounded-lg bg-paper p-3.5">
            <b dir="ltr" className="font-mono text-[12px]">
              Authentication failed
            </b>
            <p className="text-ink/60">
              استعمل Personal Access Token بدل كلمة السر (الخطوة 4).
            </p>
          </div>
          <div className="rounded-lg bg-paper p-3.5">
            <b dir="ltr" className="font-mono text-[12px]">
              rejected — non-fast-forward
            </b>
            <p className="text-ink/60">
              المستودع يحتوي ملفات — احذفه وأنشئه فارغاً، أو استعمل{" "}
              <span dir="ltr" className="font-mono text-[12px]">
                git push -u origin main --force
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
