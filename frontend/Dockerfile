FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL=http://localhost:5050
ARG SERVER_API_URL=http://backend:5050
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG MISTRAL_API_KEY=
ARG MISTRAL_MODEL=mistral-small-latest
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV SERVER_API_URL=$SERVER_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV MISTRAL_API_KEY=$MISTRAL_API_KEY
ENV MISTRAL_MODEL=$MISTRAL_MODEL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["npm", "start"]
