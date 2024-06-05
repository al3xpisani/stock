import request from 'supertest';
import express, { Express, NextFunction } from 'express';
import setRoutePaths from '../routes';
import { setRedisClient } from '../redis/setRedisClient';

jest.mock('../redis/setRedisClient', () => {
  return {
    setRedisClient: (app: Express) => {
      return (req: Request, res: Response, next: NextFunction): void => {
        (req as any).redisClient = {};
        next();
      };
    }
  };
});

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(setRedisClient(app));
  setRoutePaths(app);
  return app;
};

describe('API Service', () => {
  let app: Express;
  beforeEach(() => {
    jest.clearAllMocks();
    app = createTestApp();
  });

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
