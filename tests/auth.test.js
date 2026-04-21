process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecret';

const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

describe('Authentication Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should register a user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should log in a user and return a token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
  });
});
