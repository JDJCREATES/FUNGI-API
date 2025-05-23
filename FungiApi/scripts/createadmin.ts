import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import User from "../src/models/User";
import UserRepo from "../src/repos/UserRepo";
import logger from "jet-logger";

// Load environment variables
dotenv.config({
  path: path.join(__dirname, "../src/config/.env.development"),
});

// Admin user data
const adminUser = {
  id: -1,
  name: "Admin User",
  email: "admin@fungi-api.com",
  password: "admin123", // Change this to a secure password
  role: "admin",
  created: new Date(),
};

// Connect to MongoDB and create admin
const createAdmin = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/fungi-api";
    await mongoose.connect(mongoURI);
    logger.info("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await UserRepo.getOne(adminUser.email);

    if (existingAdmin) {
      logger.info("Admin user already exists");
    } else {
      // Create admin user
      await UserRepo.add(adminUser);
      logger.info("Admin user created successfully");
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");

    process.exit(0);
  } catch (error) {
    logger.err("Error creating admin user:", error);
    process.exit(1);
  }
};

// Run the function
createAdmin();
