import { RouteError } from '@src/common/util/route-errors';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import UserRepo from '@src/repos/UserRepo';
import { IUser } from '@src/models/User';
import User from '@src/models/User';
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
const createToken = (userId: number, name: string, role: string): string => {
  return jwt.sign(
    { userId, name, role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Create refresh token
 */
const createRefreshToken = (userId: number): string => {
  return jwt.sign(
    { userId },
    REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Register a new user
 */
async function register(user: IUser): Promise<{ user: IUser; token: string; refreshToken: string }> {
  console.log('Registering user:', user.email);
  
  // Check if user already exists
  const existingUser = await UserRepo.getOne(user.email);
  if (existingUser) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Email already in use'
    );
  }
  
  // Set default role if not provided
  if (!user.role) {
    user.role = 'user';
  }
  
  // Hash password before adding
  if (user.password) {
    console.log('Hashing password for new user');
    user.password = await User.hashPassword(user.password);
    console.log('Password hashed, length:', user.password.length);
  }
  
  // Add user
  await UserRepo.add(user);
  console.log('User added to database');
  
  // Create tokens
  const token = createToken(user.id, user.name, user.role);
  const refreshToken = createRefreshToken(user.id);
  
  // Remove password from returned user
  const { password, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword as IUser, token, refreshToken };
}

/**
 * Login user
 */
async function login(email: string, password: string): Promise<{ user: IUser; token: string; refreshToken: string }> {
  console.log(`Login attempt for email: ${email}`);
  
  // Get user by email
  const user = await UserRepo.getOne(email);
  
  if (!user) {
    console.log('User not found');
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'Invalid credentials'
    );
  }
  
  console.log('User found, checking password');
  
  // Check if user has a password
  if (!user.password) {
    console.log('User has no password');
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'Invalid credentials'
    );
  }
  
  // Compare password
  console.log('Comparing passwords');
  const isMatch = await User.comparePassword(password, user.password);
  console.log('Password match:', isMatch);
  
  if (!isMatch) {
    console.log('Password does not match');
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'Invalid credentials'
    );
  }
  
  console.log('Login successful');
  
  // Create tokens
  const token = createToken(user.id, user.name, user.role || 'user');
  const refreshToken = createRefreshToken(user.id);
  
  // Remove password from returned user
  const { password: _, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword as IUser, token, refreshToken };
}

/**
 * Refresh access token
 */
async function refreshToken(token: string): Promise<{ token: string }> {
  try {
    // Verify refresh token
    const decoded = jwt.verify(token, REFRESH_SECRET) as { userId: number };
    
    // Get user
    const user = await UserRepo.getOne(decoded.userId.toString());
    
    if (!user) {
      throw new RouteError(
        HttpStatusCodes.UNAUTHORIZED,
        'Invalid token'
      );
    }
    
    // Create new access token
    const newToken = createToken(user.id, user.name, user.role || 'user');
    
    return { token: newToken };
  } catch (error) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'Invalid or expired refresh token'
    );
  }
}

/**
 * Get current user
 */
async function getCurrentUser(userId: number): Promise<IUser> {
  const user = await UserRepo.getOne(userId.toString());
  
  if (!user) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      'User not found'
    );
  }
  
  // Remove password from returned user
  const { password, ...userWithoutPassword } = user;
  
  return userWithoutPassword as IUser;
}

/**
 * Reset password for a user (self-service)
 */
async function resetPassword(email: string, newPassword: string): Promise<void> {
  const user = await UserRepo.getOne(email);
  
  if (!user) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      'User not found'
    );
  }
  
  // Hash the new password
  user.password = await User.hashPassword(newPassword);
  
  // Update the user
  return UserRepo.update(user);
}

// Export default
export default {
  register,
  login,
  getCurrentUser,
  resetPassword,
  refreshToken,
  createToken,
  createRefreshToken
} as const;
