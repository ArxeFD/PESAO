import mongoose from 'mongoose';
import { MockDB } from './mockData';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pesao';

let db: any = null;

async function connectDB() {
  if (db) return db;

  try {
    if (MONGODB_URI === 'mongodb://localhost:27017/pesao') {
      // Use mock database if MongoDB URI is not configured
      db = MockDB.getInstance();
      console.log('Using mock database');
    } else {
      // Connect to MongoDB
      const opts = {
        bufferCommands: false,
      };

      const connection = await mongoose.connect(MONGODB_URI, opts);
      db = connection;
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    // Fallback to mock database if connection fails
    db = MockDB.getInstance();
    console.log('Falling back to mock database');
  }

  return db;
}

export default connectDB; 