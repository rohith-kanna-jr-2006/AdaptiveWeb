const request = require('supertest');
const app = require('../server/app');
require('./setup');

describe('Health API Endpoint', () => {
  it('GET /api/health should return 200 and standard success response envelope', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toEqual({
      status: 'ok',
      service: 'AdaptiveWeb'
    });
  });

  it('GET /api/unknown-endpoint should return 404 with error envelope', async () => {
    const res = await request(app).get('/api/unknown-endpoint');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'NOT_FOUND');
  });
});
