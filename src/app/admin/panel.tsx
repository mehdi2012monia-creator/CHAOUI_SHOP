```tsx
"use client";

import { useState } from "react";

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="w-full min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">لوحة تحكم MEHDISTORE</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            إدارة المتجر والمنتجات والطلبات
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`rounded-lg px-4 py-2 text-sm ${
              activeTab === "dashboard"
                ? "bg-black text-white"
                : "border bg-white"
            }`}
          >
            الرئيسية
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`rounded-lg px-4 py-2 text-sm ${
              activeTab === "products"
                ? "bg-black text-white"
                : "border bg-white"
            }`}
          >
            المنتجات
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`rounded-lg px-4 py-2 text-sm ${
              activeTab === "orders"
                ? "bg-black text-white"
                : "border bg-white"
            }`}
          >
            الطلبات
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`rounded-lg px-4 py-2 text-sm ${
              activeTab === "settings"
                ? "bg-black text-white"
                : "border bg-white"
            }`}
          >
            الإعدادات
          </button>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-xl font-semibold">لوحة التحكم</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border p-5">
                  <p className="text-sm text-gray-500">المنتجات</p>
                  <p className="mt-2 text-3xl font-bold">0</p>
                </div>

                <div className="rounded-xl border p-5">
                  <p className="text-sm text-gray-500">الطلبات</p>
                  <p className="mt-2 text-3xl font-bold">0</p>
                </div>

                <div className="rounded-xl border p-5">
                  <p className="text-sm text-gray-500">المبيعات</p>
                  <p className="mt-2 text-3xl font-bold">0 DH</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <h2 className="text-xl font-semibold">إدارة المنتجات</h2>
              <p className="mt-2 text-sm text-gray-500">
                يمكنك إضافة وإدارة منتجات المتجر هنا.
              </p>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-semibold">الطلبات</h2>
              <p className="mt-2 text-sm text-gray-500">
                ستظهر طلبات الزبائن هنا.
              </p>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-xl font-semibold">إعدادات المتجر</h2>
              <p className="mt-2 text-sm text-gray-500">
                إعدادات MEHDISTORE.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
```
