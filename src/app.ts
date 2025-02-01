
import express from 'express';
import cors from 'cors';
import Database from './config/database';
import faqRoutes from './routes/faqRoutes';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        Database.getInstance();
    }

    private config(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes(): void {
        this.app.use('/api/faqs', faqRoutes);
    }
}

export default new App().app;
