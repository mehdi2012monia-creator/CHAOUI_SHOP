"use client";

import { useState, type ReactNode } from "react";

/* ───────────── عناصر المحاكاة ───────────── */

function Browser({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) {
  return (
    <div
      dir="ltr"
      className="overflow-hidden rounded-xl border border-ink/15 bg-white shadow-[0_14px_34px_-16px_rgba(14,23,38,.4)]"
    >
      <div className="flex items-center gap-2.5 border-b border-ink/10 bg-[#f6f8fa] px-3 py-2.5">
        <span className="flex gap-1.5">
          <i className="block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <i className="block h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <i className="block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <div className="flex flex-1 items-center gap-1.5 rounded-md border border-ink/10 bg-white px-2.5 py-1">
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-mint-600" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span className="font-mono text-[10px] text-ink/55">{url}</span>
        </div>
      </div>
      <div className="bg-white p-4">{children}</div>
    </div>
  );
}

function Terminal({ lines }: { lines: { t: string; c?: string }[] }) {
  return (
    <div
      dir="ltr"
      className="overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-[0_14px_34px_-16px_rgba(14,23,38,.6)]"
    >
      <div className="flex items-center gap-2.5 border-b border-white/10 bg-[#161b22] px-3 py-2.5">
        <span className="flex gap-1.5">
          <i className="block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <i className="block h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <i className="block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="font-mono text-[10px] text-white/40">
          Terminal — mehdishop
        </span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-6">
        {lines.map((l, i) => (
          <div key={i} className={l.c ?? "text-white/70"}>
            {l.t}
          </div>
        ))}
      </pre>
    </div>
  );
}

/** رقم دائري يشير إلى موضع في الصورة */
function Pin({
  n,
  className,
}: {
  n: number;
  className: string;
}) {
  return (
    <span
      className={`absolute z-10 grid h-6 w-6 place-items-center rounded-full bg-danger text-[11px] font-extrabold text-white shadow-lg ring-3 ring-white ${className}`}
    >
      {n}
    </span>
  );
}

function Note({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-2.5 text-[13px] leading-7">
      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-danger text-[10px] font-extrabold text-white">
        {n}
      </span>
      <span className="text-ink/70">{children}</span>
    </li>
  );
}

function Frame({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-ink/10 bg-paper p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <span className="rounded-md bg-ink px-2.5 py-1 text-[11px] font-extrabold text-paper">
          {step}
        </span>
        <h4 className="font-extrabold">{title}</h4>
      </div>
      {children}
    </section>
  );
}

/* ───────────── الدليل المصوّر ───────────── */

export function GithubVisual({
  user,
  repo,
}: {
  user: string;
  repo: string;
}) {
  const [tab, setTab] = useState<"terminal" | "desktop">("desktop");
  const remote = `https://github.com/${user}/${repo}.git`;

  return (
    <div className="grid gap-5">
      {/* ١ — إنشاء المستودع */}
      <Frame step="الصورة ١" title="أنشئ مستودعاً فارغاً على github.com/new">
        <div className="relative">
          <Browser url="github.com/new">
            <p className="mb-3 border-b border-ink/10 pb-2 text-[13px] font-bold text-ink">
              Create a new repository
            </p>

            <div className="relative mb-3 flex items-end gap-2">
              <div>
                <label className="mb-1 block text-[10px] font-bold text-ink/50">
                  Owner *
                </label>
                <div className="flex items-center gap-1.5 rounded-md border border-ink/15 bg-[#f6f8fa] px-2.5 py-1.5">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-majorelle-600 text-[8px] font-bold text-white">
                    {user.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="font-mono text-[11px]">{user}</span>
                </div>
              </div>
              <span className="pb-2 text-ink/40">/</span>
              <div className="flex-1">
                <label className="mb-1 block text-[10px] font-bold text-ink/50">
                  Repository name *
                </label>
                <div className="rounded-md border-2 border-majorelle-500 px-2.5 py-1.5 font-mono text-[11px]">
                  {repo}
                </div>
              </div>
              <Pin n={1} className="-top-1 right-[38%]" />
            </div>
            <p className="mb-4 text-[10px] font-bold text-mint-600">
              ✓ {repo} is available.
            </p>

            <div className="relative mb-4 grid gap-2">
              <label className="flex items-start gap-2 rounded-md border border-ink/15 p-2">
                <span className="mt-0.5 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-ink/25" />
                <span className="text-[11px]">
                  <b>Public</b>
                  <span className="block text-[10px] text-ink/45">
                    Anyone on the internet can see this repository.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2 rounded-md border-2 border-majorelle-500 bg-majorelle-50 p-2">
                <span className="mt-0.5 grid h-3.5 w-3.5 place-items-center rounded-full border-[4px] border-majorelle-600" />
                <span className="text-[11px]">
                  <b>Private</b>
                  <span className="block text-[10px] text-ink/45">
                    You choose who can see this repository.
                  </span>
                </span>
              </label>
              <Pin n={2} className="-top-2 left-1" />
            </div>

            <div className="relative rounded-md border border-danger/40 bg-danger/5 p-2.5">
              <p className="mb-1.5 text-[10px] font-bold text-ink/60">
                Initialize this repository with:
              </p>
              {["Add a README file", "Add .gitignore", "Choose a license"].map(
                (t) => (
                  <div key={t} className="flex items-center gap-2 py-0.5">
                    <span className="grid h-3.5 w-3.5 place-items-center rounded border-2 border-danger text-[9px] font-bold text-danger">
                      ✕
                    </span>
                    <span className="text-[11px] text-ink/60 line-through">
                      {t}
                    </span>
                  </div>
                )
              )}
              <Pin n={3} className="-top-2 left-1" />
            </div>

            <div className="relative mt-4 flex justify-end">
              <span className="rounded-md bg-[#1f883d] px-4 py-1.5 text-[11px] font-bold text-white">
                Create repository
              </span>
              <Pin n={4} className="-top-2 -left-2" />
            </div>
          </Browser>
        </div>

        <ul className="mt-4 grid gap-2">
          <Note n={1}>
            اكتب اسم المستودع:{" "}
            <b dir="ltr" className="font-mono">
              {repo}
            </b>
          </Note>
          <Note n={2}>
            اختر <b>Private</b> ليبقى الكود خاصاً بك (أو Public إن أردته مفتوحاً)
          </Note>
          <Note n={3}>
            <b className="text-danger">مهم جداً:</b> اترك هذه الخانات الثلاث
            فارغة — المشروع يحتوي README و .gitignore بالفعل، وإضافتها تسبب
            تعارضاً عند الرفع
          </Note>
          <Note n={4}>
            اضغط <b>Create repository</b> — ستنتقل لصفحة فارغة بها أوامر
          </Note>
        </ul>
      </Frame>

      {/* ٢ — طريقة الرفع */}
      <Frame step="الصورة ٢" title="ارفع المشروع — اختر الطريقة الأنسب لك">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("desktop")}
            className={`btn-press rounded-lg px-4 py-2 text-xs font-extrabold transition ${
              tab === "desktop"
                ? "bg-ink text-paper"
                : "border border-ink/15 bg-white text-ink/55"
            }`}
          >
            🖱️ بدون أوامر (مستحسن)
          </button>
          <button
            type="button"
            onClick={() => setTab("terminal")}
            className={`btn-press rounded-lg px-4 py-2 text-xs font-extrabold transition ${
              tab === "terminal"
                ? "bg-ink text-paper"
                : "border border-ink/15 bg-white text-ink/55"
            }`}
          >
            ⌨️ عبر Terminal
          </button>
        </div>

        {tab === "desktop" ? (
          <>
            <div className="relative">
              <div
                dir="ltr"
                className="overflow-hidden rounded-xl border border-ink/15 shadow-[0_14px_34px_-16px_rgba(14,23,38,.4)]"
              >
                <div className="flex items-center gap-2.5 bg-[#24292f] px-3 py-2.5">
                  <span className="flex gap-1.5">
                    <i className="block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <i className="block h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <i className="block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </span>
                  <span className="text-[10px] font-bold text-white/60">
                    GitHub Desktop
                  </span>
                </div>

                <div className="flex items-center gap-3 border-b border-ink/10 bg-[#f6f8fa] px-3 py-2">
                  <div className="relative rounded-md border border-ink/15 bg-white px-3 py-1.5 text-[10px]">
                    <span className="block text-ink/45">Current repository</span>
                    <b className="text-[11px]">{repo}</b>
                    <Pin n={1} className="-top-2 -left-2" />
                  </div>
                  <div className="relative ml-auto rounded-md bg-[#1f883d] px-3.5 py-2 text-[10px] font-bold text-white">
                    ⬆ Publish repository
                    <Pin n={3} className="-top-2 -left-2" />
                  </div>
                </div>

                <div className="grid grid-cols-[150px_1fr] bg-white">
                  <div className="border-l border-ink/10 bg-[#f6f8fa] p-2.5">
                    <p className="mb-1.5 text-[9px] font-bold text-ink/45">
                      66 changed files
                    </p>
                    {["README.md", "package.json", "src/app/page.tsx", "public/images/"].map(
                      (f) => (
                        <div
                          key={f}
                          className="flex items-center gap-1.5 py-0.5 font-mono text-[9px] text-ink/60"
                        >
                          <span className="text-mint-600">+</span>
                          {f}
                        </div>
                      )
                    )}
                  </div>
                  <div className="relative p-3">
                    <div className="rounded-md border border-ink/15 p-2">
                      <p className="font-mono text-[10px] text-ink/70">
                        MEHDISHOP store
                      </p>
                    </div>
                    <div className="mt-2 rounded-md bg-[#1f883d] px-3 py-1.5 text-center text-[10px] font-bold text-white">
                      ✓ Commit to main
                    </div>
                    <Pin n={2} className="top-1 left-1" />
                  </div>
                </div>
              </div>
            </div>

            <ul className="mt-4 grid gap-2">
              <Note n={1}>
                نزّل{" "}
                <a
                  href="https://desktop.github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-extrabold text-majorelle-600 underline"
                >
                  GitHub Desktop
                </a>{" "}
                ← <b>File</b> ← <b>Add local repository</b> ← اختر مجلد المشروع
              </Note>
              <Note n={2}>
                اكتب وصفاً بسيطاً واضغط <b>Commit to main</b>
              </Note>
              <Note n={3}>
                اضغط <b>Publish repository</b> — وأزل علامة{" "}
                <span dir="ltr">Keep this code private</span> إن أردته عاماً
              </Note>
            </ul>
            <p className="mt-3 rounded-lg bg-mint-100/60 px-4 py-3 text-[12px] leading-6 font-bold text-mint-600">
              ✅ هذه الطريقة لا تحتاج أوامر ولا Personal Access Token — يسجّل
              دخولك تلقائياً بحسابك.
            </p>
          </>
        ) : (
          <>
            <Terminal
              lines={[
                { t: `$ git remote add origin ${remote}`, c: "text-[#7ee787]" },
                { t: "$ git push -u origin main", c: "text-[#7ee787]" },
                { t: "" },
                { t: `Username: ${user}`, c: "text-white/50" },
                {
                  t: "Password: ghp_xxxxxxxxxxxxxxxxxxxx   ← الصق الـ token هنا",
                  c: "text-[#ffa657]",
                },
                { t: "" },
                { t: "Enumerating objects: 78, done.", c: "text-white/45" },
                { t: "Compressing objects: 100% (72/72), done.", c: "text-white/45" },
                { t: "Writing objects: 100% (78/78), 1.42 MiB, done.", c: "text-white/45" },
                { t: `To ${remote}`, c: "text-white/45" },
                { t: " * [new branch]      main -> main", c: "text-[#7ee787]" },
                {
                  t: "✓ branch 'main' set up to track 'origin/main'.",
                  c: "text-[#7ee787]",
                },
              ]}
            />
            <div className="mt-4 rounded-lg border border-saffron-500/35 bg-saffron-100/60 p-4">
              <p className="text-[13px] font-extrabold text-saffron-600">
                🔑 كلمة سر حسابك لن تعمل — تحتاج Personal Access Token
              </p>
              <ol className="mt-2 grid gap-1 text-[12px] leading-6 font-bold text-ink/65">
                <li>
                  1. افتح{" "}
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="text-majorelle-600 underline"
                  >
                    github.com/settings/tokens
                  </a>
                </li>
                <li>
                  2. <b>Generate new token</b> ← <b>(classic)</b>
                </li>
                <li>
                  3. ضع علامة على صلاحية <b dir="ltr">repo</b> ← Generate
                </li>
                <li>
                  4. انسخ الرمز{" "}
                  <span dir="ltr" className="font-mono">
                    ghp_...
                  </span>{" "}
                  والصقه مكان كلمة السر
                </li>
              </ol>
            </div>
          </>
        )}
      </Frame>

      {/* ٣ — النتيجة */}
      <Frame step="الصورة ٣" title="تأكد من نجاح الرفع">
        <Browser url={`github.com/${user}/${repo}`}>
          <div className="mb-3 flex items-center gap-2 border-b border-ink/10 pb-2.5">
            <span className="text-[13px]">📕</span>
            <span className="font-mono text-[12px] font-bold text-majorelle-600">
              {user} / <b>{repo}</b>
            </span>
            <span className="rounded-full border border-ink/20 px-2 py-0.5 text-[9px] font-bold text-ink/50">
              Private
            </span>
          </div>

          <div className="overflow-hidden rounded-md border border-ink/15">
            <div className="flex items-center justify-between bg-[#f6f8fa] px-3 py-1.5 text-[10px] text-ink/50">
              <span>
                <b className="text-ink/70">{user}</b> MEHDISHOP store
              </span>
              <span>68 files</span>
            </div>
            {[
              { i: "📁", n: "public/images/products", d: "10 صور المنتجات" },
              { i: "📁", n: "src", d: "كود المتجر واللوحة" },
              { i: "📄", n: "README.md", d: "وصف المشروع" },
              { i: "📄", n: ".env.example", d: "نموذج بدون أسرار" },
              { i: "📄", n: "package.json", d: "الاعتماديات" },
            ].map((f) => (
              <div
                key={f.n}
                className="flex items-center gap-2 border-t border-ink/8 px-3 py-1.5"
              >
                <span className="text-[11px]">{f.i}</span>
                <span className="font-mono text-[11px] text-majorelle-600">
                  {f.n}
                </span>
                <span className="mr-auto text-[10px] text-ink/40">{f.d}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-md border border-mint-600/30 bg-mint-100/50 px-3 py-2">
            <span className="text-[12px]">🔒</span>
            <span className="text-[10px] font-bold text-mint-600">
              لا يوجد ملف .env في القائمة — هذا صحيح ومقصود، أسرارك آمنة
            </span>
          </div>
        </Browser>

        <p className="mt-4 rounded-lg bg-ink px-4 py-3.5 text-[13px] leading-7 font-bold text-paper/75">
          ⏭️ <b className="text-saffron-300">الخطوة التالية:</b> انتقل إلى تبويب{" "}
          <b className="text-paper">«النشر على Vercel»</b> واربط هذا المستودع —
          متجرك يصبح مباشراً على الإنترنت خلال دقيقتين.
        </p>
      </Frame>
    </div>
  );
}
