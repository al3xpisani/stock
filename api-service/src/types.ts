import { RedisClientType } from 'redis';
import { Request } from 'express';

export type AuthResponse = {
  isAuthenticated: boolean;
  accessToken: string | null;
};

export type FirebaseOptions = {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  measurementId: string | undefined;
};

export type DiagramSchema = {
  id?: string;
  name?: string;
  creation?: string;
  data?: object;
  userInfo?: object;
};

export type UserInfo = {
  email: string;
  role: string;
};

export interface StockData {
  Name: string;
  Symbol: string;
  Open: string;
  High: string;
  Low: string;
  Close: string;
  Date: string;
}
export interface TransformedData {
  id?: string;
  name: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  stockDate: string;
  error?: string;
  hasData?: boolean;
}

export type StockDataResponse = {
  data: StockData;
};

export type GroupedStock = {
  stock: string;
  times_requested: number;
};

export type RedisResponse = {
  redisClientError: boolean;
};

export type RedisQueueSchema = {
  id: string | undefined;
  ticketName: string;
  timestampIssue: string;
};

export interface CustomRequest extends Request {
  redisClient?: RedisClientType;
}
