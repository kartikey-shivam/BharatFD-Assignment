import { Request, Response, NextFunction } from 'express';
import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

class CacheMiddleware {
    private static instance: CacheMiddleware;
    private redisClient: RedisClientType;

    private constructor() {
        this.redisClient = createClient({ url: process.env.REDIS_URL });

        this.redisClient.connect().catch((error) => {
            console.error("Redis Connection Error:", error);
        });

        this.redisClient.on("error", (err) => {
            console.error("Redis Client Error:", err);
        });
    }

    public static getInstance(): CacheMiddleware {
        if (!CacheMiddleware.instance) {
            CacheMiddleware.instance = new CacheMiddleware();
        }
        return CacheMiddleware.instance;
    }

    private async getCachedData(key: string): Promise<string | null> {
        try {
            return await this.redisClient.get(key);
        } catch (error) {
            console.error("Redis GET Error:", error);
            return null;
        }
    }

    private async setCachedData(key: string, value: string): Promise<void> {
        try {
            await this.redisClient.set(key, value, { EX: 3600 });
            console.log(`Cache SET Successful for key: ${key}`);
        } catch (error) {
            console.error("Redis SET Error:", error);
        }
    }

    public cache = async (req: Request, res: Response, next: NextFunction) => {
        const cacheKey = `api_${req.originalUrl}`;

        try {
            const cachedData = await this.getCachedData(cacheKey);
            if (cachedData) {
                console.log(`Cache HIT for key: ${cacheKey}`);
                return res.success('data.fetched', JSON.parse(cachedData));
            }

            console.log(`Cache MISS for key: ${cacheKey}`);
            const originalSuccess = res.success;
            res.success = function(message: string, data?: any, statusCode?: number) {
                CacheMiddleware.getInstance().setCachedData(cacheKey, JSON.stringify(data));
                originalSuccess.call(this, message, data, statusCode);
            };

            next();
        } catch (error) {
            next();
        }
    };
}

export const cacheMiddleware = CacheMiddleware.getInstance().cache;