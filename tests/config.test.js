const request = require('supertest');
const app = require('../server/app');
require('./setup');

describe('Config API Endpoints', () => {
  it('GET /api/config should return default adaptive configuration', async () => {
    const res = await request(app).get('/api/config');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('adaptiveEnabled', true);
    expect(res.body.data).toHaveProperty('measurementInterval', 5000);
    expect(res.body.data).toHaveProperty('qualityThresholds');
  });

  it('PUT /api/config should update adaptive configuration with valid payload', async () => {
    const updatePayload = {
      adaptiveEnabled: false,
      measurementInterval: 10000,
      qualityThresholds: {
        poorLatency: 400
      }
    };

    const res = await request(app)
      .put('/api/config')
      .send(updatePayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.adaptiveEnabled).toBe(false);
    expect(res.body.data.measurementInterval).toBe(10000);
    expect(res.body.data.qualityThresholds.poorLatency).toBe(400);
  });

  it('PUT /api/config should reject invalid measurementInterval (< 1000)', async () => {
    const res = await request(app)
      .put('/api/config')
      .send({ measurementInterval: 500 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toContain('between 1000 and 60000');
  });

  it('PUT /api/config should reject unknown key in body', async () => {
    const res = await request(app)
      .put('/api/config')
      .send({ unknownField: 'test' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
