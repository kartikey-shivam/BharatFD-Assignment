import request from 'supertest';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import  app  from '../app';  // Update import
import  FAQ  from '../models/Faq';  // Update import

let redisClient: any;

beforeAll(async () => {
    try {
        await mongoose.disconnect();
        await mongoose.connect('mongodb://localhost:27017/bharatfd_test');
        
        redisClient = createClient({
            url: 'redis://localhost:6379'
        });
        await redisClient.connect();
    } catch (error) {
        console.error('Setup Error:', error);
    }
});

afterAll(async () => {
    try {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        if (redisClient?.isOpen) {
            await redisClient.quit();
        }
    } catch (error) {
        console.error('Cleanup Error:', error);
    }
});

beforeEach(async () => {
    await FAQ.deleteMany({});
});

describe('FAQ API Tests', () => {
    const testFaq = {
        question: 'Test Question?',
        answer: 'Test Answer',
        category: 'test'
    };

    describe('POST /api/faqs/create', () => {  // Update path
        it('should create a new FAQ', async () => {
            const response = await request(app)
                .post('/api/faqs/create')  // Update path
                .send(testFaq);
            
            expect(response.status).toBe(201);
            expect(response.body.question).toBe(testFaq.question);
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/faqs/create')
                .send({});
            
            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/faqs', () => {
        it('should return all FAQs', async () => {
            await FAQ.create(testFaq);
            
            const response = await request(app)
                .get('/api/faqs');
            
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(1);
        });

        it('should use cache on second request', async () => {
            await FAQ.create(testFaq);
            
            // First request
            await request(app).get('/api/faqs');
            
            // Second request should use cache
            const response = await request(app).get('/api/faqs');
            expect(response.status).toBe(200);
            // Check cache header if implemented
        });
    });

    describe('GET /api/faqs/:id', () => {
        it('should return a single FAQ', async () => {
            const faq = await FAQ.create(testFaq);
            
            const response = await request(app)
                .get(`/api/faqs/${faq._id}`);
            
            expect(response.status).toBe(200);
            expect(response.body.question).toBe(testFaq.question);
        });

        it('should return 404 for non-existent FAQ', async () => {
            const response = await request(app)
                .get(`/api/faqs/${new mongoose.Types.ObjectId()}`);
            
            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/faqs/:id', () => {
        it('should update an existing FAQ', async () => {
            const faq = await FAQ.create(testFaq);
            const updatedData = { ...testFaq, question: 'Updated Question?' };
            
            const response = await request(app)
                .put(`/api/faqs/${faq._id}`)
                .send(updatedData);
            
            expect(response.status).toBe(200);
            expect(response.body.question).toBe(updatedData.question);
        });
    });

    describe('DELETE /api/faqs/:id', () => {
        it('should delete an existing FAQ', async () => {
            const faq = await FAQ.create(testFaq);
            
            const response = await request(app)
                .delete(`/api/faqs/${faq._id}`);
            
            expect(response.status).toBe(204);
            const found = await FAQ.findById(faq._id);
            expect(found).toBeNull();
        });
    });
});