import { RedisClientType } from 'redis';
import 'dotenv/config';
import { RedisQueueSchema, TransformedData } from '../types';

export const addRawQueueData = async (
  redisClient: RedisClientType,
  key: string,
  value: string
) => {
  const client: RedisClientType = redisClient;
  const response = await client.set(key, value);
  return response;
};
export const addMapQueueData = async (
  redisClient: RedisClientType,
  ticketData: TransformedData
) => {
  const client: RedisClientType = redisClient;
  const mapQueue = new Map<string, RedisQueueSchema>();
  mapQueue.set('redis-tickets', {
    id: ticketData.id,
    ticketName: ticketData.symbol,
    timestampIssue: new Date().toISOString()
  });
  const serializedValue = JSON.stringify(Array.from(mapQueue));
  const response = await client.rPush(ticketData.symbol, serializedValue);
  return response;
};
export const readMapQueueData = async (
  redisClient: RedisClientType,
  mapKey: string
) => {
  const client: RedisClientType = redisClient;
  const response = await client.hGetAll(mapKey);
  return response;
};
export const syncQueue = async (
  redisClient: RedisClientType,
  queueRedisName: string
) => {
  const client: RedisClientType = redisClient;
  const elementNotFoundStatus = { status: 'element not found', id: -1 };

  const olderElementIndex: string[] = await client.lRange(queueRedisName, 0, 0);
  if (olderElementIndex.length === 0) return elementNotFoundStatus;

  await removeQueueItem(redisClient, queueRedisName, olderElementIndex[0]);

  const [
    [queueName, { id, ticketName, serviceTypeArea, issue, timestampIssue }]
  ] = JSON.parse(olderElementIndex[0]);
  return { id, ticketName, serviceTypeArea, issue, timestampIssue, queueName };
};

export const removeQueueItem = async (
  redisClient: RedisClientType,
  mapKey: string,
  value: string
) => {
  const client: RedisClientType = redisClient;
  const response = await client.lRem(mapKey, 1, value);
  return response;
};

export const readRawQueueData = async (
  redisClient: RedisClientType,
  key: string
) => {
  const client: RedisClientType = redisClient;
  const response = await client.get(key);
  return response;
};
