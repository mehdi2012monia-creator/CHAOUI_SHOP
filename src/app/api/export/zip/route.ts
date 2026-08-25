import { readFile, readdir } from "fs/promises";
import path from "path";
import JSZip from "jszip";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getSetting } from "@/lib/admin";
import { buildStoreHtml } from "@/lib/export-html";
import { clean, isLocal } from "@/lib/site";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const IMG_DIR = path.join(process.cwd(), "public", "images", "products");

export async function GET(req: Request) {
  const url = new URL(req.url);

  /* ---------- تحديد عنوان المتجر ---------- */
  const fwdHost =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const fwdProto =
    req.headers.get("x-forwarded-proto") ??
    (fwdHost.startsWith("localhost") || fwdHost.startsWith("127.")
      ? "http"
      : "https");
  const runtime = fwdHost ? clean(`${fwdProto}://${fwdHost}`) : url.origin;

  const [
    all,
    shippingRaw,
    thresholdRaw,
    categoriesRaw,
    whatsapp,
    phone,
    savedUrl,
    urlEnabled,
  ] = await Promise.all([
    db
      .select()
      .from(products)
      .where(eq(products.active, true))
      .orderBy(desc(products.featured), desc(products.id)),
    getSetting("shipping_fee", "35"),
    getSetting("free_shipping_threshold", "500"),
    getSetting("categories", "المطبخ,إلكترونيات,المنزل"),
    getSetting("store_whatsapp", "212600000000"),
    getSetting("store_phone", "0600-000000"),
    getSetting("site_url", ""),
    getSetting("site_url_enabled", "false"),
  ]);

  // نستعمل النطاق المخصص فقط إذا كان يستجيب فعلاً، وإلا نبقى على الخادم العامل
  const custom = clean(savedUrl);
  let apiBase = runtime;
  if (urlEnabled === "true" && custom && !isLocal(custom)) {
    try {
      const ping = await fetch(custom, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(4000),
      });
      if (ping.ok) apiBase = custom;
    } catch {
      /* النطاق غير مربوط بعد */
    }
  }

  /* ---------- بناء ملف HTML ---------- */
  const categories = categoriesRaw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const html = buildStoreHtml({
    products: all,
    categories,
    shippingFee: Number(shippingRaw) || 35,
    freeThreshold: Number(thresholdRaw) || 500,
    apiBase,
    whatsapp: whatsapp.replace(/\D/g, "") || "212600000000",
    phone,
    localImages: true, // الصور مرفقة داخل الحزمة
  });

  /* ---------- تجميع الحزمة ---------- */
  const zip = new JSZip();

  zip.file("index.html", html);

  // الصور
  const imgFolder = zip.folder("images/products");
  let imageCount = 0;
  try {
    const files = await readdir(IMG_DIR);
    for (const f of files) {
      if (!/\.(jpe?g|png|webp|gif|svg)$/i.test(f)) continue;
      const buf = await readFile(path.join(IMG_DIR, f));
      imgFolder?.file(f, buf);
      imageCount++;
    }
  } catch {
    /* لا صور محلية */
  }

  // منتجات تستعمل صوراً خارجية
  const externalImages = all
    .filter((p) => p.image.startsWith("http"))
    .map((p) => `- ${p.name}: ${p.image}`);

  /* ---------- README ---------- */
  const readme = `# CHAOUISHOP — متجر إلكتروني (نسخة ثابتة)

متجر مغربي لبيع المواد المنزلية والإلكترونيات، بالدرهم المغربي والدفع عند الاستلام.

## 📦 محتوى الحزمة

| الملف | الوصف |
|---|---|
| \`index.html\` | المتجر كاملاً (تصميم + ${all.length} منتجاً + سلة + لوحة تحكم) |
| \`images/products/\` | ${imageCount} صورة منتج |
| \`.nojekyll\` | لازم لعمل GitHub Pages بشكل صحيح |

## 🚀 النشر على GitHub Pages

1. أنشئ مستودعاً جديداً على [github.com/new](https://github.com/new) باسم \`chaouishop\`
2. ارفع **محتويات هذا المجلد** (وليس المجلد نفسه)
3. \`Settings\` ← \`Pages\` ← اختر \`Branch: main\` و \`/ (root)\` ← \`Save\`
4. بعد دقيقة يصبح متجرك على:
   \`https://USERNAME.github.io/chaouishop/\`

### عبر terminal

\`\`\`bash
git init
git add .
git commit -m "CHAOUISHOP store"
git branch -M main
git remote add origin https://github.com/USERNAME/chaouishop.git
git push -u origin main
\`\`\`

## 🧩 التضمين في Google Sites

بعد النشر، في محرر Google Sites:
**إدراج ← تضمين ← عبر عنوان URL** والصق رابط صفحتك، أو استعمل:

\`\`\`html
<iframe src="https://USERNAME.github.io/chaouishop/" width="100%" height="1400"
        frameborder="0" style="border:0" allowfullscreen></iframe>
\`\`\`

## 🔐 لوحة التحكم

انقر **5 مرات** على شعار **MEHDISHOP** (في الأعلى أو الفوتر) لتفتح لوحة التحكم:

- 📊 نظرة عامة — الإحصائيات ورسم المبيعات
- 📦 الطلبات — تتبع الطلبيات وتغيير حالاتها
- 🏷️ المنتجات — إضافة وتعديل وحذف
- ⚙️ الإعدادات — التوصيل والأقسام والتواصل

## ⚠️ مهم: الاتصال بالخادم

هذا الملف **واجهة فقط**. الطلبات والمنتجات ولوحة التحكم تحتاج خادم المتجر:

\`\`\`
${apiBase}
\`\`\`

- إن كان الخادم يعمل: كل شيء يشتغل تلقائياً
- إن تغيّر عنوانه: افتح لوحة التحكم وستطلب منك العنوان الجديد (يُحفظ تلقائياً)
- إن تعذّر الاتصال عند الطلب: يتحول تلقائياً إلى **واتساب**

> لنشر المتجر كاملاً بقاعدة بياناته، استعمل **Vercel** — راجع دليل \`DEPLOY-VERCEL.md\` في المشروع الأصلي.

${
  externalImages.length > 0
    ? `\n## 🖼️ صور خارجية\n\nهذه المنتجات تستعمل صوراً من الإنترنت (غير مضمّنة):\n\n${externalImages.join("\n")}\n`
    : ""
}
---

© 2026 CHAOUISHOP — صنع بإتقان في المغرب ★
`;

  zip.file("README.md", readme);
  zip.file(".nojekyll", "");

  zip.file(
    ".gitignore",
    `.DS_Store
Thumbs.db
*.log
`
  );

  const buf = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="chaouishop-github.zip"',
      "Content-Length": String(buf.length),
      "Cache-Control": "no-store",
    },
  });
}
