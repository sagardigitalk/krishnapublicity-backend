import express from 'express';
import { getHomeContent, updateHomeContent } from '../controllers/homeController.js';

const router = express.Router();

router.route('/')
  .get(getHomeContent)
  .put(updateHomeContent); // In a real app, protect this with admin middleware

export default router;
