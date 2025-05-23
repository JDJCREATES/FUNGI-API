import jwt from 'jsonwebtoken';
import ENV from '@src/common/constants/ENV';

// JWT Secret from environment variables
const JWT_SECRET = ENV.JwtSecret || 'your-jwt-secret-key';
const REFRESH_SECRET = ENV.RefreshSecret || 'your-refresh-secret-key';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '1h'; // 1 hour
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

/**
 * Create access token
 */
export const createToken = (userId: number, name: string, role: string): string => {
  return jwt.sign(
    { userId, name, role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Create refresh token
 */
export const createRefreshToken = (userId: number): string => {
  return jwt.sign(
    { userId },
    REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Verify access token
 */
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, REFRESH_SECRET);
};
