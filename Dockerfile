FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV SKIP_ENV_VALIDATION=1
ENV DATABASE_URL=postgresql://dummy:dummy@dummy:5432/dummy
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
