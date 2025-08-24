import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set!');
  console.error('Please set MONGODB_URI in your Vercel environment variables.');
  // Don't exit in serverless environment, just log the error
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
}

mongoose.set('strictQuery', true);

const connectOptions = {
  serverSelectionTimeoutMS: 30000, // Reduce timeout for serverless environment
  socketTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 5, // Reduce pool size for serverless
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  bufferCommands: false, // Disable buffering for faster failure detection
  autoCreate: false // Disable auto-creation of collections
};

async function connectWithRetry() {
  if (!MONGODB_URI) {
    console.error('Cannot connect to MongoDB: MONGODB_URI is not set');
    return;
  }

  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoose.connect(MONGODB_URI, connectOptions);
      console.log('Connected to MongoDB Atlas successfully');
      return;
    } catch (err) {
      retries++;
      console.error(`MongoDB connection attempt ${retries} failed:`, err);
      if (retries === maxRetries) {
        console.error('Max retries reached. Cannot connect to MongoDB.');
        // Don't exit in serverless environment
        if (process.env.NODE_ENV !== 'production') {
          process.exit(1);
        }
        return;
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, retries), 10000)));
    }
  }
}

connectWithRetry();

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

export default mongoose;
