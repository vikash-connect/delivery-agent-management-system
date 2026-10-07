import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 1,
  lazyConnect: false,
  retryStrategy(times) {
    // Exponential backoff capped at 2 seconds
    return Math.min(times * 200, 2000);
  },
});

redis.on('connect', () => {
  console.log('[Redis] Connected successfully to Redis server');
});

redis.on('error', (err) => {
  console.warn('[Redis Warning] Connection issue:', err.message);
});

export default redis;
