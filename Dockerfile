FROM node:lts-slim
RUN npm install -g bun

WORKDIR /app

ENV PORT 8080

COPY package*.json ./

RUN bun install

COPY . .

EXPOSE 8080

CMD ["bun", "run", "server"]
