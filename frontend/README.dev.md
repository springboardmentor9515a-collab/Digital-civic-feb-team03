# Frontend Developer Quick Start

This file contains quick commands to run the frontend locally and common environment variables. This is a helper only — it does not modify application logic.

Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

Start backend (in a separate terminal)

```powershell
cd backend
npm install
npm run dev
```

Start frontend

```powershell
cd frontend
npm install
npm run dev
```

Environment
- To point the frontend to a local backend, create `frontend/.env.local` with:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Note: The frontend already defaults to `http://localhost:5000/api` when `NEXT_PUBLIC_API_URL` is not set.

Quick API checks
- Visit `http://localhost:5000/` to confirm the backend is running (should return "Backend is running...").
- Test login endpoint with curl (replace credentials):

```powershell
curl http://localhost:5000/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"you@example.com","password":"password"}'
```

Troubleshooting tips
- If you see a CORS error in the browser console, ensure the backend `FRONTEND_URL` (in `.env` for backend) includes your frontend origin (e.g. `http://localhost:3000`) and restart the backend.
- If `Failed to fetch` appears in the browser network tab, confirm both servers are running and that `NEXT_PUBLIC_API_URL` is correct.

If you'd like, I can add a root-level script to start both servers concurrently or create a short PowerShell script to automate these steps.
