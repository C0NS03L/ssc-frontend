FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install

COPY . .

RUN bun run build

EXPOSE 80

# Start the application
CMD ["bun", "run", "start"]