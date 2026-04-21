process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecret';

const request = require('supertest');
const app = require('../app');
const { sequelize, User, Task } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let userToken;
let adminToken;
let userId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({
    username: 'normaluser',
    email: 'user@example.com',
    password: await bcrypt.hash('password123', 10),
    role: 'user'
  });

  const admin = await User.create({
    username: 'adminuser',
    email: 'admin@example.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin'
  });

  userId = user.id;
  userToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET);
  adminToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await sequelize.close();
});

describe('Task Routes', () => {
  it('should block access without a token', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(401);
  });

  it('should create a task for authenticated user', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Finish project', description: 'Complete backend final project' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Finish project');
  });

  it('should return only user tasks for normal user', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  it('admin should be able to view all users', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('normal user should not be able to view all users', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});
