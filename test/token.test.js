const assert = require('assert');
const { signToken, verifyToken } = require('../backend/utils/token');

describe('token utils', () => {
  it('signs and verifies payloads', () => {
    const token = signToken({ email: 'test@example.com', role: 'user' });
    const payload = verifyToken(token);
    assert.strictEqual(payload.email, 'test@example.com');
    assert.strictEqual(payload.role, 'user');
    assert.ok(payload.exp > Date.now());
  });

  it('rejects tampered tokens', () => {
    const token = signToken({ email: 'test@example.com' });
    const parts = token.split('.');
    parts[1] = Buffer.from(JSON.stringify({ email: 'bad@example.com' })).toString('base64');
    const tampered = parts.join('.');
    assert.strictEqual(verifyToken(tampered), null);
  });
});
