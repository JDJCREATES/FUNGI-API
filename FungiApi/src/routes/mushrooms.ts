import { Router } from 'express';
import {
  createMushroom,
  getAllMushrooms,
  getMushroomById,
  updateMushroom,
  deleteMushroom,
} from '../controllers/mushroomController';

// Create router
const router = Router();

// Log when routes are accessed
router.use((req, res, next) => {
  console.log(`Mushroom route accessed: ${req.method} ${req.originalUrl}`);
  next();
});

// Define routes individually to avoid TypeScript issues
router.get('/', getAllMushrooms);
router.post('/', createMushroom);

router.get('/:id', getMushroomById);
router.put('/:id', updateMushroom);
router.delete('/:id', deleteMushroom);

// Export router
export default router;
