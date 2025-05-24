import 'dotenv/config';
import http from 'http';
import logger from 'jet-logger';
import mongoose from 'mongoose';

import ENV from './common/constants/ENV';
import connectDB from './config/db';
import app from './server';

import { ensureAdminExists } from './middleware/ensureAdmin';

const PORT = ENV.Port;

// Create HTTP server
let httpServer: http.Server;

// Start server function
const start = async () => {
  // Connect to MongoDB
  mongoose.connect(ENV.MongoUri)
    .then(async () => {
      console.log('Connected to MongoDB Atlas successfully');
      
      // Ensure admin user exists
      await ensureAdminExists();
      
      // Start the server and store the reference
      httpServer = app.listen(PORT, () => {
        console.log(`Server running in ${ENV.NodeEnv} mode on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
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
  } else {
    // If server hasn't started yet, just close MongoDB connection
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
  }
};

// Handle termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
start();
