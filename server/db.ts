import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://waleed:waleed@cluster0.s6t8yk3.mongodb.net/venue-booking?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set!');
  console.error('Please set MONGODB_URI in your Vercel environment variables.');
  console.error('Using fallback connection string for development...');
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
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Attempting to connect to MongoDB... (attempt ${retries + 1}/${maxRetries})`);
      await mongoose.connect(MONGODB_URI, connectOptions);
      console.log('✅ Connected to MongoDB successfully!');
      return;
    } catch (err) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries} failed:`, err.message);
      if (retries === maxRetries) {
        console.error('🚨 Max retries reached. Database will be unavailable.');
        console.error('Please check your MongoDB connection string and network connectivity.');
        return;
      }
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, retries), 5000);
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

connectWithRetry();

mongoose.connection.on('error', (err) => {
  console.error('🔥 MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB connected to:', MONGODB_URI?.split('@')[1]?.split('?')[0] || 'database');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

export default mongoose;
