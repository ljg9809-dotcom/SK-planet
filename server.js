'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const PORT = Number(process.env.CARDNEWS_PORT || 8787);
const KEY_FILE = path.join(ROOT, 'tools', 'openai-key.txt');
const GENERATED_DIR = path.join(ROOT, 'assets', 'images', 'cardnews', 'generated');
const MIME = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
}

function json(res, status, body) {
  cors(res);
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
  res.end(JSON.stringify(body));
}

function getKey() {
  try {
    const key = fs.readFileSync(KEY_FILE, 'utf8').split(/\r?\n/)[0].trim();
    return key.startsWith('sk-') ? key : '';
  } catch {
    return '';
  }
}

function readBody(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      raw += chunk;
      if (Buffer.byteLength(raw) > limit) reject(new Error('요청이 너무 큽니다.'));
    });
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); }
      catch { reject(new Error('요청 형식이 올바르지 않습니다.')); }
    });
    req.on('error', reject);
  });
}

async function generateImage(req, res) {
  const key = getKey();
  if (!key) return json(res, 503, {error:'프로젝트 API 키 파일을 찾을 수 없습니다.'});
  try {
    const body = await readBody(req);
    const subject = String(body.prompt || '').trim().slice(0, 1800);
    if (subject.length < 3) return json(res, 400, {error:'배경 설명을 입력해 주세요.'});
    const prompt = `${subject}\n\nCreate a premium editorial background image for a Korean social media card-news slide. Portrait 4:5 composition, strong depth, intentional negative space in the lower third for an HTML text overlay. No text, no letters, no typography, no logos, no watermark, no interface elements.`;
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
      body: JSON.stringify({model:'gpt-image-2',prompt,size:'1024x1280',quality:'medium',n:1})
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.error?.message || `OpenAI 요청 실패 (${response.status})`;
      console.error(`[image] request failed: ${response.status}`);
      return json(res, response.status, {error:message});
    }
    const encoded = data?.data?.[0]?.b64_json;
    if (!encoded) return json(res, 502, {error:'이미지 데이터가 반환되지 않았습니다.'});
    fs.mkdirSync(GENERATED_DIR, {recursive:true});
    const filename = `gen-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.png`;
    fs.writeFileSync(path.join(GENERATED_DIR, filename), Buffer.from(encoded, 'base64'), {mode:0o600});
    json(res, 200, {ok:true,url:`assets/images/cardnews/generated/${filename}`,model:'gpt-image-2'});
  } catch (error) {
    console.error(`[image] ${error.name || 'Error'}: ${error.message}`);
    json(res, 500, {error:'이미지 생성 중 오류가 발생했습니다.'});
  }
}

function serveStatic(req, res) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname); }
  catch { res.writeHead(400); return res.end('Bad request'); }
  if (pathname === '/') pathname = '/cardnews.html';
  const requested = path.resolve(ROOT, `.${pathname}`);
  const relative = path.relative(ROOT, requested);
  const isPrivateToolFile = relative.toLowerCase().startsWith(`tools${path.sep}`);
  if (relative.startsWith('..') || path.isAbsolute(relative) || isPrivateToolFile) {
    res.writeHead(403); return res.end('Forbidden');
  }
  fs.stat(requested, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404); return res.end('Not found'); }
    cors(res);
    res.writeHead(200, {'Content-Type':MIME[path.extname(requested).toLowerCase()] || 'application/octet-stream'});
    fs.createReadStream(requested).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { cors(res); res.writeHead(204); return res.end(); }
  if (req.method === 'GET' && req.url.split('?')[0] === '/ping') return json(res, 200, {ok:true,openai:Boolean(getKey()),model:'gpt-image-2'});
  if (req.method === 'POST' && req.url.split('?')[0] === '/img-gen') return generateImage(req, res);
  if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res);
  json(res, 405, {error:'지원하지 않는 요청입니다.'});
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') console.error(`포트 ${PORT}가 이미 사용 중입니다. 열려 있는 카드뉴스 서버를 확인해 주세요.`);
  else console.error(error.message);
  process.exitCode = 1;
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`FOLD Card News Studio: http://localhost:${PORT}`);
  console.log(`AI background: ${getKey() ? 'ready (gpt-image-2)' : 'API key missing'}`);
});
