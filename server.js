'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8787);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end('Method not allowed');
  }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); return res.end('Bad request'); }
  if (pathname === '/') pathname = '/index.html';
  const requested = path.resolve(ROOT, `.${pathname}`);
  const relative = path.relative(ROOT, requested);
  const segments = relative.split(path.sep);
  const allowed = ['index.html', 'report.html', 'contents.html', 'service.html','admin.html','admin.js','admin.css','chatbot-content.js','chatbot.js','chatbot-core.mjs','chatbot.json','chatbot.css','inquiry-client.js','inquiry-config.json'].includes(relative)
    || (['assets', 'js', 'css'].includes(segments[0]) && !segments.some(segment => segment.startsWith('.')));
  if (relative.startsWith('..') || path.isAbsolute(relative) || !allowed) {
    res.writeHead(404);
    return res.end('Not found');
  }
  fs.stat(requested, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(requested).toLowerCase()] || 'application/octet-stream' });
    if (req.method === 'HEAD') return res.end();
    const stream = fs.createReadStream(requested);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  });
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `포트 ${PORT}가 이미 사용 중입니다.` : error.message);
  process.exitCode = 1;
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Portfolio: http://localhost:${PORT}`);
});
