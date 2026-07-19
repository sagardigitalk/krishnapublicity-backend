import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', upload.single('image'), uploadImage);
router.delete('/', deleteImage);

export default router;
