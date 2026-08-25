FROM oven/bun:1.1
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install

COPY . .

# الحل: نستعمل bunx و نزيد --force
RUN bunx prisma generate --force

RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]
