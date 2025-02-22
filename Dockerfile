FROM oven/bun:latest

WORKDIR /app

ENV PORT 8080

COPY package*.json ./

RUN bun install

COPY . ./

CMD [ "bun", "run", "server" ]

