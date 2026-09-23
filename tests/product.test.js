const request = require('supertest');
const app = require('../server/app');
const { seedProducts } = require('../server/seed/seedProducts');
require('./setup');

describe('Product API & Optimization Endpoints', () => {
  let seededProducts = [];

  beforeEach(async () => {
    // Seed 30 products before test runs
    seededProducts = await seedProducts();
  });

  describe('GET /api/products', () => {
    it('should return paginated product list with default page 1 and pageSize 10', async () => {
      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(res.headers['cache-control']).toBe('public, max-age=300');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('products');
      expect(res.body.data.products.length).toBe(10);
      expect(res.body.data.pagination).toEqual({
        totalItems: 30,
        totalPages: 3,
        currentPage: 1,
        pageSize: 10
      });

      // Verify minimal payload structure & asset variant contract
      const firstProduct = res.body.data.products[0];
      expect(firstProduct).toHaveProperty('_id');
      expect(firstProduct).toHaveProperty('name');
      expect(firstProduct).toHaveProperty('price');
      expect(firstProduct).toHaveProperty('category');
      expect(firstProduct).toHaveProperty('thumbnail');
      expect(firstProduct).toHaveProperty('image');
      expect(firstProduct.image).toHaveProperty('small');
      expect(firstProduct.image).toHaveProperty('medium');
      expect(firstProduct.image).toHaveProperty('large');
    });

    it('should support custom pagination parameters (?page=2&pageSize=5)', async () => {
      const res = await request(app).get('/api/products?page=2&pageSize=5');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.products.length).toBe(5);
      expect(res.body.data.pagination).toEqual({
        totalItems: 30,
        totalPages: 6,
        currentPage: 2,
        pageSize: 5
      });
    });

    it('should support category filtering (?category=Audio)', async () => {
      const res = await request(app).get('/api/products?category=Audio');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.products.length).toBeGreaterThan(0);
      res.body.data.products.forEach(p => {
        expect(p.category).toBe('Audio');
      });
    });

    it('should reject invalid page parameter (e.g. page=-1)', async () => {
      const res = await request(app).get('/api/products?page=-1');

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('positive integer');
    });

    it('should reject invalid pageSize parameter (e.g. pageSize=100)', async () => {
      const res = await request(app).get('/api/products?pageSize=100');

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('between 1 and 50');
    });

    it('should handle page parameter beyond total available records (e.g. page=999)', async () => {
      const res = await request(app).get('/api/products?page=999&pageSize=10');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.products).toEqual([]);
      expect(res.body.data.pagination).toEqual({
        totalItems: 30,
        totalPages: 3,
        currentPage: 999,
        pageSize: 10
      });
    });

    it('should support pagination boundary limits (pageSize=1 and pageSize=50)', async () => {
      const resMin = await request(app).get('/api/products?page=1&pageSize=1');
      expect(resMin.statusCode).toBe(200);
      expect(resMin.body.data.products.length).toBe(1);

      const resMax = await request(app).get('/api/products?page=1&pageSize=50');
      expect(resMax.statusCode).toBe(200);
      expect(resMax.body.data.products.length).toBe(30);
    });

    it('should reject non-numeric and zero pagination parameters', async () => {
      const resNonNumeric = await request(app).get('/api/products?page=abc');
      expect(resNonNumeric.statusCode).toBe(400);
      expect(resNonNumeric.body.error.code).toBe('VALIDATION_ERROR');

      const resZeroPage = await request(app).get('/api/products?page=0');
      expect(resZeroPage.statusCode).toBe(400);
      expect(resZeroPage.body.error.code).toBe('VALIDATION_ERROR');

      const resZeroSize = await request(app).get('/api/products?pageSize=0');
      expect(resZeroSize.statusCode).toBe(400);
      expect(resZeroSize.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return totalPages 0 for empty collection / non-matching filter', async () => {
      const res = await request(app).get('/api/products?category=NonExistentCategory');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.products).toEqual([]);
      expect(res.body.data.pagination).toEqual({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10
      });
    });

    it('should compressed response payload with gzip when Accept-Encoding gzip header is sent', async () => {
      const res = await request(app)
        .get('/api/products')
        .set('Accept-Encoding', 'gzip');

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-encoding']).toBe('gzip');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return full product details for valid existing ID', async () => {
      const targetId = seededProducts[0]._id.toString();
      const res = await request(app).get(`/api/products/${targetId}`);

      expect(res.statusCode).toBe(200);
      expect(res.headers['cache-control']).toBe('public, max-age=300');
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(targetId);
      expect(res.body.data.name).toBe(seededProducts[0].name);
      expect(res.body.data).toHaveProperty('description');
      expect(res.body.data.image).toHaveProperty('small');
      expect(res.body.data.image).toHaveProperty('medium');
      expect(res.body.data.image).toHaveProperty('large');
    });

    it('should return 404 for valid ObjectId that does not exist in DB', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/products/${nonExistentId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('should return 400 for malformed product ID string', async () => {
      const res = await request(app).get('/api/products/invalid-id-format');

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('24-character hexadecimal');
    });
  });

  describe('GET /api/categories', () => {
    it('should return distinct list of product categories', async () => {
      const res = await request(app).get('/api/categories');

      expect(res.statusCode).toBe(200);
      expect(res.headers['cache-control']).toBe('public, max-age=300');
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toContain('Electronics');
      expect(res.body.data).toContain('Audio');
      expect(res.body.data).toContain('Wearables');
      expect(res.body.data).toContain('Home & Smart Living');
      expect(res.body.data).toContain('Accessories');
    });
  });
});
