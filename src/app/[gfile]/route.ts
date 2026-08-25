import { getSetting } from "@/lib/admin";

export const dynamic = "force-dynamic";

/**
 * دعم التحقق من ملكية الموقع في Google Search Console بطريقة "ملف HTML".
 * Google يعطيك ملفاً مثل google1a2b3c4d.html يجب أن يكون في جذر الموقع.
 * تكفي كتابة اسم الملف في لوحة التحكم وسيُقدَّم من هنا تلقائياً.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ gfile: string }> }
) {
  const { gfile } = await params;

  // نقبل فقط ملفات تحقق Google
  if (!/^google[a-z0-9]+\.html$/i.test(gfile)) {
    return new Response("Not Found", { status: 404 });
  }

  const saved = (await getSetting("google_html_file", "")).trim();
  if (!saved || saved.toLowerCase() !== gfile.toLowerCase()) {
    return new Response("Not Found", { status: 404 });
  }

  // المحتوى الذي يتوقعه Google داخل الملف
  const token = gfile.replace(/\.html$/i, "");
  return new Response(`google-site-verification: ${token}.html`, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
