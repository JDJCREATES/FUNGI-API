import { RouteError } from '@src/common/util/route-errors';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

import UserRepo from '@src/repos/UserRepo';
import { IUser } from '@src/models/User';
import User from '@src/models/User';

/******************************************************************************
                                Constants
******************************************************************************/

export const USER_NOT_FOUND_ERR = 'User not found';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 */
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

/**
 * Add one user.
 * Note: This is an admin function. For user registration, use AuthService.register
 */
async function addOne(user: IUser): Promise<void> {
  // Check if user already exists
  const existingUser = await UserRepo.getOne(user.email);
  if (existingUser) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Email already in use'
    );
  }
  
  // Hash password if it exists
  if (user.password) {
    user.password = await User.hashPassword(user.password);
  }
  
  return UserRepo.add(user);
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<void> {
  const persists = await UserRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  
  // Hash password if it's being updated
  if (user.password) {
    user.password = await User.hashPassword(user.password);
  }
  
  // Return user
  return UserRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: number): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Delete user
  return UserRepo.delete(id);
}

/**
 * Reset a user's password (admin function)
 */
async function resetPassword(userId: number, newPassword: string): Promise<void> {
  const persists = await UserRepo.persists(userId);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  
  // Get the user
  const user = await UserRepo.getOne(userId.toString());
  if (!user) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  
  // Hash the new password
  user.password = await User.hashPassword(newPassword);
  
  // Update the user
  return UserRepo.update(user);
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  resetPassword,
} as const;
