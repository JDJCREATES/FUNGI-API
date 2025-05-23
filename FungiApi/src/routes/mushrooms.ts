import { Router } from 'express';
import {
  createMushroom,
  getAllMushrooms,
  getMushroomById,
  updateMushroom,
  deleteMushroom,
} from '../controllers/mushroomController';
import { authenticateUser, authorizeAdmin } from '../middleware/auth';

// Create router
const router = Router();

// Log when routes are accessed
router.use((req, res, next) => {
  console.log(`Mushroom route accessed: ${req.method} ${req.originalUrl}`);
  next();
});

// Public routes
router.get('/', getAllMushrooms);
router.get('/:id', getMushroomById);

// Protected routes - require authentication
router.post('/', authenticateUser, createMushroom);
router.put('/:id', authenticateUser, updateMushroom);

// Admin-only routes
router.delete('/:id', authenticateUser, authorizeAdmin, deleteMushroom);

// Export router
export default router;
