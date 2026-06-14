FROM node:18-alpine AS web-builder
WORKDIR /web
COPY ui/package*.json ./
RUN npm ci
COPY ui .
RUN npm run build:web

FROM node:18-alpine AS api-builder
WORKDIR /app
COPY api/package*.json ./
RUN npm ci
COPY api .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=api-builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=api-builder /app/lib ./lib
COPY --from=web-builder /web/dist-web ./public
EXPOSE 3000
CMD ["node", "lib/index.js"]
