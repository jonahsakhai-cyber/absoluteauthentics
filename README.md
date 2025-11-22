# Absolute Authentics — Premium Sports Memorabilia

This repository contains the Absolute Authentics website, a platform for premium sports memorabilia.

## How to Run Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   ```
   - The server listens on the PORT environment variable or defaults to 3000.

3. **Open in browser**
   - Navigate to http://localhost:3000
   - The full website will be served from the `public/` directory

## Verification

You can verify the server is running correctly with these curl commands:

```bash
# Test the main HTML page
curl -i http://localhost:3000/

# Test the health check endpoint
curl http://localhost:3000/api/health
```

Expected outputs:
- The first command should return HTTP 200 with HTML content
- The second command should return JSON: `{"status":"ok","uptime_seconds":<number>}`

## Development

For development with auto-restart on file changes:
```bash
npm run start:dev
```

## Structure

- `public/` - Static website files (HTML, CSS, JS, images)
- `server.js` - Express server that serves the static files and provides API endpoints
- `backup_version4/` - Backup of previous version files