#!/usr/bin/env node

import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { isAuthorized, sendUnauthorized } from './auth.mjs';
import { buildDashboardModel } from './career-data.mjs';
import { APP_DIR, dataPaths, resolveStateDir, safeRelativeFile } from './config.mjs';
import { ensureState, runDailyMonitor, runScan, startDailyScheduler } from './runner.mjs';

const PUBLIC_DIR = path.join(APP_DIR, 'public');

function json(res, status, payload) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function contentType(filePath) {
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

function serveFile(res, filePath) {
  if (!existsSync(filePath)) {
    json(res, 404, { error: 'Not found' });
    return;
  }
  res.writeHead(200, { 'content-type': contentType(filePath) });
  res.end(readFileSync(filePath));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => resolve(body));
  });
}

export function createAppServer({ stateDir = resolveStateDir(), env = process.env } = {}) {
  ensureState(stateDir, env);
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://localhost');

      if (url.pathname === '/health') {
        json(res, 200, { ok: true, service: 'career-ops', state: 'ready' });
        return;
      }

      if (!isAuthorized(req, env)) {
        sendUnauthorized(res);
        return;
      }

      if (url.pathname === '/' || url.pathname === '/index.html') {
        serveFile(res, path.join(PUBLIC_DIR, 'index.html'));
        return;
      }

      if (url.pathname.startsWith('/assets/')) {
        const asset = safeRelativeFile(PUBLIC_DIR, url.pathname.replace(/^\/assets\//, ''));
        serveFile(res, asset);
        return;
      }

      if (url.pathname === '/api/summary') {
        json(res, 200, buildDashboardModel(stateDir));
        return;
      }

      if (url.pathname === '/api/applications') {
        json(res, 200, { applications: buildDashboardModel(stateDir).applications });
        return;
      }

      if (url.pathname === '/api/opportunities') {
        json(res, 200, { opportunities: buildDashboardModel(stateDir).opportunities });
        return;
      }

      if (url.pathname === '/api/scan' && req.method === 'POST') {
        await readBody(req);
        const result = await runScan({ stateDir, env });
        json(res, result.exitCode === 0 ? 200 : 500, result);
        return;
      }

      if (url.pathname === '/api/daily' && req.method === 'POST') {
        await readBody(req);
        const result = await runDailyMonitor({ stateDir, env });
        json(res, result.status === 'success' ? 200 : 500, result);
        return;
      }

      if (url.pathname.startsWith('/reports/')) {
        const paths = dataPaths(stateDir);
        const reportFile = safeRelativeFile(paths.reportsDir, url.pathname.replace(/^\/reports\//, ''));
        serveFile(res, reportFile);
        return;
      }

      json(res, 404, { error: 'Not found' });
    } catch (err) {
      json(res, 500, { error: err.message });
    }
  });
}

export function startServer({ env = process.env } = {}) {
  const stateDir = resolveStateDir(env);
  const server = createAppServer({ stateDir, env });
  const scheduler = startDailyScheduler({ stateDir, env });
  const port = Number(env.PORT || 3000);
  server.listen(port, () => {
    console.log(`career-ops web app listening on ${port}`);
  });
  return { server, scheduler };
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  startServer();
}
