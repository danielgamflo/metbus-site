const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('node:url');

const PORT = 4000;
const ROOT_DIR = path.resolve(__dirname, '.');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg'
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function isPathInside(parent, child) {
  const rel = path.relative(parent, child);
  return !!rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
}

function send403(res) {
  res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('403 Forbidden');
}

function serveFile(req, res, fullPath, stat) {
  const contentType = getContentType(fullPath);
  const headers = {
    'Content-Type': contentType,
    'Accept-Ranges': 'bytes'
  };

  if (!contentType.startsWith('text/html')) {
    headers['Cache-Control'] = 'public, max-age=3600';
  }

  const range = req.headers.range;
  if (range && (contentType.startsWith('video/') || contentType.startsWith('audio/'))) {
    const size = stat.size;
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) {
      res.writeHead(416, { 'Content-Range': `bytes */${size}` });
      return res.end();
    }
    const start = match[1] ? parseInt(match[1], 10) : 0;
    const end = match[2] ? parseInt(match[2], 10) : size - 1;

    if (start >= size || end >= size || start > end) {
      res.writeHead(416, { 'Content-Range': `bytes */${size}` });
      return res.end();
    }

    headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
    headers['Content-Length'] = end - start + 1;

    res.writeHead(206, headers);
    fs.createReadStream(fullPath, { start, end }).pipe(res);
    return;
  }

  headers['Content-Length'] = stat.size;
  res.writeHead(200, headers);
  fs.createReadStream(fullPath).pipe(res);
}

const server = http.createServer((req, res) => {
  try {
    const parsed = parse(req.url);
    let pathname = decodeURIComponent(parsed.pathname || '/');
    if (pathname === '/') pathname = '/index.html';

    const requestedPath = path.normalize(path.join(ROOT_DIR, pathname));
    if (!isPathInside(ROOT_DIR, requestedPath)) {
      return send403(res);
    }

    fs.stat(requestedPath, (err, stat) => {
      if (err) {
        if (err.code === 'ENOENT') return send404(res);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('500 Internal Server Error');
      }

      if (stat.isDirectory()) {
        const indexPath = path.join(requestedPath, 'index.html');
        fs.stat(indexPath, (idxErr, idxStat) => {
          if (idxErr || !idxStat.isFile()) return send404(res);
          serveFile(req, res, indexPath, idxStat);
        });
      } else if (stat.isFile()) {
        serveFile(req, res, requestedPath, stat);
      } else {
        send404(res);
      }
    });
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('400 Bad Request');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


