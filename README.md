# Absolute Authentics

Premium sports memorabilia website featuring authentic signed items from legendary athletes.

## Features

- Responsive website with premium UI/UX
- Express server with static file serving
- Health check API endpoint
- Flexible payment plans section
- Contact and inquiry forms
- Featured collection gallery

## Run & Verify

### Installation

Install dependencies:
```bash
npm install
```

### Start the Server

Start the application:
```bash
npm start
```

The server will start on port 3000 (or the PORT environment variable if set).

### Verify Functionality

Test the website root:
```bash
curl -i http://localhost:3000/
```

Expected output:
```
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
...
(HTML content of the homepage)
```

Test the health check endpoint:
```bash
curl http://localhost:3000/api/health
```

Expected output:
```json
{"status":"ok","uptime_seconds":X.XXX}
```

### Access in Browser

Open your browser to:
- Homepage: http://localhost:3000
- Store: http://localhost:3000/store.html
- Sell: http://localhost:3000/sell.html

## Project Structure

```
├── public/              # Static website files
│   ├── index.html      # Main homepage
│   ├── store.html      # Store page
│   ├── sell.html       # Sell page
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── images/         # Image assets
├── backup_version4/    # Backup of Version4 files
├── server.js           # Express server
├── package.json        # Node dependencies and scripts
└── README.md           # This file
```

## Development

For development with auto-reload:
```bash
npm run start:dev
```

## License

MIT