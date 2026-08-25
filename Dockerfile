FROM oven/bun:1.1
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install

COPY .

# مسحنا prisma و build عادي
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]
