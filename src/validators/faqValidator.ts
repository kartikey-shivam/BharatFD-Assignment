import { z } from 'zod';

export const FAQValidators = {
    create: z.object({
        body: z.object({
            question: z.string()
                .min(10, 'Question must be at least 10 characters')
                .max(500, 'Question cannot exceed 500 characters'),
            answer: z.string()
                .min(20, 'Answer must be at least 20 characters')
                .max(1000, 'Answer cannot exceed 1000 characters'),
            isActive: z.boolean().default(true)
        })
    }),

    update: z.object({
        params: z.object({
            id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid FAQ ID format')
        }),
        body: z.object({
            question: z.string()
                .min(10, 'Question must be at least 10 characters')
                .max(500, 'Question cannot exceed 500 characters')
                .optional(),
            answer: z.string()
                .min(20, 'Answer must be at least 20 characters')
                .max(1000, 'Answer cannot exceed 1000 characters')
                .optional(),
            isActive: z.boolean().optional()
        })
    }),

    getOne: z.object({
        params: z.object({
            id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid FAQ ID format')
        }),
        query: z.object({
            lang: z.string().length(2).default('en')
        })
    })
};