/** تنسيق المبلغ بالدرهم المغربي */
export function mad(n: number): string {
  return `${Math.round(n).toLocaleString("en-US")} د.م`;
}

export function formatDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("ar-MA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export const ORDER_STATUS_META: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "جديدة", color: "#8A5B00", bg: "#FFF1D6" },
  preparing: { label: "قيد التحضير", color: "#17339E", bg: "#E3E9FC" },
  shipped: { label: "تم الشحن", color: "#0E7490", bg: "#D8F3F9" },
  delivered: { label: "تم التسليم", color: "#166B45", bg: "#DFF3E8" },
  cancelled: { label: "ملغاة", color: "#A33030", bg: "#FBE3E3" },
};

export const MOROCCAN_CITIES = [
  "الدار البيضاء",
  "الرباط",
  "مراكش",
  "فاس",
  "طنجة",
  "أكادير",
  "مكناس",
  "وجدة",
  "القنيطرة",
  "تطوان",
  "سلا",
  "المحمدية",
  "الجديدة",
  "بني ملال",
  "خريبكة",
  "الناظور",
  "العيون",
  "مدينة أخرى",
];
