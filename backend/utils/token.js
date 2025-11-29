const crypto = require('crypto');

const SECRET = process.env.APP_SECRET || 'local-dev-secret';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function base64Url(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function signToken(payload) {
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Date.now() + SEVEN_DAYS_MS;
  const body = base64Url(JSON.stringify({ ...payload, exp }));
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;
  const [header, body, signature] = token.split('.');
  if (!header || !body || !signature) return null;
  const expected = crypto
    .createHmac('sha256', SECRET)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }
  const payload = JSON.parse(Buffer.from(body, 'base64').toString('utf8'));
  if (payload.exp && payload.exp < Date.now()) {
    return null;
  }
  return payload;
}

module.exports = {
  signToken,
  verifyToken,
};
