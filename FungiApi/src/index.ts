import 'dotenv/config';
import http from 'http';
import logger from 'jet-logger';
import mongoose from 'mongoose';

import ENV from '@src/common/constants/ENV';
import connectDB from '@src/config/db';
import app from './server';     // your Express app

let httpServer: http.Server;   // will hold our HTTP server instance

/******************************************************************************
                                Start Server
******************************************************************************/

const start = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();
    logger.info('✔️  MongoDB connected');

    // 2. Create HTTP server and listen
    httpServer = http.createServer(app).listen(ENV.Port, () => {
      logger.info(`🚀  Server started on port: ${ENV.Port}`);
    });
  } catch (err: any) {
    logger.err('❌  Failed to start server', true);
    process.exit(1);
  }
};

// 3. Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.err('Unhandled Rejection at promise:', true);
  console.dir({ reason, promise });
});

// 4. Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.err('Uncaught Exception:', true);
  logger.err(err.stack ?? err.toString(), true);
  gracefulShutdown();
});

// 5. Graceful shutdown
const gracefulShutdown = () => {
  logger.info('🔌  Shutting down gracefully...');

  // Stop accepting new connections
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
};

// 6. Handle termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

start();
