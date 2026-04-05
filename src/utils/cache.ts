import { getRedisClient } from "../config/redis";

const DEFAULT_TTL = 3600; // 1 hour in seconds

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    const redis = getRedisClient();
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  static async set(key: string, value: any, ttlSeconds: number = DEFAULT_TTL): Promise<void> {
    const redis = getRedisClient();
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  }

  static async del(key: string): Promise<void> {
    const redis = getRedisClient();
    await redis.del(key);
  }

  static async delPattern(pattern: string): Promise<void> {
    const redis = getRedisClient();
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
  }

  // Generate cache key for room availability (used in booking service)
  static getRoomAvailabilityKey(hotelId: string, roomId: string, checkIn: string, checkOut: string): string {
    return `availability:${hotelId}:${roomId}:${checkIn}:${checkOut}`;
  }
}