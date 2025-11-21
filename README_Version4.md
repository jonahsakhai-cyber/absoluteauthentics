# Absolute Authentics — Minimal working web app

This repository lacked a package.json which caused `npm start` to fail with ENOENT. I added a minimal Node/Express app and static frontend so the project can run.

How to run locally:

1. Install dependencies
   - npm install

2. Start the server
   - npm start
   - The server listens on PORT environment variable or defaults to 3000.

3. Open in browser
   - http://localhost:3000
   - Click "Check health" to call /api/health.

Notes:
- Replace public/ files and server.js with your real application code as needed.
- If this repo is intended to be a frontend-only app (create-react-app / Next.js etc.), you can adapt the package.json scripts and the server accordingly.