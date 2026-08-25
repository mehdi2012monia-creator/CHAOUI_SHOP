import { redirect } from "next/navigation";

/** رابط قصير: /zip → تحميل المشروع الكامل مباشرة */
export function GET() {
  redirect("/api/export/project");
}
