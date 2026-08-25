FROM oven/bun:1.1
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install

COPY . .

# نطفيو Turbopack و نبنيو عادي
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build --no-turbo

EXPOSE 3000
CMD ["bun", "run", "start"]
