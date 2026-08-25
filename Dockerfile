# 1. استعمل صورة Bun الرسمية
FROM oven/bun:1.1

# 2. دير فولدر الخدمة
WORKDIR /app

# 3. نسخ ملفات الباكيجات الاول باش الكاش يخدم
COPY package.json bun.lockb* ./

# 4. نصب الديبندنسيز
RUN bun install

# 5. نسخ باقي الكود
COPY . .

# 6. جنريت Prisma
RUN bunx prisma generate

# 7. بيلد Next.js
RUN bun run build

# 8. البورت
EXPOSE 3000

# 9. الامر باش يدماري السيرفر
CMD ["bun", "run", "start"]
