FROM node:20-alpine
WORKDIR /app

# 1. Install deps
COPY package*.json ./
RUN npm install

# 2. Copy all files
COPY . .

# 3. Build with fake DB URL باش ميطيحش فـ البيلد
ENV SKIP_ENV_VALIDATION=1
ENV DATABASE_URL=postgresql://dummy:dummy@dummy:5432/dummy
RUN npm run build

# 4. Run
EXPOSE 3000
CMD ["npm", "start"]
