const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // Normalize URL
  let parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  } else if (!path.extname(pathname)) {
    // If request is like /who or /who/
    const possibleHtml = path.join(BASE_DIR, pathname + '.html');
    if (fs.existsSync(possibleHtml)) {
      pathname = pathname + '.html';
    } else {
      const possibleIndex = path.join(BASE_DIR, pathname, 'index.html');
      if (fs.existsSync(possibleIndex)) {
        pathname = path.join(pathname, 'index.html');
      }
    }
  }

  const filePath = path.join(BASE_DIR, pathname);

  // Security check: ensure path is within BASE_DIR
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`
        <body style="font-family: sans-serif; background: #070b14; color: #fff; padding: 40px; text-align: center;">
          <h1 style="color: #06b6d4;">404 - Page Not Found</h1>
          <p>The requested file <code>${pathname}</code> was not found.</p>
          <a href="/" style="color: #3b82f6;">Return to Home</a>
        </body>
      `);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Handle range requests for video streaming (crucial for smooth MP4 playback!)
    const range = req.headers.range;
    if (range && contentType.startsWith('video/')) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunkSize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType
      });
      fileStream.pipe(res);
      return;
    }

    // Standard static response
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 FutureNxt AIverse Website is LIVE!`);
  console.log(`🌐 Local URL:  http://localhost:${PORT}/`);
  console.log(`🌐 Network:    http://127.0.0.1:${PORT}/`);
  console.log(`====================================================`);
});
