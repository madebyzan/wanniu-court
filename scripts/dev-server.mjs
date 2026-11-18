import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/png'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon']
]);

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl || '/', 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const target = resolve(root, relativePath);

  if (target !== root && !target.startsWith(root + sep)) {
    return null;
  }

  return target;
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
    return;
  }

  let target;
  try {
    target = resolveRequestPath(request.url);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  if (!target) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const fileInfo = await stat(target);
    if (!fileInfo.isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': mimeTypes.get(extname(target).toLowerCase()) || 'application/octet-stream',
      'Content-Length': fileInfo.size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'self' data:; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"
    });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    createReadStream(target).pipe(response);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(500).end('Internal server error');
  }
});

server.listen(port, '127.0.0.1', () => {
  process.stdout.write('万物审判庭开发服务器：http://127.0.0.1:' + port + '\n');
});
