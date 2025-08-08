# KakaoTalk YouTube Link Aggregator — CSV-as-DB Edition

## What this does
- Reads a **public CSV** (columns: `Date, User, Message`) as the source of truth.
- Extracts YouTube links grouped by sender.
- Serves a public JSON at `/api/parse/public` and a minimal React UI that consumes it.
- Admin can force refresh the cache via `/api/parse/admin/reload` (Bearer token).

## Quick start (local)
1) Backend
   ```bash
   cd backend
   cp .env.example .env        # set CSV_URL + ADMIN_TOKEN
   npm i
   npm run dev                 # http://localhost:4000
   ```

2) Frontend
   ```bash
   cd frontend
   npm i
   npm run dev                 # http://localhost:5173
   ```

3) Update CSV
   - Replace the CSV at your public URL (GitHub Raw, S3, Cloudflare R2, etc.).
   - Force reload:
     ```bash
     curl -X POST http://localhost:4000/api/parse/admin/reload            -H "Authorization: Bearer <ADMIN_TOKEN>"
     ```
