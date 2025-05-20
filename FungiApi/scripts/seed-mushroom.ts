import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Mushroom from '../src/models/Mushroom';
import logger from 'jet-logger';

// Load environment variables
dotenv.config({
  path: path.join(__dirname, '../src/config/.env.development')
});

// Sample mushroom data - updated to match your schema
const sampleMushrooms = [
  {
    scientificName: "Pleurotus ostreatus",
    commonNames: ["Oyster Mushroom", "Tree Oyster", "Pearl Oyster"],
    description: "A common edible mushroom with a distinctive oyster-shaped cap that grows in shelf-like clusters on dead or dying trees.",
    distribution: "Worldwide in temperate and subtropical forests",
    substrateFormulation: [
      { ingredient: "Wheat straw", percentage: 80 },
      { ingredient: "Wheat bran", percentage: 15 },
      { ingredient: "Gypsum", percentage: 5 }
    ],
    substrateMoisture: 65,
    // Fixed spawn field to match your schema
    spawn: "Grain spawn", // Changed from object to string
    phases: {
      colonization: {
        temperature: { min: 20, max: 24, unit: "°C" },
        humidity: { min: 85, max: 95, unit: "%" }
      },
      fruiting: {
        induction: {
          tempDrop: true,
          humidityIncrease: true,
          lightChange: "Introduce indirect light",
          airExchange: "Increase fresh air exchange"
        },
        temperature: { min: 10, max: 21, unit: "°C" },
        humidity: { min: 85, max: 95, unit: "%" },
        CO2: { min: 400, max: 1000, unit: "ppm" },
        light: "Indirect natural light or 12 hours of fluorescent light",
        duration: "7-14 days"
      }
    },
    expectedYield: 1.5,
    biologicalEfficiency: 150,
    flushCount: 3,
    cultivationMethod: "indoor",
    contaminationRisk: "low"
  },
  {
    scientificName: "Lentinula edodes",
    commonNames: ["Shiitake", "Black Forest Mushroom", "Oak Mushroom"],
    description: "A popular edible mushroom native to East Asia, with a distinctive umbrella-shaped brown cap and cream-colored gills.",
    distribution: "Native to East Asia, cultivated worldwide",
    substrateFormulation: [
      { ingredient: "Hardwood sawdust", percentage: 80 },
      { ingredient: "Wheat bran", percentage: 18 },
      { ingredient: "Gypsum", percentage: 2 }
    ],
    substrateMoisture: 60,
    // Fixed spawn field to match your schema
    spawn: "Grain spawn", // Changed from object to string
    phases: {
      colonization: {
        temperature: { min: 21, max: 27, unit: "°C" },
        humidity: { min: 85, max: 95, unit: "%" }
      },
      fruiting: {
        induction: {
          tempDrop: true,
          humidityIncrease: true,
          lightChange: "Introduce indirect light",
          airExchange: "Increase fresh air exchange"
        },
        temperature: { min: 10, max: 20, unit: "°C" },
        humidity: { min: 80, max: 90, unit: "%" },
        CO2: { min: 500, max: 1200, unit: "ppm" },
        light: "Indirect natural light or 12 hours of fluorescent light",
        duration: "7-14 days"
      }
    },
    expectedYield: 1.0,
    biologicalEfficiency: 100,
    flushCount: 3,
    cultivationMethod: "indoor",
    contaminationRisk: "medium"
  }
];

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fungi-api';
    logger.info('Connecting to MongoDB at: ' + mongoURI);
    
    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB');

    // Clear existing data
    await Mushroom.deleteMany({});
    logger.info('Cleared existing mushroom data');

    // Insert sample data
    const result = await Mushroom.insertMany(sampleMushrooms);
    logger.info(`Added ${result.length} sample mushrooms to database`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    logger.err('Error seeding database:');
    logger.err(error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
