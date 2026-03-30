# Stage 1: Build the application
FROM ubuntu:24.04
WORKDIR /app    
RUN apt-get update && apt-get install -y nodejs npm && npm i -g pnpm@latest

COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm run build

# COPY /app/package*.json ./
# COPY /app/node_modules ./node_modules
# COPY /app/dist ./dist

EXPOSE 3000
CMD ["pnpm", "start"]


