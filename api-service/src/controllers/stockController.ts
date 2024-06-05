import { UserInfo } from 'types';
import {
  getStockByIdService,
  getStockService,
  getStockServiceStats
} from '../services/stockServices';
import { RedisClientType } from 'redis';

export const getStockById = async (
  fieldValue: string,
  userInfo: UserInfo,
  redisClient: RedisClientType
) => {
  try {
    return await getStockByIdService(fieldValue, userInfo, redisClient);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error listing stocks: ' + error.message);
    }
  }
};

export const getStock = async (orderByField: string) => {
  try {
    return await getStockService(orderByField);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error listing all stocks: ' + error.message);
    }
  }
};

export const getStockStats = async (
  orderByField: string,
  userInfo: UserInfo
) => {
  try {
    return await getStockServiceStats(orderByField, userInfo);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error listing stocks stats: ' + error.message);
    }
  }
};
