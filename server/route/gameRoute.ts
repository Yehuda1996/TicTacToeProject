import express from 'express';
import * as gameController from '../controllers/gameController.js'
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/start', authMiddleware, gameController.StartSocket);

export default router;


