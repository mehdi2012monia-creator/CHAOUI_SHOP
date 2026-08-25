# 🛍️ MEHDISHOP — متجر إلكتروني مغربي

متجر إلكتروني كامل لبيع **المواد المنزلية والإلكترونيات**، بواجهة عربية (RTL) وأسعار بالدرهم المغربي، مع لوحة تحكم مدمجة لإدارة المنتجات والطلبات.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle-green)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4)

---

## ✨ المميزات

### واجهة المتجر
- تصميم عربي كامل (RTL) بهوية مغربية — أقواس، زليج، وألوان الصحراء
- بحث فوري وتصفية حسب الأقسام
- عروض اليوم مع عدّاد تنازلي مباشر
- نظرة سريعة على المنتج + صفحة مستقلة لكل منتج
- سلة مشتريات تُحفظ في المتصفح مع شريط التوصيل المجاني
- إتمام الطلب مع التحقق من رقم الهاتف المغربي وقائمة المدن
- **الدفع عند الاستلام** — لا حاجة لبوابة دفع

### لوحة التحكم
تُفتح بالنقر **5 مرات** على شعار MEHDISHOP، أو عبر `/admin`

- 📊 إحصائيات المبيعات ورسم بياني لآخر 7 أيام
- 📦 إدارة الطلبيات مع تغيير الحالة وتفاصيل كل طلب
- 🏷️ إضافة وتعديل وحذف المنتجات
- ⚙️ إعدادات التوصيل والأقسام ومعلومات التواصل
- 🚀 أدلة مدمجة للنشر على Google و Vercel

### جاهز لـ Google
- بيانات منظمة `Product` + `Offer` بالدرهم (MAD)
- `sitemap.xml` ديناميكي و `robots.txt`
- تغذية منتجات لـ **Google Merchant Center** عبر `/api/feed.xml`
- تصدير نسخة **HTML مستقلة** للتضمين في Google Sites

---

## 🚀 التشغيل محلياً

```bash
# 1. تثبيت الاعتماديات
npm install

# 2. إعداد البيئة
cp .env.example .env
# ثم عدّل DATABASE_URL في ملف .env

# 3. إنشاء الجداول وإضافة المنتجات
npx drizzle-kit push
npx tsx src/db/seed.ts

# 4. التشغيل
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

> بديل بدون terminal: شغّل الخادم ثم افتح `/api/setup` مرة واحدة.

---

## 🌍 النشر

| الوجهة | الدليل |
|---|---|
| **Vercel** (مستحسن) | [`DEPLOY-VERCEL.md`](./DEPLOY-VERCEL.md) |
| **Google Search & Sites** | [`DEPLOY-GOOGLE.md`](./DEPLOY-GOOGLE.md) |

### متغيرات البيئة

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NEXT_PUBLIC_SITE_URL=https://chaouishop.app
SETUP_TOKEN=change-me
```

---

## 🧱 البنية التقنية

| الطبقة | التقنية |
|---|---|
| الإطار | Next.js 16 (App Router) |
| اللغة | TypeScript |
| التنسيق | Tailwind CSS v4 |
| قاعدة البيانات | PostgreSQL + Drizzle ORM |
| الخطوط | Tajawal + Lalezar |

```
src/
├── app/
│   ├── page.tsx              # المتجر
│   ├── produit/[id]/         # صفحة المنتج (SEO)
│   ├── admin/                # لوحة التحكم
│   └── api/
│       ├── orders/           # إنشاء الطلبات
│       ├── admin/            # إدارة المنتجات والطلبات
│       ├── setup/            # تهيئة قاعدة البيانات
│       ├── export/html/      # تصدير نسخة HTML
│       └── feed.xml/         # تغذية Google Merchant
├── components/store/         # مكونات الواجهة
├── db/                       # المخطط والبيانات الأولية
└── lib/                      # أدوات مساعدة
```

---

## 📜 الأوامر

```bash
npm run dev        # التطوير
npm run build      # البناء للإنتاج
npm run start      # تشغيل نسخة الإنتاج
npm run typecheck  # فحص الأنواع
npm run lint       # فحص الجودة
```

---

## 📄 الرخصة

مشروع خاص — جميع الحقوق محفوظة © 2026 MEHDISHOP
