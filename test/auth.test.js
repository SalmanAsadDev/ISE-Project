const assert = require('assert');
const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../backend/index');
const { getUserPath, getPlanPath } = require('../backend/utils/fileDb');

// helper for cleanup
function cleanup(email) {
  const userFile = getUserPath(email);
  const planFile = getPlanPath(email);
  [userFile, planFile].forEach((file) => {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  });
}

describe('auth flow', () => {
  const email = `test-${Date.now()}@example.com`;

  after(() => cleanup(email));

  it('registers a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({ email, password: 'Secret123!' });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.email, email);
  });

  it('logs in existing user', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password: 'Secret123!' });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
  });

  it('rejects invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'wrong' });
    assert.strictEqual(res.status, 401);
  });
});
