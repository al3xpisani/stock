import request from 'supertest';
import app from '../app';

describe('API Service', () => {
  it('should return 200 on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe(
      'Check... README.md file to be aware of API Contract'
    );
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });
});
