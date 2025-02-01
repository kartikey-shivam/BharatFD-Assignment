
import mongoose, { Schema, Document } from "mongoose";
import { IFAQ } from "../interfaces/faq";

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

FAQSchema.methods.getTranslation = function(field: 'question' | 'answer', lang: string): string {
    const content = this[field];
    return content.get(lang) || content.get('en') || '';
};

export default mongoose.model<IFAQ>("FAQ", FAQSchema);
