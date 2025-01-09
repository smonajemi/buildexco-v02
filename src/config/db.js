import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbURI = process.env.MONGO_URI;
if (!dbURI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

const connectDB = async () => {
  const options = {
    serverSelectionTimeoutMS: 5000,  // Timeout for finding a server
    socketTimeoutMS: 45000,  // Socket timeout for a request
    autoIndex: false,  // Disable automatic index creation in production

  };

  try {
    await mongoose.connect(dbURI, options);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    // Retry mechanism
    setTimeout(() => connectDB(), 5000); // 5 seconds
  }
};

// handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose successfully connected!');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected!');
});

export default connectDB;
