# Recheck this file when using this template
FROM oven/bun:latest as base

# Create app directory
WORKDIR /usr/src/app

FROM base as install

# Install app dependencies
COPY package.json bun.lock ./

# Bundle app source
COPY . .

RUN bun install --silent --production

EXPOSE 3000
CMD ["bun", "./src/main.ts"]