import express from 'express';
import { getHoardings, createCity, updateCity, deleteCity } from '../controllers/hoardingController.js';

const router = express.Router();

router.route('/')
  .get(getHoardings)
  .post(createCity);

router.route('/:id')
  .put(updateCity)
  .delete(deleteCity);

export default router;
