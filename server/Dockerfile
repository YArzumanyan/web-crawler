FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npx tsc

# CMD ["node", "dist/script.js"]
CMD ["node", "dist/server.js"]

EXPOSE 3000