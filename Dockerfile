# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder --chown=appuser:appgroup /usr/src/app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /usr/src/app/package*.json ./
RUN npm ci --omit=dev

USER appuser

EXPOSE 3001
CMD ["node", "dist/main"]
