FROM node:22-alpine AS base
RUN npm i --global --no-update-notifier --no-fund pnpm@10.11.0

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma:generate
RUN pnpm build

FROM base AS deps-prod
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production 
ENV HOSTNAME=0.0.0.0 
ENV PORT=3000

COPY --from=deps-prod --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/next.config.ts ./
COPY --from=builder --chown=node:node /app/.next/standalone ./.next/standalone
COPY --from=builder --chown=node:node /app/public ./.next/standalone/public
COPY --from=builder --chown=node:node /app/.next/static ./.next/standalone/.next/static
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/generated ./generated

COPY --chown=node:node docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER node
EXPOSE 3000

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
CMD ["node", ".next/standalone/server.js"]