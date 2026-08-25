FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
# زدنا --legacy-peer-deps حيت عندك React 19 و مكتبات قديمة
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
