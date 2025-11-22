// Minimal Express server to serve static frontend and a simple API endpoint
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Determine static directory (prefer public/, fallback to root)
let staticDir = __dirname;
try {
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir)) {
    staticDir = publicDir;
  }
} catch (err) {
  console.warn('Error checking for public directory:', err.message);
}

// Serve static assets
app.use(express.static(staticDir));

// Simple API endpoint for health checks and demo
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime_seconds: process.uptime() });
});

// Catch-all: serve index.html for client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(staticDir, 'index.html');
  try {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('index.html not found');
    }
  } catch (err) {
    console.error('Error serving index.html:', err.message);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => {
  console.log(`Absolute Authentics server listening on port ${PORT}`);
  console.log(`Serving static files from: ${staticDir}`);
});

module.exports = app;