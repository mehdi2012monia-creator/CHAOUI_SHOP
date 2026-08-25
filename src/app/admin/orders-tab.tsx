"use client";

import { useMemo, useState } from "react";
import type { Order } from "@/db/schema";
import { mad, formatDate, ORDER_STATUS_META } from "@/lib/format";
import { IconBox, IconChevron } from "@/components/ui";

const FILTERS = ["الكل", "pending", "preparing", "shipped", "delivered", "cancelled"];

export function OrdersTab({
  orders,
  onChanged,
}: {
  orders: Order[];
  onChanged: () => void;
}) {
  const [filter, setFilter] = useState("الكل");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "الكل" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  const changeStatus = async (o: Order, status: string) => {
    await fetch(`/api/admin/orders/${o.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    onChanged();
  };

  const count = (s: string) =>
    s === "الكل" ? orders.length : orders.filter((o) => o.status === s).length;

  return (
    <div className="rounded-xl border border-ink/10 bg-white">
      <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-ink/10 p-4">
        {FILTERS.map((f) => {
          const meta = f === "الكل" ? null : ORDER_STATUS_META[f];
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`btn-press flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-extrabold transition ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 bg-white text-ink/60 hover:border-ink/40"
              }`}
            >
              {meta ? meta.label : "كل الطلبات"}
              <span
                className={`rounded-full px-1.5 text-[10px] ${
                  active ? "bg-white/20" : "bg-ink/8"
                }`}
              >
                {count(f)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-ink/10 bg-paper/60 text-right text-[11px] font-extrabold text-ink/50">
              <th className="px-4 py-3">الطلب</th>
              <th className="px-4 py-3">العميل</th>
              <th className="px-4 py-3">المدينة</th>
              <th className="px-4 py-3">المنتجات</th>
              <th className="px-4 py-3">المجموع</th>
              <th className="px-4 py-3">الحالة</th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {filtered.map((o) => {
              const meta = ORDER_STATUS_META[o.status];
              const open = expanded === o.id;
              return (
                <OrderRow
                  key={o.id}
                  order={o}
                  meta={meta}
                  open={open}
                  onToggle={() => setExpanded(open ? null : o.id)}
                  onStatus={(s) => changeStatus(o, s)}
                />
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-14 text-center">
                  <IconBox className="mx-auto h-8 w-8 text-ink/20" />
                  <p className="mt-3 text-sm font-bold text-ink/40">
                    لا توجد طلبات في هذه القائمة
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderRow({
  order: o,
  meta,
  open,
  onToggle,
  onStatus,
}: {
  order: Order;
  meta: { label: string; color: string; bg: string };
  open: boolean;
  onToggle: () => void;
  onStatus: (s: string) => void;
}) {
  return (
    <>
      <tr className={`transition ${open ? "bg-paper/70" : "hover:bg-paper/40"}`}>
        <td className="px-4 py-3.5">
          <p className="font-extrabold" dir="ltr">
            {o.ref}
          </p>
          <p className="text-[11px] font-bold text-ink/45">{formatDate(o.createdAt)}</p>
        </td>
        <td className="px-4 py-3.5">
          <p className="font-extrabold">{o.customerName}</p>
          <p className="text-[11px] font-bold text-ink/45" dir="ltr">
            {o.phone}
          </p>
        </td>
        <td className="px-4 py-3.5 font-bold text-ink/70">{o.city}</td>
        <td className="px-4 py-3.5 font-bold text-ink/70">
          {o.items.reduce((s, i) => s + i.qty, 0)} قطع
        </td>
        <td className="px-4 py-3.5 font-extrabold text-majorelle-700">{mad(o.total)}</td>
        <td className="px-4 py-3.5">
          <select
            value={o.status}
            onChange={(e) => onStatus(e.target.value)}
            className="cursor-pointer rounded-md border-0 px-2.5 py-1.5 text-[11px] font-extrabold outline-none"
            style={{ color: meta.color, backgroundColor: meta.bg }}
          >
            {Object.entries(ORDER_STATUS_META).map(([k, m]) => (
              <option key={k} value={k}>
                {m.label}
              </option>
            ))}
          </select>
        </td>
        <td className="px-4 py-3.5">
          <button
            type="button"
            onClick={onToggle}
            aria-label="تفاصيل"
            className={`grid h-8 w-8 place-items-center rounded-lg text-ink/45 transition hover:bg-ink/8 ${
              open ? "rotate-180" : ""
            }`}
          >
            <IconChevron className="h-4 w-4" />
          </button>
        </td>
      </tr>
      {open && (
        <tr className="bg-paper/70">
          <td colSpan={7} className="px-6 pb-5">
            <div className="animate-rise grid gap-4 rounded-xl border border-ink/10 bg-white p-4 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h4 className="text-xs font-extrabold text-ink/50">المنتجات المطلوبة</h4>
                <ul className="mt-2.5 grid gap-2.5">
                  {o.items.map((i) => (
                    <li key={i.productId} className="flex items-center gap-3">
                      <img
                        src={i.image}
                        alt={i.name}
                        className="h-11 w-11 rounded-lg border border-ink/10 object-cover"
                      />
                      <span className="flex-1 truncate text-[13px] font-bold">{i.name}</span>
                      <span className="text-xs font-bold text-ink/50">×{i.qty}</span>
                      <span className="w-20 text-left text-[13px] font-extrabold">
                        {mad(i.price * i.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-3.5 grid gap-1 border-t border-dashed border-ink/15 pt-3 text-xs font-bold text-ink/60">
                  <div className="flex justify-between">
                    <dt>المجموع الفرعي</dt>
                    <dd>{mad(o.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>التوصيل</dt>
                    <dd>{o.shipping === 0 ? "مجاني" : mad(o.shipping)}</dd>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-ink">
                    <dt>المجموع</dt>
                    <dd>{mad(o.total)}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-ink/50">عنوان التوصيل</h4>
                <p className="mt-2.5 text-[13px] leading-6 font-bold">
                  {o.customerName}
                  <br />
                  {o.city} — {o.address}
                  <br />
                  <span dir="ltr">{o.phone}</span>
                </p>
                {o.note && (
                  <>
                    <h4 className="mt-4 text-xs font-extrabold text-ink/50">ملاحظة العميل</h4>
                    <p className="mt-1.5 rounded-lg bg-saffron-100/70 px-3 py-2 text-[13px] font-bold text-saffron-600">
                      {o.note}
                    </p>
                  </>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
