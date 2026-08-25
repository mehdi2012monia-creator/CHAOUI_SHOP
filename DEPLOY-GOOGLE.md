# نشر متجر MEHDISHOP على Google

هذا الدليل يشرح كيف تنشر المتجر وتجعله يظهر على Google.

---

## ملخص سريع

| الهدف | الطريقة | الرابط |
|---|---|---|
| عرض المتجر في صفحة Google Sites | تضمين iframe | `إدراج ← تضمين` |
| ظهور المتجر في بحث Google | Search Console + Sitemap | `/sitemap.xml` |
| عرض المنتجات في Google Shopping | Merchant Center | `/api/feed.xml` |

> ⚠️ Google Sites **لا يستضيف** تطبيقات بقاعدة بيانات. الخطوة الأولى دائماً هي نشر المتجر على استضافة تدعم Next.js، ثم تضمينه أو فهرسته.

---

## 1) نشر المتجر (مجاناً على Vercel)

1. ارفع المشروع إلى مستودع على GitHub.
2. ادخل إلى [vercel.com](https://vercel.com) ← **New Project** ← اختر المستودع.
3. أنشئ قاعدة بيانات PostgreSQL مجانية من [Neon](https://neon.tech) أو [Supabase](https://supabase.com) وانسخ رابط الاتصال.
4. في Vercel أضف متغيرات البيئة:

```
DATABASE_URL=postgresql://...        # رابط قاعدة البيانات
NEXT_PUBLIC_SITE_URL=https://chaouishop.app
GOOGLE_SITE_VERIFICATION=            # يُملأ في الخطوة 3
```

5. اضغط **Deploy**، ثم شغّل مرة واحدة لإنشاء الجداول والمنتجات:

```bash
npx drizzle-kit push
npx tsx src/db/seed.ts
```

---

## 2) التضمين في Google Sites

تم ضبط رؤوس الأمان (`frame-ancestors`) للسماح بالتضمين، لذا المتجر يشتغل كاملاً داخل Google Sites.

1. افتح موقعك في [sites.google.com](https://sites.google.com).
2. **إدراج (Insert) ← تضمين (Embed) ← عبر عنوان URL** والصق رابط متجرك.
3. أو اختر **رمز التضمين** والصق:

```html
<iframe src="https://chaouishop.app" width="100%" height="1200"
        frameborder="0" style="border:0" allowfullscreen></iframe>
```

4. وسّع الإطار ليملأ الصفحة ← **نشر**.

💡 تجد هذا الكود جاهزاً للنسخ داخل لوحة التحكم في تبويب **النشر على Google**.

---

## 3) الظهور في بحث Google

1. ادخل إلى [Google Search Console](https://search.google.com/search-console) وأضف نطاقك.
2. اختر التحقق بواسطة **علامة HTML**، انسخ قيمة `content` وضعها في `GOOGLE_SITE_VERIFICATION` ثم أعد النشر.
3. بعد التحقق: **Sitemaps** ← ألصق `sitemap.xml` ← إرسال.

### ما هو مُفعّل تلقائياً في المشروع

- ✅ صفحة مستقلة لكل منتج: `/produit/[id]` قابلة للفهرسة
- ✅ بيانات منظمة `Product` + `Offer` بالدرهم المغربي (MAD) وحالة التوفر
- ✅ بيانات `OnlineStore` و `BreadcrumbList`
- ✅ `sitemap.xml` ديناميكي يتحدث مع كل منتج جديد
- ✅ `robots.txt` يمنع فهرسة `/admin` و `/api`
- ✅ وسوم Open Graph و Twitter Card للمشاركة على الشبكات
- ✅ عناوين `canonical` وميتاداتا عربية كاملة

---

## 4) Google Shopping مجاناً (Merchant Center)

1. أنشئ حساباً في [merchants.google.com](https://merchants.google.com).
2. أكّد ملكية الموقع (نفس نطاق Search Console).
3. **Products ← Add product feed ← Scheduled fetch**.
4. ألصق رابط التغذية:

```
https://chaouishop.app/api/feed.xml
```

5. اختر التحديث اليومي. التغذية تحترم صيغة RSS 2.0 الخاصة بـ Google مع الأسعار بالدرهم `MAD` ومصاريف الشحن للمغرب.

---

## نصائح لتحسين الترتيب

- اكتب وصفاً غنياً لكل منتج من لوحة التحكم (يظهر في نتائج البحث).
- استعمل صوراً مربعة واضحة بدقة 800×800 على الأقل.
- حدّث المخزون باستمرار — Google يخفض ترتيب المنتجات غير المتوفرة.
- اربط نطاقاً خاصاً (chaouishop.app) بدل نطاق `.vercel.app` لمصداقية أعلى.
