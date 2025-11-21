#!/usr/bin/env bash
set -euo pipefail

# Creates project files and zips:
# package.json.zip, server.js.zip, public_index.html.zip, public_style_css.zip, gitignore.zip, README_md.zip, project_all.zip

echo "Creating temporary working directory ./absoluteauthentics_temp"
rm -rf absoluteauthentics_temp
mkdir -p absoluteauthentics_temp/public
cd absoluteauthentics_temp

# package.json
cat > package.json <<'EOF'
{
  "name": "absoluteauthentics",
  "version": "0.1.0",
  "description": "Minimal Express + static frontend for Absolute Authentics",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "start:dev": "nodemon server.js",
    "test": "echo \"No tests specified\" && exit 0"
  },
  "author": "jonahsakhai-cyber",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
EOF

# server.js
cat > server.js <<'EOF'
// Minimal Express server to serve static frontend and a simple API endpoint
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from /public
app.use(express.static(path.join(__dirname, 'public')));

// Simple API endpoint for health checks and demo
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime_seconds: process.uptime() });
});

// Catch-all: serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Absolute Authentics server listening on port ${PORT}`);
});

module.exports = app;
EOF

# public/index.html
cat > public/index.html <<'EOF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Absolute Authentics</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <main>
    <h1>Absolute Authentics</h1>
    <p>A minimal running web app — replace with your real app code.</p>

    <section id="status">
      <h2>API Status</h2>
      <button id="checkBtn">Check health</button>
      <pre id="output">Click "Check health" to test /api/health</pre>
    </section>

    <footer>
      <small>Running on port provided by environment (or 3000 locally).</small>
    </footer>
  </main>

  <script>
    document.getElementById('checkBtn').addEventListener('click', async () => {
      const out = document.getElementById('output');
      out.textContent = 'Checking...';
      try {
        const res = await fetch('/api/health');
        const json = await res.json();
        out.textContent = JSON.stringify(json, null, 2);
      } catch (err) {
        out.textContent = 'Error: ' + err.message;
      }
    });
  </script>
</body>
</html>
EOF

# public/style.css
cat > public/style.css <<'EOF'
:root {
  --bg: #0f1724;
  --card: #0b1220;
  --accent: #00a3ff;
  --text: #e6eef6;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  background: linear-gradient(180deg,#071022 0%, #0a1828 100%);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

main {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.04);
  padding: 28px;
  border-radius: 12px;
  width: min(720px, 94vw);
  box-shadow: 0 8px 30px rgba(2,6,23,0.6);
}

h1 { margin: 0 0 8px 0; font-size: 1.6rem; color: var(--accent); }
p { margin: 0 0 18px 0; color: #cfe9ff; }

#status { margin-top: 12px; }
#checkBtn {
  background: var(--accent);
  color: #041124;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
}
#checkBtn:hover { opacity: 0.9; }
pre#output {
  margin-top: 12px;
  background: rgba(0,0,0,0.25);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
}
footer { margin-top: 18px; color: #9fb8d2; font-size: 0.85rem; }
EOF

# .gitignore
cat > .gitignore <<'EOF'
node_modules
.env
.DS_Store
EOF

# README.md
cat > README.md <<'EOF'
# Absolute Authentics — Minimal working web app

This repository lacked a package.json which caused \`npm start\` to fail with ENOENT. I added a minimal Node/Express app and static frontend so the project can run.

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
EOF

echo "Zipping individual files..."

zip -q package.json.zip package.json
zip -q server.js.zip server.js
zip -q public_index_html.zip public/index.html
zip -q public_style_css.zip public/style.css
zip -q gitignore.zip .gitignore
zip -q README_md.zip README.md

echo "Zipping entire project into project_all.zip..."
zip -qr project_all.zip package.json server.js public .gitignore README.md

echo "Done. Files created in: $(pwd)"
ls -lh *.zip || true

echo "Moving zip files back to parent directory ./"
mv *.zip ../ || true

cd ..
rm -rf absoluteauthentics_temp

echo "All zip files are available in the current directory:"
ls -lh *.zip || true