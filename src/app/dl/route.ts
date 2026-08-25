import { redirect } from "next/navigation";

/** رابط قصير: /dl → صفحة التحميل */
export function GET() {
  redirect("/download");
}
