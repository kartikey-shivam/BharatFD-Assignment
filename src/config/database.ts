import mongoose from 'mongoose';

class Database {
    private static instance: Database;
    
    private constructor() {
        this.connect();
    }

    private connect(): void {
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bharatfd')
            .then(() => console.log('Connected to MongoDB'))
            .catch(err => console.error('MongoDB connection error:', err));
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

export default Database;