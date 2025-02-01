import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';
import { sanitizeOptions } from '../config/sanitize.config';

export const sanitizeContent = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.answer) {
            if (typeof req.body.answer === 'string') {
                console.log('Sanitizing single answer');
                req.body.answer = sanitizeHtml(req.body.answer, sanitizeOptions);
            } else if (typeof req.body.answer === 'object') {
                console.log('Sanitizing multilingual answers');
                Object.keys(req.body.answer).forEach(lang => {
                    if (typeof req.body.answer[lang] === 'string') {
                        req.body.answer[lang] = sanitizeHtml(req.body.answer[lang], sanitizeOptions);
                    }
                });
            }
        }

        if (req.body.question) {
            if (typeof req.body.question === 'string') {
                console.log('Sanitizing single question');
                req.body.question = sanitizeHtml(req.body.question, sanitizeOptions);
            } else if (typeof req.body.question === 'object') {
                console.log('Sanitizing multilingual questions');
                Object.keys(req.body.question).forEach(lang => {
                    if (typeof req.body.question[lang] === 'string') {
                        req.body.question[lang] = sanitizeHtml(req.body.question[lang], sanitizeOptions);
                    }
                });
            }
        }

        console.log('Content sanitization completed');
        next();
    } catch (error) {
        console.error('Sanitization middleware error:', error);
        res.status(400).json({
            status: 'error',
            message: 'Content sanitization failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};