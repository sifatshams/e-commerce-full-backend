import mongoose from 'mongoose';

// .env
const mongo_url = process.env.MONGO_URI;

// database connection
const connectDB = async () => {
  try {
    await mongoose.connect(mongo_url);
    console.log('Database connected successfully!');
  } catch (error) {
    console.log('Database connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
