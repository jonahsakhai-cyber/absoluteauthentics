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