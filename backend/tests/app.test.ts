import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/db';
import redis from '../src/config/redis';

describe('App Smoke Test', () => {
  afterAll(async () => {
    await prisma.$disconnect();
    redis.disconnect(); // or quit()
  });

  it('GET /health should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('message', 'Delivery Agent Management System API is healthy');
  });
});
