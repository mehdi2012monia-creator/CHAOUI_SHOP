"use client";

import { useCallback, useEffect, useState } from "react";
import type { Order, Product } from "@/db/schema";
import {
  IconBox,
  IconGear,
  IconGrid,
  IconSpark,
  IconStore,
  IconTag,
  IconX,
  Wordmark,
} from "@/components/ui";
import { Dashboard } from "./dashboard";
import { ProductsTab } from "./products-tab";
import { OrdersTab } from "./orders-tab";
import { SettingsTab } from "./settings-tab";
import { PublishTab } from "./publish-tab";
import { VercelTab } from "./vercel-tab";
import { GithubTab } from "./github-tab";
import { HtmlCard } from "./html-card";

type Tab =
  | "dashboard"
  | "products"
  | "orders"
  | "settings"
  | "publish"
  | "github"
  | "vercel";

const TABS: { id: Tab; label: string; icon: typeof IconGrid }[] = [
  { id: "dashboard", label: "نظرة عامة", icon: IconGrid },
  { id: "products", label: "المنتجات", icon: IconTag },
  { id: "orders", label: "الطلبات", icon: IconBox },
  { id: "settings", label: "الإعدادات", icon: IconGear },
  { id: "publish", label: "النشر على Google", icon: IconSpark },
  { id: "github", label: "رفع على GitHub", icon: IconBox },
  { id: "vercel", label: "النشر على Vercel", icon: IconStore },
];

const TITLES: Record<Tab, { title: string; sub: string }> = {
  dashboard: { title: "نظرة عامة", sub: "ملخص نشاط متجرك اليوم" },
  products: { title: "إدارة المنتجات", sub: "أضف، عدّل أو أوقف المنتجات" },
  orders: { title: "الطلبيات", sub: "تتبع طلبات العملاء وحدّث حالاتها" },
  settings: { title: "الإعدادات", sub: "التوصيل، الأقسام ومعلومات التواصل" },
  publish: {
    title: "النشر على Google",
    sub: "اربط متجرك بـ Google Sites، بحث Google و Merchant Center",
  },
  github: {
    title: "رفع المشروع على GitHub",
    sub: "احفظ كود متجرك واربطه بالنشر التلقائي",
  },
  vercel: {
    title: "النشر على Vercel",
    sub: "دليل كامل لنشر المتجر على الإنترنت وربط نطاقك",
  },
};

/**
 * لوحة التحكم — تعمل كصفحة مستقلة (/admin) أو كطبقة عائمة داخل المتجر
 * حين تُمرَّر onClose (مفيد داخل Google Sites بدون تغيير الرابط).
 */
export function AdminPanel({ onClose }: { onClose?: () => void }) {
  const embedded = typeof onClose === "function";

  const [tab, setTab] = useState<Tab>("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  const loadAll = useCallback(async () => {
    const [pRes, oRes, sRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/orders"),
      fetch("/api/admin/settings"),
    ]);
    if (pRes.ok) setProducts(await pRes.json());
    if (oRes.ok) setOrders(await oRes.json());
    if (sRes.ok) setSettings(await sRes.json());
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const categories = (settings.categories ?? "المطبخ,إلكترونيات,المنزل")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <div
      className={`flex flex-col bg-paper lg:flex-row ${
        embedded ? "h-full" : "min-h-screen"
      }`}
    >
      {/* القائمة الجانبية */}
      <aside
        className={`zellige-light flex shrink-0 flex-col bg-ink p-4 lg:w-64 lg:p-5 ${
          embedded ? "lg:h-full lg:overflow-y-auto" : "lg:min-h-screen"
        }`}
      >
        <div className="flex items-center justify-between lg:mb-8">
          {embedded ? (
            <Wordmark dark />
          ) : (
            <a href="/" aria-label="المتجر">
              <Wordmark dark />
            </a>
          )}
          <span className="rounded-md bg-saffron-400/15 px-2 py-1 text-[10px] font-extrabold text-saffron-300 lg:hidden">
            لوحة التحكم
          </span>
        </div>

        <nav className="no-scrollbar flex gap-1.5 overflow-x-auto lg:flex-col">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`btn-press flex shrink-0 items-center gap-2.5 rounded-lg px-4 py-2.5 text-[13px] font-extrabold transition ${
                  active
                    ? "bg-saffron-400 text-ink"
                    : "text-paper/55 hover:bg-white/8 hover:text-paper"
                }`}
              >
                <t.icon className="h-4.5 w-4.5" />
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* رابط سريع لكود HTML */}
        <a
          href="/api/export/html"
          target="_blank"
          rel="noreferrer"
          className="mt-4 hidden items-center gap-2.5 rounded-lg border border-dashed border-saffron-400/40 px-4 py-2.5 text-[13px] font-extrabold text-saffron-300 transition hover:border-saffron-400 hover:bg-saffron-400/10 lg:flex"
        >
          <span>📄</span>
          كود HTML للمتجر
        </a>

        <div className="mt-auto hidden pt-8 lg:block">
          {embedded ? (
            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center gap-2.5 rounded-lg px-4 py-2.5 text-[13px] font-extrabold text-paper/55 transition hover:bg-white/8 hover:text-paper"
            >
              <IconStore className="h-4.5 w-4.5" />
              رجوع إلى المتجر
            </button>
          ) : (
            <a
              href="/"
              className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-[13px] font-extrabold text-paper/55 transition hover:bg-white/8 hover:text-paper"
            >
              <IconStore className="h-4.5 w-4.5" />
              عرض المتجر
            </a>
          )}
        </div>
      </aside>

      {/* المحتوى */}
      <div className={`flex-1 ${embedded ? "overflow-y-auto" : ""}`}>
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-ink/10 bg-paper/90 px-5 py-4 backdrop-blur-md lg:px-8">
          <div className="min-w-0">
            <h1 className="font-display text-[26px] leading-none">
              {TITLES[tab].title}
            </h1>
            <p className="mt-1 truncate text-xs font-bold text-ink/45">
              {TITLES[tab].sub}
            </p>
          </div>
          {embedded ? (
            <button
              type="button"
              onClick={onClose}
              className="btn-press flex shrink-0 items-center gap-2 rounded-lg border border-ink/15 bg-white px-3.5 py-2 text-xs font-extrabold transition hover:border-danger/40 hover:text-danger"
            >
              <IconX className="h-4 w-4" />
              إغلاق
            </button>
          ) : (
            <a
              href="/"
              className="btn-press hidden shrink-0 items-center gap-2 rounded-lg border border-ink/15 bg-white px-3.5 py-2 text-xs font-extrabold transition hover:border-majorelle-500 hover:text-majorelle-600 sm:flex"
            >
              <IconStore className="h-4 w-4" />
              عرض المتجر
            </a>
          )}
        </header>

        <main className="p-5 lg:p-8">
          {tab === "dashboard" && (
            <div className="grid gap-5">
              <Dashboard
                products={products}
                orders={orders}
                onNavigate={(t) => setTab(t as Tab)}
              />
              <HtmlCard />
            </div>
          )}
          {tab === "products" && (
            <ProductsTab
              products={products}
              categories={categories}
              onChanged={loadAll}
            />
          )}
          {tab === "orders" && <OrdersTab orders={orders} onChanged={loadAll} />}
          {tab === "settings" && (
            <SettingsTab
              settings={settings}
              categories={categories}
              onChanged={loadAll}
            />
          )}
          {tab === "publish" && <PublishTab />}
          {tab === "github" && <GithubTab />}
          {tab === "vercel" && <VercelTab />}
        </main>
      </div>
    </div>
  );
}
