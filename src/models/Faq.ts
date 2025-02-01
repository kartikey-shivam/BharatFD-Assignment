  import mongoose, { Schema, Document } from "mongoose";
  import { IFAQ } from "../interfaces/faq";
  import TranslationService from "../services/translationService";
  export interface FAQDocument extends IFAQ, Document {
    getTranslatedContent(field: string, lang: string): Promise<string>;
}
  const FAQSchema = new Schema(
      {
          question: {
              type: Map,
              of: String,
              required: true,
              default: { en: '' }
          },
          answer: {
              type: Map,
              of: String,
              required: true,
              default: { en: '' }
          },
          isActive: {
              type: Boolean,
              default: true
          }
      },
      {
          timestamps: true
      }
  );
  FAQSchema.methods.getTranslatedContent = async function (field: string, lang: string): Promise<string> {
    const translationService = TranslationService.getInstance();
    const translatedField = `${field}_${lang}`;
    

    const originalContent = this.get(field);
    if (!originalContent) {
        return "";
    }

    try {
   
        const translatedContent = await translationService.translate(originalContent, lang);

      
        this.set(translatedField, translatedContent);
        await this.save();

        return translatedContent;
    } catch (error) {
        return originalContent; 
    }
};

export default mongoose.model<FAQDocument>("FAQ", FAQSchema);

