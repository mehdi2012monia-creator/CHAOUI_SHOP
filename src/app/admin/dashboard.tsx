"use client";

import { useMemo } from "react";
import type { Order, Product } from "@/db/schema";
import { mad, formatDate, ORDER_STATUS_META } from "@/lib/format";
import { IconBox, IconCash, IconTag, IconTruck } from "@/components/ui";

function StatTile({
  label,
  value,
  sub,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  icon: (p: { className?: string }) => React.ReactNode;
  tone: string;
}) {
  return (
    <div className="animate-rise rounded-xl border border-ink/10 bg-white p-5 transition hover:shadow-lg hover:shadow-ink/5">
      <div className={`grid h-11 w-11 place-items-center rounded-lg ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3.5 text-[11px] font-extrabold text-ink/45">{label}</p>
      <p className="mt-1 font-display text-[30px] leading-none text-ink">{value}</p>
      <p className="mt-1.5 text-[11px] font-bold text-ink/40">{sub}</p>
    </div>
  );
}

export function Dashboard({
  products,
  orders,
  onNavigate,
}: {
  products: Product[];
  orders: Order[];
  onNavigate: (tab: string) => void;
}) {
  const revenue = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "cancelled")
        .reduce((s, o) => s + o.total, 0),
    [orders]
  );
  const pending = orders.filter((o) => o.status === "pending").length;

  const chart = useMemo(() => {
    const days: { key: string; label: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      days.push({
        key,
        label: new Intl.DateTimeFormat("ar", { weekday: "short" }).format(d),
        total: 0,
      });
    }
    for (const o of orders) {
      if (o.status === "cancelled") continue;
      const key = new Date(o.createdAt).toDateString();
      const day = days.find((x) => x.key === key);
      if (day) day.total += o.total;
    }
    const max = Math.max(...days.map((d) => d.total), 1);
    return { days, max };
  }, [orders]);

  const recent = orders.slice(0, 6);

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile
          label="إجمالي المبيعات"
          value={mad(revenue)}
          sub="بدون الطلبات الملغاة"
          icon={IconCash}
          tone="bg-saffron-100 text-saffron-600"
        />
        <StatTile
          label="عدد الطلبات"
          value={String(orders.length)}
          sub={`${pending} طلبات جديدة تنتظر`}
          icon={IconBox}
          tone="bg-majorelle-100 text-majorelle-700"
        />
        <StatTile
          label="طلبات جديدة"
          value={String(pending)}
          sub="تحتاج إلى المعالجة"
          icon={IconTruck}
          tone="bg-mint-100 text-mint-600"
        />
        <StatTile
          label="المنتجات"
          value={String(products.length)}
          sub={`${products.filter((p) => p.active).length} منتج نشط`}
          icon={IconTag}
          tone="bg-paper-soft text-ink/70"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        {/* مبيعات آخر 7 أيام */}
        <div className="rounded-xl border border-ink/10 bg-white p-5">
          <h3 className="font-extrabold">مبيعات آخر 7 أيام</h3>
          <div className="mt-5 flex h-44 items-end gap-2.5">
            {chart.days.map((d) => (
              <div key={d.key} className="group flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] font-extrabold text-ink/0 transition group-hover:text-ink/60">
                  {d.total > 0 ? mad(d.total) : ""}
                </span>
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    d.total > 0
                      ? "bg-majorelle-600 group-hover:bg-saffron-400"
                      : "bg-ink/8"
                  }`}
                  style={{
                    height: `${Math.max(6, (d.total / chart.max) * 100)}%`,
                  }}
                />
                <span className="text-[10px] font-bold text-ink/45">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* آخر الطلبات */}
        <div className="rounded-xl border border-ink/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold">آخر الطلبات</h3>
            <button
              type="button"
              onClick={() => onNavigate("orders")}
              className="text-xs font-extrabold text-majorelle-600 transition hover:text-majorelle-700"
            >
              عرض الكل ←
            </button>
          </div>
          {recent.length === 0 ? (
            <p className="mt-8 pb-6 text-center text-sm font-bold text-ink/40">
              لا توجد طلبات بعد
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-ink/8">
              {recent.map((o) => {
                const meta = ORDER_STATUS_META[o.status];
                return (
                  <li key={o.id} className="flex items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-extrabold">
                        {o.customerName}
                        <span className="ms-2 text-[11px] font-bold text-ink/40" dir="ltr">
                          {o.ref}
                        </span>
                      </p>
                      <p className="text-[11px] font-bold text-ink/45">
                        {o.city} · {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <span
                      className="rounded-md px-2 py-1 text-[10px] font-extrabold"
                      style={{ color: meta.color, backgroundColor: meta.bg }}
                    >
                      {meta.label}
                    </span>
                    <span className="w-20 text-left text-[13px] font-extrabold text-majorelle-700">
                      {mad(o.total)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
