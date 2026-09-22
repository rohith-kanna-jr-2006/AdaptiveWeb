const app = require('./app');
const env = require('./config/env');
const db = require('./config/db');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await db.connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`[AdaptiveWeb Server] Running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      console.log(`[AdaptiveWeb Server] Health endpoint: http://localhost:${env.PORT}/api/health`);
    });

    // Graceful Shutdown Handlers
    const handleShutdown = async (signal) => {
      console.log(`\n[AdaptiveWeb Server] Received ${signal}. Shutting down server cleanly...`);
      server.close(async () => {
        await db.disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));

  } catch (error) {
    console.error(`[AdaptiveWeb Server] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
