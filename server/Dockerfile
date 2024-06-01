FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm install async-mutex

RUN npx tsc

CMD ["node", "dist/script.js"]
