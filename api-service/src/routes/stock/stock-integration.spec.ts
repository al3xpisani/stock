import request from 'supertest';
import { getStockById } from '../../controllers/stockController';
import express, { Express, NextFunction } from 'express';
import setRoutePaths from '../../routes';
import { setRedisClient } from '../../redis/setRedisClient';

jest.mock('../../../src/controllers/stockController', () => ({
  getStockById: jest.fn(),
  getStock: jest.fn(),
  getStockStats: jest.fn()
}));

interface AuthResponse {
  accessToken: string;
}

jest.mock('../../../src/middleware/check-token', () => ({
  checkValidToken: jest.fn((req, res, next) => next())
}));

jest.mock('../../redis/setRedisClient', () => {
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
describe('Stock Route', () => {
  let app: Express;
  beforeEach(() => {
    jest.clearAllMocks();
    app = createTestApp();
  });
  it('should return stock data for valid request', async () => {
    const mockData = {
      hasData: true,
      status: {
        name: 'Test Stock',
        symbol: 'TST',
        open: 100,
        high: 110,
        low: 90,
        close: 105,
        stockDate: '2023-01-01'
      }
    };
    (getStockById as jest.Mock).mockResolvedValue(mockData);

    const responseToken = await request(app)
      .get('/register')
      .set('email', `alexandre.pisani.ant@gmail.com`)
      .set('pwd', `_test123`);
    const { accessToken } = responseToken.body as AuthResponse;
    const response = await request(app)
      .get('/stock')
      .query({ q: 'aapl.us' })
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'abg@consoto.com',
        role: 'user'
      });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'Stock - Listing by ID ok.',
      data: {
        hasData: true,
        status: {
          name: 'Test Stock',
          symbol: 'TST',
          open: 100,
          high: 110,
          low: 90,
          close: 105,
          stockDate: '2023-01-01'
        }
      }
    });
  });

  it('should return 400 for missing query parameter', async () => {
    const mockData = {
      error: 'Invalid or missing query parameter: q with stockId value'
    };
    (getStockById as jest.Mock).mockResolvedValue(mockData);

    const responseToken = await request(app)
      .get('/register')
      .set('email', `alexandre.pisani.ant@gmail.com`)
      .set('pwd', `_test123`);
    const { accessToken } = responseToken.body as AuthResponse;
    const response = await request(app)
      .get('/stock/')
      // .query({ q: 'aapl.us' })
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'abg@consoto.com',
        role: 'user'
      });

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      error: 'Invalid or missing query parameter: q with stockId value'
    });
  });
});
