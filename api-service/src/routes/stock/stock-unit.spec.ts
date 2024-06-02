import stockDiagram from './stock';
import { Request, Response, NextFunction } from 'express';
import { checkValidToken } from '../../middleware/check-token';
import { getStockByIdService } from '../../services/stockServices';

jest.mock('../../../src/services/stockServices', () => ({
  getStockByIdService: jest.fn()
}));

jest.mock('../../../src/middleware/check-token', () => ({
  checkValidToken: jest.fn()
}));

describe('Stock Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return 200 if query parameter is added', async () => {
    (checkValidToken as jest.Mock).mockImplementation((req, res, next) =>
      next()
    );
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
    (getStockByIdService as jest.Mock).mockResolvedValue(mockData);

    const req = {
      query: { q: 'aapl.us' },
      body: { email: 'abg@contoso.com', role: 'user' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response;

    const next = jest.fn() as unknown as NextFunction;

    const routeLayer = stockDiagram.stack.find(
      (layer: any) => layer.route?.path === '/' && layer.route?.methods?.get
    );

    if (!routeLayer) {
      throw new Error('Route handler not found');
    }

    const middleware = routeLayer.route.stack[0].handle;
    const routeHandler = routeLayer.route.stack[1].handle;

    await middleware(req, res, next);
    await routeHandler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        hasData: true,
        status: {
          close: 105,
          high: 110,
          low: 90,
          name: 'Test Stock',
          open: 100,
          stockDate: '2023-01-01',
          symbol: 'TST'
        }
      },
      status: 'Stock - Listing by ID ok.'
    });
  });

  it('should return 400 if query parameter is missing', async () => {
    (checkValidToken as jest.Mock).mockImplementation((req, res, next) =>
      next()
    );

    const req = {
      body: {}
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    const routeLayer = stockDiagram.stack.find(
      (layer: any) => layer.route?.path === '/' && layer.route?.methods?.get
    );

    if (!routeLayer) {
      throw new Error('Route handler not found');
    }

    const middleware = routeLayer.route.stack[0].handle;
    const routeHandler = routeLayer.route.stack[1].handle;

    await middleware(req, res, next);
    await routeHandler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status:
        "Error when listing Stock TypeError: Cannot read properties of undefined (reading 'q')"
    });
  });
});
