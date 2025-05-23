import express, { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import './config/db';
import mushroomRoutes from './routes/mushrooms';
import { securityMiddleware } from './security';
import cors from 'cors';
import { apiLimiter, authLimiter } from './ratelimit';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(express.json());

// Apply security middleware
app.use(securityMiddleware);

// Apply CORS middleware
app.use(cors({
  origin: '*', // In production, specify your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Apply rate limiting to all routes
app.use('/api', apiLimiter);

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/mushrooms', mushroomRoutes);

// Global error handler
app.use(errorHandler);

export default app;
