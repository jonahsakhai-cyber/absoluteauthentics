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