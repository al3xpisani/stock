import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express';
import {
  getStockById,
  getStock,
  getStockStats
} from '../../controllers/stockController';
import { checkValidToken } from '../../middleware/check-token';
import httpStatus from 'http-status';
import { UserInfo } from 'types';

const stockDiagram = express.Router();
const midVerifyValidToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return checkValidToken(req, res, next);
};

stockDiagram.get(
  '/',
  midVerifyValidToken,
  async (req: Request, res: Response) => {
    try {
      const stockID = req.query.q as string;
      const userInfo: UserInfo = req.body;
      const allStock = await getStockById(stockID, userInfo);
      const hasData = allStock?.hasData;
      if (!hasData) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({
            error: 'Invalid or missing query parameter: q with stockId value'
          });
      }
      return res.status(httpStatus.OK).json({
        status: 'Stock - Listing by ID ok.',
        data: allStock
      });
    } catch (e) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ status: 'Error when listing Stock ' + e });
    }
  }
);

stockDiagram.get(
  '/history',
  midVerifyValidToken,
  async (req: Request, res: Response) => {
    try {
      const allStock = await getStock('creation');
      return res.status(httpStatus.OK).json({
        status: 'Stock - Listingok.',
        data: allStock
      });
    } catch (e) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ status: 'Error when listing all the Stock ' + e });
    }
  }
);
stockDiagram.get(
  '/stats',
  midVerifyValidToken,
  async (req: Request, res: Response) => {
    try {
      const userInfo: UserInfo = req.body || {};
      const allStock = await getStockStats('creation', userInfo);
      return res.status(httpStatus.OK).json({
        status: 'Stock - stats for super user.',
        data: allStock
      });
    } catch (e) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ status: 'Error when listing the stats for super user ' + e });
    }
  }
);

export default stockDiagram;
