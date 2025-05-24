import jetEnv, { num } from "jet-env";
import { isEnumVal } from "jet-validators";

import { cleanEnv, str, port, host } from "envalid";
import { NodeEnvs } from ".";

/******************************************************************************
                                 Setup
******************************************************************************/

// Check if required environment variables are present
const requiredEnvVars = ["NODE_ENV"];

const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error("================================");
  console.error(" Missing environment variables:");
  missingVars.forEach((envVar) => {
    console.error(`    ${envVar}: The application environment`);
  });
  console.error("================================");
  process.exit(1);
}

// Environment variables with defaults
export default {
  // Server
  Port: Number(process.env.PORT || 3000),
  NodeEnv: process.env.NODE_ENV || "development",

  // Database
  MongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/fungi-api",

  // API
  ApiPrefix: process.env.API_PREFIX || "/api",

  // Logging
  LogLevel: process.env.LOG_LEVEL || "info",

  // CORS
  CorsOrigin: process.env.CORS_ORIGIN || "*",

  JwtSecret: process.env.JWT_SECRET || "your-jwt-secret-key",
  JwtLifetime: process.env.JWT_LIFETIME || "1h",

  RefreshSecret: process.env.REFRESH_SECRET || "your-refresh-secret-key",
  RefreshLifetime: process.env.REFRESH_LIFETIME || "7d",

   AdminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  AdminPassword: process.env.ADMIN_PASSWORD || 'changeme',
  AdminName: process.env.ADMIN_NAME || 'Admin User',
};
