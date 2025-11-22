// Robust Express server to serve static frontend and API endpoints
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Determine static directory: prefer public/ if it exists, fallback to repo root
const publicDir = path.join(__dirname, 'public');
const staticDir = fs.existsSync(publicDir) ? publicDir : __dirname;
const indexPath = path.join(staticDir, 'index.html');

// Serve static assets
app.use(express.static(staticDir));

// API endpoint for health checks
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime_seconds: process.uptime() });
});

// Catch-all: serve index.html for client-side routing
app.get('*', (req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

app.listen(PORT, () => {
  console.log(`Absolute Authentics server listening on port ${PORT}`);
  console.log(`Serving static files from: ${staticDir}`);
});

module.exports = app;