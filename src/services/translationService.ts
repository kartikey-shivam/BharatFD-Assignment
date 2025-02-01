  import { Translate } from "@google-cloud/translate/build/src/v2";
  import path from "path";
  import dotenv from "dotenv";

  dotenv.config();

  class TranslationService {
      private static instance: TranslationService;
      private translator: Translate;

      private constructor() {
          process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, "../config/translate-key.json");
            
          this.translator = new Translate();
      }

      public static getInstance(): TranslationService {
          if (!TranslationService.instance) {
              TranslationService.instance = new TranslationService();
          }
          return TranslationService.instance;
      }

      public async translate(text: string, targetLang: string): Promise<string> {
          if (!text || !targetLang) {
              return text;
          }

          try {
              const [translation] = await this.translator.translate(text, targetLang);
              return translation;
          } catch (error) {
              console.error("Google Translate API Error:", error);
              return text;
          }
      }
  }

  export default TranslationService;