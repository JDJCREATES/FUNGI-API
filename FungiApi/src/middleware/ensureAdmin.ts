import mongoose from 'mongoose';
import User from '@src/models/User';
import UserRepo from '@src/repos/UserRepo';
import ENV from '@src/common/constants/ENV';

/**
 * Ensures that an admin user exists in the database
 */
export const ensureAdminExists = async (): Promise<void> => {
  try {
    console.log('Checking for admin user...');
    
    // Check if admin user already exists
    const adminEmail = ENV.AdminEmail;
    const existingAdmin = await UserRepo.getOne(adminEmail);
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user if it doesn't exist
    console.log('Creating admin user...');
    
    const adminUser = User.new({
      name: ENV.AdminName,
      email: ENV.AdminEmail,
      password: ENV.AdminPassword,
      role: 'admin'
    });
    
    await UserRepo.add(adminUser);
    console.log('Admin user created successfully');
    
  } catch (error) {
    console.error('Error ensuring admin exists:', error);
    throw error;
  }
};

// If this script is run directly
if (require.main === module) {
  // Connect to MongoDB
  mongoose.connect(ENV.MongoUri)
    .then(() => {
      console.log('Connected to MongoDB');
      return ensureAdminExists();
    })
    .then(() => {
      console.log('Admin user check complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
