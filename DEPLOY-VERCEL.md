# نشر متجر MEHDISHOP على Vercel

دليل كامل لنشر المتجر على الإنترنت. الوقت المتوقع: **15 دقيقة**. كل الخدمات المذكورة مجانية.

---

## 1) ارفع المشروع على GitHub

```bash
git init
git add .
git commit -m "MEHDISHOP store"
git branch -M main
git remote add origin https://github.com/USERNAME/mehdishop.git
git push -u origin main
```

> تأكد أن مجلد `public/images` مرفوع (ليس في `.gitignore`) وإلا لن تظهر صور المنتجات.

---

## 2) أنشئ قاعدة بيانات PostgreSQL

| الخدمة | الرابط | ملاحظة |
|---|---|---|
| **Neon** | [neon.tech](https://neon.tech) | الأفضل مع Vercel — اختر **Pooled connection** |
| **Supabase** | [supabase.com](https://supabase.com) | Settings ← Database ← Connection string |

انسخ رابط الاتصال، يجب أن يشبه:

```
postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

المشروع مُهيّأ مسبقاً لدعم SSL والاتصالات المحدودة المناسبة للبيئات بدون خادم.

---

## 3) استورد المشروع في Vercel

1. افتح [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** ← اختر مستودعك
3. Vercel يكتشف Next.js تلقائياً — **لا تغيّر إعدادات البناء**

---

## 4) أضف متغيرات البيئة

قبل الضغط على **Deploy**، افتح **Environment Variables**:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NEXT_PUBLIC_SITE_URL=https://chaouishop.app
SETUP_TOKEN=mehdi-secret-2026
```

| المتغير | الوصف | إلزامي |
|---|---|---|
| `DATABASE_URL` | رابط قاعدة البيانات | ✅ نعم |
| `NEXT_PUBLIC_SITE_URL` | نطاقك النهائي | اختياري |
| `SETUP_TOKEN` | كلمة سر لحماية مسار التهيئة | مستحسن |
| `GOOGLE_SITE_VERIFICATION` | رمز Search Console | اختياري |

ثم اضغط **Deploy**.

---

## 5) هيّئ قاعدة البيانات (من المتصفح)

بعد نجاح النشر، افتح **مرة واحدة**:

```
https://chaouishop.app/api/setup?token=mehdi-secret-2026
```

هذا المسار:
- ينشئ الجداول الثلاثة (`products`, `orders`, `settings`)
- يضيف 14 منتجاً بصورها وأثمنتها
- يضبط الإعدادات الافتراضية

ستظهر صفحة تأكيد خضراء. **لا يحذف أي بيانات موجودة** — يمكن تشغيله بأمان أكثر من مرة.

> بديل عبر terminal إن فضّلت:
> ```bash
> npx drizzle-kit push
> npx tsx src/db/seed.ts
> ```

---

## 6) اربط نطاقك الخاص

في Vercel: **Settings ← Domains ← Add** واكتب نطاقك.

ثم أضف سجلّات DNS عند مسجّل النطاق (Namecheap، GoDaddy…):

| Type | Name | Value |
|---|---|---|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

> انسخ القيم الفعلية من صفحة Vercel. الانتشار: من دقائق إلى بضع ساعات. شهادة SSL تُضاف تلقائياً.

بعد ربط النطاق، فعّله من **لوحة التحكم ← الإعدادات ← 🌐 رابط المتجر**.

---

## بعد النشر

- **لوحة التحكم:** `https://votre-domaine/admin` أو 5 نقرات على شعار MEHDISHOP
- **التحديثات:** كل `git push` ينشر تلقائياً خلال دقيقة
- **Search Console:** أرسل `sitemap.xml` من تبويب النشر على Google
- **الأمان:** احذف `SETUP_TOKEN` من المتغيرات بعد التهيئة

---

## حل المشاكل

| المشكلة | الحل |
|---|---|
| خطأ 500 عند فتح المتجر | الجداول غير موجودة — افتح `/api/setup?token=...` |
| `DATABASE_URL is required` | أضف المتغير في Vercel ثم **Redeploy** |
| الصور لا تظهر | `public/images` غير مرفوع إلى GitHub |
| `SSL connection required` | أضف `?sslmode=require` في نهاية رابط قاعدة البيانات |
| التعديلات لا تظهر | الإعدادات تتطلب **Redeploy** وليس فقط حفظ |
