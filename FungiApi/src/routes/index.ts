import { Router } from 'express';
import mushroomRoutes from './mushrooms';

// Create the base router
const baseRouter = Router();

// Add mushroom routes
baseRouter.use('/mushrooms', mushroomRoutes);

// Add a test route to verify the router is working
baseRouter.get('/test', (req, res) => {
  res.json({ message: 'API router is working!' });
});

// Export the router
export default baseRouter;
