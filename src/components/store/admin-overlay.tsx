"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPanel } from "@/app/admin/panel";

export const ADMIN_EVENT = "mehdishop:open-admin";

/**
 * زر لوحة التحكم + اللوحة كطبقة عائمة — بدون كلمة مرور.
 * كل شيء داخل نفس الصفحة، فيعمل داخل Google Sites بدون تغيير الرابط.
 */
export function AdminOverlay() {
  const [open, setOpen] = useState(false);

  const request = useCallback(() => setOpen(true), []);

  // فتح عبر الحدث (النقر 5 مرات على الشعار)
  useEffect(() => {
    const onOpen = (e: Event) => {
      e.preventDefault();
      request();
    };
    window.addEventListener(ADMIN_EVENT, onOpen);
    return () => window.removeEventListener(ADMIN_EVENT, onOpen);
  }, [request]);

  // فتح عبر #admin أو ?admin=1
  useEffect(() => {
    const check = () => {
      const hash = window.location.hash === "#admin";
      const q = new URLSearchParams(window.location.search).get("admin") === "1";
      if (hash || q) request();
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [request]);

  // منع تمرير الصفحة خلف اللوحة + الإغلاق بمفتاح Esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    if (window.location.hash === "#admin") {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  };

  // لا يوجد زر ظاهر — الدخول فقط بالنقر 5 مرات على شعار MEHDISHOP
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-paper">
      <AdminPanel onClose={close} />
    </div>
  );
}
