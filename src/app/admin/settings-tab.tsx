"use client";

import { useEffect, useState } from "react";
import { SaveNote, Spinner, Toggle } from "./ui";
import { IconX } from "@/components/ui";

export function SettingsTab({
  settings,
  categories,
  onChanged,
}: {
  settings: Record<string, string>;
  categories: string[];
  onChanged: () => void;
}) {
  const [shipFee, setShipFee] = useState(settings.shipping_fee ?? "35");
  const [threshold, setThreshold] = useState(settings.free_shipping_threshold ?? "500");
  const [phone, setPhone] = useState(settings.store_phone ?? "");
  const [whatsapp, setWhatsapp] = useState(settings.store_whatsapp ?? "");
  const [siteUrl, setSiteUrl] = useState(
    settings.site_url || "https://chaouishop.app"
  );
  const [urlOn, setUrlOn] = useState(settings.site_url_enabled === "true");
  const [live, setLive] = useState("");

  useEffect(() => {
    setLive(window.location.origin);
  }, []);
  const [cats, setCats] = useState<string[]>(categories);
  const [newCat, setNewCat] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState<"" | "ship" | "cats" | "contact" | "url">("");

  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  };

  const saveSettings = async (
    key: "ship" | "cats" | "contact" | "url",
    payload: Record<string, string>
  ) => {
    setBusy(key);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: payload }),
    });
    setBusy("");
    if (res.ok) {
      flash("تم الحفظ بنجاح");
      onChanged();
    }
  };

  const addCat = () => {
    const c = newCat.trim();
    if (!c || cats.includes(c)) return;
    setCats([...cats, c]);
    setNewCat("");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* رابط المتجر */}
      <div className="rounded-xl border-2 border-majorelle-500/30 bg-white p-5 lg:col-span-2">
        <h3 className="font-extrabold">🌐 رابط المتجر</h3>
        <p className="mt-1 text-xs font-bold text-ink/45">
          يُستعمل في خريطة الموقع، ملف Google Merchant، كود التضمين في Google
          Sites، ونسخة HTML المصدَّرة
        </p>

        <div className="mt-4 rounded-lg border border-mint-600/25 bg-mint-100/60 px-4 py-3">
          <p className="text-xs font-extrabold text-mint-600">
            ✅ الوضع الحالي: الرابط التلقائي (يعمل الآن)
          </p>
          <p
            dir="ltr"
            className="mt-1 font-mono text-[12px] font-bold break-all text-ink/70"
          >
            {live || "..."}
          </p>
          <p className="mt-1.5 text-[11px] leading-6 font-bold text-ink/50">
            النظام يكتشف رابط الخادم تلقائياً، لذا كل الروابط تشتغل دائماً حتى
            قبل ربط نطاقك الخاص.
          </p>
        </div>

        <div className="mt-4">
          <label className="label">
            نطاقك الخاص (فعّله فقط بعد شرائه وربطه فعلياً)
          </label>
          <div className="flex flex-wrap gap-2.5">
            <input
              className="input max-w-md flex-1"
              dir="ltr"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://chaouishop.app"
            />
            <button
              type="button"
              disabled={busy !== ""}
              onClick={() =>
                saveSettings("url", {
                  site_url: siteUrl.trim().replace(/\/$/, ""),
                  site_url_enabled: String(urlOn),
                })
              }
              className="btn-press flex items-center gap-2 rounded-lg bg-majorelle-600 px-6 py-2.5 text-sm font-extrabold text-white shadow-md shadow-majorelle-600/25 transition hover:bg-majorelle-700 disabled:opacity-60"
            >
              {busy === "url" && <Spinner className="h-4 w-4" />}
              حفظ
            </button>
          </div>

          <label className="mt-3.5 flex cursor-pointer items-center gap-3 rounded-lg bg-paper px-4 py-3">
            <Toggle on={urlOn} onChange={setUrlOn} />
            <span className="text-[13px] font-bold">
              استعمل نطاقي الخاص في كل الروابط
              <span className="mt-0.5 block text-[11px] font-bold text-ink/45">
                {urlOn
                  ? "⚠️ مفعّل — تأكد أن النطاق مربوط وإلا ستتوقف الروابط عن العمل"
                  : "معطّل — يُستعمل الرابط التلقائي العامل أعلاه"}
              </span>
            </span>
          </label>
        </div>
        <SaveNote msg={msg} />
      </div>

      {/* التوصيل */}
      <div className="rounded-xl border border-ink/10 bg-white p-5">
        <h3 className="font-extrabold">إعدادات التوصيل</h3>
        <p className="mt-1 text-xs font-bold text-ink/45">
          ثمن التوصيل وعتبة التوصيل المجاني بالدرهم
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="label">ثمن التوصيل (د.م)</label>
            <input
              className="input"
              type="number"
              min={0}
              value={shipFee}
              onChange={(e) => setShipFee(e.target.value)}
            />
          </div>
          <div>
            <label className="label">توصيل مجاني ابتداءً من</label>
            <input
              className="input"
              type="number"
              min={0}
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          disabled={busy !== ""}
          onClick={() =>
            saveSettings("ship", {
              shipping_fee: shipFee,
              free_shipping_threshold: threshold,
            })
          }
          className="btn-press mt-4 flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-extrabold text-paper transition hover:bg-majorelle-600 disabled:opacity-60"
        >
          {busy === "ship" && <Spinner className="h-4 w-4" />}
          حفظ
        </button>
        <SaveNote msg={msg} />
      </div>

      {/* التواصل */}
      <div className="rounded-xl border border-ink/10 bg-white p-5">
        <h3 className="font-extrabold">معلومات التواصل</h3>
        <p className="mt-1 text-xs font-bold text-ink/45">تظهر في الفوتر للمتجر</p>
        <div className="mt-4 grid gap-4">
          <div>
            <label className="label">الهاتف</label>
            <input
              className="input"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0600-000000"
            />
          </div>
          <div>
            <label className="label">واتساب (بالصيغة الدولية)</label>
            <input
              className="input"
              dir="ltr"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="212600000000"
            />
          </div>
        </div>
        <button
          type="button"
          disabled={busy !== ""}
          onClick={() =>
            saveSettings("contact", { store_phone: phone, store_whatsapp: whatsapp })
          }
          className="btn-press mt-4 flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-extrabold text-paper transition hover:bg-majorelle-600 disabled:opacity-60"
        >
          {busy === "contact" && <Spinner className="h-4 w-4" />}
          حفظ
        </button>
        <SaveNote msg={msg} />
      </div>

      {/* الأقسام */}
      <div className="rounded-xl border border-ink/10 bg-white p-5 lg:col-span-2">
        <h3 className="font-extrabold">أقسام المتجر</h3>
        <p className="mt-1 text-xs font-bold text-ink/45">
          أضف أو احذف الأقسام التي تظهر في المتجر
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {cats.map((c) => (
            <span
              key={c}
              className="flex items-center gap-1.5 rounded-full bg-majorelle-100 px-3.5 py-1.5 text-xs font-extrabold text-majorelle-700"
            >
              {c}
              <button
                type="button"
                aria-label={`حذف ${c}`}
                onClick={() => setCats(cats.filter((x) => x !== c))}
                className="text-majorelle-700/50 transition hover:text-danger"
              >
                <IconX className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-3.5 flex max-w-md gap-2">
          <input
            className="input"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCat();
              }
            }}
            placeholder="اسم القسم الجديد..."
          />
          <button
            type="button"
            onClick={addCat}
            className="btn-press shrink-0 rounded-lg border border-ink/15 bg-white px-4 text-sm font-extrabold transition hover:border-ink/40"
          >
            إضافة
          </button>
        </div>
        <button
          type="button"
          disabled={busy !== "" || cats.length === 0}
          onClick={() => saveSettings("cats", { categories: cats.join(",") })}
          className="btn-press mt-4 flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-extrabold text-paper transition hover:bg-majorelle-600 disabled:opacity-60"
        >
          {busy === "cats" && <Spinner className="h-4 w-4" />}
          حفظ الأقسام
        </button>
        <SaveNote msg={msg} />
      </div>
    </div>
  );
}
