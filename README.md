# Absolute Authentics — Premium Sports Memorabilia

A full-featured web application for premium sports memorabilia with Express backend.

## How to Run Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   ```
   The server listens on PORT environment variable or defaults to 3000.

3. **Open in browser**
   - Navigate to http://localhost:3000
   - The site includes Home, Store, and Sell Now pages
   - API health endpoint available at http://localhost:3000/api/health

## Project Structure

- `public/` - Static website files (HTML, CSS, JS, images)
- `server.js` - Express server that serves static files and API endpoints
- `package.json` - Node.js dependencies and scripts
- `backup_version4/` - Archived duplicate Version4 files

## Testing

To verify the application is working:

```bash
# Start the server
npm start

# In another terminal, test the endpoints:
curl http://localhost:3000/           # Should return HTML
curl http://localhost:3000/api/health # Should return {"status":"ok","uptime_seconds":...}
```

## Development

For development with auto-reload:
```bash
npm run start:dev
```