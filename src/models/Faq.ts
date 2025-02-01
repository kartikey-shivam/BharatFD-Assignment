  import mongoose, { Schema, Document } from "mongoose";
  import { IFAQ } from "../interfaces/faq";
  import TranslationService from "../services/translationService";
  import sanitizeHtml from 'sanitize-html';
import { sanitizeOptions } from '../config/sanitize.config';
  export interface FAQDocument extends IFAQ, Document {
    getTranslatedContent(field: string, lang: string): Promise<string>;
}
  const FAQSchema = new Schema(
      {
          question: {
              type: String,
              required: true,
              default: { en: '' }
          },
          answer: {
              type: String,
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
  FAQSchema.pre('save', function(next) {
      try {
          if (this.isModified('answer')) {
              const answer = this.get('answer');
              if (typeof answer === 'string') {
                  this.set('answer', sanitizeHtml(answer, sanitizeOptions));
              }
          }

          if (this.isModified('question')) {
              const question = this.get('question');
              if (typeof question === 'string') {
                  this.set('question', sanitizeHtml(question, sanitizeOptions));
              }
          }

          console.log('Content sanitized successfully');
          next();
      } catch (error) {
          console.error('Error in sanitization middleware:', error);
          next(error instanceof Error ? error : new Error('Unknown error occurred'));
      }
  });  
  
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

        return translatedContent;
    } catch (error) {
        return originalContent; 
    }
};

export default mongoose.model<FAQDocument>("FAQ", FAQSchema);

