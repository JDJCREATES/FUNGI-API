import { isString } from 'jet-validators';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import AuthService from '@src/services/AuthService';
import User, { IUser } from '@src/models/User';
import UserRepo from '@src/repos/UserRepo';

import { IReq, IRes } from './common/types';
import { parseReq } from './common/util';
import { authenticateUser } from '@src/middleware/auth';

/******************************************************************************
                                Constants
******************************************************************************/

const Validators = {
  register: parseReq({ 
    user: {
      name: isString,
      email: isString,
      password: isString
    }
  }),
  login: parseReq({ 
    email: isString,
    password: isString
  }),
  resetPassword: parseReq({
    email: isString,
    newPassword: isString
  }),
  refreshToken: parseReq({
    refreshToken: isString
  })
} as const;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Register a new user.
 */
async function register(req: IReq, res: IRes) {
  try {
    const { user: userData } = Validators.register(req.body);
    console.log('Registering user with email:', userData.email);
    
    // Create a proper IUser object with default values
    const user: IUser = User.new({
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    
    // Log the user object (without the actual password)
    console.log('User object created:', { 
      ...user, 
      password: user.password ? `[${user.password.length} chars]` : undefined 
    });
    
    const result = await AuthService.register(user);
    console.log('User registered successfully');
    
    res.status(HttpStatusCodes.CREATED).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

/**
 * Login user.
 */
async function login(req: IReq, res: IRes) {
  try {
    console.log('Login request body:', req.body);
    
    const { email, password } = Validators.login(req.body);
    console.log(`Login attempt for email: ${email}`);
    
    const result = await AuthService.login(email, password);
    console.log('Login successful');
    res.status(HttpStatusCodes.OK).json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

/**
 * Refresh token
 */
async function refreshToken(req: IReq, res: IRes) {
  try {
    const { refreshToken } = Validators.refreshToken(req.body);
    
    const result = await AuthService.refreshToken(refreshToken);
    
    res.status(HttpStatusCodes.OK).json(result);
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ 
      error: error.message 
    });
  }
}

/**
 * Get current user.
 */
async function getCurrentUser(req: IReq, res: IRes) {
  try {
    if (!req.user) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: 'Not authenticated' });
    }
    
    const user = await AuthService.getCurrentUser(req.user.userId);
    res.status(HttpStatusCodes.OK).json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

/**
 * Reset password
 */
async function resetPassword(req: IReq, res: IRes) {
  try {
    const { email, newPassword } = Validators.resetPassword(req.body);
    
    await AuthService.resetPassword(email, newPassword);
    
    res.status(HttpStatusCodes.OK).json({ 
      message: 'Password reset successful' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ 
      error: error.message 
    });
  }
}

/**
 * Debug user - check if a user exists
 */
async function debugUser(req: IReq, res: IRes) {
  try {
    const email = req.query.email as string;
    
    if (!email) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'Email is required' });
    }
    
    // Check if user exists
    const user = await UserRepo.getOne(email);
    
    if (!user) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ 
        exists: false, 
        message: 'User not found' 
      });
    }
    
    // Return user info without sensitive data
    return res.status(HttpStatusCodes.OK).json({ 
      exists: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0
      } 
    });
  } catch (error) {
    console.error('Debug error:', error);
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  register,
  login,
  getCurrentUser,
  resetPassword,
  refreshToken,
  debugUser
} as const;
