```tsx
"use client";

import { useEffect, useState } from "react";

export function AdminPanel() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("لوحة إدارة MEHDISTORE جاهزة");
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto p-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            لوحة إدارة MEHDISTORE
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            إدارة المتجر والمنتجات والإعدادات
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4 text-sm">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-5">
            <h2 className="font-semibold">المنتجات</h2>
            <p className="mt-2 text-sm text-gray-500">
              إدارة منتجات المتجر
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <h2 className="font-semibold">الطلبات</h2>
            <p className="mt-2 text-sm text-gray-500">
              متابعة طلبات الزبائن
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <h2 className="font-semibold">الإعدادات</h2>
            <p className="mt-2 text-sm text-gray-500">
              إعدادات المتجر
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPanel;
```
