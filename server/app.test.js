import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from './src/index.js';

test('health endpoint works', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
});

test('auth login works with seeded admin', async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'admin@megaprep.com', password: 'admin123' });
  assert.equal(res.status, 200);
  assert.ok(res.body.token);
});
