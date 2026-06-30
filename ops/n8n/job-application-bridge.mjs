import { createServer } from 'node:http';
import { execFile } from 'node:child_process';

const host = process.env.CAREER_OPS_N8N_JOB_BRIDGE_HOST || '127.0.0.1';
const port = Number(process.env.CAREER_OPS_N8N_JOB_BRIDGE_PORT || 18766);
const token = process.env.CAREER_OPS_N8N_BRIDGE_TOKEN;
const projectDir = process.env.PROJECT_DIR || '/Users/paulopierrondi/Projects/career-ops';
const runner = `${projectDir}/scripts/n8n-job-application-run.sh`;

if (!token) {
  throw new Error('CAREER_OPS_N8N_BRIDGE_TOKEN missing');
}

function json(res, status, body) {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(payload);
}

function isAuthorized(req) {
  return req.headers['x-career-ops-token'] === token;
}

function runJobApplications(res) {
  execFile(runner, {
    cwd: projectDir,
    timeout: 1000 * 60 * 60 * 3,
    maxBuffer: 1024 * 1024 * 10,
    env: {
      ...process.env,
      PROJECT_DIR: projectDir,
      AUTOMATION_ID: 'n8n-daily-us-ai-job-applications',
    },
  }, (error, stdout, stderr) => {
    const raw = String(stdout || '').trim();
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    let parsed = null;

    if (start >= 0 && end > start) {
      try {
        parsed = JSON.parse(raw.slice(start, end + 1));
      } catch {
        parsed = null;
      }
    }

    if (error) {
      return json(res, 500, {
        ok: false,
        status: 'failed',
        code: error.code ?? null,
        signal: error.signal ?? null,
        stderr_tail: String(stderr || '').slice(-2000),
        stdout_tail: raw.slice(-2000),
        parsed,
      });
    }

    return json(res, 200, {
      ok: true,
      status: parsed?.status || 'success',
      result: parsed,
      stderr_tail: String(stderr || '').slice(-1000),
    });
  });
}

const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/healthz') {
    return json(res, 200, { ok: true, service: 'career-ops-n8n-job-application-bridge' });
  }

  if (req.method === 'POST' && req.url === '/run') {
    if (!isAuthorized(req)) {
      return json(res, 401, { ok: false, error: 'unauthorized' });
    }

    req.resume();
    return runJobApplications(res);
  }

  return json(res, 404, { ok: false, error: 'not_found' });
});

server.listen(port, host, () => {
  console.log(`career-ops n8n job application bridge listening on http://${host}:${port}`);
});
