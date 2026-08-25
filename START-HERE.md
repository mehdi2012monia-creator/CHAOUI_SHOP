# 🚀 ابدأ من هنا — CHAOUISHOP

هذه حزمة **المشروع الكامل** (كود المصدر) جاهزة للرفع على GitHub والنشر على Vercel.

## ✅ محتوى الحزمة

| المجلد / الملف | الوصف |
|---|---|
| `src/` | 58 ملف — كود المتجر ولوحة التحكم |
| `public/images/products/` | 10 صورة منتج |
| `package.json` | الاعتماديات |
| `.env.example` | نموذج متغيرات البيئة (بدون أسرار) |
| `README.md` | وصف المشروع |
| `DEPLOY-*.md` | أدلة النشر (GitHub / Vercel / Google) |

**المجموع:** 81 ملفاً (~1867 كيلوبايت)

> 🔒 ملف `.env` الحقيقي **غير مضمّن** — أسرارك آمنة.
> 🔒 `node_modules` و `.next` غير مضمّنة (تُبنى تلقائياً).

---

## 1) الرفع على GitHub

```bash
git init
git add .
git commit -m "CHAOUISHOP store"
git branch -M main
git remote add origin https://github.com/USERNAME/chaouishop.git
git push -u origin main
```

> بدون أوامر: استعمل [GitHub Desktop](https://desktop.github.com) ← `Add local repository` ← `Publish`.

## 2) النشر على Vercel

1. [vercel.com/new](https://vercel.com/new) ← استورد المستودع
2. أنشئ قاعدة بيانات مجانية من [Neon](https://neon.tech)
3. أضف متغيرات البيئة:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
SETUP_TOKEN=mehdi-secret-2026
```

4. اضغط **Deploy**
5. بعد النشر افتح مرة واحدة: `https://votre-site.vercel.app/api/setup?token=mehdi-secret-2026`

## 3) التشغيل محلياً

```bash
npm install
cp .env.example .env      # ثم عدّل DATABASE_URL
npx drizzle-kit push
npx tsx src/db/seed.ts
npm run dev
```

## 🔐 لوحة التحكم

انقر **5 مرات** على شعار MEHDISHOP، أو افتح `/admin`.

---

للتفاصيل الكاملة راجع: `DEPLOY-GITHUB.md` ثم `DEPLOY-VERCEL.md`
