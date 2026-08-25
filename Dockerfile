# Stage 1: Build with Node
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json bun.lockb* ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Run with Bun
FROM oven/bun:1.1 AS runner
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["bun", "run", "start"]
