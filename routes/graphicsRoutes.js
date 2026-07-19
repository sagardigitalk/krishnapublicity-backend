import express from 'express';
import { getGraphics, createGraphics, updateGraphics, deleteGraphics } from '../controllers/graphicsController.js';

const router = express.Router();

router.route('/')
  .get(getGraphics)
  .post(createGraphics);

router.route('/:id')
  .put(updateGraphics)
  .delete(deleteGraphics);

export default router;
