import { Request, Response, NextFunction } from 'express';
import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();
interface CustomResponse extends Response {
    success(message: string, data?: any, statusCode?: number): void;
}
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

    private async setCachedData(key: string, data: any, lang: string='en'): Promise<void> {
        try {
            
            await this.redisClient.set(key,  JSON.stringify(data), { EX: 3600 });
            
           
        } catch (error) {
            console.error("Redis SET Error:", error);
        }
    }

    public cache = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const cacheKey = `api_${req.originalUrl}`;
        const lang = req.query.lang as string || 'en';
        try {
            const cachedData = await this.redisClient.get(cacheKey);
            if (cachedData) {
              
                res.status(200).json({
                    message: 'Data retrieved from cache',
                    data: JSON.parse(cachedData)
                });
                return;
            }
    
         
            const originalJson = res.json;
            res.json = function(body: any) {
                CacheMiddleware.getInstance().setCachedData(cacheKey, body,lang);
                return originalJson.call(this, body);
            };
    
            next();
        } catch (error) {
            next();
        }
    };
}

export const cacheMiddleware = CacheMiddleware.getInstance().cache;