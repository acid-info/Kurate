# Build
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# is this usefull ?
RUN corepack enable && \
  corepack prepare pnpm@latest --activate

# Layer for package installs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /usr/src/app/
COPY packages/contracts/ /usr/src/app/packages/contracts/
RUN pnpm install

WORKDIR /usr/src/app/packages/contracts

RUN pnpm run compile

CMD ["pnpm", "start:blockchain"]
