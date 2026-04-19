FROM node:24.15-slim AS builder
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV VITE_API_URL="/"
RUN corepack enable

COPY ../package.json ../pnpm-lock.yaml ./

RUN pnpm i

COPY .. .

RUN pnpm build

FROM nginx AS prod
WORKDIR /app

COPY --from=builder /app/dist/web /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
