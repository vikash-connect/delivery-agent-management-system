import redis from '../config/redis';
import crypto from 'crypto';

const DEFAULT_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '60', 10);
const LIST_KEYS_SET = 'agents:list_keys';

export class CacheService {
  /**
   * Generates a unique, deterministic cache key for query list parameters
   */
  generateListCacheKey(query: Record<string, any>): string {
    const sortedQueryKeys = Object.keys(query)
      .sort()
      .reduce((acc, key) => {
        if (query[key] !== undefined && query[key] !== null) {
          acc[key] = query[key];
        }
        return acc;
      }, {} as Record<string, any>);

    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(sortedQueryKeys))
      .digest('hex');

    return `agents:list:${hash}`;
  }

  /**
   * Generates key for single agent
   */
  generateAgentCacheKey(id: string): string {
    return `agents:id:${id}`;
  }

  /**
   * Safe getter: returns cached data or null if MISS / Redis error
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await redis.get(key);
      if (!cachedData) return null;
      return JSON.parse(cachedData) as T;
    } catch (err: any) {
      console.warn(`[Cache Warning] Failed to GET key "${key}":`, err.message);
      return null;
    }
  }

  /**
   * Safe setter: caches item with TTL & tracks list keys in set
   */
  async set(key: string, data: any, ttlInSeconds = DEFAULT_TTL): Promise<void> {
    try {
      const payload = JSON.stringify(data);
      if (key.startsWith('agents:list:')) {
        const pipeline = redis.pipeline();
        pipeline.setex(key, ttlInSeconds, payload);
        pipeline.sadd(LIST_KEYS_SET, key);
        await pipeline.exec();
      } else {
        await redis.setex(key, ttlInSeconds, payload);
      }
    } catch (err: any) {
      console.warn(`[Cache Warning] Failed to SET key "${key}":`, err.message);
    }
  }

  /**
   * Invalidate agent caches safely on mutation (POST/PUT/DELETE)
   */
  async invalidateAgentCache(agentId?: string): Promise<void> {
    try {
      const pipeline = redis.pipeline();

      // Invalidate single agent cache if ID provided
      if (agentId) {
        pipeline.del(`agents:id:${agentId}`);
      }

      // Retrieve all active list query keys
      const listKeys = await redis.smembers(LIST_KEYS_SET);
      if (listKeys.length > 0) {
        pipeline.del(...listKeys);
        pipeline.del(LIST_KEYS_SET);
      }

      await pipeline.exec();
    } catch (err: any) {
      console.warn('[Cache Warning] Failed to invalidate cache:', err.message);
    }
  }
}

export const cacheService = new CacheService();
