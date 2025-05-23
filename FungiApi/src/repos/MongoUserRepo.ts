import mongoose from 'mongoose';
import { IUser } from '@src/models/User';
import User from '@src/models/User';

// Define the MongoDB schema for users
const UserSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  created: { type: Date, default: Date.now }
});

// Create the model
const UserModel = mongoose.model('User', UserSchema);

/**
 * Get one user by email or ID.
 */
async function getOne(identifier: string | number): Promise<IUser | null> {
  let user;
  
  // If identifier is a number or looks like a number, treat it as an ID
  if (typeof identifier === 'number' || !isNaN(Number(identifier))) {
    const id = typeof identifier === 'string' ? parseInt(identifier) : identifier;
    user = await UserModel.findOne({ id });
  } else {
    // Otherwise treat it as an email
    user = await UserModel.findOne({ email: identifier });
  }
  
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
    created: user.created
  };
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const user = await UserModel.findOne({ id });
  return !!user;
}

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  const users = await UserModel.find();
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
    created: user.created
  }));
}

/**
 * Add a user.
 * Note: Password should already be hashed by the service
 */
async function add(user: IUser): Promise<void> {
  // Generate a unique ID if not provided
  if (user.id === -1) {
    const maxUser = await UserModel.findOne().sort('-id');
    user.id = maxUser ? maxUser.id + 1 : 1;
  }
  
  // Create the user in the database
  await UserModel.create(user);
}


/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
  await UserModel.updateOne({ id: user.id }, user);
}

/**
 * Delete a user.
 */
async function delete_(id: number): Promise<void> {
  await UserModel.deleteOne({ id });
}

/**
 * Authenticate a user.
 */
async function authenticate(email: string, password: string): Promise<IUser | null> {
  console.log(`Authenticating user: ${email}`);
  
  // Find user by email directly in this method
  const user = await UserModel.findOne({ email });
  
  if (!user) {
    console.log('User not found');
    return null;
  }
  
  if (!user.password) {
    console.log('User has no password');
    return null;
  }
  
  console.log('Comparing passwords');
  const isMatch = await User.comparePassword(password, user.password);
  console.log('Password match:', isMatch);
  
  if (!isMatch) {
    return null;
  }
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
    created: user.created
  };
}


/**
 * Debug function to check if a user exists
 */
async function debugUser(email: string): Promise<any> {
  const user = await UserModel.findOne({ email });
  
  if (!user) {
    return { exists: false, message: 'User not found' };
  }
  
  return {
    exists: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    }
  };
}

// Add this to your exports
export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  authenticate,
  debugUser
} as const;


