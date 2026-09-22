const request = require('supertest');
const app = require('../server/app');
require('./setup');

describe('Adaptive API Endpoints', () => {
  describe('GET /api/adaptive/policy', () => {
    it('should return active policy configuration', async () => {
      const res = await request(app).get('/api/adaptive/policy');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('enabled', true);
      expect(res.body.data).toHaveProperty('policies');
      expect(Array.isArray(res.body.data.policies)).toBe(true);
    });
  });

  describe('POST /api/adaptive/evaluate', () => {
    it('should evaluate POOR network profile (2g connection)', async () => {
      const payload = {
        sessionId: 'sess-poor-001',
        network: {
          effectiveType: '2g',
          downlink: 0.5,
          latency: 450
        },
        device: {
          type: 'mobile'
        }
      };

      const res = await request(app)
        .post('/api/adaptive/evaluate')
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.evaluatedProfile).toBe('poor');
      expect(res.body.data.decision).toEqual({
        contentQuality: 'low',
        optimization: 'aggressive',
        prefetchEnabled: false,
        maxImageResolution: '480p',
        compressionLevel: 'high',
        resourceStrategy: 'minimal'
      });
    });

    it('should evaluate MODERATE network profile (3g connection)', async () => {
      const payload = {
        sessionId: 'sess-mod-002',
        network: {
          effectiveType: '3g',
          downlink: 2.5,
          latency: 180
        }
      };

      const res = await request(app)
        .post('/api/adaptive/evaluate')
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.evaluatedProfile).toBe('moderate');
      expect(res.body.data.decision).toEqual({
        contentQuality: 'medium',
        optimization: 'standard',
        prefetchEnabled: false,
        maxImageResolution: '720p',
        compressionLevel: 'standard',
        resourceStrategy: 'balanced'
      });
    });

    it('should evaluate GOOD network profile (4g fast connection)', async () => {
      const payload = {
        sessionId: 'sess-good-003',
        network: {
          effectiveType: '4g',
          downlink: 15.0,
          latency: 35
        },
        device: {
          type: 'desktop'
        }
      };

      const res = await request(app)
        .post('/api/adaptive/evaluate')
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.evaluatedProfile).toBe('good');
      expect(res.body.data.decision).toEqual({
        contentQuality: 'high',
        optimization: 'minimal',
        prefetchEnabled: true,
        maxImageResolution: '1080p',
        compressionLevel: 'none',
        resourceStrategy: 'full'
      });
    });

    it('should reject invalid network.effectiveType enum', async () => {
      const payload = {
        network: {
          effectiveType: 'invalid-type'
        }
      };

      const res = await request(app)
        .post('/api/adaptive/evaluate')
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('network.effectiveType');
    });

    it('should reject negative latency value', async () => {
      const payload = {
        network: {
          latency: -50
        }
      };

      const res = await request(app)
        .post('/api/adaptive/evaluate')
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
