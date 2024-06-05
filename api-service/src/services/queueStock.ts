import { RedisClientType } from 'redis';
import { addMapQueueData } from '../redis/redis';
import { TransformedData } from 'types';

export const sendTicketToQueue = async (
  redisClient: RedisClientType,
  ticketData: TransformedData
) => {
  await addMapQueueData(redisClient, ticketData);
};
