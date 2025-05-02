import mongoose from 'mongoose';
import { MockDB } from './mockData';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pesao';

let db: any = null;

async function connectDB() {
  if (db) {
    console.log('Using existing database connection');
    return db;
  }

  try {
    if (MONGODB_URI === 'mongodb://localhost:27017/pesao') {
      console.log('MongoDB URI not configured, using mock database');
      db = MockDB.getInstance();
      return db;
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/[^@]*@/, '//****:****@'));

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const connection = await mongoose.connect(MONGODB_URI, opts);
    db = connection;
    console.log('Successfully connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to database:', error);
    console.log('Falling back to mock database');
    db = MockDB.getInstance();
    return db;
  }
}

export default connectDB; 