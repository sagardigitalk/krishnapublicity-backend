import express from 'express';
import { getTeamContent, updateTeamContent } from '../controllers/teamController.js';

const router = express.Router();

router.route('/')
  .get(getTeamContent)
  .put(updateTeamContent);

export default router;
