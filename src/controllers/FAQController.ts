import { Request, Response } from 'express';
import FAQ from '../models/Faq';

class FAQController {
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const faq = new FAQ(req.body);
            await faq.save();
            res.status(201).json(faq);
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const lang = req.query.lang as string || 'en';
            const faqs = await FAQ.find();
            
            if (lang === 'en') {
                res.json(faqs);
                return;
            }

            const translatedFaqs = await Promise.all(faqs.map(async (faq) => ({
                ...faq.toObject(),
                // question: await faq.getTranslatedContent('question', lang),
                // answer: await faq.getTranslatedContent('answer', lang)
            })));
            res.json(translatedFaqs);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        try {
            const faq = await FAQ.findById(req.params.id);
            if (!faq) {
                res.status(404).json({ message: 'FAQ not found' });
                return;
            }
            res.json(faq);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!faq) {
                res.status(404).json({ message: 'FAQ not found' });
                return;
            }
            res.json(faq);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const faq = await FAQ.findByIdAndDelete(req.params.id);
            if (!faq) {
                res.status(404).json({ message: 'FAQ not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }
}

export default new FAQController();
