import mongoose from 'mongoose';

// Use a real MongoDB connection for tests (set MONGODB_URI in env)
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweet_test';

// Connect to MongoDB before running tests
beforeAll(async () => {
  // Ensure any existing connection is closed to avoid duplicate connections
  try {
    await mongoose.disconnect();
  } catch (err) {
    // ignore
  }

  await mongoose.connect(mongoUri);
  // Clear database before running tests in this file to ensure isolation
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Disconnect after all tests (and clear DB once)
afterAll(async () => {
  await mongoose.disconnect();
});