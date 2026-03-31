
FROM node:24-alpine
RUN apk add --no-cache pnpm
WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]

