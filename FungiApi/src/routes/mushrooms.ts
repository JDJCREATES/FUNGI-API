import { Router } from 'express';
import {
  createMushroom,
  getAllMushrooms,
  getMushroomById,
  updateMushroom,
  deleteMushroom,
} from '../controllers/mushroomController';

const router = Router();

router.route('/')
  .get(getAllMushrooms)
  .post(createMushroom);

router.route('/:id')
  .get(getMushroomById)
  .put(updateMushroom)
  .delete(deleteMushroom);

export default router;
