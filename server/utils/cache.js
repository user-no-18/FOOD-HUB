import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
};

export const setCache = async (key, data, ttlSeconds = 300) => {
  try {
    await redis.set(key, data, { ex: ttlSeconds });
  } catch (error) {
    console.error("Redis set error:", error);
  }
};

export const delCache = async (key) => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error("Redis del error:", error);
  }
};

// Also export raw instance in case we need generic methods
export default redis;
