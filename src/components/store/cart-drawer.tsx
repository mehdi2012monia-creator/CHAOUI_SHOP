"use client";

import { useState } from "react";
import { mad, MOROCCAN_CITIES } from "@/lib/format";
import { useStore } from "./store-context";
import {
  IconArrowLeft,
  IconCart,
  IconCash,
  IconCheck,
  IconTrash,
  IconX,
  QtyStepper,
} from "@/components/ui";

type Errors = Partial<Record<"name" | "phone" | "city" | "address", string>>;

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    step,
    setStep,
    lines,
    cartCount,
    subtotal,
    shipping,
    total,
    freeThreshold,
    shippingFee,
    setQty,
    removeLine,
    clearCart,
    lastOrder,
  } = useStore();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: MOROCCAN_CITIES[0],
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");

  const close = () => setCartOpen(false);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (form.name.trim().length < 3) errs.name = "اكتب اسمك الكامل";
    if (!/^0[5-7]\d{8}$/.test(form.phone.replace(/\s/g, "")))
      errs.phone = "رقم هاتف مغربي غير صحيح (مثال: 0612345678)";
    if (form.address.trim().length < 6) errs.address = "اكتب عنواناً كاملاً";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setBusy(true);
    setServerError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { ...form, phone: form.phone.replace(/\s/g, "") },
          items: lines.map((l) => ({ productId: l.productId, qty: l.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "وقع مشكل، عاود المحاولة");
      clearCart();
      setStep("done");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "وقع مشكل");
    } finally {
      setBusy(false);
    }
  };

  const missing = Math.max(0, freeThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeThreshold) * 100);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        cartOpen ? "visible" : "invisible delay-300"
      }`}
      aria-hidden={!cartOpen}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* الرأس */}
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="flex items-center gap-2.5 text-lg font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-saffron-400">
              <IconCart className="h-4.5 w-4.5" />
            </span>
            {step === "cart" && (
              <>
                سلة المشتريات
                <span className="rounded-full bg-majorelle-100 px-2.5 py-0.5 text-xs font-extrabold text-majorelle-700">
                  {cartCount}
                </span>
              </>
            )}
            {step === "form" && "معلومات التوصيل"}
            {step === "done" && "تم تأكيد الطلب"}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="إغلاق"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink/50 transition hover:bg-ink/5 hover:text-ink"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        {/* ------------ السلة ------------ */}
        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-ink/5 text-ink/30">
                    <IconCart className="h-9 w-9" />
                  </span>
                  <p className="mt-4 font-extrabold">السلة فارغة</p>
                  <p className="mt-1 text-sm text-ink/50">
                    عثر على منتجات تعجبك وزيدها للسلة
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="btn-press mt-5 rounded-lg bg-ink px-6 py-2.5 text-sm font-bold text-paper transition hover:bg-majorelle-600"
                  >
                    ابدأ التسوق
                  </button>
                </div>
              ) : (
                <ul className="grid gap-3.5">
                  {lines.map((l) => (
                    <li
                      key={l.productId}
                      className="flex gap-3 rounded-xl border border-ink/10 bg-white p-3"
                    >
                      <img
                        src={l.product.image}
                        alt={l.product.name}
                        className="h-20 w-20 shrink-0 rounded-lg object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="line-clamp-2 text-[13px] leading-5 font-bold">
                            {l.product.name}
                          </h4>
                          <button
                            type="button"
                            aria-label="حذف"
                            onClick={() => removeLine(l.productId)}
                            className="text-ink/30 transition hover:text-danger"
                          >
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <QtyStepper
                            small
                            qty={l.qty}
                            max={l.product.stock}
                            onChange={(q) => setQty(l.productId, q)}
                          />
                          <span className="text-sm font-extrabold text-majorelle-700">
                            {mad(l.product.price * l.qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-ink/10 bg-white px-5 py-4">
                {missing > 0 ? (
                  <p className="text-xs font-bold text-ink/60">
                    زيد{" "}
                    <span className="text-saffron-600">{mad(missing)}</span>{" "}
                    باش تستافد من التوصيل المجاني
                  </p>
                ) : (
                  <p className="flex items-center gap-1.5 text-xs font-extrabold text-mint-600">
                    <IconCheck className="h-3.5 w-3.5" />
                    مبروك! حصلت على التوصيل المجاني
                  </p>
                )}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full bg-saffron-400 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <dl className="mt-4 grid gap-1.5 text-sm">
                  <div className="flex justify-between text-ink/70">
                    <dt>المجموع الفرعي</dt>
                    <dd className="font-bold">{mad(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-ink/70">
                    <dt>التوصيل</dt>
                    <dd className={`font-bold ${shipping === 0 ? "text-mint-600" : ""}`}>
                      {shipping === 0 ? "مجاني" : mad(shipping)}
                    </dd>
                  </div>
                  <div className="mt-1 flex justify-between border-t border-dashed border-ink/15 pt-2.5 text-base font-extrabold">
                    <dt>المجموع</dt>
                    <dd className="text-majorelle-700">{mad(total)}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="btn-press mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-majorelle-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-majorelle-600/25 transition hover:bg-majorelle-700"
                >
                  إتمام الطلب
                  <IconArrowLeft className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ------------ نموذج الطلب ------------ */}
        {step === "form" && (
          <form onSubmit={submitOrder} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <button
                type="button"
                onClick={() => setStep("cart")}
                className="mb-4 flex items-center gap-1.5 text-xs font-extrabold text-ink/50 transition hover:text-ink"
              >
                <IconArrowLeft className="h-3.5 w-3.5 rotate-180" />
                الرجوع للسلة
              </button>

              <div className="grid gap-4">
                <div>
                  <label className="label">الاسم الكامل *</label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => set("name")(e.target.value)}
                    placeholder="مثال: المهدي العلوي"
                  />
                  {errors.name && (
                    <p className="mt-1 text-[11px] font-bold text-danger">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="label">رقم الهاتف *</label>
                  <input
                    className="input text-left"
                    dir="ltr"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => set("phone")(e.target.value)}
                    placeholder="0612345678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[11px] font-bold text-danger">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="label">المدينة *</label>
                  <select
                    className="input"
                    value={form.city}
                    onChange={(e) => set("city")(e.target.value)}
                  >
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">العنوان الكامل *</label>
                  <input
                    className="input"
                    value={form.address}
                    onChange={(e) => set("address")(e.target.value)}
                    placeholder="الحي، الشارع، رقم المنزل..."
                  />
                  {errors.address && (
                    <p className="mt-1 text-[11px] font-bold text-danger">{errors.address}</p>
                  )}
                </div>
                <div>
                  <label className="label">ملاحظة (اختياري)</label>
                  <textarea
                    className="input min-h-20 resize-none"
                    value={form.note}
                    onChange={(e) => set("note")(e.target.value)}
                    placeholder="أي ملاحظة للتوصيل..."
                  />
                </div>

                <div className="flex items-center gap-2.5 rounded-lg bg-saffron-100 px-3.5 py-3 text-xs font-bold text-saffron-600">
                  <IconCash className="h-5 w-5 shrink-0" />
                  الدفع عند الاستلام — ما تخلص والو حتى توصلك السلعة
                </div>
                {serverError && (
                  <p className="rounded-lg bg-danger/10 px-3.5 py-2.5 text-xs font-bold text-danger">
                    {serverError}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-ink/10 bg-white px-5 py-4">
              <div className="mb-3 flex justify-between text-sm font-extrabold">
                <span>
                  المجموع ({cartCount} منتجات)
                  <span className="ms-2 text-xs font-bold text-ink/45">
                    توصيل: {shipping === 0 ? "مجاني" : mad(shipping)}
                  </span>
                </span>
                <span className="text-majorelle-700">{mad(total)}</span>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="btn-press w-full rounded-lg bg-ink py-3.5 text-sm font-extrabold text-paper transition hover:bg-majorelle-600 disabled:opacity-60"
              >
                {busy ? "جاري إرسال الطلب..." : `تأكيد الطلب — ${mad(total)}`}
              </button>
            </div>
          </form>
        )}

        {/* ------------ النجاح ------------ */}
        {step === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-8 text-center">
            <span className="animate-pop grid h-24 w-24 place-items-center rounded-full bg-mint-100 text-mint-600">
              <IconCheck className="h-11 w-11" strokeWidth={3} />
            </span>
            <h3 className="mt-6 font-display text-3xl">شكراً على ثقتك!</h3>
            <p className="mt-2 text-sm leading-7 text-ink/60">
              تم تسجيل طلبك بنجاح وسنتصل بك قريباً لتأكيده.
              <br />
              احتفظ برقم الطلب للمتابعة:
            </p>
            <div className="mt-5 rounded-xl border-2 border-dashed border-saffron-500/60 bg-saffron-100/60 px-8 py-4">
              <span className="block text-xs font-bold text-ink/50">رقم الطلب</span>
              <span className="mt-1 block text-2xl font-extrabold tracking-wider text-majorelle-700" dir="ltr">
                {lastOrder?.ref}
              </span>
              <span className="mt-1 block text-sm font-extrabold">
                {lastOrder ? mad(lastOrder.total) : ""}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep("cart");
                close();
              }}
              className="btn-press mt-7 rounded-lg bg-ink px-8 py-3 text-sm font-extrabold text-paper transition hover:bg-majorelle-600"
            >
              مواصلة التسوق
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
