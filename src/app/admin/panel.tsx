```tsx
"use client";

import { useState } from "react";

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <main className="min-h-screen w-full p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        <h1 className="text-3xl font-bold">
          MEHDISTORE
        </h1>

        <p className="mt-2 mb-8 text-gray-500">
          لوحة تحكم المتجر
        </p>

        <div className="mb-6 flex flex-wrap gap-2">

          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={
              activeTab === "dashboard"
                ? "rounded-lg border bg-black px-5 py-2.5 text-sm font-medium text-white"
                : "rounded-lg border bg-white px-5 py-2.5 text-sm font-medium text-black"
            }
          >
            الرئيسية
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={
              activeTab === "products"
                ? "rounded-lg border bg-black px-5 py-2.5 text-sm font-medium text-white"
                : "rounded-lg border bg-white px-5 py-2.5 text-sm font-medium text-black"
            }
          >
            المنتجات
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={
              activeTab === "orders"
                ? "rounded-lg border bg-black px-5 py-2.5 text-sm font-medium text-white"
                : "rounded-lg border bg-white px-5 py-2.5 text-sm font-medium text-black"
            }
          >
            الطلبات
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={
              activeTab === "settings"
                ? "rounded-lg border bg-black px-5 py-2.5 text-sm font-medium text-white"
                : "rounded-lg border bg-white px-5 py-2.5 text-sm font-medium text-black"
            }
          >
            الإعدادات
          </button>

        </div>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">

          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-2xl font-bold">
                لوحة التحكم
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <div className="rounded-xl border p-6">
                  <p className="text-sm text-gray-500">
                    المنتجات
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    0
                  </p>
                </div>

                <div className="rounded-xl border p-6">
                  <p className="text-sm text-gray-500">
                    الطلبات
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    0
                  </p>
                </div>

                <div className="rounded-xl border p-6">
                  <p className="text-sm text-gray-500">
                    المبيعات
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    0 DH
                  </p>
                </div>

              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <h2 className="text-2xl font-bold">
                المنتجات
              </h2>

              <p className="mt-2 text-gray-500">
                إدارة منتجات MEHDISTORE.
              </p>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-2xl font-bold">
                الطلبات
              </h2>

              <p className="mt-2 text-gray-500">
                إدارة ومتابعة طلبات الزبائن.
              </p>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-2xl font-bold">
                الإعدادات
              </h2>

              <p className="mt-2 text-gray-500">
                إعدادات المتجر.
              </p>
            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default AdminPanel;
```
