FROM node:24.15-slim AS builder
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm i

COPY . .

RUN pnpm build-server

RUN rm -rf node_modules

FROM node:24.15-slim AS prod
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --from=builder /app /app

RUN pnpm i -P

EXPOSE 4000

CMD ["node", "dist/server/index.js"]
