import express, { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import './config/db';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import baseRouter from './routes';
import { apiLimiter, authLimiter } from './ratelimit';
import { errorHandler } from './middleware/errorHandler';
import ENV from './common/constants/ENV';

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: ENV.CorsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Compress responses
app.use(compression());

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (ENV.NodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Apply rate limiting to all routes
app.use(ENV.ApiPrefix, apiLimiter);

// Apply stricter rate limiting to auth routes
app.use(`${ENV.ApiPrefix}/auth`, authLimiter);

// API routes
app.use(ENV.ApiPrefix, baseRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: ENV.NodeEnv });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

export default app;
