# Build
FROM node:18-alpine AS build

WORKDIR /usr/src/app

RUN corepack enable && \
  corepack prepare pnpm@latest --activate

# Layer for package installs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /usr/src/app/
COPY packages/ui/package.json /usr/src/app/packages/ui/
RUN pnpm install

# Layer for relayer package
COPY packages/ui/ /usr/src/app/packages/ui

WORKDIR /usr/src/app/packages/ui

RUN pnpm run build

# Final image
FROM node:18-alpine

RUN corepack enable && \
  corepack prepare pnpm@latest --activate

ENV NODE_ENV production
USER node
WORKDIR /usr/src/app/packages/ui

COPY --chown=node:node --from=build /usr/local/bin/pnpm /usr/local/bin/pnpm
COPY --chown=node:node --from=build /usr/local/lib  /usr/local/lib
COPY --chown=node:node --from=build /usr/src/app/ /usr/src/app/

CMD ["pnpm", "preview", "--host" ,"0.0.0.0", "--port", "5173"]
