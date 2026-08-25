# رفع متجر MEHDISHOP على GitHub

الخطوة الأولى قبل النشر على Vercel. الوقت المتوقع: **5 دقائق**.

---

## ✅ حالة المشروع

تمت تهيئة Git بالفعل وإنشاء أول commit:

- **66 ملفاً** جاهزة للرفع
- الفرع الرئيسي: `main`
- ملف `.env` **مستبعد** (كلمات السر ورابط قاعدة البيانات آمنة)
- صور المنتجات العشر مضمّنة في `public/images/products/`

للتحقق:

```bash
git log --oneline -1
git status
```

---

## 1) أنشئ مستودعاً فارغاً

افتح [github.com/new](https://github.com/new):

| الحقل | القيمة |
|---|---|
| Repository name | `mehdishop` |
| Visibility | `Private` (خاص) أو `Public` |
| Add README | ❌ **لا تضع علامة** |
| Add .gitignore | ❌ **لا تضع علامة** |
| Add license | ❌ **لا تضع علامة** |

> المشروع يحتوي هذه الملفات بالفعل — إضافتها من GitHub تسبب تعارضاً عند الرفع.

اضغط **Create repository**.

---

## 2) اربط المستودع وارفع

```bash
git remote add origin https://github.com/USERNAME/mehdishop.git
git push -u origin main
```

استبدل `USERNAME` باسم حسابك.

### إن لم تكن Git مهيّأة عندك

```bash
git init
git add .
git commit -m "MEHDISHOP store"
git branch -M main
git remote add origin https://github.com/USERNAME/mehdishop.git
git push -u origin main
```

---

## 3) تسجيل الدخول

GitHub **لا يقبل كلمة سر الحساب** عند الرفع. تحتاج **Personal Access Token**:

1. افتح [github.com/settings/tokens](https://github.com/settings/tokens)
2. **Generate new token (classic)**
3. اختر صلاحية **`repo`**
4. انسخ الرمز واستعمله مكان كلمة السر

### 💡 بديل أسهل بدون أوامر

نزّل [**GitHub Desktop**](https://desktop.github.com):

1. `File ← Add local repository` واختر مجلد المشروع
2. `Publish repository`
3. انتهى — بدون terminal ولا tokens

---

## 4) تأكد من النجاح

افتح `https://github.com/USERNAME/mehdishop` — يجب أن ترى:

- ✅ 66 ملفاً
- ✅ مجلد `public/images/products` بالصور
- ✅ **لا يوجد** ملف `.env` (هذا صحيح ومقصود)

---

## 🔄 رفع التعديلات لاحقاً

```bash
git add .
git commit -m "تحديث المنتجات"
git push
```

إن كان المتجر منشوراً على Vercel، سيتحدث **تلقائياً** خلال دقيقة.

---

## 🔧 حل المشاكل

| الرسالة | الحل |
|---|---|
| `remote origin already exists` | `git remote set-url origin https://github.com/USER/repo.git` |
| `Authentication failed` | استعمل Personal Access Token بدل كلمة السر |
| `rejected — non-fast-forward` | المستودع غير فارغ — أنشئه من جديد بدون README |
| `src refspec main does not match` | نفّذ `git add . && git commit -m "init"` أولاً |

---

## ⏭️ الخطوة التالية

بعد نجاح الرفع، انتقل إلى [`DEPLOY-VERCEL.md`](./DEPLOY-VERCEL.md) لنشر المتجر على الإنترنت.
