import 'dotenv/config';
import http from 'http';
import logger from 'jet-logger';
import mongoose from 'mongoose';

import ENV from './common/constants/ENV';
import connectDB from './config/db';
import app from './server';

// Create HTTP server
let httpServer: http.Server;

// Start server function
const start = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();
    logger.info('✔️  MongoDB connected');

    // 2. Create HTTP server and listen
    httpServer = http.createServer(app).listen(ENV.Port, () => {
      logger.info(`🚀  Server started on port: ${ENV.Port}`);
      logger.info(`Try accessing: http://localhost:${ENV.Port}/test`);
      logger.info(`API endpoint: http://localhost:${ENV.Port}/api/mushrooms`);
      logger.info(`Debug routes: http://localhost:${ENV.Port}/debug-routes`);
    });
  } catch (err: any) {
    logger.err('❌  Failed to start server', err);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.err('Unhandled Rejection at promise:', true);
  console.dir({ reason, promise });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.err('Uncaught Exception:', true);
  logger.err(err.stack ?? err.toString(), true);
  gracefulShutdown();
});

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('🔌  Shutting down gracefully...');

  // Stop accepting new connections
  if (httpServer) {
    httpServer.close(() => {
      logger.info('👍  HTTP server closed');

      // Then close the MongoDB connection
      mongoose.connection
        .close(false)
        .then(() => {
          logger.info('👍  MongoDB connection closed');
          process.exit(0);
        })
        .catch((err) => {
          logger.err('Error during MongoDB closure:', true);
          process.exit(1);
        });
    });

    // Force exit after 10s
    setTimeout(() => {
      logger.err('⏱️  Forced shutdown', true);
      process.exit(1);
    }, 10_000);
  }
};

// Handle termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
start();
