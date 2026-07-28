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

Use separate Docker Compose projects from each app folder. Do not start the frontend image directly from Docker Desktop, because that skips the backend URL environment variables.

The separate Docker projects are:

```text
backend/  -> Docker project: pahuna-backend  -> http://localhost:5050
frontend/ -> Docker project: pahuna-frontend -> http://localhost:3001
mongo     -> inside backend project           -> localhost:27017
```

Start backend and Mongo first:

```powershell
cd C:\Users\Acer\Desktop\pahuna-college\backend
Copy-Item .env.example .env
docker compose up --build
```

Then open a second PowerShell and start frontend:

```powershell
cd C:\Users\Acer\Desktop\pahuna-college\frontend
Copy-Item .env.example .env
docker compose up --build
```

Open:

```text
Frontend: http://localhost:3001
Backend: http://localhost:5050
MongoDB: localhost:27017
```

Stop frontend:

```powershell
cd C:\Users\Acer\Desktop\pahuna-college\frontend
docker compose down
```

Stop backend and Mongo:

```powershell
cd C:\Users\Acer\Desktop\pahuna-college\backend
docker compose down
```

Reset backend database/uploads volumes only when you want a fresh reset:

```powershell
cd C:\Users\Acer\Desktop\pahuna-college\backend
docker compose down -v
```
