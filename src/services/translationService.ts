  import { Translate } from "@google-cloud/translate/build/src/v2";
  import { createClient, RedisClientType } from "redis";
  import path from "path";
  import dotenv from "dotenv";

  dotenv.config();

  class TranslationService {
      private static instance: TranslationService;
      private translator: Translate;
      private redisClient: RedisClientType;

      private constructor() {
          process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, "../config/translate-key.json");

          this.translator = new Translate();

          this.redisClient = createClient({ url: process.env.REDIS_URL });

          this.redisClient.connect().catch((error) => {
              console.error("Redis Connection Error:", error);
          });

          this.redisClient.on("error", (err) => {
              console.error("Redis Client Error:", err);
          });
      }

      public static getInstance(): TranslationService {
          if (!TranslationService.instance) {
              TranslationService.instance = new TranslationService();
          }
          return TranslationService.instance;
      }

      private async getCachedTranslation(key: string): Promise<string | null> {
          try {
              return await this.redisClient.get(key);
          } catch (error) {
              return null;
          }
      }

      private async setCachedTranslation(key: string, value: string): Promise<void> {
          try {
              await this.redisClient.set(key, value, { EX: 3600 });
          } catch (error) {
              console.error("Redis SET Error:", error);
          }
      }

      public async translate(text: string, targetLang: string): Promise<string> {
          if (!text || !targetLang) {
              return text;
          }

          const cacheKey = `trans_${text}_${targetLang}`;

          try {
              const cachedTranslation = await this.getCachedTranslation(cacheKey);
              if (cachedTranslation) {
                  return cachedTranslation;
              }
              console.log(`Cached Translation Found: ${cachedTranslation}`);

              const [translation] = await this.translator.translate(text, targetLang);

              console.log(`Translation Successful: ${translation}`);

              await this.setCachedTranslation(cacheKey, translation);

              return translation;
          } catch (error) {
              console.error("Google Translate API Error:", error);
              return text;
          }
      }
  }

  export default TranslationService;
