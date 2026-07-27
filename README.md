# Pahuna College

Full-stack Pahuna tourism platform with:

- `frontend/` - Next.js public site and admin dashboard
- `backend/` - Express API
- `docker-compose.yml` - MongoDB, backend, and frontend local deployment

## Vercel

Detected structure:

```text
pahuna-college/
├── frontend/   Next.js app for Vercel
├── backend/    Express API, deploy separately
└── docker-compose.yml
```

Vercel should deploy the frontend only. The backend must be deployed separately, then its public URL must be set as `NEXT_PUBLIC_API_URL`.

Recommended Vercel settings:

```text
Root Directory: frontend
Framework Preset: Next.js
Install Command: npm ci
Build Command: npm run build
Output Directory: .next
```

If Vercel is importing from the repository root, this root `vercel.json` forwards install/build/output to `frontend/`. The `.vercelignore` file keeps backend, Docker, local env, and generated files out of the Vercel source upload.

Required Vercel environment variables:

```text
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
MISTRAL_API_KEY=your-mistral-key
MISTRAL_MODEL=mistral-small-latest
```

Optional frontend environment variables:

```text
SERVER_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

There is no Prisma code generation step in this project. The backend uses Mongoose/MongoDB and is not built by Vercel.

Local Vercel-style verification:

```powershell
npm run test:frontend
npm run build
npm run build:backend
```

## Docker Compose

Copy the example env file if `.env` does not exist:

```powershell
Copy-Item .env.example .env
```

For local Docker, use:

```text
FRONTEND_PORT=3001
CLIENT_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:5050
SERVER_API_URL=http://backend:5050
```

Start the full stack:

```powershell
docker compose up --build
```

Open:

```text
Frontend: http://localhost:3001
Backend: http://localhost:5050
MongoDB: localhost:27017
```

Stop:

```powershell
docker compose down
```

Reset database/uploads volumes:

```powershell
docker compose down -v
```
