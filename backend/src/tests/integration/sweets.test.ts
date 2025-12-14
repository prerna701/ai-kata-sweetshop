import request from 'supertest';
import app from '../../app';
import { Sweet } from '../../models/Sweet';

describe('Sweets API Integration Tests', () => {
  let adminToken: string;
  let customerToken: string;
  let sweetId: string;

  beforeAll(async () => {
    // Create admin user
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'admin@sweet.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      });
    adminToken = adminRes.body.data.token;

    // Create customer user
    const customerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'customer@sweet.com',
        password: 'customer123',
        name: 'Customer User'
      });
    customerToken = customerRes.body.data.token;
  });

  describe('POST /api/sweets (Admin only)', () => {
    it('should create a new sweet as admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Chocolate',
          category: 'Chocolate',
          price: 3.99,
          quantity: 50,
          description: 'Delicious test chocolate'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.sweet).toHaveProperty('_id');
      expect(response.body.data.sweet.name).toBe('Test Chocolate');
      
      sweetId = response.body.data.sweet._id;
    });

    it('should return 403 for customer trying to create sweet', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Customer Sweet',
          category: 'Candy',
          price: 1.99,
          quantity: 20
        });

      expect(response.status).toBe(403);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Unauthorized Sweet',
          category: 'Cake',
          price: 9.99,
          quantity: 10
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sweets', () => {
    beforeAll(async () => {
      // Create some test sweets
      await Sweet.create([
        {
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.99,
          quantity: 100
        },
        {
          name: 'Gummy Bears',
          category: 'Candy',
          price: 1.49,
          quantity: 200
        },
        {
          name: 'Butter Cookies',
          category: 'Biscuit',
          price: 4.99,
          quantity: 0
        }
      ]);
    });

    it('should get all sweets', async () => {
      const response = await request(app)
        .get('/api/sweets');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination.total).toBeGreaterThan(0);
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Chocolate');

      expect(response.status).toBe(200);
      expect(response.body.data.every((sweet: any) => 
        sweet.category === 'Chocolate'
      )).toBe(true);
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=1&maxPrice=3');

      expect(response.status).toBe(200);
      expect(response.body.data.every((sweet: any) => 
        sweet.price >= 1 && sweet.price <= 3
      )).toBe(true);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let purchaseSweetId: string;

    beforeAll(async () => {
      const sweet = await Sweet.create({
        name: 'Purchase Test Sweet',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10
      });
      purchaseSweetId = sweet._id.toString();
    });

    it('should purchase sweet successfully', async () => {
      const response = await request(app)
        .post(`/api/sweets/${purchaseSweetId}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ quantity: 3 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.sweet.quantity).toBe(7);
    });

    it('should return 400 for insufficient stock', async () => {
      const response = await request(app)
        .post(`/api/sweets/${purchaseSweetId}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ quantity: 10 });

      expect(response.status).toBe(400);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${purchaseSweetId}/purchase`)
        .send({ quantity: 1 });

      expect(response.status).toBe(401);
    });
  });
});