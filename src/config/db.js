import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbURI = process.env.MONGO_URI;
if (!dbURI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

const connectDB = async () => {
  try {
    const options = {
      // future options
    };

    await mongoose.connect(dbURI, options);
    console.log('Database Successfully Connected!')
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

export default connectDB;
