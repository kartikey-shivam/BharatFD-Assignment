import { Request, Response, NextFunction } from 'express';
import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

class CacheMiddleware {
    private static instance: CacheMiddleware;
    private redisClient: RedisClientType;
    private isConnecting: boolean = false;

    private constructor() {
        this.redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
        
        this.redisClient.on('error', (err) => {
            console.error(' Redis Client Error:', err);
        });
    }

    private async ensureConnection() {
        try {
            if (!this.redisClient.isOpen && !this.isConnecting) {
                this.isConnecting = true;
                await this.redisClient.connect();
                this.isConnecting = false;
            }
        } catch (error) {
            this.isConnecting = false;
            console.error(" Redis Connection Error:", error);
            throw error;
        }
    }

    public static getInstance(): CacheMiddleware {
        if (!CacheMiddleware.instance) {
            CacheMiddleware.instance = new CacheMiddleware();
            CacheMiddleware.instance.ensureConnection();
        }
        return CacheMiddleware.instance;
    }

    private async setCachedData(key: string, data: any, lang: string='en'): Promise<void> {
        try {
            await this.ensureConnection();
            await this.redisClient.set(key, JSON.stringify(data), { EX: 3600 });
        } catch (error) {
            console.error(` Redis SET Error for key ${key}:`, error);
        }
    }
    private generateCacheKey(req: Request): string {
        const lang = req.query.lang as string || 'en';
        const id = req.params.id;
        
        if (id) {
            return `faq_${id}_${lang}`;
        }
        return `api_${req.originalUrl}`;
    }
    public cache = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const cacheKey = this.generateCacheKey(req);
        const lang = req.query.lang as string || 'en';

        try {
            await this.ensureConnection();
            const cachedData = await this.redisClient.get(cacheKey);
            
            if (cachedData) {
                res.status(200).json({
                    message: 'Data retrieved from cache',
                    data: JSON.parse(cachedData)
                });
                return;
            }

            console.log(` Cache MISS for key: ${cacheKey}`);
            const originalJson = res.json;
            res.json = function(body: any) {
                console.log(` Caching response for key: ${cacheKey}`);
                // CacheMiddleware.getInstance().setCachedData(cacheKey, body, lang);
                return originalJson.call(this, body);
            };

            next();
        } catch (error) {
            next();
        }
    };
    private async clearSpecificCache(id: string): Promise<void> {
        try {
            await this.ensureConnection();
            const pattern = `faq_${id}_*`;
            const keys = await this.redisClient.keys(pattern);
            
            const listPattern = 'api_/faqs*';
            const listKeys = await this.redisClient.keys(listPattern);
            
            const allKeys = [...keys, ...listKeys];
            
            if (allKeys.length) {
                await this.redisClient.del(allKeys);
            }
        } catch (error) {
            console.error(`Redis DELETE Error for ID ${id}:`, error);
        }
    }

    public clearCache = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = req.params.id;
        
        try {
            await this.ensureConnection();
            if (id) {
                await this.clearSpecificCache(id);
            }
            next();
        } catch (error) {
            next();
        }
    };
}

export const cacheMiddleware = CacheMiddleware.getInstance().cache;
export const clearCache = CacheMiddleware.getInstance().clearCache;