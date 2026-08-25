import { readFile, readdir, stat } from "fs/promises";
import path from "path";
import JSZip from "jszip";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const ROOT = process.cwd();

/** مجلدات وملفات لا تُرفع أبداً */
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".vercel",
  "dist",
  "build",
  "out",
  "coverage",
  ".turbo",
]);

const SKIP_FILES = new Set([
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  "next-env.d.ts",
  "tsconfig.tsbuildinfo",
  ".DS_Store",
  "Thumbs.db",
]);

/** الملفات والمجلدات المسموح بها في الجذر */
const ROOT_ALLOW = new Set([
  "src",
  "public",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.ts",
  "postcss.config.mjs",
  "eslint.config.mjs",
  "drizzle.config.ts",
  ".gitignore",
  ".env.example",
  "README.md",
  "DEPLOY-GITHUB.md",
  "DEPLOY-VERCEL.md",
  "DEPLOY-GOOGLE.md",
]);

type Entry = { path: string; size: number };

async function addDir(
  zip: JSZip,
  absDir: string,
  relDir: string,
  collected: Entry[]
): Promise<void> {
  const items = await readdir(absDir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      if (SKIP_DIRS.has(item.name)) continue;
      await addDir(
        zip,
        path.join(absDir, item.name),
        relDir ? `${relDir}/${item.name}` : item.name,
        collected
      );
      continue;
    }
    if (!item.isFile()) continue;
    if (SKIP_FILES.has(item.name)) continue;
    if (item.name.startsWith(".env") && item.name !== ".env.example") continue;

    const abs = path.join(absDir, item.name);
    const rel = relDir ? `${relDir}/${item.name}` : item.name;
    const buf = await readFile(abs);
    zip.file(rel, buf);
    collected.push({ path: rel, size: buf.length });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const light = url.searchParams.get("light") === "1"; // بدون package-lock

  const zip = new JSZip();
  const collected: Entry[] = [];

  const rootItems = await readdir(ROOT, { withFileTypes: true });
  for (const item of rootItems) {
    if (!ROOT_ALLOW.has(item.name)) continue;
    if (light && item.name === "package-lock.json") continue;

    if (item.isDirectory()) {
      await addDir(zip, path.join(ROOT, item.name), item.name, collected);
    } else if (item.isFile()) {
      const buf = await readFile(path.join(ROOT, item.name));
      zip.file(item.name, buf);
      collected.push({ path: item.name, size: buf.length });
    }
  }

  /* إحصاءات */
  const images = collected.filter((c) => c.path.startsWith("public/images"));
  const source = collected.filter((c) => c.path.startsWith("src/"));
  const totalKb = Math.round(
    collected.reduce((s, c) => s + c.size, 0) / 1024
  );

  /* دليل سريع داخل الحزمة */
  const guide = `# 🚀 ابدأ من هنا — CHAOUISHOP

هذه حزمة **المشروع الكامل** (كود المصدر) جاهزة للرفع على GitHub والنشر على Vercel.

## ✅ محتوى الحزمة

| المجلد / الملف | الوصف |
|---|---|
| \`src/\` | ${source.length} ملف — كود المتجر ولوحة التحكم |
| \`public/images/products/\` | ${images.length} صورة منتج |
| \`package.json\` | الاعتماديات |
| \`.env.example\` | نموذج متغيرات البيئة (بدون أسرار) |
| \`README.md\` | وصف المشروع |
| \`DEPLOY-*.md\` | أدلة النشر (GitHub / Vercel / Google) |

**المجموع:** ${collected.length} ملفاً (~${totalKb} كيلوبايت)

> 🔒 ملف \`.env\` الحقيقي **غير مضمّن** — أسرارك آمنة.
> 🔒 \`node_modules\` و \`.next\` غير مضمّنة (تُبنى تلقائياً).

---

## 1) الرفع على GitHub

\`\`\`bash
git init
git add .
git commit -m "CHAOUISHOP store"
git branch -M main
git remote add origin https://github.com/USERNAME/chaouishop.git
git push -u origin main
\`\`\`

> بدون أوامر: استعمل [GitHub Desktop](https://desktop.github.com) ← \`Add local repository\` ← \`Publish\`.

## 2) النشر على Vercel

1. [vercel.com/new](https://vercel.com/new) ← استورد المستودع
2. أنشئ قاعدة بيانات مجانية من [Neon](https://neon.tech)
3. أضف متغيرات البيئة:

\`\`\`
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
SETUP_TOKEN=mehdi-secret-2026
\`\`\`

4. اضغط **Deploy**
5. بعد النشر افتح مرة واحدة: \`https://votre-site.vercel.app/api/setup?token=mehdi-secret-2026\`

## 3) التشغيل محلياً

\`\`\`bash
npm install
cp .env.example .env      # ثم عدّل DATABASE_URL
npx drizzle-kit push
npx tsx src/db/seed.ts
npm run dev
\`\`\`

## 🔐 لوحة التحكم

انقر **5 مرات** على شعار MEHDISHOP، أو افتح \`/admin\`.

---

للتفاصيل الكاملة راجع: \`DEPLOY-GITHUB.md\` ثم \`DEPLOY-VERCEL.md\`
`;

  zip.file("START-HERE.md", guide);

  const buf = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="chaouishop-project.zip"',
      "Content-Length": String(buf.length),
      "Cache-Control": "no-store",
      "X-File-Count": String(collected.length),
    },
  });
}
