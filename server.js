// Minimal Express server to serve static frontend and a simple API endpoint
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Determine static directory (prefer public/, fallback to root)
const publicDir = path.join(__dirname, 'public');
const staticDir = fs.existsSync(publicDir) ? publicDir : __dirname;

// Serve static assets
app.use(express.static(staticDir));

// Simple API endpoint for health checks and demo
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime_seconds: process.uptime() });
});

// Catch-all: serve index.html for client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(staticDir, 'index.html');
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