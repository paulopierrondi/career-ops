import crypto from 'node:crypto';

function equal(a, b) {
  const left = Buffer.from(String(a || ''));
  const right = Buffer.from(String(b || ''));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function headerValue(headers, name) {
  if (!headers) return '';
  return headers[name] || headers[name.toLowerCase()] || '';
}

export function authConfig(env = process.env) {
  return {
    token: env.CAREER_OPS_ADMIN_TOKEN || env.CAREER_OPS_BASIC_PASSWORD || '',
    user: env.CAREER_OPS_BASIC_USER || 'paulo',
  };
}

export function isAuthorized(req, env = process.env) {
  const { token, user } = authConfig(env);
  if (!token) return false;

  const authorization = headerValue(req.headers, 'authorization');
  if (!authorization) return false;

  const bearer = authorization.match(/^Bearer\s+(.+)$/i);
  if (bearer) return equal(bearer[1].trim(), token);

  const basic = authorization.match(/^Basic\s+(.+)$/i);
  if (!basic) return false;

  let decoded = '';
  try {
    decoded = Buffer.from(basic[1], 'base64').toString('utf-8');
  } catch {
    return false;
  }
  const idx = decoded.indexOf(':');
  if (idx === -1) return false;
  const givenUser = decoded.slice(0, idx);
  const givenPassword = decoded.slice(idx + 1);
  return equal(givenUser, user) && equal(givenPassword, token);
}

export function sendUnauthorized(res) {
  res.writeHead(401, {
    'content-type': 'application/json',
    'www-authenticate': 'Basic realm="career-ops"',
  });
  res.end(JSON.stringify({ error: 'Unauthorized' }));
}
