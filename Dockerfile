# Recheck this file when using this template
FROM oven/bun:latest as base

# Temporarily switch to root to install system packages
USER root

# Install Chromium and required fonts/libraries for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Switch back to bun user
USER bun

# Switch back to bun user
# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

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