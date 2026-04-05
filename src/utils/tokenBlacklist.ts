import { getRedisClient } from "../config/redis";

export class TokenBlacklist {
  static async add(token: string, expirySeconds: number): Promise<void> {
    const redis = getRedisClient();
    await redis.setex(`blacklist:${token}`, expirySeconds, "1");
  }

  static async isBlacklisted(token: string): Promise<boolean> {
    const redis = getRedisClient();
    const result = await redis.get(`blacklist:${token}`);
    return result !== null;
  }
}