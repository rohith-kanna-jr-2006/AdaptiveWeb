const mongoose = require('mongoose');
const env = require('./env');

/**
 * Connects to MongoDB database using Mongoose.
 * @param {string} [customUri] - Optional override URI for testing
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async (customUri) => {
  const uri = customUri || env.MONGODB_URI;

  try {
    const conn = await mongoose.connect(uri);

    if (env.NODE_ENV !== 'test') {
      console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
    }

    return conn;
  } catch (error) {
    if (env.NODE_ENV !== 'test') {
      console.error(`[Database] Connection Error: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Disconnects from MongoDB database.
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (env.NODE_ENV !== 'test') {
      console.log('[Database] MongoDB disconnected cleanly.');
    }
  } catch (error) {
    if (env.NODE_ENV !== 'test') {
      console.error(`[Database] Disconnect Error: ${error.message}`);
    }
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
