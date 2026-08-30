FROM node:24-alpine AS build
WORKDIR /workspace
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages
COPY transport ./transport
COPY clients ./clients
COPY core ./core
COPY tools ./tools
COPY tsconfig.json ./
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bba/api build

FROM node:24-alpine
WORKDIR /workspace
ENV NODE_ENV=production
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/apps/api ./apps/api
COPY --from=build /workspace/transport/agency-runtime ./transport/agency-runtime
COPY --from=build /workspace/packages/publisher-prototype ./packages/publisher-prototype
CMD ["node", "apps/api/dist/main.js"]
