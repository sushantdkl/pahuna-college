# Pahuna Frontend

Next.js frontend for the Pahuna tourism platform.

## Vercel Deployment

Deploy this folder as the Vercel project root:

```text
Root Directory: frontend
Framework Preset: Next.js
Install Command: npm ci
Build Command: npm run build
Output Directory: .next
```

Required Vercel environment variables:

```text
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
MISTRAL_API_KEY=your-mistral-key
MISTRAL_MODEL=mistral-small-latest
```

Optional analytics variables:

```text
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

The backend must be deployed separately and reachable from `NEXT_PUBLIC_API_URL`.
Uploaded images from that backend host are allowed by `next.config.ts` during the Vercel build.

## Local Commands

```bash
npm ci
npm run test:frontend
npm run build
npm run dev
```

## Docker Compose Deployment

From the project root, create a local Docker env file:

```bash
copy .env.example .env
```

Edit `.env` and set strong values for:

```text
MONGO_PASS
JWT_SECRET
DEFAULT_ADMIN_PASSWORD
MISTRAL_API_KEY
EMAIL_USER
EMAIL_PASS
```

For local Docker, keep:

```text
NEXT_PUBLIC_API_URL=http://localhost:5050
SERVER_API_URL=http://backend:5050
CLIENT_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

If port `3000` is already used by your local Next dev server, set these values in `.env`:

```text
FRONTEND_PORT=3001
CLIENT_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

Build and start everything:

```bash
docker compose up --build
```

Open:

```text
Frontend: http://localhost:3000
Backend health: http://localhost:5050
MongoDB: localhost:27017
```

Stop containers:

```bash
docker compose down
```

Stop and delete Mongo/upload volumes:

```bash
docker compose down -v
```
