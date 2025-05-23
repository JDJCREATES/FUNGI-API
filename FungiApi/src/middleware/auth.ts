import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ENV from '@src/common/constants/ENV';

// JWT Secret from environment variables
const JWT_SECRET = ENV.JwtSecret || 'your-jwt-secret-key';

// Extend the Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        name: string;
        role: string;
      };
    }
  }
}

/**
 * Authenticate user middleware
 */
export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication invalid' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; name: string; role: string };
    
    // Attach user to request object
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication invalid' });
  }
};

/**
 * Authorize admin middleware
 */
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Unauthorized: Admin access required' });
    return;
  }
  
  next();
};
