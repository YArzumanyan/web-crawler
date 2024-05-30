FROM node:22

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npx tsc

EXPOSE 3000

RUN node dist/script.js

CMD ["node", "dist/script.js"]
