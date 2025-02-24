FROM oven/bun:latest

WORKDIR /app

ENV PORT 8080

COPY package*.json ./

RUN bun install

COPY . ./

EXPOSE 8080

CMD [ "bun", "run", "server", "--port=8080" ]

