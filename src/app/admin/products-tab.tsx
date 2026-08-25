"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/db/schema";
import { mad } from "@/lib/format";
import { AdminModal, Spinner, Toggle } from "./ui";
import {
  IconEdit,
  IconPlus,
  IconSearch,
  IconTag,
  IconTrash,
} from "@/components/ui";

type FormState = {
  name: string;
  category: string;
  price: string;
  oldPrice: string;
  stock: string;
  image: string;
  description: string;
  featured: boolean;
  active: boolean;
};

const emptyForm = (category: string): FormState => ({
  name: "",
  category,
  price: "",
  oldPrice: "",
  stock: "10",
  image: "",
  description: "",
  featured: false,
  active: true,
});

function toForm(p: Product): FormState {
  return {
    name: p.name,
    category: p.category,
    price: String(p.price),
    oldPrice: p.oldPrice ? String(p.oldPrice) : "",
    stock: String(p.stock),
    image: p.image,
    description: p.description,
    featured: p.featured,
    active: p.active,
  };
}

export function ProductsTab({
  products,
  categories,
  onChanged,
}: {
  products: Product[];
  categories: string[];
  onChanged: () => void;
}) {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(categories[0] ?? ""));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim();
    if (!s) return products;
    return products.filter(
      (p) => p.name.includes(s) || p.category.includes(s)
    );
  }, [products, q]);

  const openNew = () => {
    setForm(emptyForm(categories[0] ?? ""));
    setError("");
    setEditing("new");
  };
  const openEdit = (p: Product) => {
    setForm(toForm(p));
    setError("");
    setEditing(p);
  };

  const patchToggle = async (p: Product, field: "featured" | "active", v: boolean) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: v }),
    });
    onChanged();
  };

  const remove = async (p: Product) => {
    if (!confirm(`هل أنت متأكد من حذف «${p.name}»؟`)) return;
    await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    onChanged();
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price);
    if (!form.name.trim() || !Number.isFinite(price) || price <= 0 || !form.image.trim()) {
      setError("المرجو ملء الاسم والثمن ورابط الصورة");
      return;
    }
    setBusy(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || categories[0],
      price,
      oldPrice: form.oldPrice === "" ? null : Number(form.oldPrice),
      stock: Number(form.stock) || 0,
      image: form.image.trim(),
      description: form.description.trim(),
      featured: form.featured,
      active: form.active,
    };
    const isNew = editing === "new";
    const res = await fetch(
      isNew ? "/api/admin/products" : `/api/admin/products/${(editing as Product).id}`,
      {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "تعذر الحفظ");
      return;
    }
    setEditing(null);
    onChanged();
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="rounded-xl border border-ink/10 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 p-4">
        <div className="relative w-full sm:w-72">
          <IconSearch className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث في المنتجات..."
            className="input pr-10"
          />
        </div>
        <button
          type="button"
          onClick={openNew}
          className="btn-press flex items-center gap-2 rounded-lg bg-majorelle-600 px-4.5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-majorelle-600/25 transition hover:bg-majorelle-700"
        >
          <IconPlus className="h-4 w-4" />
          إضافة منتج
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-ink/10 bg-paper/60 text-right text-[11px] font-extrabold text-ink/50">
              <th className="px-4 py-3">المنتج</th>
              <th className="px-4 py-3">القسم</th>
              <th className="px-4 py-3">الثمن</th>
              <th className="px-4 py-3">المخزون</th>
              <th className="px-4 py-3">مميز</th>
              <th className="px-4 py-3">نشط</th>
              <th className="px-4 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {filtered.map((p) => (
              <tr key={p.id} className="transition hover:bg-paper/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-11 w-11 rounded-lg border border-ink/10 object-cover"
                    />
                    <div>
                      <p className="max-w-60 truncate font-extrabold">{p.name}</p>
                      <p className="text-[11px] font-bold text-ink/40">#{p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-majorelle-100 px-2 py-1 text-[11px] font-extrabold text-majorelle-700">
                    {p.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-extrabold">{mad(p.price)}</p>
                  {p.oldPrice && (
                    <p className="text-[11px] font-bold text-ink/35 line-through">
                      {mad(p.oldPrice)}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-extrabold ${
                      p.stock === 0
                        ? "text-danger"
                        : p.stock <= 5
                          ? "text-saffron-600"
                          : "text-ink"
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Toggle on={p.featured} onChange={(v) => patchToggle(p, "featured", v)} />
                </td>
                <td className="px-4 py-3">
                  <Toggle on={p.active} onChange={(v) => patchToggle(p, "active", v)} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      aria-label="تعديل"
                      className="grid h-8.5 w-8.5 place-items-center rounded-lg text-ink/45 transition hover:bg-majorelle-100 hover:text-majorelle-700"
                    >
                      <IconEdit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(p)}
                      aria-label="حذف"
                      className="grid h-8.5 w-8.5 place-items-center rounded-lg text-ink/45 transition hover:bg-danger/10 hover:text-danger"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-14 text-center">
                  <IconTag className="mx-auto h-8 w-8 text-ink/20" />
                  <p className="mt-3 text-sm font-bold text-ink/40">لا توجد منتجات</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing !== null && (
        <AdminModal
          title={editing === "new" ? "إضافة منتج جديد" : "تعديل المنتج"}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save} className="grid gap-4">
            <div>
              <label className="label">اسم المنتج *</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="مثال: قلاية هوائية رقمية 5 لتر"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">القسم</label>
                <input
                  className="input"
                  list="admin-categories"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                />
                <datalist id="admin-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="label">الثمن (د.م) *</label>
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="299"
                />
              </div>
              <div>
                <label className="label">الثمن قبل التخفيض</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={form.oldPrice}
                  onChange={(e) => set("oldPrice", e.target.value)}
                  placeholder="اختياري"
                />
              </div>
            </div>
            <div>
              <label className="label">رابط الصورة *</label>
              <input
                className="input"
                dir="ltr"
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="/images/products/....jpg أو https://..."
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="معاينة"
                  className="mt-2.5 h-24 w-24 rounded-lg border border-ink/10 object-cover"
                />
              )}
            </div>
            <div>
              <label className="label">الوصف</label>
              <textarea
                className="input min-h-24 resize-none"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="وصف مختصر يظهر في صفحة المنتج..."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">المخزون</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => set("stock", e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2.5 self-end pb-2.5 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="h-4.5 w-4.5 accent-majorelle-600"
                />
                منتج مميز
              </label>
              <label className="flex items-center gap-2.5 self-end pb-2.5 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => set("active", e.target.checked)}
                  className="h-4.5 w-4.5 accent-majorelle-600"
                />
                ظاهر في المتجر
              </label>
            </div>
            {error && (
              <p className="rounded-lg bg-danger/10 px-3.5 py-2.5 text-xs font-bold text-danger">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2.5 border-t border-ink/10 pt-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="btn-press rounded-lg px-5 py-2.5 text-sm font-bold text-ink/55 transition hover:bg-ink/5"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={busy}
                className="btn-press flex items-center gap-2 rounded-lg bg-ink px-6 py-2.5 text-sm font-extrabold text-paper transition hover:bg-majorelle-600 disabled:opacity-60"
              >
                {busy && <Spinner className="h-4 w-4" />}
                حفظ المنتج
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}
