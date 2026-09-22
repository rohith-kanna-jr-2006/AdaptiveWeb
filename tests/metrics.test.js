const request = require('supertest');
const app = require('../server/app');
require('./setup');

describe('Metrics API Endpoints', () => {
  describe('POST /api/metrics', () => {
    it('should store performance metric with valid payload', async () => {
      const metricPayload = {
        sessionId: 'session-xyz-100',
        metricName: 'loadTime',
        value: 1250,
        unit: 'ms',
        source: 'client',
        network: {
          effectiveType: '4g',
          downlink: 10,
          latency: 45
        }
      };

      const res = await request(app)
        .post('/api/metrics')
        .send(metricPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.sessionId).toBe('session-xyz-100');
      expect(res.body.data.metricName).toBe('loadTime');
      expect(res.body.data.value).toBe(1250);
      expect(res.body.data.unit).toBe('ms');
      expect(res.body.data.source).toBe('client');
    });

    it('should reject submission with missing sessionId', async () => {
      const metricPayload = {
        metricName: 'loadTime',
        value: 1200,
        unit: 'ms',
        source: 'client'
      };

      const res = await request(app)
        .post('/api/metrics')
        .send(metricPayload);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('sessionId');
    });

    it('should reject invalid metricName', async () => {
      const metricPayload = {
        sessionId: 'sess-123',
        metricName: 'unsupportedMetric',
        value: 100,
        unit: 'ms',
        source: 'client'
      };

      const res = await request(app)
        .post('/api/metrics')
        .send(metricPayload);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('metricName');
    });

    it('should reject negative value', async () => {
      const metricPayload = {
        sessionId: 'sess-123',
        metricName: 'loadTime',
        value: -500,
        unit: 'ms',
        source: 'client'
      };

      const res = await request(app)
        .post('/api/metrics')
        .send(metricPayload);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('value');
    });

    it('should reject invalid source', async () => {
      const metricPayload = {
        sessionId: 'sess-123',
        metricName: 'loadTime',
        value: 500,
        unit: 'ms',
        source: 'magic_ai'
      };

      const res = await request(app)
        .post('/api/metrics')
        .send(metricPayload);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('source');
    });
  });

  describe('GET /api/metrics/:sessionId', () => {
    it('should retrieve stored metrics for specific sessionId', async () => {
      const sessionId = 'session-retrieval-test';

      // Insert two metrics
      await request(app).post('/api/metrics').send({
        sessionId,
        metricName: 'loadTime',
        value: 1100,
        unit: 'ms',
        source: 'client'
      });

      await request(app).post('/api/metrics').send({
        sessionId,
        metricName: 'latency',
        value: 45,
        unit: 'ms',
        source: 'browser_measurement'
      });

      const res = await request(app).get(`/api/metrics/${sessionId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sessionId).toBe(sessionId);
      expect(res.body.data.count).toBe(2);
      expect(res.body.data.metrics.length).toBe(2);
    });

    it('should return empty list for sessionId with no recorded metrics', async () => {
      const res = await request(app).get('/api/metrics/non-existent-session');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.count).toBe(0);
      expect(res.body.data.metrics).toEqual([]);
    });
  });
});
