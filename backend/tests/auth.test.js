const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Sakshi',
        email: 'sakshi@test.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(201);
  });
});
